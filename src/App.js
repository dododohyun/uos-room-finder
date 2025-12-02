// src/App.js
import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  User,
  LogIn,
  Plus,
  X,
  ChevronRight,
  Bed,
  Calendar,
  DollarSign,
  Maximize,
  Clock,
  Heart,
  LogOut,
  Layers,
  Shield,
  MapPin,
  Building,
  Camera,     // 사진 아이콘
  Upload,     // 업로드 아이콘
  AlertTriangle, // 신고 아이콘
  CheckCircle, // 승인 아이콘
  Activity,    // 활동 아이콘
  Box          // 3D 모델 아이콘
} from "lucide-react";

// ---------------- 1. 데이터 정의 (구조 통일) ----------------

// [원룸]
const initialProperties = [
  {
    id: 1,
    category: "room", // 카테고리 구분
    typeLabel: "원룸",
    address: "휘경동 293-94",
    lat: 37.586422,
    lng: 127.059887,
    price: { deposit: 5000, monthly: 50, jeonse: 15000 }, // 가격 있음
    area: 25.5,
    floor: 3,
    built: 2018,
    commute: 15,
    lumaUrl: "https://lumalabs.ai/embed/c8a7dd2d-3573-424a-9a48-feec67416c26?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    description: "서울시립대 도보 15분, 깨끗한 원룸. 풀옵션.",
  },
  {
    id: 2,
    category: "room",
    typeLabel: "원룸",
    address: "전농동 152-13",
    lat: 37.585922,
    lng: 127.055280,
    price: { deposit: 3000, monthly: 45, jeonse: 12000 },
    area: 20.3,
    floor: 2,
    built: 2020,
    commute: 10,
    lumaUrl: "https://lumalabs.ai/embed/c8a7dd2d-3573-424a-9a48-feec67416c26?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    description: "역세권, 신축 원룸. 채광 좋음.",
  },
];

// [신규 건물] - 데이터 구조를 원룸과 비슷하게 맞춤 (가격 제외)
const initialBuildings = [
  {
    id: 101,
    category: "building",
    typeLabel: "교육 시설",
    address: "서울시립대 미래관 (신축)",
    lat: 37.5845,
    lng: 127.0580,
    price: null, // 가격 없음
    area: 1200,
    floor: 7,
    built: 2024,
    commute: 0,
    lumaUrl: "https://lumalabs.ai/embed/c8a7dd2d-3573-424a-9a48-feec67416c26?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"], // 더미 이미지
    description: "최첨단 스마트 강의실과 연구실을 갖춘 신축 건물입니다. (3D 모델 업데이트 됨)",
  },
  {
    id: 102,
    category: "building",
    typeLabel: "문화 시설",
    address: "100주년 기념관",
    lat: 37.5838,
    lng: 127.0594,
    price: null,
    area: 3000,
    floor: 5,
    built: 2018,
    commute: 0,
    lumaUrl: "https://lumalabs.ai/embed/c8a7dd2d-3573-424a-9a48-feec67416c26?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    images: ["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800"],
    description: "대강당, 전시실, 국제회의장을 갖춘 복합 문화 공간입니다.",
  },
];

// [안심 시설]
const initialSafety = [
  { id: 201, type: "cctv", name: "안심 CCTV 1", lat: 37.5870, lng: 127.0600 },
  { id: 202, type: "light", name: "스마트 가로등", lat: 37.5860, lng: 127.0610 },
  { id: 203, type: "cctv", name: "골목길 CCTV", lat: 37.5850, lng: 127.0470 },
];

