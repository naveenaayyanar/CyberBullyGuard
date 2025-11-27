import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  selectedType: string;
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
}

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'ransomware', label: 'Ransomware' },
  { id: 'data-breach', label: 'Data Breach' },
  { id: 'vulnerability', label: 'Vulnerability' },
  { id: 'malware', label: 'Malware' },
  { id: 'phishing', label: 'Phishing' },
  { id: 'ddos', label: 'DDoS' },
];

const types = [
  { id: 'all', label: 'All Types' },
  { id: 'article', label: 'Articles' },
  { id: 'incident', label: 'Incidents' },
];

export function FilterBar({ selectedCategory, selectedType, onCategoryChange, onTypeChange }: FilterBarProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-cyan-400" />
        <span className="text-white">Filters</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Category</label>
          <select 
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Type</label>
          <select 
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
          >
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
