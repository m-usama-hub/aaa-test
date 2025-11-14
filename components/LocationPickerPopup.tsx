'use client';

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useBranches } from '@/lib/hooks/useBranches';
import { Branch } from '@/lib/api';
import { CloseIcon } from './Icons';

type Location = {
  id: string;
  name: string;
  details?: string;
  hours?: string;
  message?: string;
  mapUrl?: string;
  branchType?: string;
  stateName?: string;
};

type LocationPickerPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  title: string;
  containerRef?: { current: HTMLFormElement | null };
  searchQuery?: string;
  selectedLocationName?: string;
};

// Helper function to convert Branch to Location
const branchToLocation = (branch: Branch): Location => {
  // Format hours from BranchOfficeTiming
  const formatHours = (timings: Branch['BranchOfficeTiming']) => {
    if (!timings?.BranchTimings || timings.BranchTimings.length === 0) return undefined;
    
    return timings.BranchTimings.map(timing => {
      const shifts = timing.Shifts.join(', ');
      return `${timing.DayString} : ${shifts}`;
    }).join(' | ');
  };

  return {
    id: branch._id,
    name: branch.Name,
    details: branch.Address,
    hours: formatHours(branch.BranchOfficeTiming),
    message: branch.Message || undefined,
    mapUrl: branch.GoogleLocationURL || undefined,
    branchType: branch.BranchType?.Name,
    stateName: branch.CountryState?.StateName,
  };
};

