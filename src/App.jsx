import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Import gambar dari local assets
import coverBook from './assets/coverbook.jpg';

// ABI Contract PlasmaReads (Update sesuai contract baru)
const CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"ebookId","type":"uint256"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"string","name":"coverUrl","type":"string"},{"indexed":false,"internalType":"uint256","name":"createdAt","type":"uint256"}],"name":"EbookPublished","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"purchaseId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"ebookId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"string","name":"buyerName","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"finalPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"purchasedAt","type":"uint256"}],"name":"EbookPurchased","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"purchaseId","type":"uint256"},{"indexed":false,"internalType":"string","name":"buyerName","type":"string"},{"indexed":false,"internalType":"string","name":"whatsappNumber","type":"string"},{"indexed":false,"internalType":"uint256","name":"ebookId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"WhatsAppNotificationSent","type":"event"},
  {"inputs":[],"name":"DISCOUNT_PERCENTAGE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MAX_DISCOUNTED_PURCHASES","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MAX_EBOOKS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_ebookId","type":"uint256"},{"internalType":"string","name":"_buyerName","type":"string"},{"internalType":"string","name":"_whatsappNumber","type":"string"}],"name":"purchaseEbook","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_preview","type":"string"},{"internalType":"string","name":"_coverUrl","type":"string"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"publishEbook","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getAllEbooks","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"preview","type":"string"},{"internalType":"string","name":"coverUrl","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"bool","name":"isPublished","type":"bool"},{"internalType":"address","name":"author","type":"address"},{"internalType":"bool","name":"isPurchased","type":"bool"},{"internalType":"address","name":"purchaser","type":"address"}],"internalType":"struct PlasmaReads.Ebook[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getPurchasedEbooksForOwner","outputs":[{"internalType":"uint256[]","name":"ebookIds","type":"uint256[]"},{"internalType":"address[]","name":"purchasers","type":"address[]"},{"internalType":"string[]","name":"buyerNames","type":"string[]"},{"internalType":"string[]","name":"whatsappNumbers","type":"string[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_ebookId","type":"uint256"}],"name":"getEbookPurchaseStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_ebookId","type":"uint256"}],"name":"getEbookPurchaserInfo","outputs":[{"internalType":"address","name":"purchaser","type":"address"},{"internalType":"string","name":"buyerName","type":"string"},{"internalType":"string","name":"whatsappNumber","type":"string"},{"internalType":"bool","name":"isPurchased","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_ebookId","type":"uint256"}],"name":"getUserHasPurchased","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getEbookStats","outputs":[{"internalType":"uint256","name":"totalPublished","type":"uint256"},{"internalType":"uint256","name":"totalPurchases","type":"uint256"},{"internalType":"uint256","name":"remainingDiscounts","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"isDiscountAvailable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getRemainingEbooks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ebooks","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"preview","type":"string"},{"internalType":"string","name":"coverUrl","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"bool","name":"isPublished","type":"bool"},{"internalType":"address","name":"author","type":"address"},{"internalType":"bool","name":"isPurchased","type":"bool"},{"internalType":"address","name":"purchaser","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"hasPurchased","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ebookCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"purchaseCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

// Ganti dengan alamat kontrak Anda setelah deploy
const CONTRACT_ADDRESS = "0x0BA5F42D7dCE30C9B0c7e4B3311c0BD994D81748";
const WHATSAPP_NUMBER = "62895600394345";
const PLASMA_CHAIN_ID = '0x2611';
const PLASMA_RPC_URL = 'https://rpc.plasma.to';
const PLASMA_BLOCK_EXPLORER = 'https://plasmascan.to';

// Daftar judul e-book default
const EBOOK_TITLES = [
  'Mastering Web3 Development',
  'Blockchain Fundamentals',
  'Smart Contract Security',
  'Decentralized Finance (DeFi)',
  'NFT Marketplace Guide',
  'Crypto Investment Strategies',
  'Solidity Programming',
  'Ethereum Ecosystem',
  'DAO Governance Models',
  'Metaverse & Web3 Future'
];

// Daftar preview e-book default
const EBOOK_PREVIEWS = [
  'Pelajari cara membangun aplikasi Web3 dari dasar hingga mahir. Buku ini akan membimbing Anda melalui konsep blockchain, smart contract, dan dApp development.',
  'Panduan komprehensif untuk memahami teknologi blockchain, konsensus algorithms, dan aplikasi praktis dalam dunia nyata.',
  'Pelajari teknik keamanan terbaik untuk smart contract development. Hindari bug dan vulnerability yang umum terjadi.',
  'Jelajahi dunia DeFi dengan panduan lengkap tentang lending, borrowing, yield farming, dan protocol lainnya.',
  'Panduan lengkap untuk membangun dan mengoperasikan marketplace NFT dengan teknologi blockchain terbaru.',
  'Strategi investasi cryptocurrency yang terbukti efektif untuk pemula hingga investor berpengalaman.',
  'Buku panduan pemrograman Solidity untuk developer yang ingin menguasai smart contract development.',
  'Ekosistem Ethereum secara mendalam: Layer 2 solutions, scaling, dan perkembangan terbaru.',
  'Memahami model governance DAO dan cara membangun organisasi otonom terdesentralisasi.',
  'Masa depan metaverse dan bagaimana Web3 akan mengubah interaksi digital kita.'
];

// Fungsi untuk mendapatkan data e-book berdasarkan index
const getEbookData = (index = 0) => {
  const titleIndex = index % EBOOK_TITLES.length;
  const previewIndex = index % EBOOK_PREVIEWS.length;
  
  return {
    title: EBOOK_TITLES[titleIndex],
    preview: EBOOK_PREVIEWS[previewIndex],
    coverUrl: coverBook
  };
};

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [publicLoading, setPublicLoading] = useState(true);
  const [userPurchases, setUserPurchases] = useState({});
  const [globalPurchaseStatus, setGlobalPurchaseStatus] = useState({}); // Track global purchase status
  
  // State untuk owner dashboard
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [ownerLoading, setOwnerLoading] = useState(false);
  
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  
  const [buyerName, setBuyerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [ebookTitle, setEbookTitle] = useState('');
  const [ebookPreview, setEbookPreview] = useState('');
  const [ebookPrice, setEbookPrice] = useState('');
  
  const [stats, setStats] = useState({
    totalPublished: 0,
    totalPurchases: 0,
    remainingDiscounts: 3,
    remainingEbooks: 10
  });

  // Helper functions
  const safeToNumber = (bigIntValue) => {
    if (!bigIntValue && bigIntValue !== 0n && bigIntValue !== 0) return 0;
    return Number(bigIntValue.toString());
  };

  const safeFormatEther = (bigIntValue) => {
    if (!bigIntValue && bigIntValue !== 0n && bigIntValue !== 0) return "0";
    try {
      return ethers.formatEther(bigIntValue.toString());
    } catch (error) {
      console.error("Error formatting ether:", error);
      return "0";
    }
  };

  // Fungsi untuk memproses ebook data dengan aman
  const processEbookData = (ebook, index) => {
    const ebookData = getEbookData(index);
    
    return {
      ...ebook,
      id: safeToNumber(ebook.id),
      price: ebook.price,
      createdAt: safeToNumber(ebook.createdAt),
      preview: ebook.preview || ebookData.preview,
      coverUrl: coverBook,
      title: ebook.title || ebookData.title,
      isPurchased: ebook.isPurchased || false,
      purchaser: ebook.purchaser || null
    };
  };

  // Blockchain explorer functions
  const openBlockExplorer = (address = CONTRACT_ADDRESS, type = 'address') => {
    let url = `${PLASMA_BLOCK_EXPLORER}`;
    
    if (type === 'address') {
      url += `/address/${address}`;
    } else if (type === 'tx') {
      url += `/tx/${address}`;
    }
    
    window.open(url, '_blank');
  };

  const openOwnerAddressExplorer = () => {
    if (owner) {
      openBlockExplorer(owner, 'address');
    }
  };

  // WhatsApp link generator
  const generateWhatsAppLink = (number, message = '') => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}${message ? `?text=${encodedMessage}` : ''}`;
  };

  // Event handlers
  const handleChainChanged = () => {
    window.location.reload();
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      initializeContract(accounts[0]);
    } else {
      setAccount('');
      setContract(null);
      setOwner('');
    }
  };

  // Initialize contract connection
  const initializeContract = async (accountAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const ownerAddress = await contractInstance.owner();
      
      setContract(contractInstance);
      setOwner(ownerAddress);
      loadEbooks(contractInstance);
      loadStats(contractInstance);
      
      // Load user's purchase status
      if (accountAddress) {
        await loadUserPurchaseStatus(contractInstance, accountAddress);
      }
      
      // Load global purchase status for all ebooks
      await loadGlobalPurchaseStatus(contractInstance);
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  // Load global purchase status for all ebooks
  const loadGlobalPurchaseStatus = async (contractInstance) => {
    if (!contractInstance) return;
    
    try {
      const ebooksList = await contractInstance.getAllEbooks();
      const status = {};
      
      for (const ebook of ebooksList) {
        const ebookId = safeToNumber(ebook.id);
        const isPurchased = await contractInstance.getEbookPurchaseStatus(ebookId);
        status[ebookId] = isPurchased;
      }
      
      setGlobalPurchaseStatus(status);
    } catch (error) {
      console.error('Error loading global purchase status:', error);
    }
  };

  // Load user's purchase status for each ebook
  const loadUserPurchaseStatus = async (contractInstance, userAddress) => {
    if (!contractInstance || !userAddress) return;
    
    try {
      const ebooksList = await contractInstance.getAllEbooks();
      const purchaseStatus = {};
      
      for (const ebook of ebooksList) {
        const hasPurchased = await contractInstance.getUserHasPurchased(userAddress, ebook.id);
        purchaseStatus[safeToNumber(ebook.id)] = hasPurchased;
      }
      
      setUserPurchases(purchaseStatus);
    } catch (error) {
      console.error('Error loading user purchase status:', error);
    }
  };

  // Load purchased ebooks for owner dashboard
  const loadPurchasedEbooksForOwner = async () => {
    if (!contract || !isOwner) return;
    
    setOwnerLoading(true);
    try {
      const [ebookIds, purchasers, buyerNames, whatsappNumbers] = 
        await contract.getPurchasedEbooksForOwner();
      
      const purchasedList = [];
      
      for (let i = 0; i < ebookIds.length; i++) {
        const ebookId = safeToNumber(ebookIds[i]);
        
        // Get ebook details
        const ebooksList = await contract.getAllEbooks();
        const ebook = ebooksList.find(e => safeToNumber(e.id) === ebookId);
        
        if (ebook) {
          purchasedList.push({
            id: ebookId,
            title: ebook.title || `Ebook #${ebookId}`,
            price: safeFormatEther(ebook.price),
            purchaser: purchasers[i],
            buyerName: buyerNames[i] || 'N/A',
            whatsappNumber: whatsappNumbers[i] || 'N/A',
            whatsappLink: generateWhatsAppLink(whatsappNumbers[i] || '')
          });
        }
      }
      
      setPurchasedEbooks(purchasedList);
    } catch (error) {
      console.error('Error loading purchased ebooks:', error);
    }
    setOwnerLoading(false);
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Silakan install MetaMask atau wallet yang kompatibel!');
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isPlasma = chainId === PLASMA_CHAIN_ID;
      
      if (!isPlasma) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: PLASMA_CHAIN_ID }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: PLASMA_CHAIN_ID,
                  chainName: 'Plasma Mainnet Beta',
                  nativeCurrency: {
                    name: 'XPL',
                    symbol: 'XPL',
                    decimals: 18
                  },
                  rpcUrls: [PLASMA_RPC_URL],
                  blockExplorerUrls: ['https://plasmascan.to/']
                }]
              });
            } catch (addError) {
              console.error('Error adding Plasma network:', addError);
              alert('Silakan tambahkan Plasma Mainnet secara manual:\n\nChain ID: 9745\nNama: Plasma Mainnet Beta\nCurrency: XPL\nRPC: https://rpc.plasma.to');
              return;
            }
          } else if (switchError.code === -32002) {
            alert('Permintaan jaringan sedang diproses. Silakan cek popup MetaMask Anda.');
            return;
          } else {
            console.error('Error switching network:', switchError);
            alert('Gagal beralih ke Plasma Mainnet. Silakan pilih network Plasma secara manual.');
            return;
          }
        }
      }

      setAccount(accounts[0]);
      await initializeContract(accounts[0]);

      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Gagal menghubungkan wallet: ' + (error.message || 'Unknown error'));
    }
  };

  // Load data publik untuk semua pengunjung
  const loadPublicData = async () => {
    try {
      setPublicLoading(true);
      const provider = new ethers.JsonRpcProvider(PLASMA_RPC_URL);
      const publicContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const ebooksList = await publicContract.getAllEbooks();
      const statsData = await publicContract.getEbookStats();
      const remainingEbooks = await publicContract.getRemainingEbooks();
      
      const processedEbooks = ebooksList.map((ebook, index) => processEbookData(ebook, index));
      
      setEbooks(processedEbooks);
      setStats({
        totalPublished: safeToNumber(statsData.totalPublished),
        totalPurchases: safeToNumber(statsData.totalPurchases),
        remainingDiscounts: safeToNumber(statsData.remainingDiscounts),
        remainingEbooks: safeToNumber(remainingEbooks)
      });
    } catch (error) {
      console.error('Error loading public data:', error);
    } finally {
      setPublicLoading(false);
    }
  };

  // Load ebooks dari kontrak
  const loadEbooks = async (contractInstance = contract) => {
    if (!contractInstance) return;
    
    setLoading(true);
    try {
      const ebooksList = await contractInstance.getAllEbooks();
      
      const processedEbooks = ebooksList.map((ebook, index) => processEbookData(ebook, index));
      
      setEbooks(processedEbooks);
    } catch (error) {
      console.error('Error loading ebooks:', error);
    }
    setLoading(false);
  };

  // Load stats dari kontrak
  const loadStats = async (contractInstance = contract) => {
    if (!contractInstance) return;
    
    try {
      const statsData = await contractInstance.getEbookStats();
      const remainingEbooks = await contractInstance.getRemainingEbooks();
      
      setStats({
        totalPublished: safeToNumber(statsData.totalPublished),
        totalPurchases: safeToNumber(statsData.totalPurchases),
        remainingDiscounts: safeToNumber(statsData.remainingDiscounts),
        remainingEbooks: safeToNumber(remainingEbooks)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Publish ebook
  const publishEbook = async (e) => {
    e.preventDefault();
    if (!contract) return;
    
    setLoading(true);
    try {
      const priceInWei = ethers.parseEther(ebookPrice);
      
      const tx = await contract.publishEbook(
        ebookTitle,
        ebookPreview,
        coverBook,
        priceInWei
      );
      await tx.wait();
      
      alert('✅ Ebook berhasil diterbitkan!');
      setShowPublishModal(false);
      setEbookTitle('');
      setEbookPreview('');
      setEbookPrice('');
      
      await loadEbooks();
      await loadStats();
      await loadPublicData();
      await loadGlobalPurchaseStatus(contract);
    } catch (error) {
      console.error('Error publishing ebook:', error);
      alert('❌ Gagal menerbitkan ebook: ' + error.message);
    }
    setLoading(false);
  };

  // Purchase ebook
  const purchaseEbook = async (e) => {
    e.preventDefault();
    if (!contract || !selectedEbook) return;
    
    // Check if ebook is already purchased by someone else
    if (globalPurchaseStatus[selectedEbook.id]) {
      alert('⚠️ Maaf, ebook ini sudah dibeli oleh orang lain!');
      setShowBuyModal(false);
      return;
    }
    
    // Check if user already purchased this ebook
    if (userPurchases[selectedEbook.id]) {
      alert('⚠️ Anda sudah membeli ebook ini!');
      setShowBuyModal(false);
      return;
    }
    
    setLoading(true);
    try {
      const originalPrice = selectedEbook.price;
      const hasDiscount = stats.remainingDiscounts > 0;
      
      let finalPrice;
      if (hasDiscount) {
        finalPrice = (originalPrice * 90n) / 100n;
      } else {
        finalPrice = originalPrice;
      }
      
      const tx = await contract.purchaseEbook(
        selectedEbook.id,
        buyerName,
        whatsappNumber,
        { value: finalPrice }
      );
      
      await tx.wait();
      
      // Update purchase status
      setUserPurchases(prev => ({
        ...prev,
        [selectedEbook.id]: true
      }));
      
      setGlobalPurchaseStatus(prev => ({
        ...prev,
        [selectedEbook.id]: true
      }));
      
      alert(`✅ Ebook "${selectedEbook.title}" berhasil dibeli!`);
      setShowBuyModal(false);
      setBuyerName('');
      setWhatsappNumber('');
      setSelectedEbook(null);
      
      await loadEbooks();
      await loadStats();
      await loadPublicData();
      await loadGlobalPurchaseStatus(contract);
      
    } catch (error) {
      console.error('Error purchasing ebook:', error);
      alert('❌ Gagal membeli ebook: ' + error.message);
    }
    setLoading(false);
  };

  // Format helpers
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return '-';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Fungsi untuk handle image error
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder-cover.png';
  };

  // Ebook card component - DIPERBARUI untuk menampilkan status pembelian global
  const renderEbookCard = (ebook) => {
    const isDiscountAvailable = stats.remainingDiscounts > 0;
    const userHasPurchased = userPurchases[ebook.id] || false;
    const isGloballyPurchased = globalPurchaseStatus[ebook.id] || false;
    
    let finalPrice;
    let displayPrice;
    let displayFinalPrice;
    
    try {
      const originalPrice = ebook.price;
      
      if (isDiscountAvailable) {
        finalPrice = (originalPrice * 90n) / 100n;
      } else {
        finalPrice = originalPrice;
      }
      
      displayPrice = safeFormatEther(originalPrice);
      displayFinalPrice = safeFormatEther(finalPrice);
    } catch (error) {
      console.error("Error calculating price:", error);
      displayPrice = "0";
      displayFinalPrice = "0";
    }

    return (
      <div key={ebook.id.toString()} className="ticket-card ebook-card">
        <div className="ticket-header">
          <h3 className="ticket-title">📖 {ebook.title}</h3>
          <div className="status-badges">
            {userHasPurchased && (
              <span className="ticket-status purchased" style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                ✅ Sudah Dimiliki
              </span>
            )}
            {isGloballyPurchased && !userHasPurchased && (
              <span className="ticket-status sold-out" style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                ⛔ Sudah Terbeli
              </span>
            )}
          </div>
        </div>

        <div className="ticket-body">
          <div className="ebook-cover">
            <img 
              src={coverBook}
              alt={ebook.title}
              className="cover-image"
              onError={handleImageError}
              style={{ 
                width: '100%', 
                height: '250px',
                borderRadius: '8px', 
                objectFit: 'cover',
                backgroundColor: '#f3f4f6'
              }}
            />
          </div>

          <div className="ticket-price">
            <p className="price-label">💰 Harga</p>
            <p className="price-value">{displayFinalPrice} Plasma XPL</p>
            {isDiscountAvailable && !isGloballyPurchased && !userHasPurchased && (
              <div className="discount-info">
                <span className="discount-badge">🎉 Diskon 10%</span>
                <p className="discount-text" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Untuk 3 pembeli pertama!
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedEbook(ebook);
              setShowPreviewModal(true);
            }}
            className="btn btn-outline"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            📖 Preview Ebook
          </button>

          {!account ? (
            <div className="buy-cta">
              <button
                onClick={connectWallet}
                className="btn btn-buy"
              >
                🔗 Connect & Beli
              </button>
            </div>
          ) : userHasPurchased ? (
            <button
              className="btn btn-disabled"
              disabled={true}
              style={{ 
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              ✅ Sudah Dimiliki
            </button>
          ) : isGloballyPurchased ? (
            <button
              className="btn btn-disabled"
              disabled={true}
              style={{ 
                backgroundColor: '#dc3545',
                color: 'white',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              ⛔ Sudah Terbeli
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedEbook(ebook);
                setShowBuyModal(true);
              }}
              className="btn btn-buy"
              disabled={loading}
            >
              {loading ? '⏳ Memproses...' : '🛒 Beli Sekarang'}
            </button>
          )}

          <div className="ticket-footer">
            <p className="ticket-date">
              📅 Diterbitkan: {formatDate(ebook.createdAt)}
            </p>
            {isGloballyPurchased && (
              <p className="ticket-status-info" style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                ⚠️ Ebook ini sudah dibeli oleh user lain
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Owner Dashboard Component
  const renderOwnerDashboard = () => {
    if (!showOwnerDashboard || !isOwner) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowOwnerDashboard(false)}>
        <div className="modal owner-dashboard-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>👑 Dashboard Owner - Ebook Terjual</h2>
            <button className="modal-close" onClick={() => setShowOwnerDashboard(false)}>✕</button>
          </div>
          
          <div className="modal-form">
            <div className="dashboard-stats" style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap' 
            }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px',
                flex: 1,
                minWidth: '150px'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Total Penjualan</h3>
                <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalPurchases}</p>
              </div>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px',
                flex: 1,
                minWidth: '150px'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Ebook Terjual</h3>
                <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>{purchasedEbooks.length}</p>
              </div>
            </div>
            
            {ownerLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="loader"></div>
                <p>Memuat data pembelian...</p>
              </div>
            ) : purchasedEbooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <h3>Belum Ada Penjualan</h3>
                <p>Belum ada ebook yang terjual.</p>
              </div>
            ) : (
              <div className="purchased-ebooks-list">
                <h3 style={{ marginBottom: '1rem' }}>📋 Daftar Ebook Terjual</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Judul Ebook</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nama Pembeli</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>WhatsApp</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Wallet Pembeli</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchasedEbooks.map((ebook, index) => (
                        <tr key={ebook.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '0.75rem' }}>#{ebook.id}</td>
                          <td style={{ padding: '0.75rem' }}>{ebook.title}</td>
                          <td style={{ padding: '0.75rem' }}>{ebook.buyerName}</td>
                          <td style={{ padding: '0.75rem' }}>
                            {ebook.whatsappNumber !== 'N/A' ? (
                              <a 
                                href={ebook.whatsappLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  color: '#25D366',
                                  textDecoration: 'none',
                                  fontWeight: 'bold',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <span style={{ fontSize: '1.2rem' }}>💬</span>
                                {ebook.whatsappNumber}
                              </a>
                            ) : (
                              <span>N/A</span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span 
                              onClick={() => openBlockExplorer(ebook.purchaser, 'address')}
                              style={{ 
                                color: '#007bff',
                                cursor: 'pointer',
                                textDecoration: 'underline dotted'
                              }}
                              title="Lihat di Block Explorer"
                            >
                              {formatAddress(ebook.purchaser)}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{ebook.price} XPL</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="modal-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => setShowOwnerDashboard(false)} 
                className="btn btn-outline"
              >
                ✕ Tutup Dashboard
              </button>
              <button 
                onClick={loadPurchasedEbooksForOwner} 
                className="btn btn-primary"
                disabled={ownerLoading}
              >
                {ownerLoading ? '⏳ Memuat...' : '🔄 Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Effects
  useEffect(() => {
    loadPublicData();
    
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            initializeContract(accounts[0]);
          }
        })
        .catch(console.error);
    }
    
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (contract && account) {
      loadEbooks();
      loadStats();
      loadUserPurchaseStatus(contract, account);
      loadGlobalPurchaseStatus(contract);
    }
  }, [contract, account]);

  // UI helpers
  const isOwner = account && owner && account.toLowerCase() === owner.toLowerCase();
  
  const disconnectWallet = async () => {
    setAccount('');
    setContract(null);
    setOwner('');
    setUserPurchases({});
    setGlobalPurchaseStatus({});
    setShowOwnerDashboard(false);
    loadPublicData();
  };

  const handleManualRefresh = async () => {
    if (contract && account) {
      await loadEbooks();
      await loadStats();
      await loadUserPurchaseStatus(contract, account);
      await loadGlobalPurchaseStatus(contract);
    }
    await loadPublicData();
    alert('✅ Data berhasil di-refresh!');
  };

  // Render preview modal
  const renderPreviewModal = () => {
    if (!showPreviewModal || !selectedEbook) return null;
    
    const userHasPurchased = userPurchases[selectedEbook.id] || false;
    const isGloballyPurchased = globalPurchaseStatus[selectedEbook.id] || false;
    const safePreview = selectedEbook.preview || 'Preview belum tersedia. Silakan beli ebook untuk membaca konten lengkap.';
    const previewLines = typeof safePreview === 'string' ? safePreview.split('\n') : [safePreview];

    return (
      <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
        <div className="modal preview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>📖 Preview: {selectedEbook.title || 'Ebook'}</h2>
            <button className="modal-close" onClick={() => setShowPreviewModal(false)}>✕</button>
          </div>
          
          <div className="modal-form">
            <div className="preview-cover" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img 
                src={coverBook}
                alt={selectedEbook.title}
                className="preview-cover-image"
                onError={handleImageError}
                style={{ 
                  width: '250px', 
                  height: '250px',
                  borderRadius: '8px', 
                  objectFit: 'cover',
                  backgroundColor: '#f3f4f6'
                }}
              />
            </div>
            
            <div className="preview-content">
              <h3 className="preview-title">Preview Ebook</h3>
              <div className="preview-text" style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>
                {previewLines.map((line, index) => (
                  <p key={index} style={{ marginBottom: '1rem' }}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>
            
            {isGloballyPurchased && !userHasPurchased && (
              <div style={{ 
                background: '#fff3cd', 
                border: '1px solid #ffeaa7',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: '0', color: '#856404', fontWeight: '500' }}>
                  ⚠️ <strong>Ebook ini sudah dibeli oleh user lain!</strong>
                </p>
              </div>
            )}
            
            <div className="modal-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowPreviewModal(false)} className="btn btn-outline">✕ Tutup Preview</button>
              
              {userHasPurchased ? (
                <button className="btn btn-disabled" disabled style={{ 
                  backgroundColor: '#28a745',
                  color: 'white',
                  cursor: 'not-allowed',
                  opacity: 0.7
                }}>
                  ✅ Sudah Dimiliki
                </button>
              ) : isGloballyPurchased ? (
                <button className="btn btn-disabled" disabled style={{ 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'not-allowed',
                  opacity: 0.7
                }}>
                  ⛔ Sudah Terbeli
                </button>
              ) : (
                <button onClick={() => { 
                  setShowPreviewModal(false); 
                  setShowBuyModal(true); 
                }} className="btn btn-primary">
                  🛒 Beli Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Buy modal dengan cek pembelian global
  const renderBuyModal = () => {
    if (!showBuyModal || !selectedEbook) return null;
    
    const userHasPurchased = userPurchases[selectedEbook.id] || false;
    const isGloballyPurchased = globalPurchaseStatus[selectedEbook.id] || false;
    
    if (userHasPurchased) {
      return (
        <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Ebook Sudah Dimiliki</h2>
              <button className="modal-close" onClick={() => setShowBuyModal(false)}>✕</button>
            </div>
            
            <div className="modal-form" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h3>Anda sudah memiliki ebook ini!</h3>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                Ebook <strong>"{selectedEbook.title}"</strong> sudah ada di library Anda.
              </p>
              <button 
                onClick={() => setShowBuyModal(false)}
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (isGloballyPurchased) {
      return (
        <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⛔ Ebook Sudah Terbeli</h2>
              <button className="modal-close" onClick={() => setShowBuyModal(false)}>✕</button>
            </div>
            
            <div className="modal-form" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⛔</div>
              <h3>Ebook ini sudah dibeli oleh user lain!</h3>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                Ebook <strong>"{selectedEbook.title}"</strong> dengan ID #{selectedEbook.id} sudah dibeli dan tidak tersedia lagi.
              </p>
              <button 
                onClick={() => setShowBuyModal(false)}
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🛒 Beli Ebook</h2>
            <button className="modal-close" onClick={() => setShowBuyModal(false)}>✕</button>
          </div>
          
          <form onSubmit={purchaseEbook} className="modal-form">
            <div className="ebook-info" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <img 
                src={coverBook}
                alt={selectedEbook.title}
                className="modal-cover"
                onError={handleImageError}
                style={{ 
                  width: '120px', 
                  height: '120px',
                  borderRadius: '8px', 
                  objectFit: 'cover',
                  backgroundColor: '#f3f4f6'
                }}
              />
              <div className="ebook-details">
                <h3>{selectedEbook.title}</h3>
                <p className="price-display">Harga: {safeFormatEther(selectedEbook.price)} XPL</p>
                {stats.remainingDiscounts > 0 && (
                  <p className="discount-display" style={{ color: 'var(--success)', fontWeight: '600' }}>
                    🎉 Diskon 10% untuk Anda!
                  </p>
                )}
                <p style={{ color: '#28a745', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  ✅ Ebook ini masih tersedia untuk dibeli
                </p>
              </div>
            </div>

            <div className="form-group">
              <label>Nama Lengkap Pembeli *</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                required
                className="form-input"
              />
              <p className="form-hint">Nama akan disimpan di blockchain untuk pencatatan</p>
            </div>

            <div className="form-group">
              <label>Nomor WhatsApp *</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="628xxxxxxxxxx"
                required
                className="form-input"
              />
              <p className="form-hint">Nomor WhatsApp akan disimpan di blockchain untuk pencatatan</p>
            </div>

            <div className="price-summary">
              <div className="summary-row">
                <span>Judul Ebook:</span>
                <span className="summary-value">{selectedEbook.title}</span>
              </div>
              <div className="summary-row">
                <span>Harga Normal:</span>
                <span className="summary-value">{safeFormatEther(selectedEbook.price)} XPL</span>
              </div>
              {stats.remainingDiscounts > 0 && (
                <>
                  <div className="summary-row">
                    <span>Diskon 10%:</span>
                    <span className="summary-value">-{safeFormatEther((selectedEbook.price * 10n) / 100n)} XPL</span>
                  </div>
                  <div className="summary-row highlight">
                    <span>Harga Setelah Diskon:</span>
                    <span className="summary-value">{safeFormatEther((selectedEbook.price * 90n) / 100n)} XPL</span>
                  </div>
                </>
              )}
              <div className="summary-row total">
                <span>Total Bayar:</span>
                <span className="summary-value total-amount">
                  {stats.remainingDiscounts > 0 
                    ? safeFormatEther((selectedEbook.price * 90n) / 100n)
                    : safeFormatEther(selectedEbook.price)
                  } XPL
                </span>
              </div>
            </div>

            <div className="info-notice" style={{ 
              background: 'var(--light)', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #ddd'
            }}>
              <p style={{ margin: '0', fontWeight: '500', color: '#666' }}>
                📝 Data pembelian akan disimpan di blockchain Plasma:
              </p>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', fontSize: '0.9rem', color: '#666' }}>
                <li>Nama lengkap pembeli</li>
                <li>Nomor WhatsApp</li>
                <li>Alamat wallet</li>
                <li>Waktu pembelian</li>
                <li>Detail ebook yang dibeli</li>
              </ul>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? '⏳ Memproses...' : '💳 Bayar & Simpan di Blockchain'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">📚</span>
              <div className="logo-text">
                <h1>Plasma Reads</h1>
                <p>Web3 Ebook Store - NFT Powered</p>
              </div>
            </div>
            
            {!account ? (
              <button onClick={connectWallet} className="btn btn-primary">
                🔗 Connect Wallet
              </button>
            ) : (
              <div className="wallet-info">
                <div className="wallet-badge">
                  <span className="wallet-icon">👛</span>
                  <span 
                    className="wallet-address clickable"
                    onClick={() => openBlockExplorer(account, 'address')}
                    title="Lihat di Block Explorer"
                    style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                  >
                    {formatAddress(account)}
                  </span>
                </div>
                {isOwner && (
                  <>
                    <span className="owner-badge">👑 Owner</span>
                    <button 
                      onClick={() => {
                        setShowOwnerDashboard(true);
                        loadPurchasedEbooksForOwner();
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ marginLeft: '0.5rem' }}
                    >
                      📊 Dashboard
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => openBlockExplorer(CONTRACT_ADDRESS, 'address')}
                  className="btn btn-outline btn-sm"
                  style={{ marginLeft: '0.5rem' }}
                  title="Lihat Kontrak di Block Explorer"
                >
                  🔍 Contract
                </button>
                
                {owner && (
                  <button 
                    onClick={openOwnerAddressExplorer}
                    className="btn btn-outline btn-sm"
                    style={{ marginLeft: '0.25rem' }}
                    title="Lihat Owner di Block Explorer"
                  >
                    👑 Owner
                  </button>
                )}
                
                <button 
                  onClick={disconnectWallet} 
                  className="btn btn-outline btn-sm"
                  style={{ marginLeft: '0.25rem' }}
                >
                  🔌 Disconnect
                </button>
                <button 
                  onClick={handleManualRefresh}
                  className="btn btn-outline btn-sm"
                  style={{ marginLeft: '0.25rem' }}
                >
                  🔄 Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Promo Banner */}
      <div className="promo-banner-container">
        <div className="container">
          <div className="promo-banner">
            🚀 <strong>DISKON 10% – HANYA UNTUK 3 ORANG TERCEPAT!</strong>
            <br/>
            <small>Beli ebook sekarang dan dapatkan harga spesial! Sisa diskon: {stats.remainingDiscounts} dari 3 slot</small>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <p className="stat-label">Ebook Tersedia</p>
                <p className="stat-value">{stats.totalPublished}/10</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-info">
                <p className="stat-label">Terjual</p>
                <p className="stat-value">{stats.totalPurchases}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎉</div>
              <div className="stat-info">
                <p className="stat-label">Diskon Tersisa</p>
                <p className="stat-value">{stats.remainingDiscounts}/3</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <p className="stat-label">Slot Ebook</p>
                <p className="stat-value">{stats.remainingEbooks} tersisa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {account && isOwner && (
            <div className="controls">
              <div className="controls-top">
                <div className="owner-actions">
                  <button 
                    onClick={() => setShowPublishModal(true)}
                    className="btn btn-primary"
                    disabled={stats.totalPublished >= 10}
                  >
                    {stats.totalPublished >= 10 ? '📚 Ebook Penuh' : '➕ Terbitkan Ebook Baru'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!account && (
            <div className="public-notice">
              <h3>📚 Daftar Ebook Tersedia</h3>
              <p>Hubungkan wallet untuk membeli ebook</p>
              <button onClick={connectWallet} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                🔗 Connect Wallet untuk Beli
              </button>
            </div>
          )}

          {publicLoading ? (
            <div className="loading">
              <div className="loader"></div>
              <p>Memuat ebook...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2>Belum Ada Ebook</h2>
              <p>
                {isOwner ? 'Anda belum menerbitkan ebook. Klik "Terbitkan Ebook Baru"' :
                 'Owner belum menerbitkan ebook'}
              </p>
            </div>
          ) : (
            <div className="tickets-grid">
              {ebooks.map(ebook => renderEbookCard(ebook))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {renderBuyModal()}
      {renderOwnerDashboard()}
      
      {/* Publish Modal */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Terbitkan Ebook Baru</h2>
              <button className="modal-close" onClick={() => setShowPublishModal(false)}>✕</button>
            </div>
            
            <form onSubmit={publishEbook} className="modal-form">
              <div className="form-group">
                <label>Judul Ebook *</label>
                <input
                  type="text"
                  value={ebookTitle}
                  onChange={(e) => setEbookTitle(e.target.value)}
                  placeholder="Masukkan judul ebook"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Preview / Trailer Ebook *</label>
                <textarea
                  value={ebookPreview}
                  onChange={(e) => setEbookPreview(e.target.value)}
                  placeholder="Masukkan preview atau sinopsis singkat ebook..."
                  required
                  className="form-input"
                  rows="5"
                  style={{ textAlign: 'justify' }}
                />
                <p className="form-hint">Preview akan ditampilkan di modal ketika user klik "Preview"</p>
              </div>

              <div className="form-group">
                <label>Harga (XPL) *</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={ebookPrice}
                  onChange={(e) => setEbookPrice(e.target.value)}
                  placeholder="0.1"
                  required
                  className="form-input"
                />
                <p className="form-hint">Harga dalam XPL (Plasma Token)</p>
              </div>

              <div className="info-box">
                <p>📌 Informasi:</p>
                <ul>
                  <li>Maksimal 10 ebook bisa diterbitkan</li>
                  <li>3 pembeli pertama mendapat diskon 10% otomatis</li>
                  <li>Pembayaran langsung ke wallet owner</li>
                  <li>Data pembeli dicatat di blockchain</li>
                  <li>Saat ini sudah diterbitkan: {stats.totalPublished}/10 ebook</li>
                  <li><strong>Gambar cover akan otomatis menggunakan coverbook.png dari assets</strong></li>
                  <li><strong>Setiap ebook ID hanya bisa dibeli oleh 1 user saja</strong></li>
                </ul>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowPublishModal(false)} className="btn btn-outline">❌ Batal</button>
                <button type="submit" className="btn btn-primary" disabled={loading || stats.totalPublished >= 10}>
                  {loading ? '⏳ Menerbitkan...' : 
                   stats.totalPublished >= 10 ? '📚 Ebook Penuh' :
                   '✅ Terbitkan Ebook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {renderPreviewModal()}

      {/* WhatsApp Float */}
      <div className="whatsapp-float">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="whatsapp-link" aria-label="Chat via WhatsApp">
          <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
          </svg>
          <span className="whatsapp-tooltip">Chat dengan Owner</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2026 Plasma Reads • Web3 Ebook Store • Powered by Plasma Blockchain</p>
          {CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x..." && (
            <div>
              <span>Contract: </span>
              <button 
                onClick={() => openBlockExplorer(CONTRACT_ADDRESS, 'address')}
                title="Lihat kontrak di Plasmascan"
              >
                {formatAddress(CONTRACT_ADDRESS)}
              </button>
              <span>
                🔗
                <button 
                  onClick={() => openBlockExplorer(CONTRACT_ADDRESS, 'address')}
                >
                  Plasmascan
                </button>
              </span>
            </div>
          )}
          
          <div>
            <span>🌐 Jaringan: </span>
            <button 
              onClick={() => window.open('https://plasma.to', '_blank')}
            >
              Plasma Mainnet
            </button>
            <span>•</span>
            <button 
              onClick={() => window.open('https://plasmascan.to', '_blank')}
            >
              Explorer
            </button>
            <span>•</span>
            <button 
              onClick={() => window.open('https://rpc.plasma.to', '_blank')}
            >
              RPC
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;