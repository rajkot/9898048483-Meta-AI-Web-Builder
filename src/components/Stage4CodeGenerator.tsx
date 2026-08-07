import React, { useState } from 'react';
import JSZip from 'jszip';
import { GeneratedProject } from '../types';
import {
  Code2,
  FileCode,
  Folder,
  FolderOpen,
  Play,
  Download,
  Copy,
  Check,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  Search,
  ExternalLink,
  Layers,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';

interface Stage4CodeGeneratorProps {
  project: GeneratedProject | null;
  onGenerateCode: () => Promise<void>;
  onProceedToDriveSync: () => void;
  isLoading: boolean;
  onBack: () => void;
}

export const Stage4CodeGenerator: React.FC<Stage4CodeGeneratorProps> = ({
  project,
  onGenerateCode,
  onProceedToDriveSync,
  isLoading,
  onBack,
}) => {
  const [activeFilePath, setActiveFilePath] = useState<string>('src/App.tsx');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  // Initialize local file contents when project loads
  React.useEffect(() => {
    if (project?.files) {
      setFileContents(project.files);
      if (project.fileList?.includes('src/App.tsx')) {
        setActiveFilePath('src/App.tsx');
      } else if (project.fileList?.length > 0) {
        setActiveFilePath(project.fileList[0]);
      }
    }
  }, [project]);

  const currentContent = fileContents[activeFilePath] || project?.files?.[activeFilePath] || '';

  const handleFileChange = (newText: string) => {
    setFileContents(prev => ({
      ...prev,
      [activeFilePath]: newText,
    }));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export complete ZIP using JSZip
  const handleDownloadZip = async () => {
    if (!project) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const filesToZip = Object.keys(fileContents).length > 0 ? fileContents : project.files;

      Object.entries(filesToZip).forEach(([path, content]) => {
        zip.file(path, String(content ?? ''));
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.projectName || 'meta-ai-app'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Construct iframe srcdoc for interactive sandbox rendering
  const generatePreviewSrcDoc = () => {
    const files = Object.keys(fileContents).length > 0 ? fileContents : project?.files || {};
    const htmlContent = files['index.html'] || '<div id="root"></div>';
    const appTsx = files['src/App.tsx'] || '';

    // Transform React JSX into browser-runnable script via Babel standalone
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide-react@0.300.0/dist/umd/lucide-react.min.js"></script>
  <style>
    body { background-color: #020617; color: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      // Mock Lucide Icons for standalone iframe execution
      const Lucide = window.LucideReact || {};
      const { Sparkles, Layout, CheckCircle, Code, Share2, Layers, Cpu, ArrowRight, Activity, Zap } = Lucide;

      // Injected Generated App Code
      ${appTsx
        .replace(/import .* from .*/g, '')
        .replace(/export default function App\(\)/g, 'function App()')}

      const rootElement = document.getElementById('root');
      if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<App />);
      }
    } catch (err) {
      document.getElementById('root').innerHTML = '<div style="padding: 24px; color: #f87171; font-family: monospace;"><h3>Preview Engine Render Error:</h3><pre>' + err.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
  };

  const filteredFiles = (project?.fileList || []).filter(f =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Stage 4 • Code Execution Engine
            </span>
            <span className="text-xs text-slate-500">Multi-File JSON Project Tree</span>
          </div>

          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Master Spec
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Interactive Code Workbench & Sandbox Preview
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
          The Execution Engine has generated a full, modular codebase mapping file paths to code contents. Inspect, edit, test the live rendered preview, or download as a standalone ZIP archive.
        </p>

        {project && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              {isZipping ? 'Archiving ZIP...' : 'Download Project ZIP'}
            </button>

            <button
              onClick={onProceedToDriveSync}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5" />
              Proceed to Google Drive Auto-Sync
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Code Workbench Grid */}
      {project && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* File Explorer Sidebar (Cols 3) */}
          <div className="lg:col-span-3 border-r border-slate-800 bg-slate-950/80 p-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-indigo-400" /> File Explorer
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                  {project.fileList?.length || 0} Files
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              {/* File Tree List */}
              <div className="space-y-1 overflow-y-auto max-h-[420px] scrollbar-thin">
                {filteredFiles.map((path) => {
                  const isActive = activeFilePath === path;
                  return (
                    <button
                      key={path}
                      onClick={() => setActiveFilePath(path)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {path}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>Project: <span className="text-white font-medium">{project.projectName}</span></div>
              <div>Strategy: <span className="text-indigo-400 font-medium">{project.strategyName}</span></div>
            </div>
          </div>

          {/* Main Workspace: Code Editor & Live Preview (Cols 9) */}
          <div className="lg:col-span-9 flex flex-col bg-slate-950">
            {/* Top Workspace Header */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'editor'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> Source Code Editor
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Live Render Preview
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {activeFilePath}
                </span>

                <button
                  onClick={handleCopyCode}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                  title="Copy File Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Editor View */}
            {activeTab === 'editor' && (
              <div className="flex-1 p-4 bg-slate-950 flex flex-col">
                <textarea
                  value={currentContent}
                  onChange={(e) => handleFileChange(e.target.value)}
                  className="w-full h-full min-h-[500px] bg-slate-950 text-slate-200 font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed border-0"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Live Sandbox Preview View */}
            {activeTab === 'preview' && (
              <div className="flex-1 p-4 bg-slate-950 flex flex-col">
                <div className="w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
                  <iframe
                    title="Live Preview Sandbox"
                    srcDoc={generatePreviewSrcDoc()}
                    className="w-full h-full min-h-[520px] border-0"
                    sandbox="allow-scripts allow-modals"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