// Helper function to group branches by type and state
const groupBranches = (branches: Branch[]) => {
  const grouped: {
    [key: string]: {
      typeName: string;
      branches: Location[];
    };
  } = {};

  branches.forEach(branch => {
    const location = branchToLocation(branch);
    const branchTypeName = branch.BranchType?.Name || 'Other';
    
    // Create a key for grouping (type + state for better organization)
    const key = `${branchTypeName}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        typeName: branchTypeName,
        branches: [],
      };
    }
    
    grouped[key].branches.push(location);
  });

  return grouped;
};

export default function LocationPickerPopup({ isOpen, onClose, onSelectLocation, containerRef, searchQuery = '', selectedLocationName }: LocationPickerPopupProps) {
  const { data: branches = [], isLoading, error } = useBranches('UAE');
  console.log(branches,"branches");
  // Convert branches to locations and group them
  const groupedLocations = useMemo(() => {
    if (!branches.length) return {};
    return groupBranches(branches);
  }, [branches]);
  console.log(groupedLocations);
  // Get first location for initial selection
  const firstLocation = useMemo(() => {
    if (branches.length > 0) {
      return branchToLocation(branches[0]);
    }
    return null;
  }, [branches]);

  // Find selected location from branches if selectedLocationName is provided
  const selectedLocationFromProps = useMemo(() => {
    if (selectedLocationName && branches.length > 0) {
      const branch = branches.find(b => b.Name === selectedLocationName);
      return branch ? branchToLocation(branch) : null;
    }
    return null;
  }, [selectedLocationName, branches]);

  // Initialize selected location - use prop value if provided, otherwise null
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [showMoreMessage, setShowMoreMessage] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update selected location when selectedLocationName prop changes or popup opens
  const prevIsOpenRef = useRef(isOpen);
  useLayoutEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Popup just opened - set selected location from prop if available
      if (selectedLocationFromProps) {
        setSelectedLocation(selectedLocationFromProps);
      } else {
        setSelectedLocation(null);
      }
      setHoveredLocation(null);
    } else if (selectedLocationFromProps && selectedLocationFromProps.id !== selectedLocation?.id) {
      // Update selected location when prop changes
      setSelectedLocation(selectedLocationFromProps);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, selectedLocationFromProps, selectedLocation]);

  // Use selectedLocationFromProps for highlighting (from prop) or selectedLocation (from click)
  const effectiveSelectedLocation = selectedLocationFromProps || selectedLocation;

  // Check if mobile and handle search input focus
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Focus search input on mobile when popup opens and reset search when closed
  useEffect(() => {
    if (isOpen && isMobile && searchInputRef.current) {
      // Small delay to ensure popup is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else if (!isOpen) {
      // Reset mobile search when popup closes
      setMobileSearchQuery('');
    }
  }, [isOpen, isMobile]);

  // Disable body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Disable body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Store scroll position for restoration
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Re-enable body scroll
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-y');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
    }

    return () => {
      // Cleanup: re-enable scroll when component unmounts
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-y');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const updatePopupPosition = () => {
      if (!isOpen) return;
      const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
      if (popupRef.current && isMobile) {
        // Clear all inline positioning styles to allow CSS to make it full-screen on mobile
        const popup = popupRef.current;
        popup.style.width = '';
        popup.style.left = '';
        popup.style.top = '';
        popup.style.bottom = '';
        popup.style.right = '';
        popup.style.height = '';
        popup.style.maxHeight = '';
        popup.style.marginTop = '';
        popup.style.marginBottom = '';
        // Ensure full screen on mobile
        popup.style.position = '';
        return;
      }

      if (containerRef?.current && popupRef.current) {
        const formRect = containerRef.current.getBoundingClientRect();
        const popup = popupRef.current;
        const popupParent = popup.parentElement;
        
        if (popupParent) {
          const parentRect = popupParent.getBoundingClientRect();
          // Calculate the left offset to align with form's left edge
          const leftOffset = formRect.left - parentRect.left;
          popup.style.width = `${formRect.width}px`;
          popup.style.left = `${leftOffset}px`;
          
          // Calculate available space below and above the input
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - formRect.bottom;
          const spaceAbove = formRect.top;
          const minPopupHeight = 300; // Minimum popup height
          const maxPopupHeight = viewportHeight * 0.9; // Maximum 90% of viewport
          const margin = 20; // Margin from viewport edges
          
          // Calculate top position relative to the form
          const formTopRelativeToParent = formRect.top - parentRect.top;
          
          let popupHeight: number;
          
          // If not enough space below and more space above, position above
          if (spaceBelow < minPopupHeight && spaceAbove > spaceBelow) {
            // Use available space above, with margin
            popupHeight = Math.max(minPopupHeight, Math.min(spaceAbove - margin, maxPopupHeight));
            
            // Position above the input - calculate relative to parent
            const bottomPosition = parentRect.height - formTopRelativeToParent + 5;
            popup.style.top = 'auto';
            popup.style.bottom = `${bottomPosition}px`;
            popup.style.marginTop = '0';
            popup.style.marginBottom = '0';
          } else {
            // Position below the input - use available space below
            popupHeight = Math.max(minPopupHeight, Math.min(spaceBelow - margin, maxPopupHeight));
            
            const topPosition = formTopRelativeToParent + formRect.height + 5;
            popup.style.top = `${topPosition}px`;
            popup.style.bottom = 'auto';
            popup.style.marginTop = '0';
            popup.style.marginBottom = '0';
          }
          
          // Set height based on available space
          popup.style.height = `${popupHeight}px`;
          popup.style.maxHeight = `${popupHeight}px`;
        }
      }
    };

    updatePopupPosition();
    
    // Update on window resize
    window.addEventListener('resize', updatePopupPosition);
    return () => {
      window.removeEventListener('resize', updatePopupPosition);
    };
  }, [isOpen, containerRef]);

  if (!isOpen) return null;

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setHoveredLocation(null); // Clear hover on click
    onSelectLocation(location.name);
    onClose(); // Close popup when location is selected
  };

  const handleLocationHover = (location: Location) => {
    setHoveredLocation(location);
  };

  const handleLocationLeave = () => {
    setHoveredLocation(null);
  };

  // Get the location to display on map (hovered or selected or first location as default)
  // Priority: hovered > selected (from prop or click) > first location
  const displayLocation = hoveredLocation || effectiveSelectedLocation || firstLocation;

  // Use mobile search query if on mobile, otherwise use prop searchQuery
  const effectiveSearchQuery = isMobile ? mobileSearchQuery : searchQuery;

  // Filter locations based on search query - only filter if user has typed something
  const filterLocations = (locationList: Location[]) => {
    // If searchQuery is empty, undefined, or only whitespace, return all locations
    if (!effectiveSearchQuery || !effectiveSearchQuery.trim()) {
      return locationList;
    }
    
    // Only filter when user has actually typed something
    const query = effectiveSearchQuery.trim().toLowerCase();
    return locationList.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.details?.toLowerCase().includes(query) ||
      location.stateName?.toLowerCase().includes(query)
    );
  };


  // Get filtered grouped locations - show all if no search query, otherwise filter
  // Always show group names even if no locations match
  const getFilteredGroupedLocations = () => {
    // If no search query, return all grouped locations
    if (!effectiveSearchQuery || !effectiveSearchQuery.trim()) {
      return groupedLocations;
    }
    
    // Otherwise, apply filter but keep all groups (even if empty)
    const filtered: typeof groupedLocations = {};
    
    Object.keys(groupedLocations).forEach(key => {
      const group = groupedLocations[key];
      const filteredBranches = filterLocations(group.branches);
      // Always include the group, even if no branches match
      filtered[key] = {
        typeName: group.typeName,
        branches: filteredBranches,
      };
    });
    
    return filtered;
  };

  const filteredGroupedLocations = getFilteredGroupedLocations();
  const hasSearchQuery = effectiveSearchQuery && effectiveSearchQuery.trim().length > 0;

  return (
    <div ref={popupRef} className="pickupReturnLocationPopup">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="popup-close-btn md:hidden"
        aria-label="Close popup"
      >
        <CloseIcon />
      </button>
      {/* Inner Wrapper */}
      <div className="inner-wrapper">
        {/* Mobile Search Input */}
        <div className="mobile-search-container md:hidden">
          <div className="mobile-search-wrapper">
            <svg 
              className="mobile-search-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="mobile-search-input"
            />
            {mobileSearchQuery && (
              <button
                onClick={() => setMobileSearchQuery('')}
                className="mobile-search-clear"
                aria-label="Clear search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* Left Section - Location List */}
        <div className="left-section">
          {isLoading ? (
            <div className="loading-state" style={{ padding: '2vw', textAlign: 'center' }}>
              <p>Loading locations...</p>
            </div>
          ) : error ? (
            <div className="error-state" style={{ padding: '2vw', textAlign: 'center', color: '#e31a37' }}>
              <p>Error loading locations. Please try again.</p>
            </div>
          ) : (
          <ul className="selectedLocations">
              {Object.keys(filteredGroupedLocations).length > 0 ? (
                Object.keys(filteredGroupedLocations).map((key, groupIndex) => {
                  const group = filteredGroupedLocations[key];
                  const isFirstGroup = groupIndex === 0;
                  
                  return (
                    <div key={key}>
                      <div className="branchTypeOuterWrapper" style={{ border: isFirstGroup ? 0 : undefined }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                        <p>{group.typeName}</p>
                </div>
                      {group.branches.length > 0 ? (
                        group.branches.map((location) => {
                          const isSelected = effectiveSelectedLocation?.id === location.id;
                          
                          return (
                            <li
                              key={location.id}
                              onClick={() => handleLocationClick(location)}
                              onMouseEnter={() => handleLocationHover(location)}
                              onMouseLeave={handleLocationLeave}
                              style={{ cursor: 'pointer' }}
                            >
                              <h6 className={`drop-val ${isSelected ? 'active' : ''}`}>
                        {location.name}
                      </h6>
                    </li>
                          );
                        })
                      ) : null}
              </div>
                  );
                })
              ) : hasSearchQuery ? (
              <div className="no-results">
                <p>No locations found matching &quot;{effectiveSearchQuery}&quot;</p>
              </div>
              ) : null}
            </ul>
            )}
        </div>

        {/* Right Section - Location Details & Map */}
        <div className="right-section-c">
          {displayLocation ? (
            <>
          <div className="location-address">
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31a37">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h6 id="updatePickedLocation">
                  <span id="selectedPickupLocation">{displayLocation.name}</span>
            </h6>
                {displayLocation.details && <span>{displayLocation.details}</span>}
                {displayLocation.hours && (
              <span>
                    <span className="timeMapping">{displayLocation.hours}</span>
              </span>
            )}
                {displayLocation.message && (
              <div className="messageArea">
                <p className="messageText">
                      {showMoreMessage ? displayLocation.message : displayLocation.message.substring(0, 70) + '...'}
                  <span className="showMoreMessage" onClick={() => setShowMoreMessage(!showMoreMessage)}>
                    {showMoreMessage ? ' Show less' : ' Show more'}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="iframe-wrapper">
            <iframe
              title="map"
                  src={displayLocation.mapUrl}
              width="100%"
              height="600"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
