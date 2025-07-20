import React from "react";
import { MapPin } from "lucide-react";

interface StoreInfoProps {
  name: string;
  address: string;
  distance?: number;
  gameCount?: number;
  isExpanded?: boolean;
}

const StoreInfo: React.FC<StoreInfoProps> = ({
  name,
  address,
  distance,
  gameCount,
  isExpanded = false,
}) => {
  const handleAddressCopy = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        alert("복사를 완료했어요!");
      })
      .catch(() => {
        alert("복사에 실패했습니다.");
      });
  };

  return (
    <div className="flex-1">
      <h3
        className={`font-bold text-gray-900 mb-2 ${
          isExpanded ? "text-xl" : "text-lg"
        }`}
      >
        {name}
      </h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span
            className="text-sm text-gray-600 leading-relaxed underline cursor-pointer hover:text-gray-800 transition-colors"
            onClick={handleAddressCopy}
          >
            {address}
          </span>
        </div>

        {distance !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-600">
              현재 위치에서 {distance.toFixed(2)}km
            </span>
            <span className="text-sm text-blue-600">
              도보 {Math.ceil(distance * 12)}분
            </span>
          </div>
        )}

        {gameCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-600">게임기 {gameCount}대</span>
            <div className="relative group">
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="게임기 수 설명"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 7V11M8 5V5.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal z-50">
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                매장에 설치된 인형뽑기 게임기의 총 개수입니다
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreInfo;
