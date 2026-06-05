"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GitBranch,
  Plus,
  Settings,
  BookOpen,
  ChevronDown,
  Lock,
  Globe,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getDashboardTheme } from "./dashboard-theme";
import type { MockRepository } from "../_data/mock-repos";
import ProfileDropdown from "./ProfileDropdown";
import { DASHBOARD_PATH } from "@/routes/path";
import { cn } from "@/lib/utils";
import { getDisplayName, getInitials, getUsername } from "@/lib/user-display";

interface DashboardSidebarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNewRepo: () => void;
  selectedRepoId: string | null;
  onSelectRepo: (id: string) => void;
  repositories: MockRepository[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardSidebar({
  isDark,
  onToggleTheme,
  onNewRepo,
  selectedRepoId,
  onSelectRepo,
  repositories,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const t = getDashboardTheme(isDark);
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    {
      href: DASHBOARD_PATH.ROOT,
      label: "Repositories",
      icon: BookOpen,
      active: pathname === DASHBOARD_PATH.ROOT,
    },
    {
      href: DASHBOARD_PATH.SETTINGS,
      label: "Settings",
      icon: Settings,
      active: pathname === DASHBOARD_PATH.SETTINGS,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Profile header */}
      <div
        className="relative p-4 border-b shrink-0"
        style={{ borderColor: t.border }}
        ref={profileRef}
      >
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="absolute top-3 right-3 p-1 rounded-md lg:hidden"
            style={{ color: t.textMuted }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-3 w-full p-2 -m-2 rounded-lg transition-colors text-left group"
          style={{ color: t.text }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = t.sidebarHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ring-2 ring-transparent group-hover:opacity-90 transition-all"
            style={{
              background: t.avatarGradient,
              color: t.successText,
            }}
          >
            {getInitials(user)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {getDisplayName(user)}
            </p>
            <p className="text-xs truncate" style={{ color: t.textMuted }}>
              @{getUsername(user)}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 shrink-0 transition-transform",
              profileOpen && "rotate-180",
            )}
            style={{ color: t.textMuted }}
          />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <ProfileDropdown
              isDark={isDark}
              onToggleTheme={() => {
                onToggleTheme();
                setProfileOpen(false);
              }}
              onClose={() => setProfileOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Primary nav */}
      <nav className="px-3 py-3 space-y-0.5 shrink-0">
        {navItems.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            onClick={onMobileClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: active ? t.sidebarActive : "transparent",
              color: active ? t.text : t.textSecondary,
            }}
            onMouseEnter={(e) => {
              if (!active)
                e.currentTarget.style.backgroundColor = t.sidebarHover;
            }}
            onMouseLeave={(e) => {
              if (!active)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-2">
        <div className="h-px" style={{ backgroundColor: t.border }} />
      </div>

      {/* Repository list */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 min-h-0">
        <div className="flex items-center justify-between px-2 mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: t.textMuted }}
          >
            Repositories
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: t.sidebarActive,
              color: t.textMuted,
            }}
          >
            {repositories.length}
          </span>
        </div>

        <ul className="space-y-0.5">
          {repositories.map((repo) => {
            const isSelected = selectedRepoId === repo.id;
            return (
              <li key={repo.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectRepo(repo.id);
                    onMobileClose?.();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-left transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? t.sidebarActive
                      : "transparent",
                    color: isSelected ? t.text : t.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor = t.sidebarHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {repo.isPrivate ? (
                    <Lock className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  )}
                  <span className="truncate font-medium">{repo.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer actions */}
      <div
        className="p-3 space-y-2 border-t shrink-0"
        style={{ borderColor: t.border }}
      >
        <button
          type="button"
          onClick={() => {
            onNewRepo();
            onMobileClose?.();
          }}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg"
          style={{
            background: t.accentGradient,
            color: t.successText,
          }}
        >
          <Plus className="w-4 h-4" />
          New repository
        </button>

        <Link
          href={DASHBOARD_PATH.SETTINGS}
          onClick={onMobileClose}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium border transition-colors"
          style={{
            borderColor: t.border,
            color: t.textSecondary,
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = t.sidebarHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>

      {/* Brand mark */}
      <div
        className="px-4 py-3 border-t flex items-center gap-2 shrink-0"
        style={{ borderColor: t.border }}
      >
        <GitBranch className="w-5 h-5" style={{ color: t.iconAccent }} />
        <span className="text-sm font-bold" style={{ color: t.text }}>
          Gent
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[260px] shrink-0 border-r h-screen sticky top-0 backdrop-blur-xl"
        style={{
          backgroundColor: t.surface,
          borderColor: t.border,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] border-r lg:hidden flex flex-col backdrop-blur-xl"
              style={{
                backgroundColor: t.surface,
                borderColor: t.border,
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
