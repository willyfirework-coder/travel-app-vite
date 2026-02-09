// src/App.jsx
import { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';
import { defaultState } from './data';

// 引入顯示元件
import Hero from './components/Hero';
import Tabs from './components/Tabs';
import ItineraryCard from './components/ItineraryCard';
import ModalManager from './components/ModalManager';

// --- 工具：圖片壓縮函式 ---
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // 1. 建立 Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 2. 設定最大寬度 (例如 1200px，夠清晰又不會太大)
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // 3. 畫上去並壓縮
        ctx.drawImage(img, 0, 0, width, height);

        // 4. 輸出成 JPEG，品質設定為 0.7 (70%)
        // 這樣通常可以把 5MB 的圖壓到 200KB 以下
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function App() {
  // --- 1. 多旅程資料庫 (Trip Library) ---
  const [allTrips, setAllTrips] = useState(() => {
    const saved = localStorage.getItem('tripLibrary_v1');
    if (saved) return JSON.parse(saved);
    // 預設建立第一個旅程
    return [{ id: Date.now(), title: defaultState.title, data: defaultState, updatedAt: Date.now() }];
  });

  // --- 2. 當前選中的旅程 ID ---
  const [currentTripId, setCurrentTripId] = useState(() => {
    return allTrips[0]?.id || Date.now();
  });

  // --- 3. 當前操作的資料 (Active Data) ---
  // 我們將當前旅程的 data 獨立出來操作，並透過 Effect 同步回 allTrips
  const [data, setData] = useState(() => {
    const found = allTrips.find(t => t.id === currentTripId);
    return found ? found.data : defaultState;
  });

  // --- UI 狀態 ---
  const [selectedRouteItems, setSelectedRouteItems] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [tempData, setTempData] = useState({});

  // --- Effect: 資料變更時，自動同步回 Library 並存檔 ---
  useEffect(() => {
    setAllTrips(prevTrips => {
      const newTrips = prevTrips.map(trip =>
        trip.id === currentTripId
          ? { ...trip, data: data, title: data.title, updatedAt: Date.now() }
          : trip
      );
      // 存入 LocalStorage
      localStorage.setItem('tripLibrary_v1', JSON.stringify(newTrips));
      return newTrips;
    });
    document.title = data.title;
  }, [data, currentTripId]);

  // ================= 功能邏輯 =================

  // --- A. 旅程管理 (Switch / Create / Delete Trip) ---
  const handleSwitchTrip = (id) => {
    const targetTrip = allTrips.find(t => t.id === id);
    if (targetTrip) {
      setCurrentTripId(id);
      setData(targetTrip.data);
      setSelectedRouteItems([]); // 切換時清空勾選
      setActiveModal(null);
    }
  };

  const handleCreateTrip = () => {
    const newId = Date.now();
    const newTrip = {
      id: newId,
      title: "新旅程計畫",
      data: { ...defaultState, title: "新旅程計畫" },
      updatedAt: Date.now()
    };
    const newTrips = [...allTrips, newTrip];
    setAllTrips(newTrips);
    localStorage.setItem('tripLibrary_v1', JSON.stringify(newTrips));

    // 切換過去
    setCurrentTripId(newId);
    setData(newTrip.data);
    setSelectedRouteItems([]);
    setActiveModal(null);
  };

  const handleDeleteTrip = (id) => {
    if (allTrips.length <= 1) return alert("至少要保留一個旅程！");
    if (!confirm("確定要永久刪除這個旅程嗎？")) return;

    const newTrips = allTrips.filter(t => t.id !== id);
    setAllTrips(newTrips);
    localStorage.setItem('tripLibrary_v1', JSON.stringify(newTrips));

    // 如果刪除的是當前旅程，切換到第一個
    if (id === currentTripId) {
      setCurrentTripId(newTrips[0].id);
      setData(newTrips[0].data);
    }
  };

  // --- B. 天數管理 (Add / Delete Day) ---
  const handleAddDay = () => {
    setData(prev => ({ ...prev, days: prev.days + 1, currentDay: prev.days + 1 }));
  };

  const handleDeleteDay = (dayToDelete) => {
    if (data.days <= 1) return alert("至少要保留一天！");

    // 檢查該天是否有行程
    const hasItems = data.items.some(item => item.day === dayToDelete);
    if (hasItems) {
      if (!confirm(`Day ${dayToDelete} 還有行程，確定要刪除並重新排序後續天數嗎？`)) return;
    } else {
      if (!confirm(`確定要刪除 Day ${dayToDelete} 嗎？`)) return;
    }

    // 過濾掉該天行程，並將後續天數 -1
    const newItems = data.items
      .filter(item => item.day !== dayToDelete)
      .map(item => {
        if (item.day > dayToDelete) {
          return { ...item, day: item.day - 1 };
        }
        return item;
      });

    setData(prev => ({
      ...prev,
      days: prev.days - 1,
      // 如果刪除當前天，且當前天是最後一天，則往前跳；否則停在原地(因為後面的天數補上來了)
      currentDay: prev.currentDay > dayToDelete ? prev.currentDay - 1 : Math.min(prev.currentDay, prev.days - 1),
      items: newItems
    }));
  };

  // --- C. 行程項目管理 (Item CRUD) ---
  const handleAddItem = (newItem) => {
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    if (newItem.day !== data.currentDay) setData(prev => ({ ...prev, currentDay: newItem.day }));
    setActiveModal(null);
  };

  const handleDeleteItem = (indexToDelete) => {
    if (confirm('確定刪除此行程？')) {
      const currentDayItems = data.items
        .map((item, idx) => ({ ...item, originalIndex: idx }))
        .filter(item => item.day === data.currentDay)
        .sort((a, b) => a.time.localeCompare(b.time));

      const realIndex = currentDayItems[indexToDelete].originalIndex;
      const newItems = [...data.items];
      newItems.splice(realIndex, 1);
      setData(prev => ({ ...prev, items: newItems }));
    }
  };

  const handleChangeImage = (url) => {
    const currentDayItems = data.items
      .map((item, idx) => ({ ...item, originalIndex: idx }))
      .filter(item => item.day === data.currentDay)
      .sort((a, b) => a.time.localeCompare(b.time));

    const realIndex = currentDayItems[tempData.targetIndex].originalIndex;
    const newItems = [...data.items];
    newItems[realIndex].img = url;
    setData(prev => ({ ...prev, items: newItems }));
    setActiveModal(null);
  };

  const handleItemImageUpload = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert("圖片太大，請選擇 10MB 以下的照片");

    try {
      // 1. 壓縮圖片
      const compressedDataUrl = await compressImage(file);

      // 2. 找出目前正在編輯的是哪一張卡片
      const currentDayItems = data.items
        .map((item, idx) => ({ ...item, originalIndex: idx }))
        .filter(item => item.day === data.currentDay)
        .sort((a, b) => a.time.localeCompare(b.time));

      const realIndex = currentDayItems[tempData.targetIndex].originalIndex;

      // 3. 更新資料
      const newItems = [...data.items];
      newItems[realIndex].img = compressedDataUrl;
      setData(prev => ({ ...prev, items: newItems }));
      
      // 4. 關閉視窗
      setActiveModal(null);
      
    } catch (error) {
      console.error("圖片處理失敗", error);
      alert("圖片處理失敗，請換一張試試看");
    }
  };

  const handleImport = (text, day) => {
    const lines = text.split('\n');
    let count = 0;
    const newItems = [...data.items];
    lines.forEach(line => {
      const match = line.match(/(\d{1,2}:\d{2})/);
      if (match) {
        let title = line.replace(match[0], '').trim().replace(/^[-.\s]+/, '');
        if (title) {
          newItems.push({ day: parseInt(day), time: match[0], title, desc: "快速匯入", img: "" });
          count++;
        }
      }
    });
    if (count > 0) {
      setData(prev => ({ ...prev, items: newItems, currentDay: parseInt(day) }));
      setActiveModal(null);
    } else {
      alert('無法辨識，請確認格式如：12:00 午餐');
    }
  };

  // 修改原本的 handleHeroUpload
  const handleHeroUpload = async (file) => {
    if (!file) return;

    // 雖然有壓縮，還是可以擋一下太誇張的大檔 (例如 > 10MB)
    if (file.size > 10 * 1024 * 1024) return alert("圖片太大，請選擇 10MB 以下的照片");

    try {
      // 顯示「處理中...」的感覺 (可選)
      // alert("圖片壓縮處理中..."); 

      // ✨ 等待壓縮完成
      const compressedDataUrl = await compressImage(file);

      // 存入資料
      setData(prev => ({ ...prev, heroImg: compressedDataUrl }));
      setActiveModal(null);

    } catch (error) {
      console.error("圖片處理失敗", error);
      alert("圖片處理失敗，請換一張試試看");
    }
  };
  // --- D. 路線勾選與連結 ---
  const handleRouteCheck = (title, checked) => {
    setSelectedRouteItems(prev => checked ? [...prev, title] : prev.filter(t => t !== title));
  };

  const getRouteLink = () => {
    const points = selectedRouteItems.map(encodeURIComponent);
    const origin = points[0];
    const dest = points[points.length - 1];
    const waypoints = points.slice(1, -1).join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&waypoints=${waypoints}&travelmode=driving`;
  };

  // ================= 渲染畫面 =================

  return (
    <>
      <Hero data={data} setActiveModal={setActiveModal} setTempData={setTempData} />

      {/* 傳遞新的 handleDeleteDay 與 handleAddDay */}
      <Tabs
        data={data}
        setData={setData}
        handleDeleteDay={handleDeleteDay}
        handleAddDay={handleAddDay}
      />

      <div className="container">
        <ItineraryCard
          data={data}
          selectedRouteItems={selectedRouteItems}
          handleRouteCheck={handleRouteCheck}
          handleDeleteItem={handleDeleteItem}
          setTempData={setTempData}
          setActiveModal={setActiveModal}
        />
      </div>

      {selectedRouteItems.length > 1 && (
        <div className="route-bar">
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>
            已選 {selectedRouteItems.length} 個景點
          </span>
          <a href={getRouteLink()} target="_blank" rel="noreferrer" className="route-btn">🚗 開始導航</a>
        </div>
      )}

      <div className="fab-group">
        <button className="fab fab-import" onClick={() => setActiveModal('import')}>⚡</button>
        <button className="fab fab-add" onClick={() => setActiveModal('add')}>+</button>
      </div>

      {/* 關鍵：將所有 Props 傳給 ModalManager，由它去呼叫 TripManager */}
      <ModalManager
        activeModal={activeModal} setActiveModal={setActiveModal}
        data={data} setData={setData} tempData={tempData}
        handleAddItem={handleAddItem} handleImport={handleImport}
        handleChangeImage={handleChangeImage} handleHeroUpload={handleHeroUpload}
        handleItemImageUpload={handleItemImageUpload}
        // 旅程管理 Props
        allTrips={allTrips}
        currentTripId={currentTripId}
        handleSwitchTrip={handleSwitchTrip}
        handleCreateTrip={handleCreateTrip}
        handleDeleteTrip={handleDeleteTrip}
      />

      <SpeedInsights />
    </>
  );
}

export default App;