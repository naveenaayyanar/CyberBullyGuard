import { NewsCard } from './NewsCard';
import { IncidentCard } from './IncidentCard';
import { NewsItem } from '../types';

interface NewsGridProps {
  items: NewsItem[];
}

export function NewsGrid({ items }: NewsGridProps) {
  if (items.length === 0) {
    return (
      <div className="bg-slate-900 rounded-lg p-12 border border-slate-800 text-center">
        <p className="text-slate-400">No items match your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        item.type === 'incident' ? (
          <IncidentCard key={item.id} incident={item as any} />
        ) : (
          <NewsCard key={item.id} news={item as any} />
        )
      ))}
    </div>
  );
}
