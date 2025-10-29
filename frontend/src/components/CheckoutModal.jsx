// src/components/CheckoutModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CheckoutModal({ onClose, onSubmit, total = 0, items = [] }) {
  const [step, setStep] = useState("form"); // "form" | "slip"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    addressType: "Home",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "card", // card | upi | cod
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: ""
  });
  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [orderTime, setOrderTime] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    // login
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Enter password (min 6 chars)";

    // contact / delivery
    if (!formData.name.trim()) newErrors.name = "Full name required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";

    // payment
    if (formData.paymentMethod === "card") {
      if (!/^\d{16}$/.test(formData.cardNumber)) newErrors.cardNumber = "Card number must be 16 digits";
      if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = "Expiry must be MM/YY";
      if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 digits";
    } else if (formData.paymentMethod === "upi") {
      if (!formData.upiId.trim()) newErrors.upiId = "Enter UPI ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    // simple random order id: ORD + timestamp + short random
    const r = Math.floor(Math.random() * 9000) + 1000;
    return `ORD${Date.now().toString().slice(-6)}${r}`;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // generate fake order meta
    const id = generateOrderId();
    setOrderId(id);
    setOrderTime(new Date());
    setStep("slip"); // show slip inside modal
  };

  const handleFinish = () => {
    // call parent onSubmit to perform backend / toast / clear-cart (your existing handler)
    // pass formData + order meta
    onSubmit({
      ...formData,
      orderId,
      orderTime: orderTime ? orderTime.toISOString() : new Date().toISOString(),
      items,
      total
    });
    // then close modal (parent might also clear cart)
    onClose();
    // reset local state (optional)
    setStep("form");
  };

  // helper display functions
  const formatCurrency = (n) => `₹${n.toFixed ? n.toFixed(2) : n}`;
  const itemTotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const displayItems = items.length ? items : [{ name: "Items", price: total }];

  return (
    <div style={styles.backdrop}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={styles.modal}
      >
        {step === "form" ? (
          <>
            <div style={styles.headerRow}>
              <h3 style={styles.title}>Checkout</h3>
              <div style={styles.total}>Total: {formatCurrency(total || itemTotal)}</div>
            </div>

            <form onSubmit={handlePlaceOrder} style={styles.form}>
              {/* LOGIN */}
              <div style={styles.sectionTitle}>Login</div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                    placeholder="you@example.com"
                    type="email"
                  />
                  {errors.email && <div style={styles.error}>{errors.email}</div>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={errors.password ? { ...styles.input, ...styles.inputError } : styles.input}
                    type="password"
                    placeholder="min 6 characters"
                  />
                  {errors.password && <div style={styles.error}>{errors.password}</div>}
                </div>
              </div>

              {/* DELIVERY */}
              <div style={styles.sectionTitle}>Delivery Details</div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full name</label>
                <input name="name" value={formData.name} onChange={handleChange} style={styles.input} />
                {errors.name && <div style={styles.error}>{errors.name}</div>}
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.inputGroup, flex: 2 }}>
                  <label style={styles.label}>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} style={styles.input} placeholder="10-digit phone" />
                  {errors.phone && <div style={styles.error}>{errors.phone}</div>}
                </div>

                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>Address type</label>
                  <select name="addressType" value={formData.addressType} onChange={handleChange} style={styles.select}>
                    <option>Home</option>
                    <option>Office</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} style={styles.textarea} rows={3} />
                {errors.address && <div style={styles.error}>{errors.address}</div>}
              </div>

              <div style={styles.row}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>City</label>
                  <input name="city" value={formData.city} onChange={handleChange} style={styles.input} />
                  {errors.city && <div style={styles.error}>{errors.city}</div>}
                </div>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} style={styles.input} />
                  {errors.pincode && <div style={styles.error}>{errors.pincode}</div>}
                </div>
              </div>

              {/* PAYMENT */}
              <div style={styles.sectionTitle}>Payment</div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Payment method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} style={styles.select}>
                  <option value="card">Credit / Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cod">Cash on Delivery (COD)</option>
                </select>
              </div>

              {formData.paymentMethod === "card" && (
                <>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Card number</label>
                    <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} style={errors.cardNumber ? { ...styles.input, ...styles.inputError } : styles.input} placeholder="16 digits" />
                    {errors.cardNumber && <div style={styles.error}>{errors.cardNumber}</div>}
                  </div>
                  <div style={styles.row}>
                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                      <label style={styles.label}>Expiry (MM/YY)</label>
                      <input name="expiry" value={formData.expiry} onChange={handleChange} style={errors.expiry ? { ...styles.input, ...styles.inputError } : styles.input} placeholder="MM/YY" />
                      {errors.expiry && <div style={styles.error}>{errors.expiry}</div>}
                    </div>
                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                      <label style={styles.label}>CVV</label>
                      <input name="cvv" value={formData.cvv} onChange={handleChange} style={errors.cvv ? { ...styles.input, ...styles.inputError } : styles.input} placeholder="3 digits" type="password" />
                      {errors.cvv && <div style={styles.error}>{errors.cvv}</div>}
                    </div>
                  </div>
                </>
              )}

              {formData.paymentMethod === "upi" && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>UPI ID</label>
                  <input name="upiId" value={formData.upiId} onChange={handleChange} style={errors.upiId ? { ...styles.input, ...styles.inputError } : styles.input} placeholder="example@upi" />
                  {errors.upiId && <div style={styles.error}>{errors.upiId}</div>}
                </div>
              )}

              <div style={styles.actions}>
                <button type="button" onClick={onClose} style={styles.cancel}>
                  Cancel
                </button>
                <button type="submit" style={styles.primary}>
                  Place Order
                </button>
              </div>
            </form>
          </>
        ) : (
          // SLIP / ORDER CONFIRMATION
          <div>
            <div style={styles.headerRow}>
              <h3 style={styles.title}>Order Confirmed</h3>
              <div style={{ color: "#388E3C", fontWeight: 700 }}>Success ✓</div>
            </div>

            <div style={styles.slip}>
              <div style={styles.slipRow}>
                <div><strong>Order ID</strong></div>
                <div>{orderId}</div>
              </div>
              <div style={styles.slipRow}>
                <div><strong>Date</strong></div>
                <div>{orderTime ? orderTime.toLocaleString() : new Date().toLocaleString()}</div>
              </div>

              <hr />

              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <strong>Items</strong>
                <div style={{ marginTop: 8 }}>
                  {displayItems.map((it, idx) => (
                    <div key={idx} style={styles.itemRow}>
                      <div style={{ fontSize: 14 }}>{it.name}{it.qty ? ` x ${it.qty}` : ""}</div>
                      <div style={{ fontWeight: 700 }}>{formatCurrency((it.price || 0) * (it.qty || 1))}</div>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <div style={styles.slipRow}>
                <div>Subtotal</div>
                <div>{formatCurrency(itemTotal || total)}</div>
              </div>
              <div style={styles.slipRow}>
                <div>Shipping</div>
                <div>₹0.00</div>
              </div>
              <div style={{ ...styles.slipRow, marginTop: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Total</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{formatCurrency(total || itemTotal)}</div>
              </div>

              <hr />

              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Shipping To</div>
                <div style={{ marginTop: 6 }}>
                  {formData.name} • {formData.phone} <br />
                  {formData.addressType} — {formData.address}, {formData.city} - {formData.pincode}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
              <button onClick={() => { setStep("form"); }} style={styles.cancel}>
                Back
              </button>
              <button onClick={handleFinish} style={styles.primary}>
                Finish
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000
  },
  modal: {
    width: "92%",
    maxWidth: 720,
    background: "white",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto"
  },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { margin: 0, color: "#1565C0" },
  total: { fontWeight: 700, color: "#1976D2" },

  form: { display: "flex", flexDirection: "column", gap: 12 },
  sectionTitle: { fontWeight: 700, marginTop: 6, marginBottom: 4, color: "#333" },

  row: { display: "flex", gap: 12 },
  inputGroup: { display: "flex", flexDirection: "column", flex: 1 },
  label: { fontSize: 13, marginBottom: 6, color: "#333" },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 },
  textarea: { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, resize: "vertical" },
  select: { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" },

  inputError: { borderColor: "#FF5252" },
  error: { color: "#D32F2F", fontSize: 12, marginTop: 6 },

  actions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 },
  cancel: { padding: "8px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
  primary: { padding: "8px 14px", borderRadius: 8, border: "none", background: "#1976D2", color: "#fff", cursor: "pointer", fontWeight: 700 },

  slip: { background: "#FAFAFA", borderRadius: 8, padding: 12, marginTop: 8, border: "1px solid #f0f0f0" },
  slipRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  itemRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 }
};
