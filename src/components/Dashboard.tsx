import { useState } from 'react';
import { AnalysisResult } from '../types';
import { StatsOverview } from './StatsOverview';
import { MessageTimeline } from './MessageTimeline';
import { BullyRanking } from './BullyRanking';
import { MessageList } from './MessageList';
import { ReportGenerator } from './ReportGenerator';
import { ArrowLeft } from 'lucide-react';

interface DashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function Dashboard({ result, onReset }: DashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'timeline' | 'messages' | 'ranking' | 'report'>('timeline');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload New Chat</span>
        </button>
        
        <div className="text-right">
          <p className="text-slate-400 text-sm">Case ID: <span className="text-purple-400">{result.caseId}</span></p>
          <p className="text-slate-500 text-xs">
            {new Date(result.uploadDate).toLocaleString()}
          </p>
        </div>
      </div>

      <StatsOverview result={result} />

      <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800 p-1 flex gap-1">
          <button
            onClick={() => setSelectedTab('timeline')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedTab === 'timeline'
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setSelectedTab('messages')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedTab === 'messages'
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setSelectedTab('ranking')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedTab === 'ranking'
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bully Ranking
          </button>
          <button
            onClick={() => setSelectedTab('report')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedTab === 'report'
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generate Report
          </button>
        </div>

        <div className="p-6">
          {selectedTab === 'timeline' && <MessageTimeline result={result} />}
          {selectedTab === 'messages' && <MessageList result={result} />}
          {selectedTab === 'ranking' && <BullyRanking result={result} />}
          {selectedTab === 'report' && <ReportGenerator result={result} />}
        </div>
      </div>
    </div>
  );
}
