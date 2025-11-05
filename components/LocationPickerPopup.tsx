'use client';

import { useState, useEffect, useRef } from 'react';

type Location = {
  name: string;
  details?: string;
  hours?: string;
  message?: string;
  mapUrl?: string;
};

type LocationPickerPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  title: string;
  containerRef?: { current: HTMLFormElement | null };
  searchQuery?: string;
};

const locations = {
  airportLocations: [
    {
      name: 'Dubai Airport - Terminal 1 (DXB)',
      details: 'Dubai Airport Terminal 1 - Arrivals Hall',
      hours: 'Sunday-Saturday : 00:00-23:59',
      message: 'Monthly rentals from Dubai & Sharjah airports are subject to Premium charge',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.635369064972!2d55.34954871125346!3d25.249203477584405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d0601c62bdd%3A0x21cb595384b197f5!2sDollar%20Car%20Rental!5e0!3m2!1sen!2sae!4v1689856281638!5m2!1sen!2sae'
    },
    { name: 'Dubai Airport - Terminal 2 (DXB)' },
    { name: 'Dubai Airport - Terminal 3 (DXB)' },
    { name: 'Sharjah Airport (SHJ)' },
    { name: 'Zayed International Airport (AUH)' }
  ],
  freeDeliveryAreas: [
    { name: 'Dubai Motor City' },
    { name: 'Dubai Marina Mall' },
    { name: 'Dubai Mall' },
    { name: 'Mall of the Emirates' },
    { name: 'Burjuman Mall' },
    { name: 'Jumeirah Village Circle - JVC' },
    { name: 'Deira City Centre' },
    { name: 'Al Barsha' },
    { name: 'Al Ghurair Mall' },
    { name: 'Near Al Raha Mall- Abu Dhabi' },
    { name: 'Discovery Gardens' },
    { name: 'Dubai Creek Harbour' },
    { name: 'Near Dalma Mall-Abu Dhabi' },
    { name: 'Dubai Festival City' },
    { name: 'Dubai Green Community' },
    { name: 'Dubai International Financial Centre (DIFC)' },
    { name: 'Dubai Palm Jumeirah' },
    { name: 'Dubai Sports City' },
    { name: 'Four Points by Sheraton – Sheikh Zayed Road' },
    { name: 'Near Galleria Mall- Abu Dhabi' },
    { name: 'Ibn Battuta Mall' },
    { name: 'Near Khalidiya Mall- Abu Dhabi' },
    { name: 'Near Mazyad Mall- Abu Dhabi' },
    { name: 'Meaisem City Centre' },
    { name: 'Meydan - Dubai' },
    { name: 'Mirdiff City Centre' },
    { name: 'Sahara Centre - Sharjah' },
    { name: 'Sharjah City Centre' },
    { name: 'Near Yas Mall- Abu Dhabi' },
    { name: 'Near Al Ain Mall- Al Ain' },
    { name: 'Al Jaddaf - Dubai' },
    { name: 'The Springs Souk' },
    { name: 'Near Boutik Mall-Abu Dhabi' },
    { name: 'Near Deerfields Mall- Abu Dhabi' },
    { name: 'Dubai Damac Hills 1' },
    { name: 'Arabian Ranches' }
  ],
  dubaiBranches: [
    { name: 'Arenco Building - Karama - Dubai' },
    { name: 'Dubai Hills Mall' },
    { name: 'Central Reservations Counter - Alquoz' },
    { name: 'Delta Hotels - Dubai' },
    { name: 'Dubai Four Points Sheraton - Bur Dubai' },
    { name: 'First Avenue Mall - Motor City' },
    { name: 'Jumeirah Lake Towers - Dubai' },
    { name: 'Oasis Mall - Dubai' },
    { name: 'Arenco Tower - Dubai Media City' },
    { name: 'Silicon Central Mall' },
    { name: 'Danube Sports World - Al Habtoor City' },
    { name: 'Business Bay Square - Dubai' }
  ],
  abuDhabiBranches: [
    { name: 'Al Maha Arjaan' },
    { name: 'Al Wahda Mall' },
    { name: 'Crowne Plaza Yas Island' },
    { name: 'Inter Continental Hotel' },
    { name: 'Mussafah' },
    { name: 'Nation Towers' },
    { name: 'Novotel Hotel' },
    { name: 'Al Reem Mall' }
  ],
  sharjahBranches: [
    { name: 'Sharjah Main Office' }
  ],
  alAinBranches: [
    { name: 'Al Jimi Mall' }
  ]
};