// [골목길/도로] - 위치 수정 (겹침 방지)
const initialRoads = [
  {
    id: 301,
    category: "road",
    typeLabel: "안심 귀갓길",
    address: "음악관 뒤편 산책로", // 주소/이름
    // 좌표를 음악관/하늘못 쪽으로 이동하여 건물 마커와 겹침 방지
    path: [
      { lat: 37.5832, lng: 127.0605 },
      { lat: 37.5835, lng: 127.0615 },
      { lat: 37.5842, lng: 127.0620 },
    ],
    color: "#8b5cf6", // 보라색
    price: null,
    lumaUrl: "https://lumalabs.ai/embed/c8a7dd2d-3573-424a-9a48-feec67416c26?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    images: ["https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?w=800"],
    description: "야간 조명이 설치되어 안전하게 이동할 수 있는 보행자 전용 도로입니다.",
  },
];

// ---------------- 메인 컴포넌트 ----------------
function UOSRoomFinder() {
  const [currentPage, setCurrentPage] = useState("map");
  const [selectedProperty, setSelectedProperty] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);

  // 레이어 상태 관리
  const [activeLayers, setActiveLayers] = useState({
    room: true,
    building: true,
    safety: true,
    road: true,
  });

  const mapRef = useRef(null);

  // ------ 카카오맵 렌더링 로직 ------
  useEffect(() => {
    if (currentPage !== "map") return;
    if (!mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) {
      console.warn("Kakao map script not loaded");
      return;
    }

    const kakao = window.kakao;
    mapRef.current.innerHTML = "";

    const center = new kakao.maps.LatLng(37.5838, 127.0594);
    const map = new kakao.maps.Map(mapRef.current, { center, level: 5 });

    // 0. 서울시립대 마커
    const uosMarker = new kakao.maps.Marker({ position: center });
    uosMarker.setMap(map);

    // 1. [원룸 매물] 렌더링 (Red)
    if (activeLayers.room) {
      initialProperties.forEach((p) => {
        const pos = new kakao.maps.LatLng(p.lat, p.lng);
        const el = createCustomMarker(p.price.monthly + "만", "#ef4444");
        el.addEventListener("click", () => {
          setSelectedProperty(p); // 클릭 시 선택
          setShowPropertyDetail(false);
          map.panTo(pos);
        });
        new kakao.maps.CustomOverlay({ position: pos, content: el, yAnchor: 1 }).setMap(map);
      });
    }

    // 2. [일반 건물] 렌더링 (Blue) - 이제 클릭 시 카드가 뜹니다
    if (activeLayers.building) {
      initialBuildings.forEach((b) => {
        const pos = new kakao.maps.LatLng(b.lat, b.lng);
        const el = createCustomMarker(b.address.split(" ")[0], "#2563eb"); // 건물명 앞부분만 표시
        
        el.addEventListener("click", () => {
            setSelectedProperty(b); // 건물도 selectedProperty로 설정하여 카드 띄움
            setShowPropertyDetail(false);
            map.panTo(pos);
        });
        new kakao.maps.CustomOverlay({ position: pos, content: el, yAnchor: 1 }).setMap(map);
      });
    }

    // 3. [안심 시설] (Green/Yellow) - 얘는 클릭 이벤트 없음 (단순 정보)
    if (activeLayers.safety) {
      initialSafety.forEach((s) => {
        const pos = new kakao.maps.LatLng(s.lat, s.lng);
        const el = document.createElement("div");
        Object.assign(el.style, {
            background: s.type === 'cctv' ? "#f59e0b" : "#10b981",
            color: "white", padding: "4px 8px", borderRadius: "12px",
            fontSize: "11px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            display: "flex", alignItems: "center", gap: "4px"
        });
        el.innerHTML = `<span>${s.type === 'cctv' ? '📷' : '💡'}</span> ${s.name}`;
        new kakao.maps.CustomOverlay({ position: pos, content: el, yAnchor: 1.5 }).setMap(map);
      });
    }

    // 4. [골목길/도로] Polyline
    if (activeLayers.road) {
      initialRoads.forEach((r) => {
        const path = r.path.map(pt => new kakao.maps.LatLng(pt.lat, pt.lng));
        
        const polyline = new kakao.maps.Polyline({
          map: map, path: path, strokeWeight: 6, strokeColor: r.color, strokeOpacity: 0.8, strokeStyle: 'solid'
        });

        // 도로명 라벨 (클릭 가능하게)
        const midIndex = Math.floor(path.length / 2);
        const el = document.createElement("div");
        el.innerHTML = `<div style="background:white; border:2px solid ${r.color}; color:${r.color}; padding:4px 8px; border-radius:12px; font-size:12px; font-weight:bold; cursor:pointer;">${r.address}</div>`;
        
        el.addEventListener("click", () => {
             setSelectedProperty(r); // 도로도 클릭 시 카드 띄움
             setShowPropertyDetail(false);
             map.panTo(path[midIndex]);
        });

        new kakao.maps.CustomOverlay({ position: path[midIndex], content: el, yAnchor: 0.5 }).setMap(map);
      });
    }

  }, [currentPage, activeLayers]);

  // Helper: 마커 DOM
  const createCustomMarker = (text, color) => {
    const el = document.createElement("div");
    Object.assign(el.style, {
      background: color, color: "white", padding: "6px 12px", borderRadius: "18px",
      fontWeight: "bold", fontSize: "13px", boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
      cursor: "pointer", whiteSpace: "nowrap", transition: "transform 0.2s"
    });
    el.innerText = text;
    el.onmouseenter = () => el.style.transform = "scale(1.1)";
    el.onmouseleave = () => el.style.transform = "scale(1)";
    return el;
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f3f4f6", fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
      
      {/* 헤더 */}
      <header style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setCurrentPage("map"); setSelectedProperty(null); }}>
          <Home size={26} color="#2563eb" />
          <span style={{ marginLeft: 8, fontSize: 20, fontWeight: 800 }}>서울시립대 원룸</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <NavButton active={currentPage === "map"} onClick={() => { setCurrentPage("map"); setSelectedProperty(null); }} label="지도" icon={<Home size={18} />} />
          {isLoggedIn ? (
            <>
              <NavButton active={currentPage === "mypage"} onClick={() => setCurrentPage("mypage")} label="마이페이지" icon={<User size={18} />} />
              <NavButton active={currentPage === "add"} onClick={() => setCurrentPage("add")} label="등록/신고" icon={<Plus size={18} />} />
            </>
          ) : (
            <NavButton active={currentPage === "login"} onClick={() => setCurrentPage("login")} label="로그인" icon={<LogIn size={18} />} />
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        
        {currentPage === "map" && (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

            {/* 레이어 컨트롤러 */}
            <div style={{ position: "absolute", top: 16, right: 16, zIndex: 30, background: "white", padding: "12px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", minWidth: "140px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px", color: "#374151" }}>
                    <Layers size={16} /> 지도 레이어
                </div>
                <LayerToggle label="원룸 매물" color="#ef4444" checked={activeLayers.room} onChange={() => setActiveLayers(p => ({...p, room: !p.room}))} />
                <LayerToggle label="주요 건물" color="#2563eb" checked={activeLayers.building} onChange={() => setActiveLayers(p => ({...p, building: !p.building}))} />
                <LayerToggle label="안심 시설" color="#10b981" checked={activeLayers.safety} onChange={() => setActiveLayers(p => ({...p, safety: !p.safety}))} />
                <LayerToggle label="안심 귀갓길" color="#8b5cf6" checked={activeLayers.road} onChange={() => setActiveLayers(p => ({...p, road: !p.road}))} />
            </div>

            {/* 매물/건물/도로 미리보기 카드 */}
            {selectedProperty && (
              <PropertyPreview property={selectedProperty} onClose={() => setSelectedProperty(null)} onDetail={() => setShowPropertyDetail(true)} />
            )}
          </div>
        )}

        {currentPage === "login" && <LoginPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} setSelectedProperty={setSelectedProperty} />}
        {currentPage === "mypage" && <MyPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} setSelectedProperty={setSelectedProperty} />}
        {currentPage === "add" && <AddPropertyPage />}
      </main>

      {/* 상세 모달 */}
      {showPropertyDetail && selectedProperty && (
        <PropertyDetail property={selectedProperty} onClose={() => setShowPropertyDetail(false)} />
      )}
    </div>
  );
}

