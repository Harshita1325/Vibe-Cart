import React from 'react';

export default function CategoryCard({ label, image, icon, active, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onClick && onClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-pressed={!!active}
      style={{
        ...styles.card,
        ...(active ? styles.activeCard : {}),
      }}
    >
      {image ? (
        <img src={image} alt={label} style={styles.image} />
      ) : (
        <div style={styles.icon} aria-hidden>
          {icon || '📦'}
        </div>
      )}
      <div style={{ ...styles.label, ...(active ? styles.activeLabel : {}) }}>{label}</div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    padding: '10px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.98)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    marginRight: 12,
    userSelect: 'none',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
  },
  activeCard: {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: '0 10px 26px rgba(0,0,0,0.16)',
    background: '#6A1B9A',
  },
  image: {
    width: 64,
    height: 64,
    objectFit: 'cover',
    borderRadius: 10,
    marginBottom: 8,
  },
  icon: {
    fontSize: 34,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: '#6A1B9A',
    textAlign: 'center',
  },
  activeLabel: {
    color: 'white',
  },
};
