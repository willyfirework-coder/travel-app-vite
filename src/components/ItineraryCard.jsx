import { FALLBACK_IMG } from '../data';
// (卡片與列表元件)
export default function ItineraryCard({ data, selectedRouteItems, handleRouteCheck, handleDeleteItem, setTempData, setActiveModal }) {
  const currentItems = data.items
    .filter(item => item.day === data.currentDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (currentItems.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.3 }}>🎐</div>
        <h3>Day {data.currentDay} 尚未安排</h3>
        <p>點擊右下角 + 開始規劃行程</p>
      </div>
    );
  }

  return (
    <>
      {currentItems.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-img-wrapper">
            <img 
              src={item.img || FALLBACK_IMG} 
              className="card-img" 
              onError={(e) => e.target.src = FALLBACK_IMG}
              alt={item.title}
            />
            <button className="edit-img-btn" onClick={() => { setTempData({ targetIndex: index }); setActiveModal('img'); }}>✎</button>
          </div>
          <div className="card-body">
            <div className="card-meta">
              <span className="time-badge">{item.time}</span>
              <input 
                type="checkbox" 
                className="route-check" 
                checked={selectedRouteItems.includes(item.title)}
                onChange={(e) => handleRouteCheck(item.title, e.target.checked)}
              />
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc || '暫無備註'}</p>
            <div className="card-footer">
              <button className="btn-text" onClick={() => handleDeleteItem(index)}>刪除</button>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title)}`} target="_blank" rel="noreferrer" className="btn-text" style={{ color: 'var(--primary)' }}>地圖 ➤</a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}