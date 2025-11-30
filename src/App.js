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
} from "lucide-react";

// ---------------- 샘플 매물 데이터 ----------------
const initialProperties = [
  {
    id: 1,
    address: "휘경동 293-94",
    lat: 37.586422,
    lng: 127.059887,
    price: { deposit: 5000, monthly: 50, jeonse: 15000 },
    area: 25.5,
    floor: 3,
    built: 2018,
    commute: 15,
    lumaUrl:
      "https://lumalabs.ai/embed/c8a7dd2d-3573-424a-9a48-feec67416c26?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
    ],
    description: "서울시립대 도보 15분, 깨끗한 원룸입니다. 풀옵션, 엘리베이터 있음",
  },
  {
    id: 2,
    address: "전농동 123-45",
    lat: 37.5854,
    lng: 127.0458,
    price: { deposit: 3000, monthly: 45, jeonse: 12000 },
    area: 20.3,
    floor: 2,
    built: 2020,
    commute: 10,
    lumaUrl:
      "https://my.matterport.com/show/?m=RsKKA9cRJnj&play=1&ts=0",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    ],
    description: "역세권, 신축 원룸. 깔끔하고 밝은 구조",
  },
  {
    id: 3,
    address: "답십리동 456-78",
    lat: 37.5684,
    lng: 127.0594,
    price: { deposit: 4000, monthly: 55, jeonse: 13000 },
    area: 22.8,
    floor: 5,
    built: 2019,
    commute: 12,
    lumaUrl:
      "https://lumalabs.ai/embed/c8a7dd2d-3573-424a-9a48-feec67416c26?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    description: "넓고 깨끗한 원룸. 채광 좋음",
  },
];

