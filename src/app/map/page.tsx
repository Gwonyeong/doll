/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Menu, X, Home, Navigation } from "lucide-react";
import Link from "next/link";

// 네이버 지도 타입 정의
declare global {
  interface Window {
    naver: {
      maps: {
        LatLng: new (lat: number, lng: number) => any;
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        Size: new (width: number, height: number) => any;
        Point: new (x: number, y: number) => any;
        Event: {
          addListener: (
            target: any,
            type: string,
            listener: () => void
          ) => void;
        };
        Position: {
          TOP_RIGHT: any;
        };
        ZoomControlStyle: {
          SMALL: any;
        };
      };
    };
  }
}

// 게임업소 데이터 타입
interface GameStore {
  id: number;
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  distance: number;
  status: string;
  category: string;
  gameCount?: number;
  area?: string;
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [stores, setStores] = useState<GameStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<GameStore | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("전체");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5); // 검색 반경 (km)
  const [markers, setMarkers] = useState<any[]>([]); // 마커 관리를 위한 상태 추가
  const [showGameCountInfo, setShowGameCountInfo] = useState(false); // 게임기 수 설명 박스 표시 상태

  // 사용자 위치 가져오기
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);

          if (map) {
            const naverLocation = new window.naver.maps.LatLng(
              location.lat,
              location.lng
            );
            map.setCenter(naverLocation);
            map.setZoom(15);
          }

          // 위치 기반으로 근처 매장 검색
          fetchNearbyStores(location.lat, location.lng);
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          // 기본 위치 (서울 중심)로 매장 검색
          fetchNearbyStores(37.5665, 126.978);
        }
      );
    } else {
      console.error("Geolocation이 지원되지 않습니다.");
      // 기본 위치로 매장 검색
      fetchNearbyStores(37.5665, 126.978);
    }
  };

  // 지도 확대
  const zoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom + 1);
    }
  };

  // 지도 축소
  const zoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom - 1);
    }
  };

  // 근처 매장 데이터 가져오기
  const fetchNearbyStores = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=100`
      );
      const result = await response.json();

      if (result.success) {
        setStores(result.data);
        console.log(`${result.total}개의 근처 매장을 찾았습니다.`);
      } else {
        console.error("매장 데이터를 가져오는데 실패했습니다:", result.error);
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 지도 초기화
  useEffect(() => {
    console.log("Map initialization started");

    if (!mapRef.current) {
      console.error("Map container not found");
      return;
    }

    if (!window.naver) {
      console.error("Naver Maps API not loaded");
      // API 로딩 대기
      const checkNaverMaps = setInterval(() => {
        if (window.naver && window.naver.maps) {
          console.log("Naver Maps API loaded successfully");
          clearInterval(checkNaverMaps);
          initializeMap();
        }
      }, 100);

      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkNaverMaps);
        console.error("Naver Maps API loading timeout");
      }, 10000);

      return;
    }

    initializeMap();

    function initializeMap() {
      if (!mapRef.current || !window.naver) return;

      console.log("Creating map with options");
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 중심
        zoom: 12,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false, // 기본 줌 컨트롤 비활성화
      };

      try {
        const naverMap = new window.naver.maps.Map(mapRef.current, mapOptions);
        console.log("Map created successfully:", naverMap);
        setMap(naverMap);

        // 사용자 위치 가져오기 및 매장 데이터 로드
        getUserLocation();
      } catch (error) {
        console.error("Error creating map:", error);
      }
    }
  }, []);

  // 매장 마커 생성
  useEffect(() => {
    if (!map || !stores.length) return;

    // 기존 마커들 제거
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    // 새 마커들 생성
    const newMarkers: any[] = [];
    stores.forEach((store) => {
      const isSelected = selectedStore?.id === store.id;

      // SVG 아이콘 선택
      const svgIcon = isSelected
        ? `<svg width="42" height="52" viewBox="0 0 42 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.0029 0C32.4391 7.74029e-05 41.7404 9.35688 42 21C40.9757 35.2294 29.2083 45.2322 21.5254 51.5L19.9971 50.2949C12.1201 44.0272 0.98425 34.1249 0 21H0.00585938C0.265411 9.35693 9.56688 0.000159809 21.0029 0Z" fill="#FF2D55"/>
          <path d="M26.1594 13.6348H23.4709V16.2529H25.0051C25.5015 16.253 25.9792 16.431 26.3527 16.751L26.5061 16.8955L31.3986 22.0381C32.0004 22.6707 32.1421 23.6128 31.7512 24.3936L28.2316 31.4199L24.5256 29.5654L27.3947 23.8389L24.1164 20.3955H18.8537L15.5754 23.8389L18.4445 29.5654L14.7385 31.4199L11.2189 24.3936C10.828 23.6128 10.9697 22.6707 11.5715 22.0381L16.4641 16.8955L16.6174 16.751C16.9908 16.4311 17.4678 16.2531 17.9641 16.2529H19.3283V13.6348H16.6408V9.49219H26.1594V13.6348Z" fill="white"/>
        </svg>`
        : `<svg width="42" height="52" viewBox="0 0 42 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.0029 0C32.4391 7.74029e-05 41.7404 9.35688 42 21C40.9757 35.2294 29.2083 45.2322 21.5254 51.5L19.9971 50.2949C12.1201 44.0272 0.98425 34.1249 0 21H0.00585938C0.265411 9.35693 9.56688 0.000159809 21.0029 0Z" fill="#AFB8C7"/>
          <path d="M26.1594 13.6348H23.4709V16.2529H25.0051C25.5015 16.253 25.9792 16.431 26.3527 16.751L26.5061 16.8955L31.3986 22.0381C32.0004 22.6707 32.1421 23.6128 31.7512 24.3936L28.2316 31.4199L24.5256 29.5654L27.3947 23.8389L24.1164 20.3955H18.8537L15.5754 23.8389L18.4445 29.5654L14.7385 31.4199L11.2189 24.3936C10.828 23.6128 10.9697 22.6707 11.5715 22.0381L16.4641 16.8955L16.6174 16.751C16.9908 16.4311 17.4678 16.2531 17.9641 16.2529H19.3283V13.6348H16.6408V9.49219H26.1594V13.6348Z" fill="white"/>
        </svg>`;

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(store.lat, store.lng),
        map: map,
        title: store.name,
        icon: {
          content: `
            <div class="relative">
              <div class="transform hover:scale-110 transition-transform cursor-pointer">
                ${svgIcon}
              </div>
              <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                ${store.distance}km
              </div>
            </div>
          `,
          size: new window.naver.maps.Size(42, 52),
          anchor: new window.naver.maps.Point(21, 52),
        },
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, "click", () => {
        setSelectedStore(store);
        // 클릭한 마커 위치를 지도 중앙으로 이동
        if (map) {
          map.setCenter(
            new window.naver.maps.LatLng(store.lat - 0.002, store.lng)
          );
          map.setZoom(16);
        }
      });

      newMarkers.push(marker);
    });

    // 마커 상태 업데이트
    setMarkers(newMarkers);

    // 사용자 위치 마커
    if (userLocation) {
      const userMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        ),
        map: map,
        title: "내 위치",
        icon: {
          content: `
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
              <div class="w-3 h-3 bg-white rounded-full"></div>
            </div>
          `,
          size: new window.naver.maps.Size(32, 32),
          anchor: new window.naver.maps.Point(16, 16),
        },
      });
      newMarkers.push(userMarker);
    }

    console.log(`${stores.length}개의 매장 마커를 생성했습니다.`);
  }, [map, stores, userLocation, selectedStore]); // selectedStore 의존성 추가

  // 필터링된 매장 목록
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "전체" || store.category.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  // 매장 카테고리 (실제 데이터 기반)
  const categories = ["전체", "게임제공업", "청소년게임제공업"];

  // 반경 변경 핸들러
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchNearbyStores(userLocation.lat, userLocation.lng);
    }
  };

  console.log(selectedStore);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 네이버 지도 */}
      <div ref={mapRef} className="w-full h-full" />

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-gray-700">매장 정보를 불러오는 중...</span>
          </div>
        </div>
      )}

      {/* 상단 검색바 */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-4 left-4 right-4 z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl p-4 glass-effect">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Home size={24} className="text-gray-600" />
              </button>
            </Link>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="매장명이나 주소를 검색해보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="text-sm text-gray-600 px-2">
              {stores.length}개 매장
            </div>
          </div>
        </div>
      </motion.div>

      {/* 사이드 메뉴 */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: isMenuOpen ? 0 : -400 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl z-20 overflow-y-auto"
      >
        <div className="p-6">
          {/* 메뉴 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">DollCatcher</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* 검색 반경 설정 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              검색 반경
            </h3>
            <div className="flex gap-2">
              {[1, 3, 5, 10].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRadiusChange(r)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    radius === r
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              카테고리
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterCategory === category
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 매장 목록 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              매장 목록 ({filteredStores.length})
            </h3>
            <div className="space-y-3">
              {filteredStores.map((store) => (
                <motion.div
                  key={store.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedStore(store);
                    if (map) {
                      map.setCenter(
                        new window.naver.maps.LatLng(store.lat, store.lng)
                      );
                      map.setZoom(16);
                    }
                  }}
                  className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {store.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {store.address}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-500 text-sm font-medium">
                          {store.distance}km
                        </span>
                        {store.gameCount && (
                          <span className="text-xs text-gray-500">
                            게임기 {store.gameCount}대
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-primary font-medium">
                        {store.category}
                      </span>
                    </div>
                    <MapPin size={20} className="text-gray-400 mt-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 선택된 매장 정보 카드 */}
      {selectedStore && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
          style={{
            height: "333px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            boxShadow: "0px -4px 9px 0px #0000001A",
          }}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {selectedStore.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span
                      className="text-sm text-gray-600 leading-relaxed underline cursor-pointer hover:text-gray-800 transition-colors"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(selectedStore.address)
                          .then(() => {
                            alert("복사를 완료했어요!");
                          })
                          .catch(() => {
                            alert("복사에 실패했습니다.");
                          });
                      }}
                    >
                      {selectedStore.address}
                    </span>
                  </div>

                  {selectedStore.phone && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a
                        href={`tel:${selectedStore.phone}`}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {selectedStore.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#3182F8" }}
                    >
                      현재 위치에서 {selectedStore.distance}km 도보{" "}
                      {Math.round(selectedStore.distance * 12)}분
                    </span>
                  </div>

                  {selectedStore.gameCount && (
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          게임기 {selectedStore.gameCount}대
                        </span>
                        <button
                          onClick={() =>
                            setShowGameCountInfo(!showGameCountInfo)
                          }
                          className="ml-1 hover:opacity-70 transition-opacity"
                        >
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="19"
                              height="19"
                              rx="9.5"
                              fill="#EFEFEF"
                            />
                            <path
                              d="M8.58011 11.0552C8.58564 10.5497 8.63812 10.1409 8.73757 9.82873C8.83978 9.51381 8.98066 9.26243 9.16022 9.07459C9.33978 8.88398 9.58011 8.69613 9.88122 8.51105C10.1436 8.35083 10.3522 8.15193 10.5069 7.91436C10.6644 7.6768 10.7431 7.40331 10.7431 7.09392C10.7431 6.83149 10.6809 6.60221 10.5566 6.40608C10.4351 6.20718 10.268 6.05387 10.0552 5.94613C9.84254 5.8384 9.60773 5.78453 9.35083 5.78453C9.11602 5.78453 8.89503 5.83287 8.68785 5.92956C8.48343 6.02624 8.31354 6.1768 8.17818 6.38121C8.04282 6.58287 7.96409 6.83702 7.94199 7.14365H6.87293C6.89227 6.68232 7.01243 6.28315 7.23343 5.94613C7.45718 5.60635 7.75276 5.34668 8.12017 5.16713C8.49033 4.98757 8.90055 4.89779 9.35083 4.89779C9.83149 4.89779 10.2541 4.99447 10.6188 5.18784C10.9862 5.37845 11.2693 5.64365 11.4682 5.98343C11.6699 6.3232 11.7707 6.70718 11.7707 7.13536C11.7707 7.58287 11.6713 7.97099 11.4724 8.29972C11.2735 8.62845 10.9862 8.90884 10.6105 9.14088C10.3591 9.29558 10.1616 9.45442 10.018 9.6174C9.87707 9.78039 9.77348 9.97514 9.70718 10.2017C9.64088 10.4282 9.60497 10.7127 9.59945 11.0552V11.105H8.58011V11.0552ZM9.12707 13.5663C8.99171 13.5663 8.86464 13.5331 8.74586 13.4669C8.62983 13.3978 8.53729 13.3052 8.46823 13.1892C8.40193 13.0732 8.37017 12.9475 8.37293 12.8122C8.37017 12.6768 8.40193 12.5511 8.46823 12.4351C8.53729 12.3191 8.62983 12.2279 8.74586 12.1616C8.86464 12.0925 8.99171 12.058 9.12707 12.058C9.26243 12.058 9.38812 12.0925 9.50414 12.1616C9.62017 12.2279 9.71133 12.3191 9.77762 12.4351C9.84669 12.5511 9.88122 12.6768 9.88122 12.8122C9.88122 12.9475 9.84669 13.0732 9.77762 13.1892C9.71133 13.3052 9.62017 13.3978 9.50414 13.4669C9.38812 13.5331 9.26243 13.5663 9.12707 13.5663Z"
                              fill="#ACACAC"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* 게임기 수 설명 박스 */}
                      {showGameCountInfo && (
                        <div
                          className="absolute top-full mt-2 px-3 py-2 rounded-lg text-xs text-white leading-relaxed whitespace-nowrap z-10"
                          style={{
                            backgroundColor: "#646464",
                            left: "calc(6rem + 8px)", // SVG 아이콘의 왼쪽 끝선과 정렬
                          }}
                        >
                          게임기 수는 인형뽑기 외에도,
                          <br />
                          다른 종류의 오락 기기를 포함한
                          <br />
                          매장 내 모든 게임기의 수를 의미해요.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedStore(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => {
                  // 후기 작성 로직 추가 예정
                  console.log("후기 작성하기 클릭:", selectedStore.name);
                }}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: "#3182F8", color: "white" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                후기 작성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 현재 위치 버튼 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="absolute top-20 right-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:shadow-2xl transition-shadow z-10 border border-gray-200"
        style={{ boxShadow: "0px 0px 4px 2px #0000001A" }}
        onClick={getUserLocation}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="11.995"
            cy="12"
            r="7.25"
            stroke="#8C8C8C"
            strokeWidth="1.5"
          />
          <circle
            cx="11.995"
            cy="12"
            r="3.25"
            stroke="#8C8C8C"
            strokeWidth="1.5"
          />
          <path d="M11.995 0V4" stroke="#8C8C8C" strokeWidth="1.5" />
          <path d="M11.995 20V24" stroke="#8C8C8C" strokeWidth="1.5" />
          <path d="M0 12.0049L4 12.0049" stroke="#8C8C8C" strokeWidth="1.5" />
          <path d="M20 12.0049L24 12.0049" stroke="#8C8C8C" strokeWidth="1.5" />
        </svg>
      </motion.button>

      {/* 지도 확대/축소 버튼 */}
      <div className="absolute top-36 right-4 z-10">
        {/* 확대 버튼 */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="w-12 h-12 bg-white rounded-t-lg flex items-center justify-center hover:shadow-2xl transition-shadow border border-gray-200 border-b-0"
          style={{ boxShadow: "0px 0px 4px 2px #0000001A" }}
          onClick={zoomIn}
        >
          <svg
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="7" stroke="#AFB4B8" strokeWidth="2" />
            <path d="M5 8H11" stroke="#AFB4B8" strokeWidth="2" />
            <path d="M8 11L8 5" stroke="#AFB4B8" strokeWidth="2" />
            <path d="M18 19L13.0503 14.0503" stroke="#AFB4B8" strokeWidth="2" />
          </svg>
        </motion.button>

        {/* 축소 버튼 */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          className="w-12 h-12 bg-white rounded-b-lg flex items-center justify-center hover:shadow-2xl transition-shadow border border-gray-200"
          style={{ boxShadow: "0px 0px 4px 2px #0000001A" }}
          onClick={zoomOut}
        >
          <svg
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="7" stroke="#AFB4B8" strokeWidth="2" />
            <path d="M5 8H11" stroke="#AFB4B8" strokeWidth="2" />
            <path d="M18 19L13.0503 14.0503" stroke="#AFB4B8" strokeWidth="2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
