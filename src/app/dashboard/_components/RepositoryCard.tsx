"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, GitFork, Clock, Lock, Globe, GitBranch } from "lucide-react";
import { getDashboardTheme } from "./dashboard-theme";
import { Repository } from "@/types/repository";
import { DASHBOARD_PATH } from "@/routes/path";

interface RepositoryCardProps {
  repo: Repository;
  isDark: boolean;
  index: number;
  highlighted?: boolean;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
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
              href={DASHBOARD_PATH.REPOSITORY(repo.owner_id, repo.name)}
              className="text-lg font-semibold hover:underline"
              style={{ color: t.accent }}
            >
              <span style={{ color: t.textMuted }}>{repo.owner_email.split('@')[0]}/</span>
              {repo.name}
            </Link>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border"
              style={{
                borderColor: t.border,
                color: t.textMuted,
              }}
            >
              {repo.is_private ? (
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
            <span
              className="inline-flex items-center gap-1"
              style={{ color: t.textMuted }}
            >
              <GitBranch className="w-3.5 h-3.5" />
              {repo.default_branch}
            </span>
            <span
              className="inline-flex items-center gap-1"
              style={{ color: t.textMuted }}
            >
              <Clock className="w-3.5 h-3.5" />
              Updated {getRelativeTime(repo.updated_at)}
            </span>
            <span
              className="text-xs"
              style={{ color: t.textMuted }}
            >
              Created {getRelativeTime(repo.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="shrink-0 px-2.5 py-1 rounded-md text-xs font-mono border"
            style={{
              borderColor: t.border,
              color: t.textMuted,
              backgroundColor: t.canvas,
            }}
          >
            ID: {repo.id}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
