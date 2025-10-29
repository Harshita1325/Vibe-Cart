export default function Header({ total }) {
  return (
    <header className="header">
      <h1>Vibe Commerce — Mock Cart</h1>
      <div className="header-right">Cart total: ${Number(total || 0).toFixed(2)}</div>
    </header>
  );
}
