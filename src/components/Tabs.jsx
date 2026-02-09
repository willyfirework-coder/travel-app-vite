// src/components/Tabs.jsx
import { useRef, useEffect, useState } from 'react';

export default function Tabs({ data, setData, handleDeleteDay, handleAddDay }) {
  const tabsRef = useRef(null);
  
  // 🌟 新增：控制是否處於編輯模式
  const [isEditing, setIsEditing] = useState(false);

  // 當天數增加時，自動捲動到最右邊
  useEffect(() => {
    if (tabsRef.current) {
        tabsRef.current.scrollLeft = tabsRef.current.scrollWidth;
    }
  }, [data.days]);

  return (
    <div className="tabs-container">
      <div className="tabs" ref={tabsRef}>
        {Array.from({ length: data.days }, (_, i) => i + 1).map(day => (
          <button
            key={day}
            className={`tab-btn ${day === data.currentDay ? 'active' : ''}`}
            onClick={() => setData(prev => ({ ...prev, currentDay: day }))}
          >
            Day {day}
            
            {/* 🌟 修改邏輯：只有在編輯模式 (isEditing) 開啟時才顯示刪除鈕 */}
            {isEditing && data.days > 1 && (
              <span 
                className="tab-del-btn" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDeleteDay(day); 
                }}
                title="刪除這一天"
              >
                ×
              </span>
            )}
          </button>
        ))}
        
        {/* 新增天數按鈕 */}
        <button className="tab-add-btn" onClick={handleAddDay} title="新增一天">+</button>
        
        {/* 🌟 新增：編輯模式切換開關 */}
        <button 
            className={`tab-edit-toggle ${isEditing ? 'active' : ''}`} 
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? "完成編輯" : "編輯天數"}
        >
            {isEditing ? '✓' : '⚙️'}
        </button>
      </div>
    </div>
  );
}