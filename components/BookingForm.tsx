'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPinIcon, CalendarIcon, CarIcon, ChevronRightIcon, ClockIcon, CloseIcon } from './Icons';
import LocationPickerPopup from './LocationPickerPopup';
import DateTimePickerPopup from './DateTimePickerPopup';

type BookingFormProps = {
    type: 'startBooking' | 'monthlySubscription';
};

export default function BookingForm({ type }: BookingFormProps) {   
    const [sameReturnLocation, setSameReturnLocation] = useState(true);
    const [pickupLocation, setPickupLocation] = useState('');
    const [returnLocation, setReturnLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('05 Nov 2025');
    const [pickupTime, setPickupTime] = useState('09:30 PM');
    const [returnDate, setReturnDate] = useState('06 Nov 2025');
    const [returnTime, setReturnTime] = useState('12:00 AM');
    const [isPickupPopupOpen, setIsPickupPopupOpen] = useState(false);
    const [isReturnPopupOpen, setIsReturnPopupOpen] = useState(false);
    const [isDateTimePopupOpen, setIsDateTimePopupOpen] = useState(false);
    const [activeDateTimeField, setActiveDateTimeField] = useState<'pickup' | 'return'>('pickup');
    
    const pickupRef = useRef<HTMLDivElement>(null);
    const returnRef = useRef<HTMLDivElement>(null);
    const pickupDateTimeRef = useRef<HTMLDivElement>(null);
    const returnDateTimeRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const isStartBooking = type === 'startBooking';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            
            // Don't close if clicking inside the pickup container (including popup)
            if (pickupRef.current && pickupRef.current.contains(target)) {
                return;
            }
            
            // Don't close if clicking inside the return container (including popup)
            if (returnRef.current && returnRef.current.contains(target)) {
                return;
            }
            
            // Don't close if clicking inside the date/time popup containers
            if (pickupDateTimeRef.current && pickupDateTimeRef.current.contains(target)) {
                return;
            }
            
            if (returnDateTimeRef.current && returnDateTimeRef.current.contains(target)) {
                return;
            }
            
            // Close all popups if clicking outside
            setIsPickupPopupOpen(false);
            setIsReturnPopupOpen(false);
            setIsDateTimePopupOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePickupDateTimeClick = () => {
        setActiveDateTimeField('pickup');
        setIsDateTimePopupOpen(true);
        setIsPickupPopupOpen(false);
        setIsReturnPopupOpen(false);
    };

    const handleReturnDateTimeClick = () => {
        setActiveDateTimeField('return');
        setIsDateTimePopupOpen(true);
        setIsPickupPopupOpen(false);
        setIsReturnPopupOpen(false);
    };

    return (
        <form ref={formRef} className="booking-form">
            <div className="booking-row flex gap-[1vw]">
                {/* Pickup & Return Location Section */}
                <div className='w-full'>
                    <label
                        className="flex justify-between mb-0"
                        style={{ marginBottom: '0.55vw' }}
                    >
                        <span
                            className="text-[#231f20] font-normal"
                            style={{
                                fontSize: '1.11vw',
                                lineHeight: '1.49vw'
                            }}
                        >
                            {isStartBooking ? 'Pickup & Return Location' : 'Pickup Location'}
                        </span>
                        {isStartBooking && (
                            <span className="flex items-center same-return-location">
                                <input
                                    type="checkbox"
                                    id="sameReturnLocation"
                                    checked={sameReturnLocation}
                                    onChange={(e) => setSameReturnLocation(e.target.checked)}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="sameReturnLocation"
                                    className="flex items-center cursor-pointer text-[#231f20] font-bold relative"
                                    style={{
                                        fontSize: '1.11vw',
                                        lineHeight: '1.49vw',
                                        paddingLeft: '2vw'
                                    }}
                                >
                                    <span
                                        className={`absolute left-0 block ${sameReturnLocation ? 'bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjRTExOTM2Ii8+PHBhdGggZD0iTTUgMTAuNzA1OUw3LjkxNjY3IDE0TDE1IDYiIHN0cm9rZT0iI0Y1RjVGNSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==)]' : 'bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIj48cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjE5IiBoZWlnaHQ9IjE5IiByeD0iMy41IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjOTk5OTk5Ii8+PHBhdGggZD0iTTUgMTAuNzA1OUw3LjkxNjY3IDE0TDE1IDYiIHN0cm9rZT0iI0M5QzlDOSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==)]'}`}
                                        style={{
                                            width: '1.38vw',
                                            height: '1.38vw',
                                            backgroundSize: 'contain',
                                            backgroundRepeat: 'no-repeat',
                                            marginRight: '0.6vw'
                                        }}
                                    />
                                    Same Return Location
                                </label>
                            </span>
                        )}
                    </label>

                    <div className="flex flex-col gap-[1vw]">
                        {/* Pickup Location Input Wrapper */}
                        <div className="gap-[1vw]" style={{ display: !sameReturnLocation ? 'flex' : '' }}>
                            <div ref={pickupRef} className="flex-col items-start bg-white  text-[#231f20] font-bold transition-colors cursor-pointer relative" style={{ width: !sameReturnLocation ? '50%' : '100%' }}>
                                <div 
                                    className={`flex-1 flex items-center border rounded-[0.34vw] cursor-pointer transition-all ${
                                        isPickupPopupOpen 
                                            ? 'border-[#e31a37] bg-[#fff5f5]' 
                                            : 'border-[#c9c9c9] hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        setIsPickupPopupOpen(true);
                                        setIsReturnPopupOpen(false);
                                        setIsDateTimePopupOpen(false);
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-center text-gray-500"
                                        style={{
                                            width: '1.38vw',
                                            height: '1.66vw',
                                            margin: '0.69vw',
                                            marginLeft: '0.83vw'
                                        }}
                                    >
                                        <MapPinIcon />
                                    </div>
                                    <input
                                        type="text"
                                        value={pickupLocation}
                                        onChange={(e) => {
                                            setPickupLocation(e.target.value);
                                        }}
                                        onFocus={() => {
                                            setIsPickupPopupOpen(true);
                                            setIsReturnPopupOpen(false);
                                            setIsDateTimePopupOpen(false);
                                        }}
                                        onClick={() => {
                                            setIsPickupPopupOpen(true);
                                            setIsReturnPopupOpen(false);
                                            setIsDateTimePopupOpen(false);
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        placeholder="Airport, City or Address"
                                        className="flex-1 border-none bg-transparent text-[#231f20] font-bold outline-none cursor-pointer"
                                        style={{
                                            fontSize: '1.18vw',
                                            lineHeight: '1.61vw',
                                            height: '3.05vw',
                                        }}
                                    />
                                    {pickupLocation && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPickupLocation('');
                                                if (sameReturnLocation) {
                                                    setReturnLocation('');
                                                }
                                            }}
                                            className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                                            style={{
                                                width: '1.38vw',
                                                height: '1.66vw',
                                                margin: '0.69vw',
                                                marginRight: '0.83vw',
                                                color: '#666',
                                            }}
                                        >
                                            <CloseIcon />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Location Picker Dropdown */}
                                {isPickupPopupOpen && (
                                    <LocationPickerPopup
                                        isOpen={isPickupPopupOpen}
                                        onClose={() => setIsPickupPopupOpen(false)}
                                        onSelectLocation={(location) => {
                                            setPickupLocation(location);
                                            if (sameReturnLocation) {
                                                setReturnLocation(location);
                                            }
                                        }}
                                        title="Select Pickup Location"
                                        containerRef={formRef}
                                        searchQuery={pickupLocation}
                                        selectedLocationName={pickupLocation}
                                    />
                                )}
                                
                                <div
                                    className="flex items-center gap-[0.5vw] bg-white  text-[#231f20] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                                    style={{
                                        paddingTop: '0.69vw',
                                        fontSize: '1.11vw',
                                        lineHeight: '1.51vw',
                                        height: '3.05vw',
                                        whiteSpace: 'nowrap'
                                    }}
                                    id="delivery-to-me"
                                >
                                    <div style={{ width: '1.66vw', height: '1.66vw' }}>
                                        <CarIcon />
                                    </div>
                                    <span>Deliver to me</span>
                                    <div style={{ width: '0.83vw', height: '0.83vw' }}>
                                        <ChevronRightIcon />
                                    </div>
                                </div>
                            </div>
                            {/* Return Location Input Wrapper - Only show for Start Booking when checkbox is unchecked */}
                            {isStartBooking && !sameReturnLocation && (
                            <div ref={returnRef} className="flex-col items-start bg-white  text-[#231f20] font-bold transition-colors cursor-pointer relative" style={{ width: !sameReturnLocation ? '50%' : '' }}>
                                    <div 
                                        className={`flex-1 flex items-center border rounded-[0.34vw] cursor-pointer transition-all ${
                                            isReturnPopupOpen 
                                                ? 'border-[#e31a37] bg-[#fff5f5]' 
                                                : 'border-[#c9c9c9] hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setIsReturnPopupOpen(true);
                                            setIsPickupPopupOpen(false);
                                            setIsDateTimePopupOpen(false);
                                        }}
                                    >
                                        <div
                                            className="flex items-center justify-center text-gray-500"
                                            style={{
                                                width: '1.38vw',
                                                height: '1.66vw',
                                                margin: '0.69vw',
                                                marginLeft: '0.83vw'
                                            }}
                                        >
                                            <MapPinIcon />
                                        </div>
                                        <input
                                            type="text"
                                            value={returnLocation}
                                            onChange={(e) => {
                                                setReturnLocation(e.target.value);
                                            }}
                                            onFocus={() => {
                                                setIsReturnPopupOpen(true);
                                                setIsPickupPopupOpen(false);
                                                setIsDateTimePopupOpen(false);
                                            }}
                                            onClick={() => {
                                                setIsReturnPopupOpen(true);
                                                setIsPickupPopupOpen(false);
                                                setIsDateTimePopupOpen(false);
                                            }}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            placeholder="Airport, City or Address"
                                            id="returnLocation"
                                            className="flex-1 border-none bg-transparent text-[#231f20] font-bold outline-none cursor-pointer"
                                            style={{
                                                fontSize: '1.18vw',
                                                lineHeight: '1.61vw',
                                                height: '3.05vw',
                                            }}
                                        />
                                        {returnLocation && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setReturnLocation('');
                                                }}
                                                className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                                                style={{
                                                    width: '1.38vw',
                                                    height: '1.66vw',
                                                    margin: '0.69vw',
                                                    marginRight: '0.83vw',
                                                    color: '#666',
                                                }}
                                            >
                                                <CloseIcon />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Location Picker Dropdown */}
                                    {isReturnPopupOpen && (
                                        <LocationPickerPopup
                                            isOpen={isReturnPopupOpen}
                                            onClose={() => setIsReturnPopupOpen(false)}
                                            onSelectLocation={setReturnLocation}
                                            title="Select Return Location"
                                            containerRef={formRef}
                                            searchQuery={returnLocation}
                                            selectedLocationName={returnLocation}
                                        />
                                    )}
                                    
                                    <div
                                        className="flex items-center gap-[0.5vw] bg-white  text-[#231f20] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                                        style={{
                                            paddingTop: '0.69vw',
                                            fontSize: '1.11vw',
                                            lineHeight: '1.51vw',
                                            height: '3.05vw',
                                            whiteSpace: 'nowrap'
                                        }}
                                        id="delivery-to-me"
                                    >
                                        <div style={{ width: '1.66vw', height: '1.66vw' }}>
                                            <CarIcon />
                                        </div>
                                        <span>Collect from me</span>
                                        <div style={{ width: '0.83vw', height: '0.83vw' }}>
                                            <ChevronRightIcon />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>
                </div>

                {/* Pickup Date & Time Section */}
                <div className="" style={{ gap: '0.83vw' }}>
                    <div ref={pickupDateTimeRef} className="relative">
                        <label className="block text-[#231f20] font-normal" style={{ fontSize: '1.11vw', lineHeight: '1.49vw', marginBottom: '0.55vw' }}>
                            <span>Pickup Date & Time</span>
                        </label>
                        <div className="flex gap-[0.83vw]">
                            <div 
                                className={`flex-1 flex items-center border rounded-[0.34vw] cursor-pointer transition-all ${
                                    isDateTimePopupOpen && activeDateTimeField === 'pickup'
                                        ? 'border-[#e31a37] bg-[#fff5f5]' 
                                        : 'border-[#c9c9c9] hover:bg-gray-50'
                                }`}
                                onClick={handlePickupDateTimeClick}
                            >
                                <div
                                    className="flex items-center justify-center text-gray-500"
                                    style={{
                                        width: '1.38vw',
                                        height: '1.66vw',
                                        margin: '0.69vw',
                                        marginLeft: '0.83vw'
                                    }}
                                >
                                    <CalendarIcon />
                                </div>
                                <input
                                    type="text"
                                    value={`${pickupDate} | ${pickupTime}`}
                                    readOnly
                                    id="pickup"
                                    className="flex-1 border-none bg-transparent text-[#231f20] font-bold outline-none cursor-pointer"
                                    style={{
                                        fontSize: '1.18vw',
                                        lineHeight: '1.61vw',
                                        height: '3.05vw'
                                    }}
                                    onClick={handlePickupDateTimeClick}
                                />
                            </div>
                        </div>
                        
                        {/* Date/Time Picker Popup */}
                        {isDateTimePopupOpen && activeDateTimeField === 'pickup' && (
                            <DateTimePickerPopup
                                isOpen={isDateTimePopupOpen}
                                onClose={() => setIsDateTimePopupOpen(false)}
                                pickupLocation={pickupLocation}
                                returnLocation={returnLocation}
                                pickupDate={pickupDate}
                                pickupTime={pickupTime}
                                returnDate={returnDate}
                                returnTime={returnTime}
                                onPickupDateChange={setPickupDate}
                                onPickupTimeChange={setPickupTime}
                                onReturnDateChange={setReturnDate}
                                onReturnTimeChange={setReturnTime}
                                activeField={activeDateTimeField}
                                containerRef={formRef}
                            />
                        )}
                    </div>

                    {/* Promo Code Button - Positioned below Pickup Date */}
                    <div className="flex items-center">
                        <div
                            className="flex items-center gap-[0.5vw] bg-white rounded-[0.34vw] text-[#231f20] font-bold hover:bg-gray-50 transition-colors cursor-pointer p-0"
                            style={{
                                paddingTop: '0.69vw',
                                fontSize: '1.11vw',
                                lineHeight: '1.51vw',
                                height: '3.05vw'
                            }}
                            id="promo-code-btn"
                        >
                            <div style={{ width: '1.66vw', height: '1.66vw' }}>
                                <ClockIcon />
                            </div>
                            <span>Promo Code / Shukran Id</span>
                        </div>
                    </div>
                </div>

                {/* Return Date & Time - Only for Start Booking */}
                {isStartBooking && (
                    <div ref={returnDateTimeRef} className="relative">
                        <label className="block text-[#231f20] font-normal" style={{ fontSize: '1.11vw', lineHeight: '1.49vw', marginBottom: '0.55vw' }}>
                            <span>Return Date & Time</span>
                        </label>
                        <div 
                            className={`flex items-center border rounded-[0.34vw] cursor-pointer transition-all ${
                                isDateTimePopupOpen && activeDateTimeField === 'return'
                                    ? 'border-[#e31a37] bg-[#fff5f5]' 
                                    : 'border-[#c9c9c9] hover:bg-gray-50'
                            }`}
                            onClick={handleReturnDateTimeClick}
                        >
                            <div
                                className="flex items-center justify-center text-gray-500"
                                style={{
                                    width: '1.38vw',
                                    height: '1.66vw',
                                    margin: '0.69vw',
                                    marginLeft: '0.83vw'
                                }}
                            >
                                <CalendarIcon />
                            </div>
                            <input
                                type="text"
                                value={`${returnDate} | ${returnTime}`}
                                readOnly
                                id="return"
                                className="flex-1 border-none bg-transparent text-[#231f20] font-bold outline-none cursor-pointer"
                                style={{
                                    fontSize: '1.18vw',
                                    lineHeight: '1.61vw',
                                    height: '3.05vw'
                                }}
                                onClick={handleReturnDateTimeClick}
                            />
                        </div>
                        
                        {/* Date/Time Picker Popup */}
                        {isDateTimePopupOpen && activeDateTimeField === 'return' && (
                            <DateTimePickerPopup
                                isOpen={isDateTimePopupOpen}
                                onClose={() => setIsDateTimePopupOpen(false)}
                                pickupLocation={pickupLocation}
                                returnLocation={returnLocation}
                                pickupDate={pickupDate}
                                pickupTime={pickupTime}
                                returnDate={returnDate}
                                returnTime={returnTime}
                                onPickupDateChange={setPickupDate}
                                onPickupTimeChange={setPickupTime}
                                onReturnDateChange={setReturnDate}
                                onReturnTimeChange={setReturnTime}
                                activeField={activeDateTimeField}
                                containerRef={formRef}
                            />
                        )}
                    </div>
                )}

                {/* Show Cars Button */}
                <div className="relative inline-block" style={{ marginTop: '2vw' }}>
                    <button
                        type="button"
                        className="bg-[#e31a37] text-white border-none rounded-[0.34vw] transition-all hover:bg-[#c8102c] whitespace-nowrap font-bold showCarBtn"
                        style={{
                            padding: '0.76vw 1.1vw',
                            fontSize: '1.11vw',
                            lineHeight: '1.51vw'
                        }}
                    >
                        Show Cars
                    </button>
                </div>
            </div>
        </form>
    );
}

