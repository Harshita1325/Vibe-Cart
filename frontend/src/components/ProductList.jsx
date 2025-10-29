import React, { useState } from 'react';

export default function ProductList({ products = [], onAdd }) {
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, delta) => {
    setQuantities(qty => ({
      ...qty,
      [id]: Math.max(1, (qty[id] || 1) + delta)
    }));
  };

  return (
    <div className="products">
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p>${p.price.toFixed(2)}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => handleQtyChange(p.id, -1)}>-</button>
              <span>{quantities[p.id] || 1}</span>
              <button onClick={() => handleQtyChange(p.id, 1)}>+</button>
              <button onClick={() => onAdd(p.id, quantities[p.id] || 1)} style={{ marginLeft: '12px' }}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