// ---------------- 메인 컴포넌트 ----------------
function UOSRoomFinder() {
  const [currentPage, setCurrentPage] = useState("map");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);

  const [properties] = useState(initialProperties);
  const mapRef = useRef(null);

  // ------ 카카오맵 초기화 로직 ------
  useEffect(() => {
    if (currentPage !== "map") return;
    if (!mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) {
      console.warn("Kakao map script not loaded");
      return;
    }

    const kakao = window.kakao;

    // 기존 내용을 비우고 새로 생성 (페이지 이동 후 복귀 시 중복 방지)
    mapRef.current.innerHTML = "";

    const center = new kakao.maps.LatLng(37.5838, 127.0594); // 서울시립대 근처
    const map = new kakao.maps.Map(mapRef.current, {
      center,
      level: 5,
    });

    // 서울시립대 마커
    const uosPosition = new kakao.maps.LatLng(37.5838, 127.0594);
    const uosMarker = new kakao.maps.Marker({ position: uosPosition });
    uosMarker.setMap(map);

    const uosInfo = new kakao.maps.InfoWindow({
      content:
        '<div style="padding:6px 10px;font-weight:bold;color:#1e40af;">서울시립대학교</div>',
    });
    uosInfo.open(map, uosMarker);

    // 매물 마커(커스텀 오버레이) 추가
    properties.forEach((p) => {
      const pos = new kakao.maps.LatLng(p.lat, p.lng);

      const el = document.createElement("div");
      Object.assign(el.style, {
        background: "#ef4444",
        color: "white",
        padding: "6px 12px",
        borderRadius: "18px",
        fontWeight: "bold",
        fontSize: "13px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
        cursor: "pointer",
        whiteSpace: "nowrap",
      });
      el.innerText = `월 ${p.price.monthly}만`;

      // 클릭 이벤트
      el.addEventListener("click", () => {
        setSelectedProperty(p);
        setShowPropertyDetail(false);
        map.panTo(pos);
      });

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: el,
        yAnchor: 1,
      });
      overlay.setMap(map);
    });
  }, [currentPage, properties]);

  // -------- 내부 페이지 컴포넌트들 (상태 접근을 위해 내부에 정의) --------
  // -------- 로그인 페이지 (수정됨) --------
  const LoginPage = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#eef2ff",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          width: 360,
          boxSizing: "border-box", // 컨테이너에도 추가
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Home size={40} color="#2563eb" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1f2937" }}>
            로그인
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            서울시립대 원룸 찾기
          </div>
        </div>
        
        {/* 입력창 1: 이메일 */}
        <input
          type="email"
          placeholder="이메일"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            marginBottom: 12,
            boxSizing: "border-box", // [핵심] 패딩을 너비에 포함시킴
            fontSize: "14px",
            outline: "none",
          }}
        />
        
        {/* 입력창 2: 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            marginBottom: 20,
            boxSizing: "border-box", // [핵심] 패딩을 너비에 포함시킴
            fontSize: "14px",
            outline: "none",
          }}
        />
        
        {/* 로그인 버튼 */}
        <button
          onClick={() => {
            setIsLoggedIn(true);
            setCurrentPage("map");
            setSelectedProperty(null);
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 700,
            fontSize: "16px",
            cursor: "pointer",
            boxSizing: "border-box", // [핵심] 버튼도 동일하게 처리
            transition: "background 0.2s",
          }}
        >
          로그인
        </button>
      </div>
    </div>
  );

  const MyPage = () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        마이페이지
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0,1fr))",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{ fontWeight: 700, marginBottom: 8, display: "flex", gap: 6 }}
          >
            <User size={18} color="#2563eb" /> 내 정보
          </div>
          <div style={{ fontSize: 14 }}>
            <div>이메일: user@uos.ac.kr</div>
            <div>회원 등급: 일반</div>
          </div>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentPage("map");
              setSelectedProperty(null);
            }}
            style={{
              marginTop: 12,
              width: "100%",
              padding: 8,
              borderRadius: 10,
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{ fontWeight: 700, marginBottom: 8, display: "flex", gap: 6 }}
          >
            <Heart size={18} color="#ef4444" /> 찜한 매물
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>
            찜한 매물이 없습니다.
          </div>
        </div>
      </div>
    </div>
  );

  const AddPropertyPage = () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        매물 등록
      </h2>
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          maxWidth: 640,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            주소
          </div>
          <input
            type="text"
            placeholder="예: 휘경동 293-94"
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
        </div>
        <button
          style={{
            marginTop: 12,
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          등록하기
        </button>
      </div>
    </div>
  );

  // ---------------- 메인 렌더링 ----------------
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f3f4f6",
        fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #e5e7eb",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 50,
          position: "relative",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => {
            setCurrentPage("map");
            setSelectedProperty(null);
            setShowPropertyDetail(false);
          }}
        >
          <Home size={26} color="#2563eb" />
          <span style={{ marginLeft: 8, fontSize: 20, fontWeight: 800 }}>
            서울시립대 원룸
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <NavButton
            active={currentPage === "map"}
            onClick={() => {
              setCurrentPage("map");
              setSelectedProperty(null);
              setShowPropertyDetail(false);
            }}
            label="지도"
            icon={<Home size={18} />}
          />
          {isLoggedIn ? (
            <>
              <NavButton
                active={currentPage === "mypage"}
                onClick={() => setCurrentPage("mypage")}
                label="마이페이지"
                icon={<User size={18} />}
              />
              <NavButton
                active={currentPage === "add"}
                onClick={() => setCurrentPage("add")}
                label="매물 등록"
                icon={<Plus size={18} />}
              />
            </>
          ) : (
            <NavButton
              active={currentPage === "login"}
              onClick={() => setCurrentPage("login")}
              label="로그인"
              icon={<LogIn size={18} />}
            />
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        
        {/* 지도 화면 */}
        {currentPage === "map" && (
          <div style={{ position: "relative", width: "100%", height: "100%", background: "#e5e7eb" }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

            {/* 매물 미리보기 카드 (오버레이) */}
            {selectedProperty && (
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  bottom: 16,
                  margin: "0 auto",
                  maxWidth: 960,
                  background: "#ffffff",
                  borderRadius: 20,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
                  overflow: "hidden",
                  zIndex: 20,
                }}
              >
                <button
                  onClick={() => setSelectedProperty(null)}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "#ffffff",
                    borderRadius: "999px",
                    border: "1px solid #e5e7eb",
                    padding: 4,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                >
                  <X size={18} />
                </button>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ flex: 1, minHeight: 260, background: "#f3f4f6" }}>
                    <iframe
                      src={selectedProperty.lumaUrl}
                      title="3D Model Preview"
                      style={{ width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>

                  <div style={{ flex: 1, padding: 20, boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                          {selectedProperty.address}
                        </div>
                        <div style={{ fontSize: 13, color: "#4b5563", marginBottom: 4 }}>
                          {selectedProperty.description}
                        </div>
                      </div>
                      <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#ef4444" }}>
                        <Heart size={22} />
                      </button>
                    </div>

                    <div style={{ background: "#eff6ff", borderRadius: 12, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <div>
                        <div style={{ color: "#6b7280", fontSize: 11 }}>보증금</div>
                        <div style={{ fontWeight: 700, color: "#2563eb", fontSize: 18 }}>
                          {selectedProperty.price.deposit}만
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "#6b7280", fontSize: 11 }}>월세</div>
                        <div style={{ fontWeight: 700, color: "#2563eb", fontSize: 18 }}>
                          {selectedProperty.price.monthly}만
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8, fontSize: 13, marginBottom: 10 }}>
                      <InfoChip icon={<Maximize size={14} color="#16a34a" />} text={`${selectedProperty.area}m²`} />
                      <InfoChip icon={<Clock size={14} color="#6366f1" />} text={`통학 ${selectedProperty.commute}분`} />
                      <InfoChip icon={<Bed size={14} color="#f97316" />} text={`${selectedProperty.floor}층`} />
                      <InfoChip icon={<Calendar size={14} color="#2563eb" />} text={`${selectedProperty.built}년`} />
                    </div>

                    <button
                      onClick={() => setShowPropertyDetail(true)}
                      style={{
                        width: "100%",
                        padding: "10px 0",
                        borderRadius: 12,
                        border: "none",
                        background: "#2563eb",
                        color: "white",
                        fontWeight: 600,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: "pointer",
                      }}
                    >
                      자세히 보기
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === "login" && <LoginPage />}
        {currentPage === "mypage" && <MyPage />}
        {currentPage === "add" && <AddPropertyPage />}
      </main>

      {/* 상세 모달 (전체 화면 덮음) */}
      {showPropertyDetail && selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setShowPropertyDetail(false)}
        />
      )}
    </div>
  );
}

