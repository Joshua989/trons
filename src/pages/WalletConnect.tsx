import React, { useState, useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import QRCodeModal from '@walletconnect/qrcode-modal';

declare global {
  interface Window {
    tronWeb?: any;
  }
}

interface WalletData {
  address: string;
  balance?: string;
  chainId?: string;
}

const WalletConnect: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connector, setConnector] = useState<any>(null);

  // Initialize WalletConnect for Tron
  const initWalletConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a new WalletConnect provider with proper mobile linking options
      const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          1: 'https://api.trongrid.io', // Tron mainnet
          2: 'https://nile.trongrid.io', // Tron testnet
        },
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: QRCodeModal,
        qrcodeModalOptions: {
          mobileLinks: [
            'trust', 
            'tokenpocket',
            'mathwallet',
            'safepal',
            'bitkeep',
            'imtoken'
          ],
          desktopLinks: [], // You can add desktop wallets here if needed
        }
      });

      // Enable session (this will show both QR code and mobile wallet options)
      await walletConnectProvider.enable();

      // Set the connector
      setConnector(walletConnectProvider);

      // Get accounts and chain info
      const accounts = walletConnectProvider.accounts;
      const chainId = walletConnectProvider.chainId;

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // For Tron network
      const address = accounts[0];
      let balance = '0';
      
      // Try to get balance if on Tron network
      if (chainId === 1 || chainId === 2) {
        if (window.tronWeb) {
          try {
            const sunBalance = await window.tronWeb.trx.getBalance(address);
            balance = window.tronWeb.fromSun(sunBalance);
          } catch (err) {
            console.error('Error getting Tron balance:', err);
          }
        }
      }

      setWalletData({
        address,
        balance: chainId === 1 || chainId === 2 ? balance : undefined,
        chainId: String(chainId)
      });

      // Set up event listeners
      walletConnectProvider.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletData(prev => prev ? {...prev, address: accounts[0]} : null);
        } else {
          setWalletData(null);
        }
      });

      walletConnectProvider.on("chainChanged", (chainId: string) => {
        setWalletData(prev => prev ? {...prev, chainId} : null);
      });

      walletConnectProvider.on("disconnect", () => {
        setWalletData(null);
        setConnector(null);
      });

    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    if (connector) {
      try {
        await connector.disconnect();
      } catch (err) {
        console.error('Error disconnecting:', err);
      }
    }
    setWalletData(null);
    setConnector(null);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const provider = new WalletConnectProvider({
        rpc: {
          1: 'https://api.trongrid.io',
          2: 'https://nile.trongrid.io',
        }
      });

      try {
        // Check if there's an existing session
        if (provider.connector.session) {
          await provider.enable();
          setConnector(provider);
          
          const accounts = provider.accounts;
          const chainId = provider.chainId;
          
          if (accounts.length > 0) {
            setWalletData({
              address: accounts[0],
              chainId: String(chainId)
            });
          }
        }
      } catch (err) {
        console.error('Error checking existing session:', err);
      }
    };

    checkExistingSession();
  }, []);

  return (
    <div className="relative">
      {walletData ? (
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {formatAddress(walletData.address)}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {walletData.chainId === '1' ? 'Tron Mainnet' : 
                 walletData.chainId === '2' ? 'Tron Testnet' : 
                 `Chain ${walletData.chainId}`}
              </span>
            </div>
            {walletData.balance && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Balance: {parseFloat(walletData.balance).toFixed(2)} TRX
              </div>
            )}
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={initWalletConnect}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect with WalletConnect'}
        </button>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;