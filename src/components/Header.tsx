import React from 'react';
import { StageId } from '../types';
import {
  Compass,
  HelpCircle,
  FileCode,
  Code2,
  HardDrive,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  currentStage: StageId;
  setStage: (stage: StageId) => void;
  completedStages: Record<StageId, boolean>;
  projectName?: string;
  onReset: () => void;
}

export const stages: Array<{ id: StageId; number: number; label: string; agent: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'strategy', number: 1, label: 'Strategy Engine', agent: 'Gemini 3.6 Flash', icon: Compass },
  { id: 'domain', number: 2, label: 'Domain Collector', agent: 'DeepSeek-R1', icon: HelpCircle },
  { id: 'spec', number: 3, label: 'Master Spec Architect', agent: 'Claude 3.7 / GPT-4o', icon: FileCode },
  { id: 'code', number: 4, label: 'Execution Engine', agent: 'Code Generator Sandbox', icon: Code2 },
  { id: 'drive', number: 5, label: 'Drive Auto-Sync', agent: 'Drive Permissions API', icon: HardDrive },
];

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  setStage,
  completedStages,
  projectName,
  onReset,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & App Identifier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-lg tracking-tight">Meta-AI Builder</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SaaS Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Multi-Stage Interactive AI Code Generation</span>
                {projectName && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400 font-medium truncate max-w-[150px]">{projectName}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="md:hidden text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded border border-slate-700"
          >
            New Project
          </button>
        </div>

        {/* Pipeline Stage Stepper */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {stages.map((st, idx) => {
            const Icon = st.icon;
            const isCurrent = currentStage === st.id;
            const isCompleted = completedStages[st.id];
            const isAccessible = isCompleted || isCurrent || idx === 0 || completedStages[stages[idx - 1]?.id];

            return (
              <React.Fragment key={st.id}>
                <button
                  disabled={!isAccessible}
                  onClick={() => isAccessible && setStage(st.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : isCompleted
                      ? 'bg-slate-800/90 text-indigo-300 hover:bg-slate-800 border border-indigo-500/20'
                      : isAccessible
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-800/60 border border-slate-800'
                      : 'bg-slate-900/50 text-slate-600 border border-slate-800/40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-white text-indigo-700'
                        : isCompleted
                        ? 'bg-indigo-500/30 text-indigo-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : st.number}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-semibold leading-tight">{st.label}</div>
                    <div className="text-[9px] opacity-70 leading-tight">{st.agent}</div>
                  </div>
                </button>

                {idx < stages.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-700 shrink-0 hidden lg:block" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
