"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  Star,
  Lock,
  Globe,
  GitBranch,
  Settings,
  Tag,
  Plus,
} from "lucide-react";
import { useDashboard } from "../../_components/DashboardContext";
import { getDashboardTheme } from "../../_components/dashboard-theme";
import type { MockRepository } from "../../_data/mock-repos";
import { MOCK_REPOSITORIES } from "../../_data/mock-repos";

interface RepositoryDetailsClientProps {
  params: {
    owner: string;
    repo: string;
  };
}

export default function RepositoryDetailsClient({
  params,
}: RepositoryDetailsClientProps) {
  const { owner, repo } = params;
  const { isDark, repositories } = useDashboard();
  const theme = getDashboardTheme(isDark);

  const repository = useMemo<MockRepository | undefined>(() => {
    return (
      repositories.find((item) => item.owner === owner && item.name === repo) ??
      MOCK_REPOSITORIES.find(
        (item) => item.owner === owner && item.name === repo,
      )
    );
  }, [owner, repo, repositories]);

  if (!repository) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <div
          className="rounded-3xl border p-10"
          style={{ backgroundColor: theme.elevated, borderColor: theme.border }}
        >
          <h1 className="text-2xl font-bold mb-3" style={{ color: theme.text }}>
            Repository not found
          </h1>
          <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
            لا يوجد معلومات عن هذا الريبو. تأكد من الرابط وحاول مرة أخرى.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
            style={{
              background: theme.accentGradient,
              color: theme.successText,
            }}
          >
            <ArrowLeft className="w-4 h-4" /> العودة إلى الريبو
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-sm uppercase tracking-[0.3em] mb-2"
            style={{ color: theme.accent }}
          >
            Repository details
          </p>
          <h1 className="text-3xl font-semibold" style={{ color: theme.text }}>
            {repository.owner}/{repository.name}
          </h1>
          <p
            className="mt-3 max-w-2xl text-sm leading-7"
            style={{ color: theme.textMuted }}
          >
            {repository.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: theme.border,
              color: theme.textSecondary,
              backgroundColor: theme.surface,
            }}
          >
            <ArrowLeft className="w-4 h-4" /> العودة إلى كل الريبو
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: theme.accentGradient,
              color: theme.successText,
            }}
          >
            <Tag className="w-4 h-4" /> Create tag
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="space-y-6">
          <section
            className="rounded-3xl border p-6"
            style={{
              backgroundColor: theme.elevated,
              borderColor: theme.border,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-[0.25em] mb-1"
                  style={{ color: theme.textMuted }}
                >
                  Overview
                </p>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: theme.text }}
                >
                  Repository summary
                </h2>
              </div>
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
              >
                <GitBranch className="w-3.5 h-3.5" /> {repository.defaultBranch}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.canvas,
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.25em] mb-2"
                  style={{ color: theme.textMuted }}
                >
                  Visibility
                </p>
                <div
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {repository.isPrivate ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  {repository.isPrivate ? "Private" : "Public"}
                </div>
              </div>
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.canvas,
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.25em] mb-2"
                  style={{ color: theme.textMuted }}
                >
                  Language
                </p>
                <div
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: repository.languageColor }}
                  />
                  {repository.language}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.25em] mb-2"
                  style={{ color: theme.textMuted }}
                >
                  Stars
                </p>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: theme.text }}
                >
                  {repository.stars}
                </p>
              </div>
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.25em] mb-2"
                  style={{ color: theme.textMuted }}
                >
                  Forks
                </p>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: theme.text }}
                >
                  {repository.forks}
                </p>
              </div>
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.25em] mb-2"
                  style={{ color: theme.textMuted }}
                >
                  Updated
                </p>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: theme.text }}
                >
                  {repository.updatedAt}
                </p>
              </div>
            </div>
          </section>

          <section
            className="rounded-3xl border p-6"
            style={{
              backgroundColor: theme.elevated,
              borderColor: theme.border,
            }}
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p
                  className="text-sm font-semibold uppercase tracking-[0.25em] mb-1"
                  style={{ color: theme.textMuted }}
                >
                  Owner
                </p>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: theme.text }}
                >
                  {repository.owner}
                </h3>
              </div>
              <div
                className="rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                }}
              >
                {repository.owner}@gent.dev
              </div>
            </div>
            <p className="text-sm leading-7" style={{ color: theme.textMuted }}>
              هذا المستودع يتم إدارته محليًا من بيانات العرض الحالية. يمكنك
              الرجوع فورًا إلى صفحة الريبو أو إنشاء فرع جديد، تاك أو ضبط
              الإعدادات.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <section
            className="rounded-3xl border p-6"
            style={{
              backgroundColor: theme.elevated,
              borderColor: theme.border,
            }}
          >
            <h2
              className="text-base font-semibold mb-4"
              style={{ color: theme.text }}
            >
              Quick actions
            </h2>
            <div className="space-y-3">
              {[
                { label: "Create Branch", icon: Plus },
                { label: "Create Commit", icon: Star },
                { label: "Create Tag", icon: Tag },
                { label: "Repository Settings", icon: Settings },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    className="w-full inline-flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors"
                    style={{
                      borderColor: theme.border,
                      color: theme.text,
                      backgroundColor: theme.surface,
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="w-4 h-4" /> {action.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.textMuted }}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="rounded-3xl border p-6"
            style={{
              backgroundColor: theme.elevated,
              borderColor: theme.border,
            }}
          >
            <h2
              className="text-base font-semibold mb-4"
              style={{ color: theme.text }}
            >
              Repository information
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: theme.textMuted }}>Name</span>
                <span style={{ color: theme.text }}>{repository.name}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: theme.textMuted }}>Owner</span>
                <span style={{ color: theme.text }}>{repository.owner}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: theme.textMuted }}>Default branch</span>
                <span style={{ color: theme.text }}>
                  {repository.defaultBranch}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: theme.textMuted }}>Visibility</span>
                <span style={{ color: theme.text }}>
                  {repository.isPrivate ? "Private" : "Public"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span style={{ color: theme.textMuted }}>Updated</span>
                <span style={{ color: theme.text }}>
                  {repository.updatedAt}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
