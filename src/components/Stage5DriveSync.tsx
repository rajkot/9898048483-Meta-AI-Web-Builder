import React, { useState } from 'react';
import { DriveSyncResult, GeneratedProject } from '../types';
import {
  HardDrive,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FolderPlus,
  FileUp,
  Key,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface Stage5DriveSyncProps {
  project: GeneratedProject | null;
  syncResult: DriveSyncResult | null;
  onExecuteSync: (targetEmail: string) => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
  onStartOver: () => void;
}

export const Stage5DriveSync: React.FC<Stage5DriveSyncProps> = ({
  project,
  syncResult,
  onExecuteSync,
  isLoading,
  onBack,
  onStartOver,
}) => {
  const [targetEmail, setTargetEmail] = useState<string>('athanu000@gmail.com');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim() || isLoading) return;
    onExecuteSync(targetEmail);
  };

  const handleCopyFolderUrl = () => {
    if (!syncResult?.folderUrl) return;
    navigator.clipboard.writeText(syncResult.folderUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              Stage 5 • Google Drive Auto-Sync Module
            </span>
            <span className="text-xs text-slate-500">Permissions API & Cloud Persistence</span>
          </div>

          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Code Workbench
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Automated Google Drive Sync & Access Control
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
          Create a Google Drive project folder, upload all {Object.keys(project?.files || {}).length} generated codebase files, and automatically grant editor/writer permissions to{' '}
          <span className="text-emerald-400 font-semibold">athanu000@gmail.com</span> using the Google Drive Permissions API.
        </p>

        {/* Sync Trigger Form */}
        <form onSubmit={handleSyncSubmit} className="mt-6 max-w-2xl space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Target Access Recipient Email (Editor / Writer Permissions):
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                required
                placeholder="athanu000@gmail.com"
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !targetEmail.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Syncing to Drive...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Start Drive Auto-Sync
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              *The engine calls the Google Drive API to create a folder, stream all JSON files, and invoke the Permissions endpoint with role = "writer".
            </p>
          </div>
        </form>
      </div>

      {/* Sync Status & Audit Console */}
      {syncResult && (
        <div className="space-y-6">
          {/* Status Box */}
          <div className="p-6 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Drive Auto-Sync Completed!</h3>
                  <p className="text-xs text-slate-400">{syncResult.message}</p>
                </div>
              </div>

              {syncResult.folderUrl && (
                <a
                  href={syncResult.folderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                >
                  Open Google Drive Folder
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Audit Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Drive Folder ID</span>
                <div className="font-mono font-semibold text-emerald-300 truncate">{syncResult.folderId}</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Files Uploaded</span>
                <div className="font-semibold text-white">{syncResult.filesCount} Code Artifacts</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Permission Granted To</span>
                <div className="font-semibold text-cyan-300 truncate">{syncResult.grantedEmail} (Editor)</div>
              </div>
            </div>

            {/* Sync Audit Logs */}
            {syncResult.logs && syncResult.logs.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Drive API Execution Logs:
                </span>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
                  {syncResult.logs.map((log, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-2">
                      <span className="text-emerald-500">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Pipeline Execution Complete</div>
              <p className="text-xs text-slate-400 mt-0.5">
                All 5 stages completed successfully from Strategy to Google Drive Auto-Sync.
              </p>
            </div>

            <button
              onClick={onStartOver}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Start New Meta-AI Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
