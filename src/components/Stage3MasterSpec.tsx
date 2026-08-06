import React, { useState } from 'react';
import { MasterSpec, StrategyOption } from '../types';
import {
  FileCode,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Code2,
  FileText,
  Layers,
  Database,
  Cpu,
  Download,
} from 'lucide-react';

interface Stage3MasterSpecProps {
  masterSpec: MasterSpec | null;
  selectedStrategy: StrategyOption;
  onGenerateMasterSpec: () => Promise<void>;
  onProceedToCodeGeneration: () => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
}

export const Stage3MasterSpec: React.FC<Stage3MasterSpecProps> = ({
  masterSpec,
  selectedStrategy,
  onGenerateMasterSpec,
  onProceedToCodeGeneration,
  isLoading,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'json' | 'components'>('markdown');
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    if (!masterSpec?.masterPromptMarkdown) return;
    navigator.clipboard.writeText(masterSpec.masterPromptMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" />
              Stage 3 • Master Spec Architect
            </span>
            <span className="text-xs text-slate-500">Claude 3.7 / GPT-4o Contract</span>
          </div>

          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Domain Collector
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Unified MASTER_PROMPT.md Specification
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
          The Master Spec Architect has synthesized your prompt, strategy option, and domain requirements into a complete technical contract (`MASTER_PROMPT.md`) ready for code execution.
        </p>

        {!masterSpec && (
          <div className="mt-6">
            <button
              onClick={onGenerateMasterSpec}
              disabled={isLoading}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Master Spec...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Synthesize Master Spec
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Spec Content Viewer */}
      {masterSpec && (
        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Project Spec Title</div>
              <div className="font-bold text-white text-sm truncate">{masterSpec.title}</div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Target Persona</div>
              <div className="font-bold text-indigo-300 text-sm truncate">{masterSpec.targetAudience}</div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tech Stack Summary</div>
              <div className="font-bold text-cyan-300 text-sm truncate">{masterSpec.techStackSummary}</div>
            </div>
          </div>

          {/* Tab Selector & Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('markdown')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'markdown'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> MASTER_PROMPT.md
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'json'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> Technical JSON Spec
                </button>
                <button
                  onClick={() => setActiveTab('components')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'components'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Component Tree Breakdown
                </button>
              </div>

              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Master Spec
                  </>
                )}
              </button>
            </div>

            {/* Tab View Contents */}
            <div className="p-6">
              {activeTab === 'markdown' && (
                <div className="font-mono text-xs text-slate-300 bg-slate-950 p-6 rounded-xl border border-slate-800/80 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
                  {masterSpec.masterPromptMarkdown}
                </div>
              )}

              {activeTab === 'json' && (
                <div className="font-mono text-xs text-amber-300 bg-slate-950 p-6 rounded-xl border border-slate-800/80 overflow-x-auto whitespace-pre max-h-[500px]">
                  {JSON.stringify(masterSpec.technicalJsonSpec, null, 2)}
                </div>
              )}

              {activeTab === 'components' && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Core Component Architecture & States</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {masterSpec.technicalJsonSpec?.coreComponents?.map((comp, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-indigo-300">{comp.name}</span>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                            Component
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{comp.purpose}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-500 font-semibold">State Keys:</span>
                          {comp.stateKeys?.map((sk, sIdx) => (
                            <span key={sIdx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-5 bg-slate-900 border border-amber-500/40 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <div className="text-sm font-bold text-white">
                Master Prompt Specification Ready for Code Generation
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pass spec contract to Stage 4: Code File Generator Execution Engine
              </p>
            </div>

            <button
              onClick={onProceedToCodeGeneration}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-amber-600/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Codebase...
                </>
              ) : (
                <>
                  Execute Code File Generator
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
