import { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { Dashboard } from './components/Dashboard';
import { AnalysisResult } from './types';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Parse and analyze the file
    const result = await analyzeChat(file);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        {!analysisResult ? (
          <UploadSection onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
        ) : (
          <Dashboard result={analysisResult} onReset={handleReset} />
        )}
      </main>
      
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>⚠️ Disclaimer: AI predictions are probabilistic and should not be the sole basis for legal actions.</p>
          <p className="mt-2">Privacy-first • Local processing • No data sharing • For educational purposes</p>
        </div>
      </footer>
    </div>
  );
}

// Mock analysis function - in production this would call the backend API
async function analyzeChat(file: File): Promise<AnalysisResult> {
  const text = await file.text();
  const messages = parseWhatsAppChat(text);
  
  // Simulate AI classification
  const analyzedMessages = messages.map(msg => ({
    ...msg,
    prediction: classifyMessage(msg.message),
  }));
  
  const flaggedMessages = analyzedMessages.filter(m => m.prediction.label === 'bullying');
  
  // Calculate bully ranking
  const bullyStats: Record<string, { count: number; severity: number }> = {};
  flaggedMessages.forEach(msg => {
    if (!bullyStats[msg.sender]) {
      bullyStats[msg.sender] = { count: 0, severity: 0 };
    }
    bullyStats[msg.sender].count++;
    bullyStats[msg.sender].severity += msg.prediction.confidence;
  });
  
  const bullyRanking = Object.entries(bullyStats)
    .map(([sender, stats]) => ({
      sender,
      count: stats.count,
      avgSeverity: stats.severity / stats.count,
    }))
    .sort((a, b) => b.count - a.count);
  
  return {
    filename: file.name,
    uploadDate: new Date().toISOString(),
    totalMessages: messages.length,
    flaggedCount: flaggedMessages.length,
    messages: analyzedMessages,
    bullyRanking,
    caseId: generateCaseId(),
  };
}

function parseWhatsAppChat(text: string) {
  const lines = text.split('\n');
  const messages: any[] = [];
  const lineRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?:\s*[AP]M)?)\s*-\s*([^:]+):\s*(.*)$/i;
  
  let currentMessage: any = null;
  
  for (const line of lines) {
    const match = line.match(lineRegex);
    
    if (match) {
      if (currentMessage) {
        messages.push(currentMessage);
      }
      
      const [, date, time, sender, message] = match;
      currentMessage = {
        id: `msg_${messages.length + 1}`,
        timestamp: parseDateTime(date, time),
        sender: sender.trim(),
        message: message.trim(),
      };
    } else if (currentMessage && line.trim()) {
      currentMessage.message += '\n' + line.trim();
    }
  }
  
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  return messages;
}

function parseDateTime(date: string, time: string): string {
  try {
    // Simple parser - handles MM/DD/YY format
    const [month, day, year] = date.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    
    // Parse time
    let hours: number, minutes: number;
    const timeParts = time.match(/(\d{1,2}):(\d{2})(?:\s*([AP]M))?/i);
    
    if (timeParts) {
      hours = parseInt(timeParts[1]);
      minutes = parseInt(timeParts[2]);
      const meridiem = timeParts[3];
      
      if (meridiem) {
        if (meridiem.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }
    } else {
      hours = 0;
      minutes = 0;
    }
    
    const dateObj = new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day), hours, minutes);
    return dateObj.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function classifyMessage(message: string) {
  const text = message.toLowerCase();
  
  // Simple rule-based classifier for demo (in production, use ML model)
  const bullyingKeywords = [
    'stupid', 'idiot', 'loser', 'hate', 'kill', 'die', 'worthless',
    'ugly', 'fat', 'dumb', 'useless', 'pathetic', 'waste', 'nobody',
    'failure', 'disgusting', 'freak', 'weird', 'annoying', 'shut up'
  ];
  
  const threatKeywords = ['kill', 'hurt', 'die', 'destroy', 'attack', 'beat'];
  const harassmentKeywords = ['stupid', 'idiot', 'loser', 'worthless', 'useless'];
  
  let score = 0;
  let category = 'normal';
  
  for (const keyword of bullyingKeywords) {
    if (text.includes(keyword)) {
      score += 0.3;
    }
  }
  
  if (threatKeywords.some(k => text.includes(k))) {
    score += 0.4;
    category = 'threat';
  } else if (harassmentKeywords.some(k => text.includes(k))) {
    category = 'harassment';
  }
  
  // Check for excessive caps and exclamation
  if (message === message.toUpperCase() && message.length > 5) {
    score += 0.2;
  }
  if ((message.match(/!/g) || []).length > 2) {
    score += 0.1;
  }
  
  const confidence = Math.min(score, 0.99);
  const label = confidence > 0.4 ? 'bullying' : 'normal';
  
  return {
    label,
    confidence,
    category: label === 'bullying' ? category : 'normal',
    severity: confidence > 0.7 ? 'high' : confidence > 0.5 ? 'medium' : 'low',
  };
}

function generateCaseId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `CBG-${timestamp}-${random}`.toUpperCase();
}
