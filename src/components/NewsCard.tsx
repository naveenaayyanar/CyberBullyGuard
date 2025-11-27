import { Clock, ExternalLink, TrendingUp } from 'lucide-react';
import { News } from '../types';

interface NewsCardProps {
  news: News;
}

const categoryColors: Record<string, string> = {
  ransomware: 'bg-red-500/10 text-red-400 border-red-500/20',
  'data-breach': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  vulnerability: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  malware: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  phishing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  ddos: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export function NewsCard({ news }: NewsCardProps) {
  const timeAgo = getTimeAgo(news.timestamp);
  
  return (
    <article className="bg-slate-900 rounded-lg p-5 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded text-xs border ${categoryColors[news.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
            {news.category.replace('-', ' ').toUpperCase()}
          </span>
          {news.trending && (
            <span className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-sm whitespace-nowrap">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>
      
      <h3 className="text-white mb-2">{news.title}</h3>
      <p className="text-slate-400 text-sm mb-3">{news.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-sm">{news.source}</span>
        <button className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
          Read More <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </article>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
