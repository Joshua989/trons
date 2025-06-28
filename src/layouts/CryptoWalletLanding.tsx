import { useState, useEffect } from 'react';
import side from './side.svg'
import news from './new.svg'
import deposit from './deposit.svg'
import request from './request.svg'
import off from './off.svg'
import moni from './moni.svg'

export default function CryptoWalletLanding() {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = (sectionId: string, delay = 0) => {
    const isVisible = visibleSections.has(sectionId);
    const delayClass = delay > 0 ? `animation-delay-${delay}` : '';
    return `transform transition-all duration-1000 ease-out ${delayClass} ${
      isVisible 
        ? 'translate-y-0 opacity-100' 
        : 'translate-y-16 opacity-0'
    }`;
  };

  return (
    <div id='feature' className="min-h-screen bg-[#292D50] text-white">
      <style>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        .scale-hover {
          transition: transform 0.3s ease;
        }
        .scale-hover:hover {
          transform: scale(1.02);
        }
      `}</style>
      
      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header Section */}
        <div 
          className={`text-center mb-8 sm:mb-16 ${getAnimationClass('header')}`}
          data-animate
          id="header"
        >
          <h1 className="font-[500] text-[28px] sm:text-[35px] lg:text-[45px] leading-tight">
            Enjoy Seamless Bridging Of The Digital<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Economy With The Traditional Economy Right<br className="hidden sm:block" />
            <span className="sm:hidden"> </span><span className="">in Your Palm</span>
          </h1>
          <p className="text-[18px] sm:text-[20px] lg:text-[24px] text-[#DE811D] font-[300] mt-4">
            Best digital wallet for your assets
          </p>
        </div>

        {/* Feature Sections */}
        <div 
          className={`flex flex-col lg:flex-row px-4 sm:px-8 lg:px-16 justify-between gap-8 lg:gap-0 ${getAnimationClass('section1')}`}
          data-animate
          id="section1"
        >
          <div className={`flex flex-col w-full lg:w-[45%] scale-hover ${getAnimationClass('section1', 200)}`}>
            <img src={side} alt="" className="w-full max-w-[300px] lg:max-w-[500px] mx-auto lg:mx-0" />
            <p className="font-[500] text-[28px] sm:text-[32px] lg:text-[40px] font-inter mt-5 text-center lg:text-left">Send Crypto</p>
            <p className="font-[400] text-[16px] sm:text-[18px] lg:text-[22px] leading-[28px] sm:leading-[30px] lg:leading-[34px] text-center lg:text-left">
              Transfer digital assets to anyone, anywhere, in just a few taps. Our streamlined experience makes crypto transfers effortless, fast and secure.
            </p>
          </div>
          <div className={`flex w-full lg:w-[45%] flex-col scale-hover ${getAnimationClass('section1', 400)}`}>
            <img src={news} alt="" className="w-full max-w-[300px] lg:max-w-[500px] mx-auto lg:mx-0" />
            <p className="font-[500] text-[28px] sm:text-[32px] lg:text-[40px] font-inter mt-5 text-center lg:text-left">Swap Crypto</p>
            <p className="font-[400] text-[16px] sm:text-[18px] lg:text-[22px] leading-[28px] sm:leading-[30px] lg:leading-[34px] text-center lg:text-left">
              Trade one crypto for another, instantly and without hassle. No complicated charts, no confusing steps. Just choose your tokens, confirm the rate, and swap in seconds even while waiting for token confirmation on the blockchain network.
            </p>
          </div>
        </div>

        <div 
          className={`flex flex-col lg:flex-row mt-[30px] sm:mt-[40px] lg:mt-[50px] px-4 sm:px-8 lg:px-16 justify-between gap-8 lg:gap-0 ${getAnimationClass('section2')}`}
          data-animate
          id="section2"
        >
          <div className={`flex flex-col w-full lg:w-[45%] scale-hover ${getAnimationClass('section2', 200)}`}>
            <img src={deposit} alt="" className="w-full max-w-[300px] lg:max-w-[500px] mx-auto lg:mx-0" />
            <p className="font-[500] text-[28px] sm:text-[32px] lg:text-[40px] font-inter mt-5 text-center lg:text-left">Deposit Crypto</p>
            <p className="font-[400] text-[16px] sm:text-[18px] lg:text-[22px] leading-[28px] sm:leading-[30px] lg:leading-[34px] text-center lg:text-left">
              Top up your wallet in seconds, safe, simple and secure. Wether you are transferring from another wallet or an exchange, depositing crypto is quick and seamless.
            </p>
          </div>
          <div id='otc' className={`flex w-full lg:w-[45%] flex-col scale-hover ${getAnimationClass('section2', 400)}`}>
            <img src={request} alt="" className="w-full max-w-[300px] lg:max-w-[500px] mx-auto lg:mx-0" />
            <p className="font-[500] text-[28px] sm:text-[32px] lg:text-[40px] font-inter mt-5 text-center lg:text-left">OTC Service</p>
            <p className="font-[400] text-[16px] sm:text-[18px] lg:text-[22px] leading-[28px] sm:leading-[30px] lg:leading-[34px] text-center lg:text-left">
              Trade large volumes of crypto with personalized service. Our over-the-counter (OTC) desk is built for high-net-worth individuals, institutions, and businesses looking for secure, and efficient trades.
            </p>
          </div>
        </div>

        <div 
          className={`flex flex-col lg:flex-row mt-[30px] sm:mt-[40px] lg:mt-[50px] px-4 sm:px-8 lg:px-16 justify-between gap-8 lg:gap-0 ${getAnimationClass('section3')}`}
          data-animate
          id="section3"
        >
          <div id='off' className={`flex flex-col w-full lg:w-[45%] scale-hover ${getAnimationClass('section3', 200)}`}>
            <img src={off} alt="" className="w-full max-w-[300px] lg:max-w-[500px] mx-auto lg:mx-0" />
            <p className="font-[500] text-[28px] sm:text-[32px] lg:text-[40px] font-inter mt-5 text-center lg:text-left">Off-Ramp Service</p>
            <p className="font-[400] text-[16px] sm:text-[18px] lg:text-[22px] leading-[28px] sm:leading-[30px] lg:leading-[34px] text-center lg:text-left">
              Seamlessly pay your customers abroad through Naira, stable coins (USDT and USDC), bitcoin and other cryptocurrencies swiftly through Nokuex.
            </p>
          </div>
          <div className={`flex w-full lg:w-[45%] flex-col scale-hover ${getAnimationClass('section3', 400)}`}>
            <img src={moni} alt="" className="w-full max-w-[300px] lg:max-w-[500px] mx-auto lg:mx-0" />
            <p className="font-[500] text-[28px] sm:text-[32px] lg:text-[40px] font-inter mt-5 text-center lg:text-left">Wallet Service</p>
            <p className="font-[400] text-[16px] sm:text-[18px] lg:text-[22px] leading-[28px] sm:leading-[30px] lg:leading-[34px] text-center lg:text-left">
              We are in the business of bridging the digital economy with the traditional economy, so we bring you the easiest and safest way to host your digital assets and fiats.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className={`flex justify-center mt-8 sm:mt-12 lg:mt-16 ${getAnimationClass('cta')}`}
          data-animate
          id="cta"
        >
          <button 
            className="w-[160px] sm:w-[175px] lg:w-[190px] h-[45px] sm:h-[50px] lg:h-[55px] gap-4 rounded-[10px] border border-[#DE811D] 
            bg-[#5A6E3B] py-[8px] sm:py-[9px] lg:py-[10px] px-[6px] sm:px-[7px] lg:px-[8px] text-white hover:opacity-90 transition-all duration-300 
            hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#DE811D]/20 text-sm sm:text-base"
          >
            Download App Now
          </button>
        </div>
        
      </div>
    </div>
  );
}