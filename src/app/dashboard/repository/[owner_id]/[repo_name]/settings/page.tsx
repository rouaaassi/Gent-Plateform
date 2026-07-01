"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Settings,
  Trash2,
  Save,
  AlertTriangle,
  Lock,
  Globe,
  GitBranch
} from "lucide-react";
import Link from "next/link";
import { useRepository, useUpdateRepository, useDeleteRepository } from "@/hooks/use-repositories";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getDashboardTheme } from "@/app/dashboard/_components/dashboard-theme";
import { DASHBOARD_PATH } from "@/routes/path";

export default function RepositorySettingsPage() {
  const params = useParams();
  const router = useRouter();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  
  const ownerId = parseInt(params.owner_id as string);
  const repoName = params.repo_name as string;
  
  const { data: repository, isLoading } = useRepository(ownerId, repoName);
  const updateRepository = useUpdateRepository();
  const deleteRepository = useDeleteRepository();
  
  const [formData, setFormData] = useState({
    name: repository?.name || '',
    description: repository?.description || '',
    is_private: repository?.is_private || false,
    default_branch: repository?.default_branch || 'main'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  const t = getDashboardTheme(isDark);

  if (isLoading || !repository) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateRepository.mutateAsync({
        ownerId,
        repoName,
        data: formData
      });
      // Success handled by react-query
    } catch (error) {
      console.error('Failed to update repository:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== repository.name) return;
    
    try {
      await deleteRepository.mutateAsync({ ownerId, repoName });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to delete repository:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link 
          href={DASHBOARD_PATH.REPOSITORY(ownerId, repoName)}
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: t.textMuted }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: t.text }}>
            Repository Settings
          </h1>
          <p className="text-sm" style={{ color: t.textMuted }}>
            {repository.owner_email.split('@')[0]}/{repository.name}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-6"
          style={{
            backgroundColor: t.elevated,
            borderColor: t.border,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" style={{ color: t.accent }} />
            <h2 className="text-lg font-semibold" style={{ color: t.text }}>
              General
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: t.text }}>
                Repository name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border"
                style={{
                  backgroundColor: t.inputBg,
                  borderColor: t.border,
                  color: t.text,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: t.text }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border resize-none"
                style={{
                  backgroundColor: t.inputBg,
                  borderColor: t.border,
                  color: t.text,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: t.text }}>
                Default branch
              </label>
              <input
                type="text"
                value={formData.default_branch}
                onChange={(e) => setFormData({ ...formData, default_branch: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border"
                style={{
                  backgroundColor: t.inputBg,
                  borderColor: t.border,
                  color: t.text,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: t.text }}>
                Visibility
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.is_private}
                    onChange={() => setFormData({ ...formData, is_private: false })}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: t.text }}>
                      <Globe className="w-4 h-4" />
                      Public
                    </div>
                    <p className="text-xs mt-1" style={{ color: t.textMuted }}>
                      Anyone can see this repository.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.is_private}
                    onChange={() => setFormData({ ...formData, is_private: true })}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: t.text }}>
                      <Lock className="w-4 h-4" />
                      Private
                    </div>
                    <p className="text-xs mt-1" style={{ color: t.textMuted }}>
                      You choose who can see and commit to this repository.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={updateRepository.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: t.accent,
                  color: t.successText,
                }}
              >
                <Save className="w-4 h-4" />
                {updateRepository.isPending ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border p-6"
          style={{
            backgroundColor: isDark ? '#ffeef0' : '#fff5f5',
            borderColor: '#f87171',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-600">
              Danger Zone
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-600 mb-1">
                Delete this repository
              </h3>
              <p className="text-sm text-red-500">
                Once you delete a repository, there is no going back.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete repository
            </button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-lg border p-6"
            style={{
              backgroundColor: t.elevated,
              borderColor: t.border,
            }}
          >
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Delete Repository
            </h3>
            <p className="text-sm mb-4" style={{ color: t.textMuted }}>
              This action cannot be undone. Type <strong>{repository.name}</strong> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={repository.name}
              className="w-full px-3 py-2 mb-4 text-sm rounded-lg border"
              style={{
                backgroundColor: t.inputBg,
                borderColor: t.border,
                color: t.text,
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-sm rounded-lg border"
                style={{
                  borderColor: t.border,
                  color: t.text,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmation !== repository.name || deleteRepository.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteRepository.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}