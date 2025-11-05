'use client';

import { useState, useEffect, useRef } from 'react';

type DateTimePickerPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  onPickupDateChange: (date: string) => void;
  onPickupTimeChange: (time: string) => void;
  onReturnDateChange: (date: string) => void;
  onReturnTimeChange: (time: string) => void;
  activeField: 'pickup' | 'return';
  containerRef?: { current: HTMLFormElement | null };
};

export default function DateTimePickerPopup({
  isOpen,
  onClose,
  pickupLocation,
  returnLocation,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  onPickupDateChange,
  onPickupTimeChange,
  onReturnDateChange,
  onReturnTimeChange,
  activeField,
  containerRef
}: DateTimePickerPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Parse current dates
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split(' ');
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return new Date(parseInt(year), monthMap[month], parseInt(day));
  };

  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = activeField === 'pickup' ? parseDate(pickupDate) : parseDate(returnDate);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const [selectedPickupDate, setSelectedPickupDate] = useState(() => parseDate(pickupDate));
  const [selectedReturnDate, setSelectedReturnDate] = useState(() => parseDate(returnDate));
  
  const [pickupHour, setPickupHour] = useState(() => {
    const match = pickupTime.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (match) {
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const period = match[3];
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return { hour, minute };
    }
    return { hour: 9, minute: 0 };
  });
  
  const [pickupPeriod, setPickupPeriod] = useState(() => {
    const match = pickupTime.match(/(AM|PM)/);
    return match ? match[1] : 'AM';
  });

  const [returnHour, setReturnHour] = useState(() => {
    const match = returnTime.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (match) {
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const period = match[3];
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return { hour, minute };
    }
    return { hour: 9, minute: 0 };
  });
  
  const [returnPeriod, setReturnPeriod] = useState(() => {
    const match = returnTime.match(/(AM|PM)/);
    return match ? match[1] : 'AM';
  });

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
      if (isOpen && containerRef?.current && popupRef.current) {
        const formRect = containerRef.current.getBoundingClientRect();
        const popup = popupRef.current;
        const popupParent = popup.parentElement;
        
        if (popupParent) {
          const parentRect = popupParent.getBoundingClientRect();
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
    window.addEventListener('resize', updatePopupPosition);
    return () => {
      window.removeEventListener('resize', updatePopupPosition);
    };
  }, [isOpen, containerRef]);

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day.toString().padStart(2, '0')} ${month} ${year}`;
  };

  const formatDateShort = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day.toString().padStart(2, '0')} ${month}`;
  };

  const formatTime = (hour: number, minute: number, period: string) => {
    let displayHour = hour;
    if (period === 'PM') {
      if (hour === 12) {
        displayHour = 12;
      } else if (hour > 12) {
        displayHour = hour - 12;
      }
    } else { // AM
      if (hour === 0) {
        displayHour = 12;
      } else if (hour === 12) {
        displayHour = 12;
      } else {
        displayHour = hour;
      }
    }
    return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return day === 0 ? 6 : day - 1;
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day: number, month: Date) => {
    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day);
    if (isPastDate(selectedDate)) return;

    if (activeField === 'pickup') {
      setSelectedPickupDate(selectedDate);
      onPickupDateChange(formatDate(selectedDate));
    } else {
      setSelectedReturnDate(selectedDate);
      onReturnDateChange(formatDate(selectedDate));
    }
  };

  const handleTimeChange = (type: 'pickup' | 'return', delta: number) => {
    // Increment/decrement by 30 minutes
    const minutesDelta = delta * 30;
    
    if (type === 'pickup') {
      const totalMinutes = pickupHour.hour * 60 + pickupHour.minute + minutesDelta;
      const clampedMinutes = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
      const newHour = Math.floor(clampedMinutes / 60);
      const newMinute = clampedMinutes % 60;
      
      setPickupHour({ hour: newHour, minute: newMinute });
      const period = newHour >= 12 ? 'PM' : 'AM';
      setPickupPeriod(period);
      onPickupTimeChange(formatTime(newHour, newMinute, period));
    } else {
      const totalMinutes = returnHour.hour * 60 + returnHour.minute + minutesDelta;
      const clampedMinutes = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
      const newHour = Math.floor(clampedMinutes / 60);
      const newMinute = clampedMinutes % 60;
      
      setReturnHour({ hour: newHour, minute: newMinute });
      const period = newHour >= 12 ? 'PM' : 'AM';
      setReturnPeriod(period);
      onReturnTimeChange(formatTime(newHour, newMinute, period));
    }
  };

  const handlePeriodToggle = (type: 'pickup' | 'return', period: string) => {
    if (type === 'pickup') {
      let hour = pickupHour.hour;
      // Convert hour based on period change
      if (period === 'AM' && hour >= 12) {
        hour = hour - 12;
      } else if (period === 'PM' && hour < 12) {
        hour = hour + 12;
      }
      setPickupHour({ ...pickupHour, hour });
      setPickupPeriod(period);
      onPickupTimeChange(formatTime(hour, pickupHour.minute, period));
    } else {
      let hour = returnHour.hour;
      // Convert hour based on period change
      if (period === 'AM' && hour >= 12) {
        hour = hour - 12;
      } else if (period === 'PM' && hour < 12) {
        hour = hour + 12;
      }
      setReturnHour({ ...returnHour, hour });
      setReturnPeriod(period);
      onReturnTimeChange(formatTime(hour, returnHour.minute, period));
    }
  };

  const navigateMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const renderCalendar = (month: Date) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const isPast = isPastDate(date);
      const isPickupSelected = selectedPickupDate.getTime() === date.getTime();
      const isReturnSelected = selectedReturnDate.getTime() === date.getTime();
      const isSelected = isPickupSelected || isReturnSelected;
      const isActive = (activeField === 'pickup' && isPickupSelected) || (activeField === 'return' && isReturnSelected);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''}`}
          onClick={() => !isPast && handleDateClick(day, month)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar-month">
        <div className="calendar-month-header">
          <span>{monthNames[month.getMonth()]} {month.getFullYear()}</span>
        </div>
        <div className="calendar-weekdays">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  const calculateDaysDifference = () => {
    const diff = Math.ceil((selectedReturnDate.getTime() - selectedPickupDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const getDisplayHour = (hour: number) => {
    if (hour === 0) return 12;
    if (hour === 12) return 12;
    if (hour > 12) return hour - 12;
    return hour;
  };

  const displayPickupHour = getDisplayHour(pickupHour.hour);
  const displayReturnHour = getDisplayHour(returnHour.hour);

  return (
    <div ref={popupRef} className="dateTimePickerPopup">
      <div className="inner-wrapper">
        {/* Left Section - Location Details */}
        <div className="left-section-datetime">
          <div className="location-details">
            <div className="location-item">
              <div className="location-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="location-info">
                <div className="location-name">{pickupLocation || 'Select pick up location'}</div>
                <div className="location-datetime">Pickup: {pickupDate} | {pickupTime}</div>
              </div>
            </div>
            
            <div className="location-connector"></div>
            
            <div className="location-item">
              <div className="location-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="location-info">
                <div className="location-name">{returnLocation || 'Select return location'}</div>
                <div className="location-datetime">Return: {returnDate} | {returnTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Calendar and Time Selectors */}
        <div className="right-section-datetime">
          {/* Calendar Section */}
          <div className="calendar-section">
            <div className="calendar-navigation">
              <button onClick={() => navigateMonth(-1)} className="calendar-nav-btn calendar-nav-left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="calendar-months">
                {renderCalendar(currentMonth)}
                {renderCalendar(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              </div>
              <button onClick={() => navigateMonth(1)} className="calendar-nav-btn calendar-nav-right">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Days Difference */}
          <div className="days-difference">
            {calculateDaysDifference()} {calculateDaysDifference() === 1 ? 'day' : 'days'}
          </div>

          {/* Time Selectors Section */}
          <div className="flex time-selectors-section">
            {/* Pickup Date & Time */}
            <div className="time-selector-group">
              <label className="time-selector-label">Pickup Date & Time</label>
              <div className="time-selector-display">{formatDateShort(selectedPickupDate)} | {pickupTime}</div>
              <div className="time-controls">
                <button onClick={() => handleTimeChange('pickup', -1)} className="time-btn">−</button>
                <div className="time-value">
                  <span className="time-number">{displayPickupHour.toString().padStart(2, '0')}:{pickupHour.minute.toString().padStart(2, '0')}</span>
                </div>
                <button onClick={() => handleTimeChange('pickup', 1)} className="time-btn">+</button>
                <div className="time-period">
                  <button 
                    onClick={() => handlePeriodToggle('pickup', 'AM')} 
                    className={`period-btn ${pickupPeriod === 'AM' ? 'active' : ''}`}
                  >
                    AM
                  </button>
                  <button 
                    onClick={() => handlePeriodToggle('pickup', 'PM')} 
                    className={`period-btn ${pickupPeriod === 'PM' ? 'active' : ''}`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* Return Date & Time */}
            <div className="time-selector-group">
              <label className="time-selector-label">Return Date & Time</label>
              <div className="time-selector-display">{formatDateShort(selectedReturnDate)} | {returnTime}</div>
              <div className="time-controls">
                <button onClick={() => handleTimeChange('return', -1)} className="time-btn">−</button>
                <div className="time-value">
                  <span className="time-number">{displayReturnHour.toString().padStart(2, '0')}:{returnHour.minute.toString().padStart(2, '0')}</span>
                </div>
                <button onClick={() => handleTimeChange('return', 1)} className="time-btn">+</button>
                <div className="time-period">
                  <button 
                    onClick={() => handlePeriodToggle('return', 'AM')} 
                    className={`period-btn ${returnPeriod === 'AM' ? 'active' : ''}`}
                  >
                    AM
                  </button>
                  <button 
                    onClick={() => handlePeriodToggle('return', 'PM')} 
                    className={`period-btn ${returnPeriod === 'PM' ? 'active' : ''}`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

