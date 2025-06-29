"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface GameBusiness {
  id: number;
  사업장명: string | null;
  영업상태명: string | null;
  소재지전화: string | null;
  소재지전체주소: string | null;
  최종수정시점: string | null;
  총게임기수: string | null;
}

interface ApiResponse {
  success: boolean;
  data: GameBusiness[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "stores">(
    "dashboard"
  );
  const router = useRouter();

  // 매장 관리 관련 상태
  const [businesses, setBusinesses] = useState<GameBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // 필터 상태
  const [filters, setFilters] = useState({
    isOperating: "", // '', 'true', 'false'
    hasPhone: "", // '', 'true', 'false'
    addressSearch: "",
    businessNameSearch: "",
    minGameMachines: 0,
    maxGameMachines: 100,
  });

  useEffect(() => {
    const handleAuthentication = () => {
      const password = prompt("관리자 비밀번호를 입력하세요:");

      // 여기에 원하는 비밀번호를 설정하세요
      const ADMIN_PASSWORD = "admin123";

      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        alert("비밀번호가 올바르지 않습니다. 접근이 거부되었습니다.");
        router.push("/");
      }
    };

    handleAuthentication();
  }, [router]);

  // 매장 데이터 가져오기
  const fetchBusinesses = async (page: number = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.isOperating && { isOperating: filters.isOperating }),
        ...(filters.hasPhone && { hasPhone: filters.hasPhone }),
        ...(filters.addressSearch && { addressSearch: filters.addressSearch }),
        ...(filters.businessNameSearch && {
          businessNameSearch: filters.businessNameSearch,
        }),
        minGameMachines: filters.minGameMachines.toString(),
        maxGameMachines: filters.maxGameMachines.toString(),
      });

      const response = await fetch(`/api/admin/game-businesses?${queryParams}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setBusinesses(data.data);
        setPagination(data.pagination);
      } else {
        alert("데이터를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("데이터 로딩 에러:", error);
      alert("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 필터 적용
  const applyFilters = () => {
    fetchBusinesses(1);
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      isOperating: "",
      hasPhone: "",
      addressSearch: "",
      businessNameSearch: "",
      minGameMachines: 0,
      maxGameMachines: 100,
    });
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (activeTab === "stores" && isAuthenticated) {
      fetchBusinesses();
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-lg">인증 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⚙️</div>
              <h1 className="text-2xl font-bold text-gray-900">
                DollCatcher Admin
              </h1>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                router.push("/");
              }}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors border border-gray-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              대시보드
            </button>
            <button
              onClick={() => setActiveTab("stores")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stores"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              매장 관리
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                관리자 대시보드
              </h2>
              <p className="text-gray-600 text-lg">
                DollCatcher 백오피스에 오신 것을 환영합니다!
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎮</div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">
                    등록된 매장
                  </h3>
                  <p className="text-gray-500">매장 관리 탭에서 확인</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">
                    사용자
                  </h3>
                  <p className="text-gray-500">개발 예정</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">
                    통계
                  </h3>
                  <p className="text-gray-500">개발 예정</p>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="text-center bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ✅ 백오피스 페이지 구축 완료!
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                비밀번호 인증을 통해 관리자만 접근할 수 있는 백오피스 페이지가
                성공적으로 구축되었습니다. 매장 관리 탭에서 등록된 매장들을
                확인하고 관리하실 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {activeTab === "stores" && (
          <div className="space-y-6">
            {/* 필터 섹션 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">필터</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* 영업상태 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    영업상태
                  </label>
                  <select
                    value={filters.isOperating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isOperating: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-gray-900"
                  >
                    <option value="">전체</option>
                    <option value="true">영업/정상</option>
                    <option value="false">기타</option>
                  </select>
                </div>

                {/* 전화번호 유무 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호 유무
                  </label>
                  <select
                    value={filters.hasPhone}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasPhone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-gray-900"
                  >
                    <option value="">전체</option>
                    <option value="true">있음</option>
                    <option value="false">없음</option>
                  </select>
                </div>

                {/* 주소 검색 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소 검색
                  </label>
                  <input
                    type="text"
                    value={filters.addressSearch}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        addressSearch: e.target.value,
                      }))
                    }
                    placeholder="주소를 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-gray-900"
                  />
                </div>

                {/* 사업장명 검색 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사업장명 검색
                  </label>
                  <input
                    type="text"
                    value={filters.businessNameSearch}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        businessNameSearch: e.target.value,
                      }))
                    }
                    placeholder="사업장명을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-gray-900"
                  />
                </div>

                {/* 게임기 수 범위 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    총 게임기 수: {filters.minGameMachines} -{" "}
                    {filters.maxGameMachines}
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.minGameMachines}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            minGameMachines: parseInt(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">
                        최소: {filters.minGameMachines}
                      </span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.maxGameMachines}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxGameMachines: parseInt(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">
                        최대: {filters.maxGameMachines}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors"
                >
                  필터 적용
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* 테이블 섹션 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    매장 목록 ({pagination.totalCount}개)
                  </h3>
                  {loading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  )}
                </div>
              </div>

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사업장명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        영업상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        연락처
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        주소
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        매장 데이터 최종수정 시점
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        총게임기수
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {businesses.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.사업장명 || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              business.영업상태명 === "영업/정상"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {business.영업상태명 || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.소재지전화 || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {business.소재지전체주소 || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.최종수정시점 || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.총게임기수 || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      {pagination.totalCount}개 중{" "}
                      {(pagination.currentPage - 1) * pagination.limit + 1}-
                      {Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.totalCount
                      )}
                      개 표시
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          fetchBusinesses(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrevPage || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        이전
                      </button>

                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(1, pagination.currentPage - 2) + i;
                          if (pageNum > pagination.totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => fetchBusinesses(pageNum)}
                              disabled={loading}
                              className={`px-3 py-1 border rounded text-sm ${
                                pageNum === pagination.currentPage
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          fetchBusinesses(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNextPage || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
