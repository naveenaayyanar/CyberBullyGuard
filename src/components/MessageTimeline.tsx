import { AnalysisResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MessageTimelineProps {
  result: AnalysisResult;
}

export function MessageTimeline({ result }: MessageTimelineProps) {
  // Group messages by hour
  const timelineData = result.messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp);
    const hourKey = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
    
    if (!acc[hourKey]) {
      acc[hourKey] = { time: hourKey, total: 0, flagged: 0 };
    }
    
    acc[hourKey].total++;
    if (msg.prediction.label === 'bullying') {
      acc[hourKey].flagged++;
    }
    
    return acc;
  }, {} as Record<string, { time: string; total: number; flagged: number }>);

  const chartData = Object.values(timelineData);

  return (
    <div>
      <h3 className="text-white mb-4">Message Activity Timeline</h3>
      <p className="text-slate-400 text-sm mb-6">
        Visualization of message frequency and flagged content over time
      </p>

      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="time" 
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
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorTotal)" 
              name="Total Messages"
            />
            <Area 
              type="monotone" 
              dataKey="flagged" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorFlagged)" 
              name="Flagged Messages"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="text-slate-400 text-sm mb-1">Peak Activity</div>
          <div className="text-white">
            {chartData.reduce((max, d) => d.total > max.total ? d : max, chartData[0])?.time || 'N/A'}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="text-slate-400 text-sm mb-1">Most Dangerous Period</div>
          <div className="text-red-400">
            {chartData.reduce((max, d) => d.flagged > max.flagged ? d : max, chartData[0])?.time || 'N/A'}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="text-slate-400 text-sm mb-1">Average Messages/Hour</div>
          <div className="text-white">
            {(result.totalMessages / chartData.length).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
