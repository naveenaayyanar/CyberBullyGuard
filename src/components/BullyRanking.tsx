import { AnalysisResult } from '../types';
import { Trophy, TrendingDown, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BullyRankingProps {
  result: AnalysisResult;
}

export function BullyRanking({ result }: BullyRankingProps) {
  const chartData = result.bullyRanking.slice(0, 10).map(bully => ({
    name: bully.sender.split(' ')[0], // First name only for chart
    count: bully.count,
    severity: (bully.avgSeverity * 100).toFixed(1),
  }));

  const getColor = (index: number) => {
    if (index === 0) return '#ef4444';
    if (index === 1) return '#f97316';
    if (index === 2) return '#eab308';
    return '#8b5cf6';
  };

  return (
    <div>
      <h3 className="text-white mb-4">Bully Ranking</h3>
      <p className="text-slate-400 text-sm mb-6">
        Participants ranked by number of flagged messages and average severity score
      </p>

      {result.bullyRanking.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg">
          <TrendingDown className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-white mb-2">No Bullying Detected</p>
          <p className="text-slate-400 text-sm">This chat appears to be healthy and respectful</p>
        </div>
      ) : (
        <>
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8' }}
                  fontSize={12}
                />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => {
                    if (name === 'count') return [value, 'Flagged Messages'];
                    if (name === 'severity') return [value + '%', 'Avg Severity'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {result.bullyRanking.slice(0, 10).map((bully, index) => (
              <div
                key={bully.sender}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-red-500/20 text-red-400' :
                      index === 1 ? 'bg-orange-500/20 text-orange-400' :
                      index === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {index < 3 ? <Trophy className="w-4 h-4" /> : <span>#{index + 1}</span>}
                    </div>
                    <div>
                      <div className="text-white">{bully.sender}</div>
                      <div className="text-slate-400 text-xs">
                        {bully.count} flagged message{bully.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">{(bully.avgSeverity * 100).toFixed(1)}%</div>
                    <div className="text-slate-400 text-xs">Avg Severity</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${bully.avgSeverity * 100}%`,
                        backgroundColor: getColor(index),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-400 text-sm mb-1">Recommendation</h4>
                <p className="text-slate-400 text-sm">
                  Consider taking action against the top-ranked individuals. Document evidence and report to appropriate authorities if necessary.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
