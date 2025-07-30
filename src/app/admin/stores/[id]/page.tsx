"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface GameBusiness {
  id: number;
  사업장명: string | null;
  영업상태명: string | null;
  소재지전화: string | null;
  소재지전체주소: string | null;
  최종수정시점: string | null;
  총게임기수: string | null;
}

interface Review {
  id: string;
  storeId: number;
  rating: number;
  content: string;
  images: string[];
  tags: string[];
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminStoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  const [store, setStore] = useState<GameBusiness | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // 새 후기 추가 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // 새 후기 폼 데이터
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: "",
    tags: [] as string[],
    userName: "익명",
  });

  const availableTags = [
    "깨끗함", "친절함", "다양한기계", "좋은위치", "주차편리", 
    "저렴함", "분위기좋음", "접근성좋음", "시설좋음", "관리잘됨"
  ];

  // 매장 정보 가져오기
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`/api/stores/${storeId}`);
        if (response.ok) {
          const data = await response.json();
          setStore(data);
        } else {
          console.error("매장 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("매장 정보 로딩 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  // 후기 목록 가져오기
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews?storeId=${storeId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error("후기를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("후기 로딩 에러:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchReviews();
    }
  }, [storeId]);

  // 후기 추가
  const handleAddReview = async () => {
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newReview,
          storeId: parseInt(storeId),
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewReview({ rating: 5, content: "", tags: [], userName: "익명" });
        fetchReviews();
        alert("후기가 추가되었습니다!");
      } else {
        alert("후기 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("후기 추가 에러:", error);
      alert("후기 추가에 실패했습니다.");
    }
  };

  // 후기 수정
  const handleEditReview = async () => {
    if (!editingReview) return;

    try {
      const response = await fetch(`/api/admin/reviews/${editingReview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: editingReview.rating,
          content: editingReview.content,
          tags: editingReview.tags,
          userName: editingReview.userName,
        }),
      });

      if (response.ok) {
        setEditingReview(null);
        fetchReviews();
        alert("후기가 수정되었습니다!");
      } else {
        alert("후기 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("후기 수정 에러:", error);
      alert("후기 수정에 실패했습니다.");
    }
  };

  // 후기 삭제
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("정말로 이 후기를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReviews();
        alert("후기가 삭제되었습니다!");
      } else {
        alert("후기 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("후기 삭제 에러:", error);
      alert("후기 삭제에 실패했습니다.");
    }
  };

  const toggleTag = (tag: string, isNewReview: boolean = true) => {
    if (isNewReview) {
      setNewReview(prev => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    } else if (editingReview) {
      setEditingReview(prev => prev ? {
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">매장을 찾을 수 없습니다</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            돌아가기
          </button>
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
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 돌아가기
              </button>
              <div className="text-3xl">🏪</div>
              <h1 className="text-2xl font-bold text-gray-900">
                {store.사업장명 || `매장 ID: ${store.id}`}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 매장 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">매장 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">매장 ID</p>
              <p className="text-gray-900">{store.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">사업장명</p>
              <p className="text-gray-900">{store.사업장명 || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">영업상태</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                store.영업상태명 === "영업/정상"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {store.영업상태명 || "-"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">연락처</p>
              <p className="text-gray-900">{store.소재지전화 || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500">주소</p>
              <p className="text-gray-900">{store.소재지전체주소 || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">총게임기수</p>
              <p className="text-gray-900">{store.총게임기수 || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">최종수정시점</p>
              <p className="text-gray-900">{store.최종수정시점 || "-"}</p>
            </div>
          </div>
        </div>

        {/* 후기 관리 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                후기 관리 ({reviews.length}개)
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                후기 추가
              </button>
            </div>
          </div>

          {/* 후기 목록 */}
          <div className="p-6">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">후기를 불러오는 중...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">등록된 후기가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingReview(review)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.content}</p>
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {review.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      작성일: {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 새 후기 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">새 후기 추가</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  작성자명
                </label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  별점
                </label>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                      className={`text-2xl ${
                        i < newReview.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  후기 내용
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="이 매장에 대한 후기를 작성해주세요..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그 선택
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag, true)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        newReview.tags.includes(tag)
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewReview({ rating: 5, content: "", tags: [], userName: "익명" });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddReview}
                disabled={!newReview.content.trim()}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 후기 수정 모달 */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">후기 수정</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  작성자명
                </label>
                <input
                  type="text"
                  value={editingReview.userName}
                  onChange={(e) => setEditingReview(prev => prev ? { ...prev, userName: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  별점
                </label>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setEditingReview(prev => prev ? { ...prev, rating: i + 1 } : null)}
                      className={`text-2xl ${
                        i < editingReview.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  후기 내용
                </label>
                <textarea
                  value={editingReview.content}
                  onChange={(e) => setEditingReview(prev => prev ? { ...prev, content: e.target.value } : null)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그 선택
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag, false)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        editingReview.tags.includes(tag)
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleEditReview}
                disabled={!editingReview.content.trim()}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}