// ---------------- 서브 컴포넌트들 ----------------

const LayerToggle = ({ label, color, checked, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "6px", cursor: "pointer" }} onClick={onChange}>
        <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: checked ? color : "#e5e7eb", marginRight: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
            {checked && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
        </div>
        <span style={{ fontSize: "13px", color: checked ? "#1f2937" : "#9ca3af", fontWeight: checked ? "600" : "400" }}>{label}</span>
    </div>
);

// [수정] 미리보기 카드: 가격 정보가 없으면(건물/도로) 안보이게 처리
const PropertyPreview = ({ property, onClose, onDetail }) => (
  <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, margin: "0 auto", maxWidth: 960, background: "#ffffff", borderRadius: 20, boxShadow: "0 16px 40px rgba(0,0,0,0.25)", overflow: "hidden", zIndex: 20 }}>
    <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "#ffffff", borderRadius: "999px", border: "1px solid #e5e7eb", padding: 4, cursor: "pointer", zIndex: 2 }}>
      <X size={18} />
    </button>
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1, minHeight: 260, background: "#f3f4f6" }}>
        <iframe src={property.lumaUrl} title="3D Preview" style={{ width: "100%", height: "100%", border: "none" }} />
      </div>
      <div style={{ flex: 1, padding: 20, boxSizing: "border-box" }}>
        {/* 카테고리 뱃지 */}
        <div style={{ display: "inline-block", padding: "4px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", color: "#4b5563", marginBottom: "8px", fontWeight: "600" }}>
            {property.typeLabel || "정보"}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{property.address}</div>
        <div style={{ fontSize: 13, color: "#4b5563", marginBottom: 10 }}>{property.description}</div>
        
        {/* 가격 정보는 'room' 타입일 때만 표시 */}
        {property.category === 'room' && property.price && (
            <div style={{ background: "#eff6ff", borderRadius: 12, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <div><span style={{color:"#6b7280", fontSize:11}}>보증금</span> <span style={{fontWeight:700, color:"#2563eb", fontSize:18}}>{property.price.deposit}만</span></div>
                <div><span style={{color:"#6b7280", fontSize:11}}>월세</span> <span style={{fontWeight:700, color:"#2563eb", fontSize:18}}>{property.price.monthly}만</span></div>
            </div>
        )}

        <button onClick={onDetail} style={{ width: "100%", padding: "10px 0", borderRadius: 12, border: "none", background: "#2563eb", color: "white", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>자세히 보기 <ChevronRight size={18} /></button>
      </div>
    </div>
  </div>
);

const LoginPage = ({ setIsLoggedIn, setCurrentPage, setSelectedProperty }) => (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", background: "#eef2ff" }}>
      <div style={{ background: "white", padding: 24, borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", width: 360, boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Home size={40} color="#2563eb" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1f2937" }}>로그인</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>서울시립대 원룸 & 공간정보</div>
        </div>
        <input type="email" placeholder="이메일" style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #d1d5db", marginBottom: 12, boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
        <input type="password" placeholder="비밀번호" style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #d1d5db", marginBottom: 20, boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
        <button onClick={() => { setIsLoggedIn(true); setCurrentPage("map"); setSelectedProperty(null); }} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "#2563eb", color: "white", fontWeight: 700, fontSize: "16px", cursor: "pointer", boxSizing: "border-box", transition: "background 0.2s" }}>로그인</button>
      </div>
    </div>
);

// [수정] 마이페이지: 정보 채우기
const MyPage = ({ setIsLoggedIn, setCurrentPage, setSelectedProperty }) => (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>마이페이지</h2>
      
      {/* 1. 프로필 & 레벨 섹션 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={30} color="#2563eb" />
                </div>
                <div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>김시립 (공간정보공학과)</div>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>2021920000 | user@uos.ac.kr</div>
                </div>
            </div>
            
            <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}>
                <span>공간정보 기여자 Lv.3</span>
                <span style={{ color: "#2563eb" }}>750 / 1000 XP</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "75%", height: "100%", background: "#2563eb" }} />
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                <div style={{ background: "#f9fafb", padding: "10px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>신고 승인</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937" }}>12건</div>
                </div>
                <div style={{ background: "#f9fafb", padding: "10px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>3D 모델</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937" }}>4건</div>
                </div>
            </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
             <div style={{ fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Heart size={20} color="#ef4444" /> 찜한 매물
             </div>
             <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "14px", border: "2px dashed #e5e7eb", borderRadius: "12px" }}>
                아직 찜한 매물이 없습니다.
             </div>
        </div>
      </div>

      {/* 2. 최근 활동 내역 섹션 */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
         <div style={{ fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={20} color="#2563eb" /> 최근 기여 활동
         </div>
         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <ActivityItem title="미래관 신축 공사현장 업데이트" date="2025.11.28" status="승인됨" color="#10b981" />
            <ActivityItem title="쪽문 가로등 파손 신고" date="2025.11.25" status="처리중" color="#f59e0b" />
            <ActivityItem title="휘경동 원룸촌 골목 3D 모델링 등록" date="2025.11.20" status="승인됨" color="#10b981" />
         </div>
         <button onClick={() => { setIsLoggedIn(false); setCurrentPage("map"); setSelectedProperty(null); }} style={{ marginTop: 24, padding: "10px 16px", borderRadius: 10, border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: "600", fontSize: "14px", width: "fit-content" }}>
            <LogOut size={16} /> 로그아웃
         </button>
      </div>
    </div>
);

const ActivityItem = ({ title, date, status, color }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f9fafb", borderRadius: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle size={18} color={color} />
            <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>{title}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>{date}</div>
            </div>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "700", color: color, background: "white", padding: "4px 8px", borderRadius: "6px", border: `1px solid ${color}` }}>
            {status}
        </div>
    </div>
);

// [수정] 매물 등록 & 신고 페이지 (탭 기능 추가)
const AddPropertyPage = () => {
    const [tab, setTab] = useState("report"); // 'room' or 'report'

    return (
        <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>등록 및 신고</h2>
          
          {/* 탭 버튼 */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
             <button onClick={() => setTab("room")} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: tab === "room" ? "#2563eb" : "white", color: tab === "room" ? "white" : "#4b5563", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>🏠 매물 등록</button>
             <button onClick={() => setTab("report")} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: tab === "report" ? "#2563eb" : "white", color: tab === "report" ? "white" : "#4b5563", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>🗺️ 지도 정보 신고</button>
          </div>
    
          <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            
            {tab === "report" ? (
                // 지도 정보 신고 폼
                <div>
                    <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <AlertTriangle size={20} color="#f59e0b" /> 지도 수정 / 정보 제보
                    </div>
                    
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>신고 유형</label>
                        <select style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }}>
                            <option>🏗️ 신규 건물 / 공사 현장</option>
                            <option>💡 가로등 / 시설물 파손</option>
                            <option>📷 3D 모델 추가 (Luma AI)</option>
                            <option>🛣️ 골목길 / 도로 정보 오류</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>위치 (주소 또는 장소명)</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <input type="text" placeholder="예: 미래관 옆 샛길" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }} />
                            <button style={{ padding: "0 16px", borderRadius: "8px", border: "1px solid #2563eb", background: "white", color: "#2563eb", fontWeight: "600", cursor: "pointer" }}>지도에서 선택</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Luma AI 3D 모델 URL (선택)</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb", padding: "8px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                            <Box size={18} color="#6b7280" />
                            <input type="text" placeholder="https://lumalabs.ai/..." style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "14px" }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                         <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>현장 사진</label>
                         <div style={{ width: "100%", height: "100px", border: "2px dashed #d1d5db", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", cursor: "pointer" }}>
                             <Camera size={24} />
                             <span style={{ fontSize: "12px", marginTop: "4px" }}>사진을 업로드하려면 클릭하세요</span>
                         </div>
                    </div>

                    <button style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: "#2563eb", color: "white", fontWeight: "700", fontSize: "16px", cursor: "pointer" }}>제보하기</button>
                </div>
            ) : (
                // 매물 등록 폼 (간단 버전)
                <div>
                     <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Home size={20} color="#2563eb" /> 우리집 내놓기
                    </div>
                    <div style={{ padding: "20px", textAlign: "center", color: "#6b7280", background: "#f9fafb", borderRadius: "8px" }}>
                        매물 등록 기능은 공인중개사 인증 후 이용 가능합니다.<br/>
                        (데모 버전입니다)
                    </div>
                </div>
            )}

          </div>
        </div>
    );
};

