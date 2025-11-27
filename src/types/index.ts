export interface Message {
  id: string;
  timestamp: string;
  sender: string;
  message: string;
}

export interface Prediction {
  label: 'normal' | 'bullying';
  confidence: number;
  category: 'normal' | 'harassment' | 'threat' | 'hate' | 'sexual';
  severity: 'low' | 'medium' | 'high';
}

export interface AnalyzedMessage extends Message {
  prediction: Prediction;
}

export interface BullyRank {
  sender: string;
  count: number;
  avgSeverity: number;
}

export interface AnalysisResult {
  filename: string;
  uploadDate: string;
  totalMessages: number;
  flaggedCount: number;
  messages: AnalyzedMessage[];
  bullyRanking: BullyRank[];
  caseId: string;
}
