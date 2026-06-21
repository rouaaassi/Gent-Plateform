"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, GitFork, Clock, Lock, Globe } from "lucide-react";
import { getDashboardTheme } from "./dashboard-theme";
import type { MockRepository } from "../_data/mock-repos";

interface RepositoryCardProps {
  repo: MockRepository;
  isDark: boolean;
  index: number;
  highlighted?: boolean;
}

export default function RepositoryCard({
  repo,
  isDark,
  index,
  highlighted = false,
}: RepositoryCardProps) {
  const t = getDashboardTheme(isDark);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="rounded-lg border p-5 transition-all duration-200"
      style={{
        backgroundColor: t.elevated,
        borderColor: highlighted ? t.accent : t.border,
        boxShadow: highlighted ? `0 0 0 1px ${t.accent}40` : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.accent;
        e.currentTarget.style.boxShadow = t.shadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = highlighted ? t.accent : t.border;
        e.currentTarget.style.boxShadow = highlighted
          ? `0 0 0 1px ${t.accent}40`
          : "none";
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={`/dashboard/repos/${repo.id}`}
              className="text-lg font-semibold hover:underline"
              style={{ color: t.accent }}
            >
              {repo.owner}
              <span style={{ color: t.textMuted }}>/</span>
              {repo.name}
            </Link>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border"
              style={{
                borderColor: t.border,
                color: t.textMuted,
              }}
            >
              {repo.isPrivate ? (
                <>
                  <Lock className="w-3 h-3" />
                  Private
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" />
                  Public
                </>
              )}
            </span>
          </div>

          {repo.description && (
            <p
              className="text-sm mb-3 line-clamp-2"
              style={{ color: t.textMuted }}
            >
              {repo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: repo.languageColor }}
              />
              <span style={{ color: t.textSecondary }}>{repo.language}</span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              style={{ color: t.textMuted }}
            >
              <Star className="w-3.5 h-3.5" />
              {repo.stars}
            </span>
            <span
              className="inline-flex items-center gap-1"
              style={{ color: t.textMuted }}
            >
              <GitFork className="w-3.5 h-3.5" />
              {repo.forks}
            </span>
            <span
              className="inline-flex items-center gap-1"
              style={{ color: t.textMuted }}
            >
              <Clock className="w-3.5 h-3.5" />
              Updated {repo.updatedAt}
            </span>
          </div>
        </div>

        <div
          className="shrink-0 px-2.5 py-1 rounded-md text-xs font-mono border"
          style={{
            borderColor: t.border,
            color: t.textMuted,
            backgroundColor: t.canvas,
          }}
        >
          {repo.defaultBranch}
        </div>
      </div>
    </motion.article>
  );
}
