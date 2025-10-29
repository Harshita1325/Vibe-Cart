import { useState } from 'react';

export default function CartView({ items = [], total=0, onRemove, onUpdate, onCheckout }) {
  return (
    <aside className="cart">
      <h2>Cart</h2>
      {items.length === 0 ? <p>Cart is empty</p> : (
        <div>
          {items.map(it => (
            <div key={it.id} className="cart-item">
              <div>
                <strong>{it.name}</strong>
                <div>${it.price.toFixed(2)} x {it.qty} = ${(it.lineTotal).toFixed(2)}</div>
              </div>
              <div className="cart-controls">
                <input type="number" min="1" value={it.qty} onChange={(e)=>onUpdate(it.id, Number(e.target.value))} />
                <button onClick={()=>onRemove(it.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ${Number(total).toFixed(2)}</strong>
          </div>
          <button onClick={onCheckout}>Checkout</button>
        </div>
      )}
    </aside>
  );
}
