export type EmotionalState = 'idle' | 'happy' | 'thinking' | 'success';

export type AssistantTab = 'quiz' | 'tools' | 'tips' | 'search';

export interface QuizOption {
  id: string;
  iconName?: string;
  title: string;
  description: string;
  nextStepId?: string;
  result?: QuizResult;
}

export interface QuizResult {
  title: string;
  badge?: string;
  summary: string;
  recommendedService?: string;
  targetPage: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin';
  actionLabel: string;
  estimatedDuration?: string;
  estimatedPrice?: string;
  proTip?: string;
}

export interface QuizStep {
  id: string;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

export interface QuickToolDefinition {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge?: string;
  type: 'combo' | 'savings';
}

export interface TipDefinition {
  id: string;
  category: 'all' | 'hair' | 'beard' | 'event' | 'daily';
  categoryLabel: string;
  title: string;
  summary: string;
  goldenRule: string;
  targetPage?: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin';
  actionLabel?: string;
}

export interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  targetPage: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin';
  actionLabel: string;
  badge?: string;
}

export interface AssistantConfig {
  theme: {
    primaryColor: string;
    accentColor: string;
    botName: string;
    roleTitle: string;
    welcomeBubbleText: string;
  };
  quizTree: Record<string, QuizStep>;
  initialQuizStepId: string;
  quickTools: QuickToolDefinition[];
  goldenTips: TipDefinition[];
  searchIndex: SearchItem[];
}
