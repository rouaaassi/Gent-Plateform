"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleTheme } from "@/store/slices/theme-slice";
import { useProfile } from "@/hooks/use-auth-profile";
import { getStoredToken } from "@/lib/auth-session";
import { hydrateAuth } from "@/store/slices/auth-slice";
import { AUTH_PATH } from "@/routes/path";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";
import NewRepositoryModal from "./NewRepositoryModal";
import { getDashboardTheme } from "./dashboard-theme";
import { MOCK_REPOSITORIES } from "../_data/mock-repos";

type DashboardContextValue = {
  isDark: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRepoId: string | null;
  setSelectedRepoId: (id: string | null) => void;
  openNewRepoModal: () => void;
};

const DashboardCtx = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardCtx);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const token = useSelector((state: RootState) => state.auth.token);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [newRepoOpen, setNewRepoOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const t = getDashboardTheme(isDark);

  useEffect(() => {
    dispatch(hydrateAuth());
    setAuthChecked(true);
  }, [dispatch]);

  const hasToken = !!token || !!getStoredToken();

  useEffect(() => {
    if (!authChecked) return;
    if (!hasToken) {
      router.replace(AUTH_PATH.LOGIN);
    }
  }, [authChecked, hasToken, router]);

  useProfile(authChecked && hasToken);

  const filteredCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_REPOSITORIES.length;
    return MOCK_REPOSITORIES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    ).length;
  }, [searchQuery]);

  if (!authChecked || !hasToken) return null;

  return (
    <DashboardCtx.Provider
      value={{
        isDark,
        searchQuery,
        setSearchQuery,
        selectedRepoId,
        setSelectedRepoId,
        openNewRepoModal: () => setNewRepoOpen(true),
      }}
    >
      <div
        className="min-h-screen flex transition-colors duration-300"
        style={{
          background: t.canvasGradient,
          color: t.text,
        }}
      >
        <DashboardSidebar
          isDark={isDark}
          onToggleTheme={() => dispatch(toggleTheme())}
          onNewRepo={() => setNewRepoOpen(true)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <DashboardTopBar
            isDark={isDark}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNewRepo={() => setNewRepoOpen(true)}
            onToggleTheme={() => dispatch(toggleTheme())}
            onMenuOpen={() => setMobileSidebarOpen(true)}
            repoCount={filteredCount}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>

        <NewRepositoryModal
          isOpen={newRepoOpen}
          onClose={() => setNewRepoOpen(false)}
          isDark={isDark}
        />
      </div>
    </DashboardCtx.Provider>
  );
}
