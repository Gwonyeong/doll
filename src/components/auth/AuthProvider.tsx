"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface User {
  id: string;
  tossId: string;
  nickname: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/api/auth/user");

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        // 401 에러 시 로그인 페이지로 리다이렉트 (단, 이미 로그인 페이지가 아닌 경우에만)
        setUser(null);
        if (pathname !== "/login") {
          const returnUrl = encodeURIComponent(pathname);
          router.push(`/login?returnUrl=${returnUrl}`);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
