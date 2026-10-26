export type ExerciseMode = 'run' | 'test';

export interface ExerciseReference {
  title: string;
  url: string;
  description?: string;
  isOfficial?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  order: number;
  category: string;
  categoryTitle: string;
  categoryOrder: number;
  categoryReadme: string;
  path: string;
  filename: string;
  mode: ExerciseMode;
  instructions: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
  references?: ExerciseReference[];
}

export interface UserExerciseState {
  code: string;
  completed: boolean;
  completedAt?: number;
  bookmarked?: boolean;
  notes?: string;
  lastRunResult?: CompileResult;
}

export interface CompileResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitDetail?: string;
  executionTimeMs?: number;
  engine?: 'local' | 'wasm' | 'serverless';
}

export interface AppSettings {
  vimMode: boolean;
  fontSize: number;
  theme: 'dark' | 'coss' | 'light';
  autoRunOnLoad: boolean;
  keymapPlatform: 'mac' | 'windows';
}
