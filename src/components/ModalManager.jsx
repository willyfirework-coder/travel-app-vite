// src/components/ModalManager.jsx
import TripManager from './TripManager'; // 確保這個元件存在！

export default function ModalManager({
  activeModal, setActiveModal, data, setData, tempData,
  handleAddItem, handleImport, handleChangeImage, handleHeroUpload,
  handleItemImageUpload, // 新增：處理行程項目圖片上傳
  // 接收 App 傳來的旅程管理 Props
  allTrips, currentTripId, handleSwitchTrip, handleCreateTrip, handleDeleteTrip
}) {
  if (!activeModal) return null;

  const closeModal = (e) => {
    if (e.target === e.currentTarget) setActiveModal(null);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal">

        {/* === A. 旅程管理器 === */}
        {activeModal === 'tripManager' && (
          <TripManager
            allTrips={allTrips}
            currentTripId={currentTripId}
            handleSwitchTrip={handleSwitchTrip}
            handleCreateTrip={handleCreateTrip}
            handleDeleteTrip={handleDeleteTrip}
            setActiveModal={setActiveModal}
          />
        )}

        {/* === B. 新增行程 === */}
        {activeModal === 'add' && (
          <>
            <h3>✨ 新增旅程記憶</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddItem({
                day: parseInt(formData.get('day')),
                time: formData.get('time'),
                title: formData.get('title'),
                img: formData.get('img'),
                desc: formData.get('desc')
              });
            }}>
              <select name="day" defaultValue={data.currentDay}>
                {Array.from({ length: data.days }, (_, i) => i + 1).map(d => <option key={d} value={d}>Day {d}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="time" type="time" defaultValue="10:00" style={{ flex: 1 }} />
                <input name="img" type="text" placeholder="圖片網址 (選填)" style={{ flex: 2 }} />
              </div>
              <input name="title" type="text" placeholder="📍 地點名稱" required />
              <textarea name="desc" rows="3" placeholder="📝 寫下一點備註..."></textarea>
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>取消</button>
                <button type="submit" className="btn-confirm">儲存</button>
              </div>
            </form>
          </>
        )}

        {/* === C. 快速匯入 === */}
        {activeModal === 'import' && (
          <>
            <h3>⚡ 快速匯入</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleImport(e.target.text.value, e.target.day.value); }}>
              <select name="day" defaultValue={data.currentDay}>
                {Array.from({ length: data.days }, (_, i) => i + 1).map(d => <option key={d} value={d}>Day {d}</option>)}
              </select>
              <textarea name="text" rows="6" placeholder="09:00 早餐
11:00 美術館"></textarea>
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>取消</button>
                <button type="submit" className="btn-confirm">匯入</button>
              </div>
            </form>
          </>
        )}

        {/* === D. 更換圖片 === */}
        {activeModal === 'img' && (
          <>
            <h3>更換圖片</h3>

            {/* 🌟 新增：上傳按鈕區塊 */}
            <label className="btn-confirm" style={{ display: 'block', textAlign: 'center', marginBottom: '15px', background: '#888', cursor: 'pointer' }}>
              📂 從相簿上傳
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleItemImageUpload(e.target.files[0])}
              />
            </label>

            <p style={{ textAlign: 'center', color: '#ccc', margin: '5px' }}>或貼上網址</p>

            <form onSubmit={(e) => { e.preventDefault(); handleChangeImage(e.target.url.value); }}>
              <input name="url" type="text" placeholder="https://..." autoFocus />
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>取消</button>
                <button type="submit" className="btn-confirm">更新</button>
              </div>
            </form>
          </>
        )}

        {/* === E. 編輯標題 === */}
        {activeModal === 'title' && (
          <>
            <h3>編輯標題</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              setData(prev => ({ ...prev, [tempData.type]: e.target.val.value }));
              setActiveModal(null);
            }}>
              <input name="val" type="text" defaultValue={tempData.val} autoFocus />
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>取消</button>
                <button type="submit" className="btn-confirm">儲存</button>
              </div>
            </form>
          </>
        )}

        {/* === F. 更換封面 === */}
        {activeModal === 'hero' && (
          <>
            <h3>更換封面底圖</h3>
            <label className="btn-confirm" style={{ display: 'block', textAlign: 'center', marginBottom: '15px', background: '#888' }}>
              📂 從相簿上傳
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleHeroUpload(e.target.files[0])} />
            </label>
            <p style={{ textAlign: 'center', color: '#ccc', margin: '5px' }}>或</p>
            <form onSubmit={(e) => { e.preventDefault(); setData(prev => ({ ...prev, heroImg: e.target.url.value })); setActiveModal(null); }}>
              <input name="url" type="text" placeholder="貼上圖片網址..." />
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>取消</button>
                <button type="submit" className="btn-confirm">確定</button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}