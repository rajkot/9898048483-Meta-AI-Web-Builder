export type StageId = 'prompt' | 'strategy' | 'domain' | 'spec' | 'code' | 'drive';

export interface StrategyOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  architecture: string;
  techStack: string[];
  keyFeatures: string[];
  uxApproach: string;
  targetAudience: string;
  prosCons: {
    pros: string[];
    cons: string[];
  };
}

export interface StrategyBreakdown {
  options: StrategyOption[];
  primaryRecommendation: string;
  overallAnalysis: string;
}

export interface DomainQuestion {
  id: string;
  question: string;
  fieldKey: string;
  hint: string;
  category: string;
  suggestedAnswers?: string[];
}

export interface DomainAnswers {
  [fieldKey: string]: string;
}

export interface MasterSpec {
  title: string;
  version: string;
  overview: string;
  targetAudience: string;
  techStackSummary: string;
  masterPromptMarkdown: string;
  technicalJsonSpec: {
    appStructure: string[];
    coreComponents: Array<{ name: string; purpose: string; stateKeys: string[] }>;
    apiEndpoints: Array<{ method: string; path: string; description: string }>;
    dataModels: Array<{ entity: string; fields: string[] }>;
    designTokens: {
      colorPalette: string[];
      typography: string;
      layoutGrid: string;
    };
  };
}

export interface GeneratedProject {
  projectName: string;
  description: string;
  files: Record<string, string>; // path -> content
  fileList: string[];
  masterSpec: MasterSpec;
  strategyName: string;
}

export interface DriveSyncConfig {
  targetEmail: string;
  createPublicLink: boolean;
  notifyUser: boolean;
  folderName?: string;
}

export interface DriveSyncResult {
  success: boolean;
  folderId?: string;
  folderUrl?: string;
  filesCount?: number;
  grantedEmail?: string;
  permissionId?: string;
  message?: string;
  logs?: string[];
}