// --------- 1. 상세 모달 (PropertyDetail) ---------
// 이 컴포넌트가 없어서 에러가 발생했습니다. 여기 추가했습니다.
const PropertyDetail = ({ property, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      zIndex: 50,
      overflowY: "auto",
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: 18,
        maxWidth: 1000,
        width: "100%",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700 }}>{property.address}</div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={22} />
        </button>
      </div>

      <div style={{ padding: 16, overflowY: "auto" }}>
        <div
          style={{
            width: "100%",
            height: 380,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 16,
            background: "#f3f4f6",
          }}
        >
          <iframe
            src={property.lumaUrl}
            title="3D Model"
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        <div
          style={{
            background: "#eff6ff",
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            <DollarSign size={20} color="#2563eb" />
            <span>가격 정보</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: 10,
            }}
          >
            <PriceBox label="보증금" value={`${property.price.deposit}만원`} />
            <PriceBox label="월세" value={`${property.price.monthly}만원`} />
            <PriceBox label="전세" value={`${property.price.jeonse}만원`} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <DetailBox
            icon={<Maximize size={18} color="#16a34a" />}
            title="전용 면적"
            main={`${property.area}m²`}
            sub={`약 ${Math.round(property.area * 0.3025)}평`}
          />
          <DetailBox
            icon={<Bed size={18} color="#a855f7" />}
            title="층수"
            main={`${property.floor}층`}
          />
          <DetailBox
            icon={<Calendar size={18} color="#f97316" />}
            title="준공년도"
            main={`${property.built}년`}
            sub={`건축 ${new Date().getFullYear() - property.built}년차`}
          />
          <DetailBox
            icon={<Clock size={18} color="#2563eb" />}
            title="통학 시간"
            main={`${property.commute}분`}
            sub="도보 기준"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>매물 사진</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: 8,
            }}
          >
            {property.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`매물 사진 ${idx + 1}`}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
            gap: 10,
            marginTop: 8,
          }}
        >
          <button
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Heart size={18} color="#ef4444" />
            찜하기
          </button>
          <button
            style={{
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            문의하기
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --------- 2. 기타 보조 컴포넌트들 ---------
const NavButton = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 999,
      border: active ? "none" : "1px solid #e5e7eb",
      background: active ? "#2563eb" : "#ffffff",
      color: active ? "#ffffff" : "#111827",
      cursor: "pointer",
      fontSize: 13,
      gap: 4,
      boxShadow: active ? "0 4px 10px rgba(37,99,235,0.4)" : "none",
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const InfoChip = ({ icon, text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "#f3f4f6",
      borderRadius: 8,
      padding: "6px 8px",
    }}
  >
    {icon}
    <span>{text}</span>
  </div>
);

const PriceBox = ({ label, value }) => (
  <div
    style={{
      background: "white",
      borderRadius: 10,
      padding: 12,
      border: "1px solid #e5e7eb",
    }}
  >
    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>
      {value}
    </div>
  </div>
);

const DetailBox = ({ icon, title, main, sub }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
    }}
  >
    <div
      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}
    >
      {icon}
      <span style={{ fontWeight: 600 }}>{title}</span>
    </div>
    <div style={{ fontSize: 18, fontWeight: 700 }}>{main}</div>
    {sub && (
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sub}</div>
    )}
  </div>
);

export default UOSRoomFinder;