const NavButton = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} style={{ display: "flex", alignItems: "center", padding: "6px 10px", borderRadius: 999, border: active ? "none" : "1px solid #e5e7eb", background: active ? "#2563eb" : "#ffffff", color: active ? "#ffffff" : "#111827", cursor: "pointer", fontSize: 13, gap: 4, boxShadow: active ? "0 4px 10px rgba(37,99,235,0.4)" : "none" }}>{icon}<span>{label}</span></button>
);

const PropertyDetail = ({ property, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", padding: 16, zIndex: 50, overflowY: "auto" }}>
    <div style={{ background: "white", borderRadius: 18, maxWidth: 1000, width: "100%", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{property.address}</div>
        <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}><X size={22} /></button>
      </div>
      <div style={{ padding: 16, overflowY: "auto" }}>
        <div style={{ width: "100%", height: 380, borderRadius: 14, overflow: "hidden", marginBottom: 16, background: "#f3f4f6" }}>
          <iframe src={property.lumaUrl} title="3D Model" style={{ width: "100%", height: "100%", border: "none" }} />
        </div>
        
        {/* 상세 모달에서도 가격 정보는 'room'일 때만 표시 */}
        {property.category === 'room' && property.price && (
            <div style={{ background: "#eff6ff", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 12 }}><DollarSign size={20} color="#2563eb" /><span>가격 정보</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
                <PriceBox label="보증금" value={`${property.price.deposit}만원`} /><PriceBox label="월세" value={`${property.price.monthly}만원`} /><PriceBox label="전세" value={`${property.price.jeonse}만원`} />
              </div>
            </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12, marginBottom: 16 }}>
          <DetailBox icon={<Maximize size={18} color="#16a34a" />} title="면적" main={`${property.area}m²`} />
          <DetailBox icon={<Bed size={18} color="#a855f7" />} title="층수" main={`${property.floor}층`} />
          <DetailBox icon={<Calendar size={18} color="#f97316" />} title="준공" main={`${property.built}년`} sub={`건축 ${new Date().getFullYear() - property.built}년차`} />
          <DetailBox icon={<Clock size={18} color="#2563eb" />} title="이동" main={`${property.commute}분`} sub="학교까지" />
        </div>
        
        {/* 버튼들 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10, marginTop: 8 }}>
          <button style={{ padding: 12, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Heart size={18} color="#ef4444" />찜하기</button>
          <button style={{ padding: 12, borderRadius: 12, border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontWeight: 600 }}>
             {property.category === 'room' ? "문의하기" : "정보 수정 제안"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PriceBox = ({ label, value }) => (
  <div style={{ background: "white", borderRadius: 10, padding: 12, border: "1px solid #e5e7eb" }}>
    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>{value}</div>
  </div>
);

const DetailBox = ({ icon, title, main, sub }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>{icon}<span style={{ fontWeight: 600 }}>{title}</span></div>
    <div style={{ fontSize: 18, fontWeight: 700 }}>{main}</div>
    {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sub}</div>}
  </div>
);

export default UOSRoomFinder;