"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Globe, Info } from "lucide-react";
import { getDashboardTheme } from "./dashboard-theme";

interface NewRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onCreate: (repo: {
    name: string;
    description: string;
    isPrivate: boolean;
  }) => Promise<void>;
}

export default function NewRepositoryModal({
  isOpen,
  onClose,
  isDark,
  onCreate,
}: NewRepositoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const t = getDashboardTheme(isDark);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleCreate = async () => {
    setErrorMessage("");
    if (!name.trim()) {
      setErrorMessage("Repository name is required.");
      return;
    }

    setIsCreating(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        isPrivate,
      });
      setName("");
      setDescription("");
      setIsPrivate(false);
      onClose();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to create repository.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-full max-w-lg rounded-xl border shadow-2xl"
              style={{
                backgroundColor: t.elevated,
                borderColor: t.border,
                boxShadow: t.shadow,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: t.border }}
              >
                <h2 className="text-lg font-semibold" style={{ color: t.text }}>
                  Create a new repository
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: t.textMuted }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 py-5 space-y-4">
                <p className="text-sm" style={{ color: t.textMuted }}>
                  Repositories contain your project files and version history.
                  Connect to{" "}
                  <code
                    className="px-1.5 py-0.5 rounded text-xs font-mono"
                    style={{
                      backgroundColor: t.sidebarActive,
                      color: t.textSecondary,
                    }}
                  >
                    POST /api/repos/create/
                  </code>{" "}
                  when ready.
                </p>

                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: t.text }}
                  >
                    Repository name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="my-awesome-repo"
                    className="w-full px-3 py-2 text-sm rounded-md border outline-none transition-colors focus:ring-2"
                    style={{
                      backgroundColor: t.inputBg,
                      borderColor: t.border,
                      color: t.text,
                    }}
                  />
                </div>

                {errorMessage ? (
                  <div
                    className="rounded-md border px-3 py-2 text-sm text-red-500"
                    style={{
                      borderColor: "#fca5a5",
                      backgroundColor: "#fee2e2",
                    }}
                  >
                    {errorMessage}
                  </div>
                ) : null}

                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: t.text }}
                  >
                    Description{" "}
                    <span
                      className="font-normal"
                      style={{ color: t.textMuted }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of your repository"
                    className="w-full px-3 py-2 text-sm rounded-md border outline-none"
                    style={{
                      backgroundColor: t.inputBg,
                      borderColor: t.border,
                      color: t.text,
                    }}
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend
                    className="text-sm font-medium mb-2"
                    style={{ color: t.text }}
                  >
                    Visibility
                  </legend>
                  <label
                    className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                    style={{ borderColor: t.border, backgroundColor: t.canvas }}
                  >
                    <input
                      type="radio"
                      checked={!isPrivate}
                      onChange={() => setIsPrivate(false)}
                      name="visibility"
                      defaultChecked
                      className="mt-1"
                    />
                    <div>
                      <div
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: t.text }}
                      >
                        <Globe className="w-4 h-4" />
                        Public
                      </div>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: t.textMuted }}
                      >
                        Anyone can see this repository.
                      </p>
                    </div>
                  </label>
                  <label
                    className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                    style={{ borderColor: t.border }}
                  >
                    <input
                      type="radio"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(true)}
                      name="visibility"
                      className="mt-1"
                    />
                    <div>
                      <div
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: t.text }}
                      >
                        <Lock className="w-4 h-4" />
                        Private
                      </div>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: t.textMuted }}
                      >
                        Only you can access this repository.
                      </p>
                    </div>
                  </label>
                </fieldset>

                <div
                  className="flex items-start gap-2 p-3 rounded-lg text-xs"
                  style={{
                    backgroundColor: t.accentMuted,
                    color: t.textSecondary,
                  }}
                >
                  <Info
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: t.accent }}
                  />
                  <span>
                    Initialize with README and default branch can be configured
                    after API integration.
                  </span>
                </div>
              </div>

              <div
                className="flex justify-end gap-2 px-5 py-4 border-t"
                style={{ borderColor: t.border }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded-md border transition-colors"
                  style={{
                    borderColor: t.border,
                    color: t.text,
                    backgroundColor: t.surface,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background: t.accentGradient,
                    color: t.successText,
                  }}
                >
                  {isCreating ? "Creating…" : "Create repository"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
