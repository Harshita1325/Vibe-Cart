import React from 'react';
import CategoryCard from './CategoryCard';

// A small, horizontal scrollable carousel of categories.
// Props:
// - selectedCategory (string)
// - setSelectedCategory (fn)
// - categories (optional array of { label, image, icon })
export default function CategoryCarousel({ selectedCategory, setSelectedCategory, categories }) {
  const defaultCategories = [
    { label: 'Makeup', icon: '💄' },
    { label: 'Gadgets', icon: '🔌' },
    { label: 'Jewellery', icon: '💍' },
    { label: 'Clothes', icon: '👗' },
    { label: 'Skincare', icon: '🧴' },
    { label: 'Stationary', icon: '✏️' },
    { label: 'Watches', icon: '⌚' },
    { label: 'Water Bottle', icon: '🥤' },
    { label: 'Furniture', icon: '🛋️' },
    { label: 'Paintings', icon: '🖼️' },
    { label: 'Food', icon: '🍱' },
  ];

  const list = Array.isArray(categories) && categories.length ? categories : defaultCategories;

  return (
    <div style={styles.wrap} aria-label="Categories carousel">
      <div style={styles.row}>
        {list.map((c) => (
          <CategoryCard
            key={c.label}
            label={c.label}
            image={c.image}
            icon={c.icon}
            active={selectedCategory === c.label}
            onClick={() => setSelectedCategory && setSelectedCategory(c.label)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    overflowX: 'auto',
    padding: '12px',
    marginTop: 12,
    WebkitOverflowScrolling: 'touch',
    background: '#F6EDFF', // light lilac / lilac background
    borderRadius: 12,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 6,
  },
};
