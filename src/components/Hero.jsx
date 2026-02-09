// src/components/Hero.jsx
export default function Hero({ data, setActiveModal, setTempData }) {
  const defaultHero = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  return (
    <header className="hero" style={{ backgroundImage: `url('${data.heroImg || defaultHero}')` }}>
      
      {/* 🌟 修復：使用 hero-controls 容器排版 */}
      <div className="hero-controls">
        <button className="hero-bg-btn" onClick={() => setActiveModal('tripManager')}>
          📂 旅程
        </button>
        <button className="hero-bg-btn" onClick={() => setActiveModal('hero')}>
          📷 底圖
        </button>
      </div>

      <div className="hero-content">
        <h1>
          {data.title}
          <span className="edit-icon" onClick={() => { setTempData({ type: 'title', val: data.title }); setActiveModal('title'); }}>✎</span>
        </h1>
        <p>
          {data.subtitle}
          <span className="edit-icon" onClick={() => { setTempData({ type: 'subtitle', val: data.subtitle }); setActiveModal('title'); }}>✎</span>
        </p>
      </div>
    </header>
  );
}