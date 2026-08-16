import "../css/Home.css";

function CategoryTabs({ activeCategory, onSelectCategory }) {
  const categories = [
    { id: "popular", label: "🔥 Popular" },
    { id: "top_rated", label: "⭐ Top Rated" },
    { id: "now_playing", label: "🎬 Now Playing" },
    { id: "upcoming", label: "🚀 Upcoming" },
  ];

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-tab-btn ${activeCategory === cat.id ? "active" : ""}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
