'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="header-nav bg-white" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)' }}>
      <div className="container mx-auto px-4 md:px-0">
        <div className="navbar flex items-center justify-between py-3 md:py-5">
          {/* Mobile Menu Toggle */}
          <button className="toggle-icon left-wrap-menu lg:hidden mr-8">
            <span className="one block w-[27px] h-[3px] bg-[#d9d9d9] my-[5px] mx-auto rounded-[5px]"></span>
            <span className="two block w-[27px] h-[3px] bg-[#d9d9d9] my-[5px] mx-auto rounded-[5px]"></span>
            <span className="three block w-[27px] h-[3px] bg-[#d9d9d9] my-[5px] mx-auto rounded-[5px]"></span>
          </button>

          {/* Logo - Centered on mobile */}
          <div className="flex-1 flex flex-col items-center lg:items-start lg:flex-initial">
            <Link href="/" className="logo flex flex-col items-center">
              <Image 
                src="/dollar.7a3cc7e0.svg" 
                width={117} 
                height={39.95} 
                alt="Dollar Car Rental UAE"
                priority
                className="w-auto h-auto"
                style={{ maxWidth: '117px', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Mobile Login/Register */}
          <div className="flex items-center gap-2 lg:hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#231f20' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <Link href="/" className="text-sm font-bold" style={{ color: '#e21936', fontSize: '14px', lineHeight: '18px' }}>
              Login | Register
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="navigation-wrap hidden lg:block">
            <ul className="navbar-nav flex items-center list-none m-0 p-0">
              <li className="nav-item">
                <a href="#" className="block px-2 py-10 text-base leading-[22px] text-black font-normal" title="Offers">
                  Offers
                </a>
              </li>
              <li className="nav-item ml-[15px]">
                <a href="#" className="block px-2 py-10 text-base leading-[22px] text-black font-normal" title="Teachers Offer">
                  Teachers Offer
                </a>
              </li>
              <li className="nav-item withLabelG ml-[15px] flex items-center">
                <a 
                  href="#" 
                  className="block px-2 py-10 text-base leading-[22px] font-normal" 
                  title="personal-leasing" 
                  style={{ 
                    background: 'linear-gradient(90deg, #e31a37 14.83%, #000 90.91%)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Personal Lease
                </a>
                <span className="text-[0.81vw] text-white font-semibold bg-[#e21936] px-[0.39vw] py-[0.1vw] rounded-[0.87vw] ml-[0.4vw] block">
                  New
                </span>
              </li>
              <li className="nav-item ml-[15px]">
                <a href="#" className="block px-2 py-10 text-base leading-[22px] text-black font-normal" title="Business Leasing">
                  Business Leasing
                </a>
              </li>
              <li className="nav-item ml-[15px]">
                <a href="#" className="block px-2 py-10 text-base leading-[22px] text-black font-normal" title="Dollar Prestige">
                  Dollar Prestige
                </a>
              </li>
              <li className="nav-item login ml-[15px]">
                <Link href="/" className="block px-2 py-10 text-base leading-[22px] font-bold" style={{ color: '#e21936', fontFamily: 'ProductSansBold' }}>
                  Login
                </Link>
              </li>
              <li className="nav-item register-bttn ml-2">
                <Link 
                  href="/register" 
                  className="inline-block px-[25px] py-[11px] text-lg leading-none uppercase font-bold text-white rounded" 
                  style={{ backgroundColor: '#e21936', fontFamily: 'ProductSansBold' }}
                >
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
