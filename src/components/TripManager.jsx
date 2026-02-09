// src/components/TripManager.jsx
// import { defaultState } from '../data';

export default function TripManager({ 
  allTrips, currentTripId, 
  handleSwitchTrip, handleCreateTrip, handleDeleteTrip, 
  setActiveModal 
}) {
  return (
    <>
      <h3>📂 我的旅程檔案室</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
        {allTrips.map(trip => (
          <div 
            key={trip.id} 
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: trip.id === currentTripId ? '2px solid var(--primary)' : '1px solid #eee',
              background: trip.id === currentTripId ? '#F0F7FA' : 'white',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleSwitchTrip(trip.id)}
          >
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-title)' }}>{trip.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(trip.updatedAt).toLocaleDateString()}</div>
            </div>
            
            {/* 防止刪除到只剩最後一個，或是刪除當前使用的 (雖然邏輯上可以，但為了防呆先隱藏) */}
            {allTrips.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                style={{ background: '#FFEBEB', color: '#D68C72', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="modal-btns">
        <button className="btn-confirm" onClick={() => handleCreateTrip()}>
          ✨ 建立新旅程 (預設範本)
        </button>
        <button className="btn-cancel" onClick={() => setActiveModal(null)}>
          關閉
        </button>
      </div>
    </>
  );
}