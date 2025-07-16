"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Star, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function ReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const [userRating, setUserRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 임시 가게 정보
  const storeName = "인형뽑다방";

  // 태그 선택/해제 핸들러
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      toast("키워드는 최대 5개까지 선택할 수 있어요");
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        if (uploadedImages.length + newImages.length < 4) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string);
              if (
                newImages.length === files.length ||
                uploadedImages.length + newImages.length === 4
              ) {
                setUploadedImages((prev) =>
                  [...prev, ...newImages].slice(0, 4)
                );
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 -m-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">{storeName}</h1>
        </div>
      </div>

      {/* 평점 섹션 */}
      <div className="p-6 text-center border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">매장에서 즐거우셨나요?</h2>
        <div className="flex justify-center items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setUserRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                size={32}
                className={
                  star <= userRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">
          최대 5개 키워드까지 선택할 수 있어요
        </p>
      </div>

      {/* 태그 선택 섹션 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-4">어떤 점이 좋았나요?</h3>

        {/* 기기/상품 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 leading-none tracking-tight">
            기기/상품
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "기기 상태가 좋아요",
              "상품이 다양해요",
              "신상품이 자주 들어와요",
              "고장 없이 잘 작동해요",
              "인기 캐릭터가 많아요",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 가격/혜택 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 leading-none tracking-tight">
            가격/혜택
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "가격이 저렴해요",
              "이벤트/서비스가 좋아요",
              "경품 교환이 쉬워요",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 분위기/환경 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3  leading-none tracking-tight">
            분위기/환경
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "매장이 깨끗해요",
              "사진 찍기 좋아요",
              "분위기가 좋아요",
              "가족끼리 가기 좋아요",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 접근성 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 leading-none tracking-tight">
            접근성
          </h4>
          <div className="flex flex-wrap gap-2">
            {["위치가 좋아요", "주차하기 편해요", "찾기 쉬워요"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          선택한 태그: {selectedTags.length}/5
        </p>
      </div>

      {/* 리뷰 더보기 안내 */}
      <div className="p-6 border-t border-gray-100">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            매장 리뷰를 10자 이상 써주세요.
          </p>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="예) 신품이 다양하고 신신품도 자주 들어와요! 분위기도 좋았어요."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {reviewText.length}/200
          </p>
        </div>

        {/* 리뷰 작성 CTA */}
        <div className="bg-blue-50 rounded-lg p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* 업로드된 이미지들 */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`업로드된 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadedImages.length >= 4}
            className={`flex items-center justify-center gap-2 font-medium mx-auto ${
              uploadedImages.length >= 4
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            <span className="text-2xl">+</span>
            <span>사진 올리기 ({uploadedImages.length}/4)</span>
          </button>
          <p className="text-xs text-gray-500 mt-2">
            매장과 관련없는 사진을 올리면 리뷰가 삭제될 수 있어요.
          </p>
        </div>

        {/* 완료 버튼 */}
        <button
          className={`w-full mt-6 py-3 rounded-lg font-medium transition-all ${
            userRating > 0 && selectedTags.length > 0 && reviewText.length >= 10
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={
            userRating === 0 ||
            selectedTags.length === 0 ||
            reviewText.length < 10
          }
          onClick={async () => {
            if (
              userRating > 0 &&
              selectedTags.length > 0 &&
              reviewText.length >= 10
            ) {
              try {
                const response = await fetch("/api/reviews", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    storeId,
                    rating: userRating,
                    content: reviewText,
                    tags: selectedTags,
                    images: uploadedImages,
                  }),
                });

                const result = await response.json();

                if (result.success) {
                  alert("리뷰가 성공적으로 등록되었습니다!");
                  router.back();
                } else {
                  alert(result.error || "리뷰 등록에 실패했습니다.");
                }
              } catch (error) {
                console.error("리뷰 제출 에러:", error);
                alert("리뷰 등록 중 오류가 발생했습니다.");
              }
            }
          }}
        >
          완료
        </button>
      </div>
    </div>
  );
}
