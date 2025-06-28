import Google from './Google.svg'
import apple from './apple.svg'
import logo from './logo.svg';

import { useState } from 'react';

export default function NokuexFooter() {
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <footer id='footer' className="bg-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Hero Section */}
      <div className="bg-[#292D50] min-h-[350px] sm:min-h-[400px] text-white py-12 sm:py-16 lg:py-20 mb-6 sm:mb-8 lg:mb-10 rounded-lg sm:rounded-xl">
        <div className="text-center space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] leading-tight lg:leading-[120%] tracking-[-0.3%] lg:tracking-[-0.6%] font-medium max-w-4xl mx-auto">
            Ready to Get Started?
          </h2>
          
          <p className="text-base sm:text-lg text-gray-300 max-w-sm sm:max-w-md mx-auto leading-relaxed px-2">
            Buy, sell, swap, receive and hold crypto tokens
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            with confidence with Nokuex.
          </p>
          
          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 px-4">
            {/* Google Play Button */}
            <button className="flex items-center space-x-2 sm:space-x-3 bg-[#FBFBFB] hover:bg-gray-100 text-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 w-full sm:w-auto min-w-[280px] sm:min-w-[160px] lg:min-w-[180px] border border-gray-300 hover:scale-105 hover:shadow-lg">
              <img src={Google} alt="Google Play" className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="text-xs text-black">GET IT ON</div>
                <div className="text-sm sm:text-base text-black font-semibold">Google Play</div>
              </div>
            </button>
            
            {/* App Store Button */}
            <button className="flex items-center space-x-2 sm:space-x-3 bg-[#FBFBFB] hover:bg-gray-100 text-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 w-full sm:w-auto min-w-[280px] sm:min-w-[160px] lg:min-w-[180px] border border-gray-300 hover:scale-105 hover:shadow-lg">
              <img src={apple} alt="App Store" className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="text-xs text-black">Download on the</div>
                <div className="text-sm sm:text-base text-black font-semibold">App Store</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
          {/* Left Section - Logo and Description */}
          <div className="lg:max-w-md xl:max-w-lg">
            <div className="mb-4 sm:mb-6">
              <img src={logo} alt="Nokuex Logo" className="h-8 sm:h-10 lg:h-12 w-auto" />
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Buy, sell, swap, send, receive, off-ramp, and hold crypto tokens with confidence on Nokuex.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-2 sm:gap-3">
              <a href="https://www.linkedin.com/company/nokuex/" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
                <a href="https://www.facebook.com/share/1At8UsCDXD/?mibextid=wwXIfr" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                </a>
              
              <a href="https://www.instagram.com/nokuexhq?igsh=MTlnMHdwazNqcTF4MA%3D%3D&utm_source=qr" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
                <a href="https://www.tiktok.com/@nokuexhq?_t=ZM-8xCm3JHn9Of&_r=1" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="TikTok">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                </a>
            </div>
          </div>
          
          {/* Right Section - Navigation Links */}
          <div className="flex flex-col xs:flex-row sm:flex-row gap-8 sm:gap-12 lg:gap-16">
            {/* Company Column */}
            <div className="min-w-0 flex-1 sm:flex-none sm:min-w-[140px]">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Company</h3>
                <ul className="space-y-2 sm:space-y-3">
                <li><a href="/abt" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">About us</a></li>
                <li><a href="#FAQ" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">FAQ</a></li>
                <li><a href="/about" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">Our Mission</a></li>
                <li><a href="mailto:info@nokuex.com" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">info@nokuex.com</a></li>
                <li><a href="tel:+2349032582289" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">+2349032582289</a></li>
                </ul>
            </div>
            
            {/* Help Column */}
            <div className="min-w-0 flex-1 sm:flex-none sm:min-w-[180px]">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Help</h3>
              <ul className="space-y-2 sm:space-y-3">

                
                <li className="relative">
                  <button
                  type="button"
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block w-full text-left focus:outline-none"
                  onClick={() => setShowSupportModal((v) => !v)}
                  >
                  Customer Support
                  </button>
                  {showSupportModal && (
                  <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 text-gray-800 text-sm">
                    <div className="font-semibold mb-2">Customer support details:</div>
                    <div>Someone@nokuex.com</div>
                    <div>+2349032582289</div>
                    <div className="mt-2">For inquiries: info@nokuex.com</div>
                    <button
                    className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-lg"
                    onClick={() => setShowSupportModal(false)}
                    aria-label="Close"
                    tabIndex={0}
                    >
                    ×
                    </button>
                  </div>
                  )}
                </li>
                <li><a href="/terms" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">Terms & Conditions</a></li>
                <li><a href="/mainpol" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">Privacy Policy</a></li>
                <li><a href="/policy" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">Counter Terrorism Finance</a></li>
                <li><a href="policy" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">AML Policy</a></li>
                <li><a href="/law" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors block">Law Enforcement Request</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            © 2025 Noku Technologies LTD, All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}