import React from 'react';
import t from './t.svg'
import Google from './Google.svg'
import apple from './apple.svg'
import phone from './phone.svg'

const CryptoTradingLanding: React.FC = () => {
  return (
    <div className="min-h-screen max-w-8xl mx-auto">
      {/* Main Container */}
      <div className="container max-w-8xl mx-auto relative">
        <div className="flex flex-col w-full lg:flex-row items-center justify-between gap-4 lg:gap-12">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:w-full xl:w-1/2 lg:text-left">
            {/* Logo */}
            <div className='flex mb-6 lg:mb-16'>
              <div className="hidden lg:flex relative left-8 top-3 mb-6 lg:mb-8">
                <div className="flex items-start">
                  <img 
                    src={t} 
                    alt="Logo" 
                    className="w-20 h-20 sm:w-10 sm:h-10 lg:w-32 lg:h-32 will-change-transform" 
                    loading="eager"
                  />
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4 lg:space-y-6 mt-8 lg:mt-24">
                {/* Main Heading */}
                <h1 className="hidden sm:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-black leading-tight text-center lg:text-left">
                  <span className="block">Trade Your</span>
                  <span className="block text-black">
                    Digital Assets
                  </span>
                  <span className="block">On Your Own</span>
                  <span className="block">Terms</span>
                </h1>
                <h1 className="block sm:hidden text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-black leading-tight text-center lg:text-left">
                  <span className="block">Trade Your   Digital</span>
                  <span className="block text-black">
                    Assets On Your
                  </span>
                  <span className="block"> Own Terms</span>
                </h1>
                
                {/* Subheading */}
                <p className="text-black text-base sm:text-lg lg:text-xl max-w-md lg:max-w-lg mx-auto lg:text-left px-4 sm:px-0 transition-colors duration-300">
                  Buy, sell, swap, send, receive, off-ramp, and hold
                  crypto tokens with confidence on Nokuex.
                </p>
              
                {/* Download Buttons */}
                <div className="flex sm:flex-row gap-4 justify-center lg:justify-start pt-2 lg:pt-6">
                  {/* Google Play Button */}
                  <button className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-200 min-w-40 sm:min-w-44 border border-gray-300 transform active:scale-95">
                    <img src={Google} alt="Google Play" className="w-6 h-6 sm:w-7 sm:h-7" loading="lazy" />
                    <div className="text-left">
                      <div className="text-xs text-black">GET IT ON</div>
                      <div className="text-sm sm:text-base text-black font-semibold">Google Play</div>
                    </div>
                  </button>
                  
                  {/* App Store Button */}
                  <button className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-200 min-w-40 sm:min-w-44 border border-gray-300 transform active:scale-95">
                    <img src={apple} alt="App Store" className="w-6 h-6 sm:w-7 sm:h-7" loading="lazy" />
                    <div className="text-left">
                      <div className="text-xs text-black">Download on the</div>
                      <div className="text-sm sm:text-base text-black font-semibold">App Store</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Phone Mockups */}
          <div className="flex-1 flex justify-center w-full lg:w-1/2 lg:justify-start lg:order-2">
            <div className="relative w-full flex items-center lg:items-start justify-center lg:justify-start min-h-64 lg:min-h-0">
              <img 
                src={phone} 
                alt="Phone mockup" 
                className="mx-auto lg:mx-0 lg:ml-20 lg:mt-5 h-auto max-w-64 sm:max-w-48 lg:max-w-96 xl:max-w-lg drop-shadow-2xl will-change-transform"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTradingLanding;