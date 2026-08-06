import React, { useState } from 'react';
import { StrategyBreakdown, StrategyOption } from '../types';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Zap,
  Lightbulb,
  ShieldCheck,
  Code,
  Loader2,
  ListFilter,
} from 'lucide-react';

interface Stage1StrategyProps {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  strategyBreakdown: StrategyBreakdown | null;
  selectedStrategy: StrategyOption | null;
  setSelectedStrategy: (option: StrategyOption) => void;
  onGenerateStrategy: (promptText: string) => Promise<void>;
  isLoading: boolean;
  onProceed: () => void;
}

const PRESET_PROMPTS = [
  {
    title: 'Meta-AI SaaS Web Builder',
    prompt: 'A SaaS platform that lets users input app prompts, generates multi-stage architectural options, domain questions, Master Specs, code trees, and auto-syncs to Google Drive with permissions granted to athanu000@gmail.com.',
  },
  {
    title: 'Enterprise Analytics Dashboard',
    prompt: 'A real-time business intelligence SaaS dashboard with interactive financial metrics, custom KPI widgets, multi-tenant workspace isolation, data export, and dark/light themes.',
  },
  {
    title: 'AI Customer Support Hub',
    prompt: 'An AI-powered customer support desk with automated ticketing, live chat assistant, knowledge base search grounding, sentiment routing, and team analytics.',
  },
  {
    title: 'FinTech Expense & Wealth Tracker',
    prompt: 'A personal wealth management app with budget forecasting, portfolio tracking, automated transaction categorization, recurring bill alerts, and CSV/PDF export.',
  },
];

export const Stage1Strategy: React.FC<Stage1StrategyProps> = ({
  userPrompt,
  setUserPrompt,
  strategyBreakdown,
  selectedStrategy,
  setSelectedStrategy,
  onGenerateStrategy,
  isLoading,
  onProceed,
}) => {
  const [activeInput, setActiveInput] = useState(userPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInput.trim() || isLoading) return;
    setUserPrompt(activeInput);
    onGenerateStrategy(activeInput);
  };

  const handleSelectPreset = (presetText: string) => {
    setActiveInput(presetText);
    setUserPrompt(presetText);
    onGenerateStrategy(presetText);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Hero Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Stage 1 • Gemini Strategy Engine
          </span>
          <span className="text-xs text-slate-500">3 Strategic Architectures</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Define Your Application Vision & Strategy
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
          Input your core product idea or pick a preset. Gemini will analyze the requirements and synthesize 3 distinct, high-level architectural build strategies tailored to your functional scope.
        </p>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={activeInput}
              onChange={(e) => setActiveInput(e.target.value)}
              placeholder="Describe your web application idea, key features, target audience, or requirements..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-4 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-none placeholder-slate-600"
            />
            <button
              type="submit"
              disabled={isLoading || !activeInput.trim()}
              className="absolute bottom-3 right-3 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  Analyze Strategy
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Quick Product Presets:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESET_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(p.prompt)}
                  disabled={isLoading}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-indigo-300 flex items-center justify-between">
                    <span>{p.title}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{p.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl mx-auto flex items-center justify-center text-indigo-400 animate-bounce">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Synthesizing Strategic Build Options...</h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluating architectural patterns, tech stack pairings, UX approaches, and trade-offs...
            </p>
          </div>
        </div>
      )}

      {/* Strategy Breakdown Display */}
      {strategyBreakdown && !isLoading && (
        <div className="space-y-6">
          {/* Analysis Bar */}
          <div className="p-5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-400 mb-1">
                Strategic Executive Analysis
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{strategyBreakdown.overallAnalysis}</p>
            </div>
            <div className="shrink-0 bg-indigo-900/60 border border-indigo-400/30 p-3 rounded-lg text-xs text-indigo-200 font-medium">
              <span className="text-indigo-400 font-bold">Recommended:</span> {strategyBreakdown.primaryRecommendation}
            </div>
          </div>

          {/* 3 Option Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {strategyBreakdown.options.map((option) => {
              const isSelected = selectedStrategy?.id === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedStrategy(option)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" /> Selected Option
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md">
                        {option.tag}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2.5">{option.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{option.description}</p>
                    </div>

                    {/* Architecture */}
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        Architecture
                      </div>
                      <p className="text-xs text-slate-400 leading-tight">{option.architecture}</p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        Tech Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {option.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] rounded font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Key Core Features</div>
                      <ul className="space-y-1">
                        {option.keyFeatures.map((feat, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* UX & Target Audience */}
                    <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">UX Approach:</span>{' '}
                        <span className="text-slate-300">{option.uxApproach}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Target Audience:</span>{' '}
                        <span className="text-slate-300">{option.targetAudience}</span>
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="bg-emerald-950/30 border border-emerald-500/20 p-2 rounded-lg">
                        <span className="font-bold text-emerald-400 block mb-1">Pros:</span>
                        {option.prosCons?.pros?.map((p, i) => (
                          <p key={i} className="text-slate-300 leading-tight mb-1">✓ {p}</p>
                        ))}
                      </div>
                      <div className="bg-amber-950/30 border border-amber-500/20 p-2 rounded-lg">
                        <span className="font-bold text-amber-400 block mb-1">Trade-offs:</span>
                        {option.prosCons?.cons?.map((c, i) => (
                          <p key={i} className="text-slate-300 leading-tight mb-1">! {c}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStrategy(option);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Selected Strategy
                        </>
                      ) : (
                        'Select This Strategy'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar to Proceed */}
          {selectedStrategy && (
            <div className="p-5 bg-slate-900 border border-indigo-500/40 rounded-2xl flex items-center justify-between shadow-xl">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Selected Strategy:</span>
                  <span className="text-indigo-400">{selectedStrategy.name}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ready to proceed to Stage 2: Domain Collector (DeepSeek-R1 Questions)
                </p>
              </div>

              <button
                onClick={onProceed}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                Proceed to Domain Collector
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
