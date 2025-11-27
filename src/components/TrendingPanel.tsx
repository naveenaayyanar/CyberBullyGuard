import { TrendingUp, ArrowUp } from 'lucide-react';
import { Trend } from '../types';

interface TrendingPanelProps {
  trends: Trend[];
}

export function TrendingPanel({ trends }: TrendingPanelProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-5 border border-slate-800 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        <h2 className="text-white">Trending Topics</h2>
      </div>
      
      <div className="space-y-3">
        {trends.map((trend, index) => (
          <div key={trend.id} className="pb-3 border-b border-slate-800 last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-slate-300 text-sm">{trend.topic}</span>
              <span className="flex items-center gap-1 text-xs text-cyan-400">
                <ArrowUp className="w-3 h-3" />
                {trend.mentions}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((trend.mentions / trends[0].mentions) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-800">
        <h3 className="text-white text-sm mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded p-3">
            <div className="text-cyan-400">127</div>
            <div className="text-slate-400 text-xs">Active Threats</div>
          </div>
          <div className="bg-slate-800 rounded p-3">
            <div className="text-orange-400">43</div>
            <div className="text-slate-400 text-xs">Critical CVEs</div>
          </div>
          <div className="bg-slate-800 rounded p-3">
            <div className="text-red-400">89</div>
            <div className="text-slate-400 text-xs">Data Breaches</div>
          </div>
          <div className="bg-slate-800 rounded p-3">
            <div className="text-green-400">156</div>
            <div className="text-slate-400 text-xs">Updates Today</div>
          </div>
        </div>
      </div>
    </div>
  );
}