export default function LocationPickerPopup({ isOpen, onClose, onSelectLocation, title, containerRef, searchQuery = '' }: LocationPickerPopupProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations.airportLocations[0]);
  const [showMoreMessage, setShowMoreMessage] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

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
        // Clear inline positioning to allow CSS to make it full-screen on mobile
        const popup = popupRef.current;
        popup.style.width = '';
        popup.style.left = '';
        popup.style.top = '';
        popup.style.bottom = '';
        popup.style.height = '';
        popup.style.maxHeight = '';
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
    onSelectLocation(location.name);
    onClose();
  };

  // Filter locations based on search query
  const filterLocations = (locationList: Location[]) => {
    if (!searchQuery.trim()) return locationList;
    const query = searchQuery.toLowerCase();
    return locationList.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.details?.toLowerCase().includes(query)
    );
  };

  // Get all location categories with their filtered locations
  const getFilteredLocationCategories = () => {
    const filteredAirports = filterLocations(locations.airportLocations);
    const filteredFreeDelivery = filterLocations(locations.freeDeliveryAreas);
    const filteredDubai = filterLocations(locations.dubaiBranches);
    const filteredAbuDhabi = filterLocations(locations.abuDhabiBranches);
    const filteredSharjah = filterLocations(locations.sharjahBranches);
    const filteredAlAin = filterLocations(locations.alAinBranches);

    return {
      airportLocations: filteredAirports,
      freeDeliveryAreas: filteredFreeDelivery,
      dubaiBranches: filteredDubai,
      abuDhabiBranches: filteredAbuDhabi,
      sharjahBranches: filteredSharjah,
      alAinBranches: filteredAlAin
    };
  };

  const filteredLocations = getFilteredLocationCategories();

  return (
    <div ref={popupRef} className="pickupReturnLocationPopup">
      {/* Inner Wrapper */}
      <div className="inner-wrapper">
        {/* Left Section - Location List */}
        <div className="left-section">
          <ul className="selectedLocations">
            {/* Airport Locations */}
            {filteredLocations.airportLocations.length > 0 && (
              <div>
                <div className="branchTypeOuterWrapper" style={{ border: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Airport Locations</p>
                </div>
                {filteredLocations.airportLocations.map((location, index) => (
                  <li key={index} onClick={() => handleLocationClick(location)}>
                    <h6 className={`drop-val ${selectedLocation.name === location.name ? 'active' : ''}`}>
                      {location.name}
                    </h6>
                  </li>
                ))}
              </div>
            )}

            {/* Free Delivery Areas */}
            {filteredLocations.freeDeliveryAreas.length > 0 && (
              <div>
                <div className="branchTypeOuterWrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>Free Delivery Areas</p>
                </div>
                {filteredLocations.freeDeliveryAreas.map((location, index) => (
                  <li key={index} onClick={() => handleLocationClick(location)}>
                    <h6 className={`drop-val ${selectedLocation.name === location.name ? 'active' : ''}`}>
                      {location.name}
                    </h6>
                  </li>
                ))}
              </div>
            )}

            {/* Dubai Branches */}
            {filteredLocations.dubaiBranches.length > 0 && (
              <div>
                <div className="branchTypeOuterWrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>Dubai Branches</p>
                </div>
                {filteredLocations.dubaiBranches.map((location, index) => (
                  <li key={index} onClick={() => handleLocationClick(location)}>
                    <h6 className={`drop-val ${selectedLocation.name === location.name ? 'active' : ''}`}>
                      {location.name}
                    </h6>
                  </li>
                ))}
              </div>
            )}

            {/* Abu Dhabi Branches */}
            {filteredLocations.abuDhabiBranches.length > 0 && (
              <div>
                <div className="branchTypeOuterWrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>Abu Dhabi Branches</p>
                </div>
                {filteredLocations.abuDhabiBranches.map((location, index) => (
                  <li key={index} onClick={() => handleLocationClick(location)}>
                    <h6 className={`drop-val ${selectedLocation.name === location.name ? 'active' : ''}`}>
                      {location.name}
                    </h6>
                  </li>
                ))}
              </div>
            )}

            {/* Sharjah Branches */}
            {filteredLocations.sharjahBranches.length > 0 && (
              <div>
                <div className="branchTypeOuterWrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>Sharjah Branches</p>
                </div>
                {filteredLocations.sharjahBranches.map((location, index) => (
                  <li key={index} onClick={() => handleLocationClick(location)}>
                    <h6 className={`drop-val ${selectedLocation.name === location.name ? 'active' : ''}`}>
                      {location.name}
                    </h6>
                  </li>
                ))}
              </div>
            )}

            {/* Al Ain Branches */}
            {filteredLocations.alAinBranches.length > 0 && (
              <div>
                <div className="branchTypeOuterWrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>Al Ain Branches</p>
                </div>
                {filteredLocations.alAinBranches.map((location, index) => (
                  <li key={index} onClick={() => handleLocationClick(location)}>
                    <h6 className={`drop-val ${selectedLocation.name === location.name ? 'active' : ''}`}>
                      {location.name}
                    </h6>
                  </li>
                ))}
              </div>
            )}

            {/* No Results Message */}
            {searchQuery.trim() && 
             filteredLocations.airportLocations.length === 0 &&
             filteredLocations.freeDeliveryAreas.length === 0 &&
             filteredLocations.dubaiBranches.length === 0 &&
             filteredLocations.abuDhabiBranches.length === 0 &&
             filteredLocations.sharjahBranches.length === 0 &&
             filteredLocations.alAinBranches.length === 0 && (
              <div className="no-results">
                <p>No locations found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </ul>
        </div>

        {/* Right Section - Location Details & Map */}
        <div className="right-section-c">
          <div className="location-address">
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31a37">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h6 id="updatePickedLocation">
              <span id="selectedPickupLocation">{selectedLocation.name}</span>
            </h6>
            {selectedLocation.details && <span>{selectedLocation.details}</span>}
            {selectedLocation.hours && (
              <span>
                <span className="timeMapping">{selectedLocation.hours}</span>
              </span>
            )}
            {selectedLocation.message && (
              <div className="messageArea">
                <p className="messageText">
                  {showMoreMessage ? selectedLocation.message : selectedLocation.message.substring(0, 70) + '...'}
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
              src={selectedLocation.mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.635369064972!2d55.34954871125346!3d25.249203477584405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d0601c62bdd%3A0x21cb595384b197f5!2sDollar%20Car%20Rental!5e0!3m2!1sen!2sae!4v1689856281638!5m2!1sen!2sae'}
              width="100%"
              height="600"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

