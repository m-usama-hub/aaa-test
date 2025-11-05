'use client';

import { useState } from 'react';
import BookingForm from './BookingForm';
import PersonalLease from './PersonalLease';

type TabType = 'startBooking' | 'monthlySubscription' | 'personalLease';

export default function BookingTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('startBooking');

  return (
    <div className="booking-tabs bg-white rounded-lg" style={{ background: 'white' }}>
      {/* Tabs Header */}
      <nav style={{ background: 'white' }}>
        <div className="flex border-b border-[#d0d5dd]">
          <button
            onClick={() => setActiveTab('startBooking')}
            className={`relative mr-[1.25vw] text-[#666666] transition-all ${
              activeTab === 'startBooking'
                ? 'text-[#e31a37] font-bold'
                : 'font-normal'
            }`}
            style={{
              fontSize: '1.25vw',
              lineHeight: '1.52vw',
              padding: '1.73vw 0 1.11vw 0',
            }}
          >
            Start Booking
            {activeTab === 'startBooking' && (
              <span className="absolute left-0 bottom-[-1.5px] w-full h-[2px] bg-[#e31a37] rounded-[10px]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('monthlySubscription')}
            className={`relative mr-[1.25vw] text-[#666666] transition-all ${
              activeTab === 'monthlySubscription'
                ? 'text-[#e31a37] font-bold'
                : 'font-normal'
            }`}
            style={{
              fontSize: '1.25vw',
              lineHeight: '1.52vw',
              padding: '1.73vw 0 1.11vw 0',
            }}
          >
            Monthly Subscription
            {activeTab === 'monthlySubscription' && (
              <span className="absolute left-0 bottom-[-1.5px] w-full h-[2px] bg-[#e31a37] rounded-[10px]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('personalLease')}
            className={`relative mr-[1.25vw] text-[#666666] transition-all ${
              activeTab === 'personalLease'
                ? 'text-[#e31a37] font-bold'
                : 'font-normal'
            }`}
            style={{
              fontSize: '1.25vw',
              lineHeight: '1.52vw',
              padding: '1.73vw 0 1.11vw 0',
            }}
          >
            Personal Lease
            {activeTab === 'personalLease' && (
              <span className="absolute left-0 bottom-[-1.5px] w-full h-[2px] bg-[#e31a37] rounded-[10px]" />
            )}
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <div style={{ marginTop: '1.8vw' }}>
        {activeTab === 'startBooking' && <BookingForm type="startBooking" />}
        {activeTab === 'monthlySubscription' && <BookingForm type="monthlySubscription" />}
        {activeTab === 'personalLease' && <PersonalLease />}
      </div>
    </div>
  );
}

