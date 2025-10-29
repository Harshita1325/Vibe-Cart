import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutModal from "./components/CheckoutModal";
import CategoryCarousel from "./components/CategoryCarousel";

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const catRef = useRef(null);

  // close category dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showCatDropdown && catRef.current && !catRef.current.contains(e.target)) {
        setShowCatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showCatDropdown]);

  const handleCheckout = (formData) => {
    // Here you would typically send the order to your backend
    console.log('Order placed:', { items: cart, total: getTotal(), ...formData });
    setToast({
      show: true,
      message: 'Order placed successfully! Thank you for shopping with us.'
    });
    setShowCheckout(false);
    setCart([]);
    setShowCart(false);

    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const products = [
    { 
      id: 1, 
      name: "Wireless Headphones",
      rating: 4.5, 
      price: 1200,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      category: "Audio"
    },
    { 
      id: 2, 
      name: "Smartwatch", 
      rating: 4.2, 
      price: 2500,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
      category: "Wearables"
    },
    { 
      id: 3, 
      name: "RGB Keyboard", 
      rating: 4.0, 
      price: 1000,
      image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=500&q=80",
      category: "Peripherals"
    },
    { 
      id: 4, 
      name: "Gaming Mouse", 
      rating: 4.3, 
      price: 800,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
      category: "Peripherals"
    },
    {
      id: 5,
      name: "USB Microphone",
      rating: 4.6,
      price: 1500,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&q=80",
      category: "Audio"
    },
    {
      id: 6,
      name: "Rose Moisturizer",
      rating: 4.8,
      price: 599,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
      category: "Beauty"
    },
    {
      id: 7,
      name: "Laptop Stand",
      rating: 4.7,
      price: 450,
      image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=500&q=80",
      category: "Accessories"
    }
  ];

  const handleQtyChange = (id, delta) => {
    setQuantities((qty) => ({
      ...qty,
      [id]: Math.max(1, (qty[id] || 1) + delta),
    }));
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((it) => it.id === product.id);
      if (exists) {
        return prev.map((it) => (it.id === product.id ? { ...it, qty: it.qty + qty } : it));
      }
      return [...prev, { ...product, qty }];
    });
    
    // Show toast notification
    setToast({
      show: true,
      message: `Added ${qty} ${qty === 1 ? 'item' : 'items'} to cart: ${product.name}`
    });
    
    // Hide toast after 2 seconds
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2000);
  };

  // remove `amount` quantity from product; if amount >= current qty remove the item
  const removeFromCart = (productId, amount = 1) => {
    setCart((prev) =>
      prev
        .map((it) => (it.id === productId ? { ...it, qty: it.qty - amount } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const setItemQty = (productId, qty) => {
    setCart((prev) =>
      prev
        .map((it) => (it.id === productId ? { ...it, qty: Math.max(1, qty) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ordered categories: common ones first, then any others found in products
  const categories = (() => {
    const base = ["Audio", "Wearables", "Peripherals", "Accessories"];
    const found = Array.from(new Set(products.map((p) => p.category || "").filter(Boolean)));
    const rest = found.filter((c) => !base.includes(c));
    return [...base.filter((b) => found.includes(b)), ...rest];
  })();

  return (
    <div style={styles.app}>
      {/* Debug: show if checkout state is true */}
      {showCheckout && (
        <div style={styles.debugBadge}>Checkout state: true</div>
      )}
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            style={styles.toast}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Vive E-Cart</h1>
          <p style={styles.tagline}>Find Your Vibe</p>
        </div>
        <button style={styles.cartButton} onClick={() => setShowCart(!showCart)}>
          🛒 Cart ({cart.length})
        </button>
      </header>

      {/* Animated Transition */}
      <AnimatePresence mode="wait">
        {!showCart ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Welcome Section with search */}
            <div style={styles.welcomeBox}>
              <div style={{
                ...styles.decorativeCircle,
                width: "120px",
                height: "120px",
                backgroundColor: "#2196F3",
                top: "-20px",
                left: "-20px",
              }}></div>
              <div style={{
                ...styles.decorativeCircle,
                width: "80px",
                height: "80px",
                backgroundColor: "#FFB300",
                bottom: "-10px",
                right: "40px",
              }}></div>
              <div style={{
                ...styles.decorativeCircle,
                width: "60px",
                height: "60px",
                backgroundColor: "#4CAF50",
                top: "30px",
                right: "10%",
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={styles.searchBarInline}>
                  <div style={styles.joinBadge} aria-hidden>
                    Join Vive
                  </div>
                  <div style={styles.inputWithIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.inputIcon} aria-hidden>
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      aria-label="Search products"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products by name or category..."
                      style={styles.searchInputInline}
                    />
                  </div>
                  <button
                    style={styles.searchButton}
                    onClick={() => { /* explicit search action: keep current query */ }}
                    aria-label="Search"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Search</span>
                  </button>
                  {searchQuery ? (
                    <button onClick={() => setSearchQuery('')} style={styles.searchClearInline} aria-label="Clear search">✕</button>
                  ) : null}

                  {/* Category dropdown inline beside the search button */}
                  <div style={styles.categoryDropdown} ref={catRef}>
                    <button
                      style={styles.categoryToggle}
                      onClick={() => setShowCatDropdown((s) => !s)}
                      aria-haspopup="listbox"
                      aria-expanded={showCatDropdown}
                    >
                      {selectedCategory}
                      <span style={{ marginLeft: 8 }}>▾</span>
                    </button>
                    {showCatDropdown && (
                      <div style={styles.categoryMenu} role="listbox">
                        <div
                          key="all"
                          onClick={() => { setSelectedCategory('All Categories'); setShowCatDropdown(false); }}
                          style={styles.categoryItem}
                        >
                          All Categories
                        </div>
                        {categories.map((cat) => (
                          <div
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setShowCatDropdown(false); }}
                            style={styles.categoryItem}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                  {/* Separate container for category carousel (keeps it out of the search/welcome area) */}
                  <div style={{ marginTop: 18 }}>
                    <CategoryCarousel
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  </div>
                {/* Scrolling headline / marquee */}
                <div style={{ marginTop: 12 }}>
                  <div style={styles.marqueeWrap} aria-hidden>
                    <motion.div
                      style={styles.marqueeInner}
                      animate={{ x: ['0%', '-50%'] }}
                      transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
                    >
                      <div style={styles.marqueeItem}>
                        <span style={styles.marqueeText}>SALE IS LIVE! FREE SHIPPING ABOVE ON ALL ORDERS ABOVE RS 1999&nbsp; • &nbsp;</span>
                      </div>
                      <div style={styles.marqueeItem}>
                        <span style={styles.marqueeText}>SALE IS LIVE! FREE SHIPPING ABOVE ON ALL ORDERS ABOVE RS 1999&nbsp; • &nbsp;</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Category carousel (horizontal scrollable list of cards) - moved below welcome box */}
              </div>
            </div>

            {/* Spotlight banner */}
            <div style={styles.spotlightWrap} role="region" aria-label="Spotlight product">
              <div style={styles.spotlightInner}>
                <div style={styles.spotlightText}>
                  <h2 style={styles.spotlightTitle}>
                    <motion.span
                      style={{ display: 'inline-block' }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 1
                      }}
                    >
                      📣
                    </motion.span>
                    {' '}In the Spotlight
                  </h2>
                </div>
                
              </div>
            </div>

            {/* Product Grid */}
            <div style={styles.productGrid}>
              {(() => {
                const qSearch = searchQuery.trim().toLowerCase();
                // Filter by search text (name/category) and by selectedCategory if not "All Categories"
                const filtered = products.filter((p) => {
                  const matchesQuery = qSearch
                    ? p.name.toLowerCase().includes(qSearch) || (p.category || '').toLowerCase().includes(qSearch)
                    : true;
                  const matchesCategory = selectedCategory && selectedCategory !== 'All Categories'
                    ? p.category === selectedCategory
                    : true;
                  return matchesQuery && matchesCategory;
                });
                return filtered.length
                  ? filtered.map((p) => (
                      <motion.div
                  key={p.id}
                  style={styles.card}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div style={styles.imageContainer}>
                    <img 
                      src={p.image} 
                      alt={p.name}
                      style={styles.productImage}
                    />
                    <div style={styles.categoryBadge}>
                      {p.category}
                    </div>
                  </div>
                  <h2 style={styles.productName}>{p.name}</h2>
                  <p style={styles.rating}>⭐ {p.rating}</p>
                  <p style={styles.price}>₹{p.price}</p>

                  {/* Quantity Controls */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "14px",
                          marginRight: "6px",
                        }}
                      >
                        Qty:
                      </span>
                      <button
                        onClick={() => handleQtyChange(p.id, -1)}
                        style={{
                          fontSize: "14px",
                          width: "26px",
                          height: "26px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          background: "#f5f5f5",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          minWidth: "26px",
                          textAlign: "center",
                        }}
                      >
                        {quantities[p.id] || 1}
                      </span>
                      <button
                        onClick={() => handleQtyChange(p.id, 1)}
                        style={{
                          fontSize: "14px",
                          width: "26px",
                          height: "26px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          background: "#f5f5f5",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      style={styles.addButton}
                      onClick={() => addToCart(p, quantities[p.id] || 1)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
                  ))
                  : (
                    <div style={styles.noResults}>No products match your search.</div>
                  )
              })()}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cart"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={styles.cartPage}
          >
            <h2 style={styles.cartHeading}>Your Cart</h2>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '-10px', marginBottom: '15px' }}>
              {cart.length > 0 ? `Total Qty: ${cart.reduce((sum, item) => sum + item.qty, 0)} items` : ''}
            </div>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <ul style={styles.cartList}>
                  {cart.map((item) => (
                    <li key={item.id} style={styles.cartItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>₹{item.price} × {item.qty} = ₹{item.price * item.qty}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => removeFromCart(item.id, 1)}
                            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                          >
                            −
                          </button>
                          <span style={{ minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                          <button
                            onClick={() => addToCart(item, 1)}
                            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                          >
                            +
                          </button>
                          <button style={styles.removeButton} onClick={() => removeFromCart(item.id, item.qty)}>Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <h3 style={styles.totalText}>Total: ₹{getTotal()}</h3>
                <motion.button
  onClick={() => setShowCheckout(true)} // opens the modal
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 200 }}
  style={styles.checkoutButton}
>
  Proceed to Checkout 🛒
</motion.button>
              </>
            )}
            <button style={styles.backButton} onClick={() => setShowCart(false)}>
              ← Back to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            onClose={() => setShowCheckout(false)}
            onSubmit={handleCheckout}
            total={getTotal()}
            items={cart}
          />  
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ Styles
const styles = {
  app: {
    backgroundColor: "#E3F2FD",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  imageContainer: {
    width: "100%",
    height: "200px",
    overflow: "hidden",
    borderRadius: "8px",
    marginBottom: "15px",
    position: "relative",
  },
  categoryBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(33, 150, 243, 0.9)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2196F3",
    color: "white",
    padding: "15px 30px",
    borderRadius: "12px",
    marginBottom: "25px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },
  tagline: {
    margin: 0,
    fontSize: "14px",
    color: "#E3F2FD",
  },
  cartButton: {
    backgroundColor: "white",
    color: "#2196F3",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  welcomeBox: {
    textAlign: "left",
    backgroundColor: "white",
    padding: "18px 16px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    position: "relative",
    overflow: "hidden",
  },
  welcomeTitle: {
    margin: "0",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1565C0",
    position: "relative",
    zIndex: 1,
  },
  welcomeSubtitle: {
    fontSize: "16px",
    color: "#333",
    position: "relative",
    zIndex: 1,
    marginTop: "10px",
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: "50%",
    opacity: "0.1",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "left",
  },
  productName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  rating: {
    color: "#FFB300",
    fontSize: "16px",
    margin: "4px 0",
  },
  price: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2196F3",
  },
  addButton: {
    backgroundColor: "white",
    color: "#2196F3",
    border: "2px solid #FFB300",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
    fontSize: "14px",
  },
  cartPage: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  cartHeading: {
    fontSize: "24px",
    color: "#1565C0",
    marginBottom: "15px",
  },
  cartList: {
    listStyle: "none",
    paddingLeft: 0,
    marginBottom: "10px",
  },
  cartItem: {
    fontSize: "16px",
    marginBottom: "8px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "6px",
  },
  totalText: {
    fontWeight: "700",
    color: "#2196F3",
    marginTop: "10px",
  },
  checkoutButton: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px",
  },
  backButton: {
    backgroundColor: "#E0E0E0",
    color: "#333",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
  },
  removeButton: {
    backgroundColor: "#FF5252",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: 1000,
    fontSize: "14px",
    fontWeight: "500",
  },
  debugBadge: {
    position: 'fixed',
    top: 80,
    right: 20,
    backgroundColor: '#FF7043',
    color: 'white',
    padding: '6px 10px',
    borderRadius: 6,
    zIndex: 3000,
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  },
  /* inline search inside welcome */
  searchBarInline: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: '12px',
  },
  // Make the search input sit to the left while category stays at the right
  searchInputInline: {
    width: 'min(760px, 72vw)',
    padding: '12px 14px 12px 40px',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 15,
    marginRight: 'auto',
  },
  joinBadge: {
    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: '20px',
    color: '#8E24AA',
    marginRight: 12,
    alignSelf: 'center',
    textShadow: '0 2px 6px rgba(0,0,0,0.12)',
  },
  inputWithIcon: {
    position: 'relative',
    display: 'inline-block',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9E9E9E',
    pointerEvents: 'none',
  },
  marqueeWrap: {
    overflow: 'hidden',
    background: '#6A1B9A',
    borderRadius: 8,
    padding: '8px 6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  marqueeInner: {
    display: 'flex',
    width: '200%',
  },
  marqueeItem: {
    width: '50%',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  marqueeText: {
    color: 'white',
    fontWeight: 400,
    fontSize: 13,
    letterSpacing: '0.4px',
  },
  /* Spotlight styles */
  spotlightWrap: {
    background: 'linear-gradient(90deg, rgba(246,237,255,0.95), rgba(255,250,240,0.95))',
    padding: '12px 20px',
    borderRadius: 12,
    margin: '12px 0',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 2px 12px rgba(106,27,154,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  spotlightInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    position: 'relative',
    zIndex: 2,
  },
  spotlightText: {
    display: 'flex',
    flexDirection: 'column',
  },
  spotlightTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#4A148C',
    letterSpacing: '0.3px',
  },
  spotlightEmoji: {
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textShadow: '0 0 8px rgba(255,223,0,0.3)',
  },
  searchButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
  categoryRowCustom: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    margin: '32px 0 24px 0',
  },
  categoryBoxCustom: {
    background: '#F3E5F5',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(106,27,154,0.08)',
    padding: '32px 36px',
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontWeight: 600,
    fontSize: '18px',
    color: '#6A1B9A',
  },
  categoryBoxText: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: '#6A1B9A',
    textTransform: 'uppercase',
  },
  categoryBoxActive: {
    background: '#6A1B9A',
    color: 'white',
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 6px 18px rgba(106,27,154,0.18)'
  },
  searchClearInline: {
    marginLeft: 6,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
  },
  categoriesRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  categoryPill: {
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(0,0,0,0.06)',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    color: '#333',
  },
  categoryPillHover: {
    background: '#E3F2FD',
    transform: 'translateY(-2px)',
  },
  categoryDropdownWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryDropdown: {
    position: 'relative',
  },
  categoryToggle: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 600,
  },
  categoryMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    background: 'white',
    border: '1px solid #eee',
    borderRadius: 8,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    minWidth: 180,
    zIndex: 4000,
    overflow: 'hidden',
  },
  categoryItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #f4f4f4',
    background: 'white',
  },
  noResults: {
    gridColumn: '1/-1',
    padding: 20,
    textAlign: 'center',
    color: '#666',
  },
  searchBarWrap: {
    display: 'flex',
    justifyContent: 'center',
    margin: '18px 0',
  },
  searchBar: {
    width: '100%',
    maxWidth: '760px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px',
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: 8,
  },
  searchClear: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '6px 8px',
  },
};

export default App;
