import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Incident } from '../types';

interface IncidentCardProps {
  incident: Incident;
}

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/50',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/50',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/50',
};

const categoryColors: Record<string, string> = {
  ransomware: 'bg-red-500/10 text-red-400 border-red-500/20',
  'data-breach': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  vulnerability: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  malware: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  phishing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  ddos: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export function IncidentCard({ incident }: IncidentCardProps) {
  const timeAgo = getTimeAgo(incident.timestamp);
  
  return (
    <article className="bg-slate-900 rounded-lg p-5 border-l-4 border-slate-800 hover:border-slate-700 transition-colors"
      style={{ borderLeftColor: getSeverityBorderColor(incident.severity) }}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded text-xs border flex items-center gap-1 ${severityColors[incident.severity]}`}>
            <AlertTriangle className="w-3 h-3" />
            {incident.severity.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded text-xs border ${categoryColors[incident.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
            {incident.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-sm whitespace-nowrap">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>
      
      <h3 className="text-white mb-2">{incident.title}</h3>
      <p className="text-slate-400 text-sm mb-3">{incident.description}</p>
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3 h-3" />
            <span>{incident.location}</span>
          </div>
          <span className="text-slate-500">{incident.affectedOrgs} organizations affected</span>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${
          incident.status === 'ongoing' 
            ? 'bg-red-500/10 text-red-400' 
            : incident.status === 'investigating'
            ? 'bg-yellow-500/10 text-yellow-400'
            : 'bg-green-500/10 text-green-400'
        }`}>
          {incident.status.toUpperCase()}
        </span>
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

function getSeverityBorderColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#3b82f6',
  };
  return colors[severity] || '#64748b';
}
