import React, { useState } from 'react';
import { DomainAnswers, DomainQuestion, StrategyOption } from '../types';
import {
  HelpCircle,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ListChecks,
  User,
  Database,
  Palette,
  Share2,
} from 'lucide-react';

interface Stage2DomainCollectorProps {
  questions: DomainQuestion[];
  domainAnswers: DomainAnswers;
  setDomainAnswers: (answers: DomainAnswers) => void;
  selectedStrategy: StrategyOption;
  onGenerateQuestions: () => Promise<void>;
  onSubmitDomainCollector: () => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'User Persona': User,
  'Data & Workflow': Database,
  'UX / Visual Branding': Palette,
  'Integrations & Cloud Sync': Share2,
};

export const Stage2DomainCollector: React.FC<Stage2DomainCollectorProps> = ({
  questions,
  domainAnswers,
  setDomainAnswers,
  selectedStrategy,
  onGenerateQuestions,
  onSubmitDomainCollector,
  isLoading,
  onBack,
}) => {
  const [answers, setLocalAnswers] = useState<DomainAnswers>(domainAnswers);

  const handleSelectAnswer = (fieldKey: string, value: string) => {
    const updated = { ...answers, [fieldKey]: value };
    setLocalAnswers(updated);
    setDomainAnswers(updated);
  };

  const handleInputChange = (fieldKey: string, value: string) => {
    const updated = { ...answers, [fieldKey]: value };
    setLocalAnswers(updated);
    setDomainAnswers(updated);
  };

  const isFormComplete = questions.length > 0 && questions.every(q => Boolean(answers[q.fieldKey]?.trim()));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Stage 2 • DeepSeek Domain Collector
            </span>
            <span className="text-xs text-slate-500">4 Targeted Business Questions</span>
          </div>

          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Strategy
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Fine-tune Domain & Business Specifications
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
          DeepSeek-R1 domain engine has tailored 4 targeted questions based on your chosen strategy:{' '}
          <span className="text-indigo-400 font-semibold">{selectedStrategy.name}</span>. Answer these questions or pick suggested defaults to shape the Master Prompt.
        </p>

        {questions.length === 0 && (
          <div className="mt-6">
            <button
              onClick={onGenerateQuestions}
              disabled={isLoading}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Domain Questions
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Questions Form Grid */}
      {questions.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((q, idx) => {
              const CategoryIcon = CATEGORY_ICONS[q.category] || ListChecks;
              const currentValue = answers[q.fieldKey] || '';

              return (
                <div
                  key={q.id || idx}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                        <CategoryIcon className="w-3 h-3" />
                        {q.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">Q{idx + 1}/4</span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">{q.question}</h3>
                    <p className="text-xs text-slate-400">{q.hint}</p>

                    {/* Pre-suggested Answer Pills */}
                    {q.suggestedAnswers && q.suggestedAnswers.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-slate-400">Quick Select Option:</span>
                        <div className="space-y-1.5">
                          {q.suggestedAnswers.map((opt, oIdx) => {
                            const isChosen = currentValue === opt;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSelectAnswer(q.fieldKey, opt)}
                                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition flex items-center justify-between cursor-pointer ${
                                  isChosen
                                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="line-clamp-2">{opt}</span>
                                {isChosen && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom Answer Input */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Custom / Refined Answer:
                    </label>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleInputChange(q.fieldKey, e.target.value)}
                      placeholder="Type custom response..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Action Bar */}
          <div className="p-5 bg-slate-900 border border-cyan-500/30 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <div className="text-sm font-bold text-white">
                Domain Specification Completion ({questions.filter(q => Boolean(answers[q.fieldKey])).length}/4 Answers Provided)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready to pass domain attributes to Stage 3: Master Spec Architect
              </p>
            </div>

            <button
              onClick={onSubmitDomainCollector}
              disabled={isLoading || !isFormComplete}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Spec...
                </>
              ) : (
                <>
                  Synthesize Master Spec
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
