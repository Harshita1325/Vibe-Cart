Vibe Cart — Mock E-Commerce Cart App
### 🛒 *A sleek, full-stack shopping cart experience built for the Vibe Commerce Internship Assignment.*

---
### 🚀 **Overview**

**Vibe Cart** is a modern full-stack shopping cart application that demonstrates essential **e-commerce workflows** — from product discovery to checkout.
It showcases the ability to design, integrate, and deploy **frontend, backend, and database layers** in a seamless and interactive experience.
---

### 🧠 **Key Features**

✅ **Product Grid View** — Beautifully responsive layout with multiple items per row.
✅ **Add / Remove from Cart** — Instant updates with transitions & animations.
✅ **Quantity Control** — Increment or decrement items directly in cart.
✅ **Dynamic Total Calculation** — Auto updates subtotal and total amount.
✅ **Smooth Cart Transition** — Fun cart slide-in animation with Framer Motion.
✅ **Checkout Modal** — User form for details like name, email, phone, address, etc.
✅ **Order Summary** — Final total with mock receipt generation.
✅ **Responsive Design** — Works across desktop, tablet, and mobile devices.
✅ **REST API Integration** — Realistic endpoints for products, cart, and checkout.

---

### ⚙️ **Tech Stack**

| Layer                   | Technology                               |
| ----------------------- | ---------------------------------------- |
| **Frontend**            | React.js, Framer Motion, React Hot Toast |
| **Backend**             | Node.js, Express.js                      |
| **Database (Optional)** | MongoDB / SQLite (for persistence)       |
| **Version Control**     | Git & GitHub                             |
| **Styling**             | Tailwind CSS + Custom Components         |

---

### 🧩 **Backend API Endpoints**

| Method   | Endpoint        | Description                                    |
| -------- | --------------- | ---------------------------------------------- |
| `GET`    | `/api/products` | Fetch all mock products (id, name, price)      |
| `POST`   | `/api/cart`     | Add product to cart `{ productId, qty }`       |
| `GET`    | `/api/cart`     | Retrieve current cart and total                |
| `DELETE` | `/api/cart/:id` | Remove a specific product                      |
| `POST`   | `/api/checkout` | Mock checkout — returns receipt with timestamp |

---

### 🖥️ **Frontend Pages**

* **Home Page** → Product grid with “Add to Cart” buttons
* **Cart View** → Displays all selected items with total, update, and remove options
* **Checkout Page** → User detail form & mock order placement
* **Order Receipt** → Confirmation with order summary

---

### 🧰 **Setup Instructions**

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/Harshita1325/Vibe-Cart.git
cd Vibe-Cart
```

#### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

Server will start on `http://localhost:5000`

#### 3️⃣ Frontend Setup

Open another terminal:

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

### 💳 **Mock Checkout Flow**

1. Add products to your cart 🛍️
2. Click “Cart” → See smooth animated cart page
3. Click “Proceed to Checkout” → Enter user details
4. Submit form → View confirmation modal with total & order time
5. Option to “Return to Shopping” 🏠

---
### 🧑‍💻 **Developer**

**Harshita — Frontend & Full Stack Developer**
✨ Passionate about crafting beautiful, responsive, and interactive web experiences.

🔗 GitHub: [@Harshita1325](https://github.com/Harshita1325)
---

### 🏁 **Final Thoughts**

This project was built as part of the **Vibe Commerce Internship Coding Assignment**, focusing on clean UI, smooth UX, and well-structured full-stack integration.

