// src/data.js

export const FALLBACK_IMG = "https://placehold.co/600x400/EEE/999?text=No+Image";

export const defaultData = [
    // Day 1
    { day: 1, time: "12:00", title: "毛蔬 亞洲蔬食", desc: "台南｜無五辛標示清楚，推薦塔香脆腸。", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600" },
    { day: 1, time: "14:30", title: "內惟藝術中心", desc: "高雄｜幾何光影，X-M5 必拍。", img: "https://images.unsplash.com/photo-1545959828-89c0250df527?w=600" },
    { day: 1, time: "16:30", title: "大港橋 & 流行音樂中心", desc: "高雄｜等待夕陽，利用廣角鏡拍蜂巢建築。", img: "https://images.unsplash.com/photo-1624330922858-6927d2c94d93?w=600" },
    { day: 1, time: "18:30", title: "五郎時食", desc: "高雄｜精緻日式蔬食無菜單。", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600" },
    { day: 1, time: "20:00", title: "高雄鹽埕區住宿", desc: "建議選擇老屋改建旅店。", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600" },

    // Day 2
    { day: 2, time: "10:30", title: "枋山郵局 (海豚屋)", desc: "屏東｜特殊建築造型。", img: "https://images.unsplash.com/photo-1628189873138-028677c3df6d?w=600" },
    { day: 2, time: "13:30", title: "南田觀景台", desc: "南迴最藍海景，Velvia 模式。", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
    { day: 2, time: "15:00", title: "太麻里平交道", desc: "櫻木花道場景。", img: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600" },
    
    // Day 3
    { day: 3, time: "10:00", title: "鹿野高台", desc: "居高臨下拍棋盤農田。", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600" },
    { day: 3, time: "14:00", title: "伯朗大道", desc: "池上｜金城武樹與稻浪。", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600" },
    { day: 3, time: "18:00", title: "超市備糧", desc: "買好明天早餐午餐，南橫無素食。", img: "https://images.unsplash.com/photo-1588964895597-a2c79b161c43?w=600" },

    // Day 4
    { day: 4, time: "09:30", title: "埡口雲海", desc: "南橫最高點，海拔2722m。", img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600" },
    { day: 4, time: "16:45", title: "諦願寺", desc: "六龜｜素食友善大廟。", img: "https://images.unsplash.com/photo-1565507746430-8d59d28dbd18?w=600" },
    { day: 4, time: "19:00", title: "赤崁璽樓", desc: "台南｜老洋房精緻蔬食。", img: "https://images.unsplash.com/photo-1560684352-8497838a2229?w=600" },

    // Day 5
    { day: 5, time: "11:00", title: "神農街", desc: "台南｜老屋顏與鐵花窗。", img: "https://images.unsplash.com/photo-1517544845501-bb783a9c7b96?w=600" },
    { day: 5, time: "15:00", title: "啟程返家", desc: "回台中。", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600" }
];

export const defaultState = {
    days: 5,
    currentDay: 1,
    title: "旅攝計畫",
    subtitle: "Day 1 - 5 • 探索之旅",
    heroImg: "",
    items: defaultData
};