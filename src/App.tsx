import React, { useState } from 'react';
import { Header } from './components/Header';
import { Stage1Strategy } from './components/Stage1Strategy';
import { Stage2DomainCollector } from './components/Stage2DomainCollector';
import { Stage3MasterSpec } from './components/Stage3MasterSpec';
import { Stage4CodeGenerator } from './components/Stage4CodeGenerator';
import { Stage5DriveSync } from './components/Stage5DriveSync';
import {
  DomainAnswers,
  DomainQuestion,
  DriveSyncResult,
  GeneratedProject,
  MasterSpec,
  StageId,
  StrategyBreakdown,
  StrategyOption,
} from './types';

export default function App() {
  const [currentStage, setCurrentStage] = useState<StageId>('strategy');
  const [completedStages, setCompletedStages] = useState<Record<StageId, boolean>>({
    prompt: true,
    strategy: false,
    domain: false,
    spec: false,
    code: false,
    drive: false,
  });

  // Global State
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [strategyBreakdown, setStrategyBreakdown] = useState<StrategyBreakdown | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyOption | null>(null);
  const [domainQuestions, setDomainQuestions] = useState<DomainQuestion[]>([]);
  const [domainAnswers, setDomainAnswers] = useState<DomainAnswers>({});
  const [masterSpec, setMasterSpec] = useState<MasterSpec | null>(null);
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [syncResult, setSyncResult] = useState<DriveSyncResult | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stage 1: Strategy Engine API
  const handleGenerateStrategy = async (promptText: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: promptText }),
      });

      if (!res.ok) throw new Error('Failed to generate strategic options');
      const data: StrategyBreakdown = await res.json();
      setStrategyBreakdown(data);

      if (data.options && data.options.length > 0) {
        setSelectedStrategy(data.options[0]);
      }
    } catch (err: any) {
      console.error('Error generating strategy:', err);
      setErrorMessage(err.message || 'Failed to generate strategy.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 2: Domain Questions API
  const handleGenerateDomainQuestions = async () => {
    if (!selectedStrategy) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/domain-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt,
          selectedStrategy,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch domain questions');
      const data = await res.json();
      setDomainQuestions(data.questions || []);
    } catch (err: any) {
      console.error('Error generating domain questions:', err);
      setErrorMessage(err.message || 'Failed to generate domain questions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 3: Master Spec API
  const handleGenerateMasterSpec = async () => {
    if (!selectedStrategy) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/master-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt,
          selectedStrategy,
          domainAnswers,
        }),
      });

      if (!res.ok) throw new Error('Failed to synthesize Master Spec');
      const data: MasterSpec = await res.json();
      setMasterSpec(data);
      setCompletedStages(prev => ({ ...prev, spec: true }));
    } catch (err: any) {
      console.error('Error generating master spec:', err);
      setErrorMessage(err.message || 'Failed to generate master spec.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 4: Code Generator API
  const handleGenerateCode = async () => {
    if (!selectedStrategy || !masterSpec) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt,
          selectedStrategy,
          masterSpec,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate project code');
      const data: GeneratedProject = await res.json();
      setProject(data);
      setCompletedStages(prev => ({ ...prev, code: true }));
    } catch (err: any) {
      console.error('Error generating code:', err);
      setErrorMessage(err.message || 'Failed to generate code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 5: Google Drive Auto-Sync API
  const handleExecuteDriveSync = async (targetEmail: string) => {
    if (!project) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/drive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.projectName,
          files: project.files,
          targetEmail,
        }),
      });

      if (!res.ok) throw new Error('Failed to sync with Google Drive');
      const data: DriveSyncResult = await res.json();
      setSyncResult(data);
      setCompletedStages(prev => ({ ...prev, drive: true }));
    } catch (err: any) {
      console.error('Error syncing drive:', err);
      setErrorMessage(err.message || 'Failed to sync with Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation Handlers
  const handleProceedToDomainCollector = async () => {
    if (!selectedStrategy) return;
    setCompletedStages(prev => ({ ...prev, strategy: true }));
    setCurrentStage('domain');
    if (domainQuestions.length === 0) {
      await handleGenerateDomainQuestions();
    }
  };

  const handleProceedToMasterSpec = async () => {
    setCompletedStages(prev => ({ ...prev, domain: true }));
    setCurrentStage('spec');
    if (!masterSpec) {
      await handleGenerateMasterSpec();
    }
  };

  const handleProceedToCodeGenerator = async () => {
    setCompletedStages(prev => ({ ...prev, spec: true }));
    setCurrentStage('code');
    if (!project) {
      await handleGenerateCode();
    }
  };

  const handleProceedToDriveSync = () => {
    setCompletedStages(prev => ({ ...prev, code: true }));
    setCurrentStage('drive');
  };

  const handleResetAll = () => {
    setCurrentStage('strategy');
    setCompletedStages({
      prompt: true,
      strategy: false,
      domain: false,
      spec: false,
      code: false,
      drive: false,
    });
    setUserPrompt('');
    setStrategyBreakdown(null);
    setSelectedStrategy(null);
    setDomainQuestions([]);
    setDomainAnswers({});
    setMasterSpec(null);
    setProject(null);
    setSyncResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header & Pipeline Stepper */}
      <Header
        currentStage={currentStage}
        setStage={setCurrentStage}
        completedStages={completedStages}
        projectName={project?.projectName || selectedStrategy?.name}
        onReset={handleResetAll}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 bg-red-950/80 border border-red-500/50 text-red-200 rounded-xl text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stage 1 View */}
        {currentStage === 'strategy' && (
          <Stage1Strategy
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            strategyBreakdown={strategyBreakdown}
            selectedStrategy={selectedStrategy}
            setSelectedStrategy={setSelectedStrategy}
            onGenerateStrategy={handleGenerateStrategy}
            isLoading={isLoading}
            onProceed={handleProceedToDomainCollector}
          />
        )}

        {/* Stage 2 View */}
        {currentStage === 'domain' && selectedStrategy && (
          <Stage2DomainCollector
            questions={domainQuestions}
            domainAnswers={domainAnswers}
            setDomainAnswers={setDomainAnswers}
            selectedStrategy={selectedStrategy}
            onGenerateQuestions={handleGenerateDomainQuestions}
            onSubmitDomainCollector={handleProceedToMasterSpec}
            isLoading={isLoading}
            onBack={() => setCurrentStage('strategy')}
          />
        )}

        {/* Stage 3 View */}
        {currentStage === 'spec' && selectedStrategy && (
          <Stage3MasterSpec
            masterSpec={masterSpec}
            selectedStrategy={selectedStrategy}
            onGenerateMasterSpec={handleGenerateMasterSpec}
            onProceedToCodeGeneration={handleProceedToCodeGenerator}
            isLoading={isLoading}
            onBack={() => setCurrentStage('domain')}
          />
        )}

        {/* Stage 4 View */}
        {currentStage === 'code' && (
          <Stage4CodeGenerator
            project={project}
            onGenerateCode={handleGenerateCode}
            onProceedToDriveSync={handleProceedToDriveSync}
            isLoading={isLoading}
            onBack={() => setCurrentStage('spec')}
          />
        )}

        {/* Stage 5 View */}
        {currentStage === 'drive' && (
          <Stage5DriveSync
            project={project}
            syncResult={syncResult}
            onExecuteSync={handleExecuteDriveSync}
            isLoading={isLoading}
            onBack={() => setCurrentStage('code')}
            onStartOver={handleResetAll}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <p>Meta-AI Web Builder Platform • Powered by Gemini 3.6 Flash & Google Drive Permissions API</p>
      </footer>
    </div>
  );
}
