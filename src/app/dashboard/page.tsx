"use client";

import { useMemo, useState } from "react";
import { Filter, SortAsc, FolderGit2 } from "lucide-react";
import { useDashboard } from "./_components/DashboardContext";
import RepositoryCard from "./_components/RepositoryCard";
import { getDashboardTheme } from "./_components/dashboard-theme";

type SortKey = "updated" | "name" | "stars";

export default function DashboardPage() {
  const {
    isDark,
    searchQuery,
    selectedRepoId,
    openNewRepoModal,
    repositories,
    reposLoading,
  } = useDashboard();
  const [sortBy, setSortBy] = useState<SortKey>("updated");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">(
    "all",
  );

  const t = getDashboardTheme(isDark);

  const filteredRepositories = useMemo(() => {
    let list = [...repositories];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.language.toLowerCase().includes(q),
      );
    }

    if (filterType === "public") list = list.filter((r) => !r.isPrivate);
    if (filterType === "private") list = list.filter((r) => r.isPrivate);

    if (selectedRepoId) {
      const selected = list.find((r) => r.id === selectedRepoId);
      if (selected) {
        list = [selected, ...list.filter((r) => r.id !== selectedRepoId)];
      }
    }

    switch (sortBy) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "stars":
        list.sort((a, b) => b.stars - a.stars);
        break;
      default:
        break;
    }

    return list;
  }, [repositories, searchQuery, filterType, sortBy, selectedRepoId]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: t.text }}
          >
            Repositories
          </h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>
            Overview of your version-controlled projects — API wiring coming
            soon.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewRepoModal}
          className="self-start sm:self-auto px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg"
          style={{
            background: t.accentGradient,
            color: t.successText,
          }}
        >
          New repository
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: repositories.length },
          {
            label: "Public",
            value: repositories.filter((r) => !r.isPrivate).length,
          },
          {
            label: "Private",
            value: repositories.filter((r) => r.isPrivate).length,
          },
          {
            label: "Languages",
            value: new Set(repositories.map((r) => r.language)).size,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border px-4 py-3"
            style={{
              backgroundColor: t.elevated,
              borderColor: t.border,
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: t.textMuted }}
            >
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-0.5" style={{ color: t.text }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-2 mb-5 p-2 rounded-lg border"
        style={{
          backgroundColor: t.elevated,
          borderColor: t.border,
        }}
      >
        <Filter className="w-4 h-4 ml-1" style={{ color: t.textMuted }} />
        {(["all", "public", "private"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className="px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors"
            style={{
              backgroundColor:
                filterType === type ? t.sidebarActive : "transparent",
              color: filterType === type ? t.text : t.textMuted,
            }}
          >
            {type}
          </button>
        ))}
        <div
          className="w-px h-5 mx-1 hidden sm:block"
          style={{ backgroundColor: t.border }}
        />
        <SortAsc className="w-4 h-4" style={{ color: t.textMuted }} />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="text-xs font-medium rounded-md border px-2 py-1.5 outline-none cursor-pointer"
          style={{
            backgroundColor: t.inputBg,
            borderColor: t.border,
            color: t.textSecondary,
          }}
        >
          <option value="updated">Last updated</option>
          <option value="name">Name</option>
          <option value="stars">Stars</option>
        </select>
      </div>

      {/* Repository list */}
      {reposLoading ? (
        <div
          className="flex items-center justify-center py-16 px-6 rounded-xl border text-center"
          style={{
            backgroundColor: t.elevated,
            borderColor: t.border,
          }}
        >
          <p className="text-sm" style={{ color: t.textMuted }}>
            Loading repositories…
          </p>
        </div>
      ) : filteredRepositories.length > 0 ? (
        <div className="space-y-3">
          {filteredRepositories.map((repo, index) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              isDark={isDark}
              index={index}
              highlighted={selectedRepoId === repo.id}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border text-center"
          style={{
            backgroundColor: t.elevated,
            borderColor: t.border,
          }}
        >
          <FolderGit2
            className="w-12 h-12 mb-4 opacity-40"
            style={{ color: t.textMuted }}
          />
          <h3 className="text-lg font-semibold mb-1" style={{ color: t.text }}>
            No repositories found
          </h3>
          <p className="text-sm max-w-sm mb-4" style={{ color: t.textMuted }}>
            {searchQuery
              ? "Try a different search term or clear filters."
              : "Create your first repository to get started with Gent."}
          </p>
          <button
            type="button"
            onClick={openNewRepoModal}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg"
            style={{
              background: t.accentGradient,
              color: t.successText,
            }}
          >
            Create repository
          </button>
        </div>
      )}
    </div>
  );
}
