"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  File, 
  Folder, 
  ChevronRight, 
  ArrowLeft, 
  Download,
  Edit,
  Copy,
  Plus
} from "lucide-react";
import { useTree, useBlob } from "@/hooks/use-files";
import { useCommits } from "@/hooks/use-commits";
import { getDashboardTheme } from "@/app/dashboard/_components/dashboard-theme";
import FileUploadModal from "./FileUploadModal";

interface FileBrowserTabProps {
  ownerId: number;
  repoName: string;
  isDark: boolean;
  defaultBranch: string;
  userEmail: string;
}

export default function FileBrowserTab({ ownerId, repoName, isDark, defaultBranch, userEmail }: FileBrowserTabProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'file'>('tree');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'create'>('create');
  
  // Debug: Log when modal state changes
  useEffect(() => {
    console.log('FileBrowserTab: showUploadModal changed to:', showUploadModal, 'mode:', uploadMode);
  }, [showUploadModal, uploadMode]);
  
  const t = getDashboardTheme(isDark);
  
  // Get latest commit SHA for the default branch
  const { data: commits = [], isLoading: commitsLoading } = useCommits(ownerId, repoName);
  const latestCommitSha = commits.length > 0 ? commits[0].sha : null;
  
  // Get current directory tree - ONLY if we have commits
  const { data: tree, isLoading: treeLoading } = useTree(
    ownerId, 
    repoName, 
    latestCommitSha || 'HEAD',
    { enabled: !!latestCommitSha } // Disable query if no commits
  );
  
  // Get file content if a file is selected
  const { data: fileBlob, isLoading: fileLoading } = useBlob(
    ownerId, 
    repoName, 
    selectedFile || ''
  );

  const handleItemClick = (item: any) => {
    if (item.type === 'tree') {
      setCurrentPath([...currentPath, item.name]);
      setViewMode('tree');
      setSelectedFile(null);
    } else {
      setSelectedFile(item.sha);
      setViewMode('file');
    }
  };

  const handleBackClick = () => {
    if (viewMode === 'file') {
      setViewMode('tree');
      setSelectedFile(null);
    } else if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'txt': 'text',
    };
    return langMap[ext || ''] || 'text';
  };

  // Show loading only when actually loading commits or tree (not when empty)
  if ((commitsLoading || treeLoading) && viewMode === 'tree' && latestCommitSha !== null) {
    return (
      <>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* File Upload Modal - must be present in ALL views */}
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          ownerId={ownerId}
          repoName={repoName}
          isDark={isDark}
          defaultBranch={defaultBranch}
          userEmail={userEmail}
          mode={uploadMode}
        />
      </>
    );
  }

  // Empty repository view - show immediately if no commits
  if (!latestCommitSha || !tree || !tree.entries || tree.entries.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <Folder className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: t.textMuted }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: t.text }}>
            This repository is empty
          </h3>
          <p className="text-sm mb-4" style={{ color: t.textMuted }}>
            Get started by creating a new file or uploading existing files.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Create button clicked, showUploadModal:', showUploadModal);
                setUploadMode('create');
                setShowUploadModal(true);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: t.accent,
                color: t.successText,
              }}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create new file
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Upload button clicked, showUploadModal:', showUploadModal);
                setUploadMode('upload');
                setShowUploadModal(true);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{
                borderColor: t.border,
                color: t.text,
              }}
            >
              Upload files
            </button>
          </div>
        </div>
        
        {/* File Upload Modal - must be present in ALL views */}
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          ownerId={ownerId}
          repoName={repoName}
          isDark={isDark}
          defaultBranch={defaultBranch}
          userEmail={userEmail}
          mode={uploadMode}
        />
      </>
    );
  }

  // File view
  if (viewMode === 'file' && selectedFile) {
    return (
      <>
        <div className="space-y-4">
        {/* File header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: t.textMuted }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to files
          </button>
          
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: t.textMuted }}
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: t.textMuted }}
              title="Copy content"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: t.textMuted }}
              title="Edit file"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {fileLoading ? (
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        ) : fileBlob ? (
          <div>
            {/* File info */}
            <div 
              className="flex items-center justify-between p-3 border-b"
              style={{ 
                backgroundColor: t.surface,
                borderColor: t.border 
              }}
            >
              <div className="text-sm" style={{ color: t.textMuted }}>
                {formatFileSize(fileBlob.size)} • {getFileLanguage(selectedFile || '')}
              </div>
              <div className="text-sm" style={{ color: t.textMuted }}>
                {fileBlob.encoding}
              </div>
            </div>
            
            {/* File content */}
            <div 
              className="p-4 overflow-auto max-h-96"
              style={{ 
                backgroundColor: t.surface,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace'
              }}
            >
              <pre className="text-sm" style={{ color: t.text }}>
                <code>{fileBlob.content}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <File className="w-12 h-12 mx-auto mb-2 opacity-40" style={{ color: t.textMuted }} />
            <p className="text-sm" style={{ color: t.textMuted }}>
              Unable to load file content
            </p>
          </div>
        )}
      </div>
      
      {/* File Upload Modal - must be present in ALL views */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        ownerId={ownerId}
        repoName={repoName}
        isDark={isDark}
        defaultBranch={defaultBranch}
        userEmail={userEmail}
        mode={uploadMode}
      />
    </>
    );
  }

  // Directory tree view
  return (
    <>
      <div className="space-y-4">
        {/* Path breadcrumb */}
        {currentPath.length > 0 && (
          <div className="flex items-center gap-1 text-sm" style={{ color: t.textMuted }}>
            <button
              onClick={() => setCurrentPath([])}
              className="hover:underline"
              style={{ color: t.accent }}
            >
              {repoName}
            </button>
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  className="hover:underline"
                  style={{ color: t.accent }}
                >
                  {path}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Back button for directories */}
        {currentPath.length > 0 && (
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: t.textMuted }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* File/folder list */}
        <div className="space-y-1">
          {tree.entries.map((item, index) => (
            <motion.div
              key={item.sha}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {item.type === 'tree' ? (
                <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
              ) : (
                <File className="w-5 h-5 flex-shrink-0" style={{ color: t.textMuted }} />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm" style={{ color: t.text }}>
                  {item.name}
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs" style={{ color: t.textMuted }}>
                <span className="hidden sm:inline">{item.sha.substring(0, 7)}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        ownerId={ownerId}
        repoName={repoName}
        isDark={isDark}
        defaultBranch={defaultBranch}
        userEmail={userEmail}
        mode={uploadMode}
      />
    </>
  );
}