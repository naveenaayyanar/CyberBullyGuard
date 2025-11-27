import { MessageSquare, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '../types';

interface StatsOverviewProps {
  result: AnalysisResult;
}

export function StatsOverview({ result }: StatsOverviewProps) {
  const flaggedPercentage = ((result.flaggedCount / result.totalMessages) * 100).toFixed(1);
  const uniqueSenders = new Set(result.messages.map(m => m.sender)).size;
  const severityDistribution = result.messages
    .filter(m => m.prediction.label === 'bullying')
    .reduce((acc, m) => {
      acc[m.prediction.severity] = (acc[m.prediction.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <MessageSquare className="w-8 h-8 text-blue-400" />
          <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-1 rounded">Total</span>
        </div>
        <div className="text-white text-2xl mb-1">{result.totalMessages}</div>
        <div className="text-slate-400 text-sm">Messages Analyzed</div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <span className="text-red-400 text-xs bg-red-400/10 px-2 py-1 rounded">Flagged</span>
        </div>
        <div className="text-white text-2xl mb-1">{result.flaggedCount}</div>
        <div className="text-slate-400 text-sm">
          Bullying Detected <span className="text-red-400">({flaggedPercentage}%)</span>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <Users className="w-8 h-8 text-green-400" />
          <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">Active</span>
        </div>
        <div className="text-white text-2xl mb-1">{uniqueSenders}</div>
        <div className="text-slate-400 text-sm">Unique Participants</div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="w-8 h-8 text-orange-400" />
          <span className="text-orange-400 text-xs bg-orange-400/10 px-2 py-1 rounded">Risk</span>
        </div>
        <div className="text-white text-2xl mb-1">
          {severityDistribution.high || 0}
        </div>
        <div className="text-slate-400 text-sm">High Severity Incidents</div>
      </div>
    </div>
  );
}
