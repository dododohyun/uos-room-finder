# 🗺️ UOS Living Map (서울시립대 주거 안심 & 공간정보 갱신 플랫폼)

> **2025B 사진측량학 기말 팀 프로젝트** > 수치지도 갱신 및 영상기반 공간정보 구축을 통한 특화된 공간 콘텐츠 제작

![Project Status](https://img.shields.io/badge/Status-Prototype-blue) ![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react) ![KakaoMap](https://img.shields.io/badge/KakaoMap-API-ffcd00)

## 📖 프로젝트 개요

**UOS Living Map**은 기존 포털 지도가 제공하지 못하는 **서울시립대 주변의 최신 골목 정보와 주거 안전 데이터**를 학생들이 직접 갱신하고 공유하는 플랫폼입니다.

단순한 원룸 매물 검색을 넘어, **직접 촬영한 3D 모델(Luma AI)**과 **안전 시설(CCTV, 가로등)** 정보를 통합하여 **"안심하고 살 수 있는 주거 지도"**를 구축하는 것을 목표로 합니다.

## ✨ 주요 기능

### 1. 🛡️ 안심 주거 지도 (Safety Map)
- **레이어 필터링:** 원룸 매물, 신축 건물, 안심 시설(CCTV/가로등), 안심 귀갓길 등 원하는 정보만 지도 위에 시각화합니다.
- **안심 귀갓길 안내:** 학교 주변 어두운 골목길 대신, 조명이 밝고 CCTV가 설치된 안전한 경로를 시각적으로 제공합니다.

### 2. 🏗️ 영상 기반 공간정보 구축 (3D Integration)
- **3D 모델 뷰어:** Luma AI로 촬영한 건물 및 골목길의 3D 모델을 앱 내에서 바로 확인할 수 있습니다.
- **상세 정보 카드:** 건물의 외관, 층수, 건축 연도, 안전 시설 유무 등 상세 속성 정보를 제공합니다.

### 3. 🔄 사용자 참여형 지도 갱신 (Map Updating)
- **지도 정보 신고:** 신축 건물 발견, 도로 파손, 가로등 고장 등 지도와 다른 정보를 사용자가 직접 제보합니다.
- **데이터 업로드:** 스마트폰으로 촬영한 현장 사진과 3D 모델 URL을 등록하여 지도를 최신 상태로 유지합니다.

### 4. 👤 기여도 기반 마이페이지 (Gamification)
- **기여 레벨 시스템:** 지도 갱신 활동(신고, 등록)에 따라 경험치를 획득하고 레벨이 상승합니다.
- **활동 내역 관리:** 내가 제보한 내역의 승인 상태와 기여 현황을 한눈에 볼 수 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend:** React.js
- **Map API:** Kakao Maps SDK
- **3D Viewer:** Luma AI WebGL Embed
- **UI Components:** Lucide React (Icons), Inline CSS (Custom Design)

---

## 🚀 실행 방법 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계가 필요합니다.

### 1. 저장소 클론 및 패키지 설치
```bash
git clone [레포지토리 주소]
cd [프로젝트 폴더명]
npm install
