import { useState } from 'react';
import { AnalysisResult, AnalyzedMessage } from '../types';
import { AlertTriangle, User, Clock, Info } from 'lucide-react';

interface MessageListProps {
  result: AnalysisResult;
}

export function MessageList({ result }: MessageListProps) {
  const [filter, setFilter] = useState<'all' | 'flagged'>('flagged');
  const [selectedMessage, setSelectedMessage] = useState<AnalyzedMessage | null>(null);

  const filteredMessages = result.messages.filter(msg => {
    if (filter === 'flagged') {
      return msg.prediction.label === 'bullying';
    }
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white mb-1">Message Analysis</h3>
          <p className="text-slate-400 text-sm">
            Detailed view of analyzed messages with AI predictions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'all'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({result.messages.length})
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'flagged'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Flagged ({result.flaggedCount})
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            onClick={() => setSelectedMessage(msg)}
            className={`bg-slate-800/50 rounded-lg p-4 border cursor-pointer transition-all ${
              msg.prediction.label === 'bullying'
                ? 'border-red-500/30 hover:border-red-500/50'
                : 'border-slate-700 hover:border-slate-600'
            } ${selectedMessage?.id === msg.id ? 'ring-2 ring-purple-500' : ''}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-white text-sm">{msg.sender}</span>
              </div>
              <div className="flex items-center gap-2">
                {msg.prediction.label === 'bullying' && (
                  <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(msg.prediction.severity)}`}>
                    {msg.prediction.severity.toUpperCase()}
                  </span>
                )}
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-3">{msg.message}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <span className={`px-2 py-1 rounded ${
                  msg.prediction.label === 'bullying'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {msg.prediction.label === 'bullying' ? 'Cyberbullying' : 'Normal'}
                </span>
                {msg.prediction.category !== 'normal' && (
                  <span className="text-slate-500">
                    Category: <span className="text-slate-400">{msg.prediction.category}</span>
                  </span>
                )}
              </div>
              <div className="text-slate-400 text-xs">
                Confidence: <span className="text-purple-400">{(msg.prediction.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMessage && (
        <div className="mt-6 bg-slate-800/50 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm">Detailed Analysis</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Message ID:</span>
              <div className="text-slate-300 text-xs font-mono mt-1">{selectedMessage.id}</div>
            </div>
            <div>
              <span className="text-slate-400">Timestamp:</span>
              <div className="text-slate-300 mt-1">{new Date(selectedMessage.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <span className="text-slate-400">Classification:</span>
              <div className="text-slate-300 mt-1 capitalize">{selectedMessage.prediction.label}</div>
            </div>
            <div>
              <span className="text-slate-400">Confidence Score:</span>
              <div className="text-slate-300 mt-1">{(selectedMessage.prediction.confidence * 100).toFixed(2)}%</div>
            </div>
            <div>
              <span className="text-slate-400">Severity Level:</span>
              <div className="text-slate-300 mt-1 capitalize">{selectedMessage.prediction.severity}</div>
            </div>
            <div>
              <span className="text-slate-400">Category:</span>
              <div className="text-slate-300 mt-1 capitalize">{selectedMessage.prediction.category}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
