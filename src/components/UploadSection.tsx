import { Upload, FileText, AlertCircle, Loader2, Shield } from 'lucide-react';
import { useState, useRef } from 'react';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export function UploadSection({ onFileUpload, isAnalyzing }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      onFileUpload(file);
    } else {
      alert('Please upload a .txt file (WhatsApp chat export)');
    }
  };

  const handleUseSample = () => {
    // Create a sample WhatsApp chat file
    const sampleChat = `12/25/24, 9:13 AM - John Doe: Hey, are you coming to the party?
12/25/24, 9:14 AM - Alice Smith: No, I'm not interested.
12/25/24, 9:15 AM - John Doe: You're so stupid for missing it.
12/25/24, 9:16 AM - Bob Johnson: Why would you say that? That's mean.
12/25/24, 9:17 AM - John Doe: Nobody asked you, loser.
12/25/24, 9:18 AM - Alice Smith: Please stop.
12/25/24, 9:19 AM - John Doe: You're all worthless anyway.
12/25/24, 9:20 AM - Carol White: This is getting out of hand.
12/25/24, 9:25 AM - John Doe: Shut up. I hate all of you.
12/25/24, 9:30 AM - Alice Smith: I'm leaving this group.
12/25/24, 9:31 AM - Bob Johnson: Me too. This is toxic.
12/25/24, 10:15 AM - Carol White: Can we please just be nice to each other?
12/25/24, 10:20 AM - John Doe: Whatever. You're all idiots.
12/25/24, 11:00 AM - Alice Smith: I'm reporting this behavior.
12/25/24, 11:05 AM - John Doe: Go ahead, nobody cares about you anyway.`;
    
    const blob = new Blob([sampleChat], { type: 'text/plain' });
    const file = new File([blob], 'sample_chat.txt', { type: 'text/plain' });
    onFileUpload(file);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-12 text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-white mb-2">Analyzing Chat...</h2>
          <p className="text-slate-400 text-sm">Processing messages with AI classifier</p>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Parsing messages</span>
              <span className="text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Running AI detection</span>
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Generating report</span>
              <span className="text-slate-600">○</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <div className="text-center mb-8">
        <h2 className="text-white mb-2">Upload Chat Export for Analysis</h2>
        <p className="text-slate-400">
          Analyze WhatsApp or other chat exports to detect cyberbullying incidents
        </p>
      </div>

      <div
        className={`bg-slate-900/50 backdrop-blur-sm border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          dragActive 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-slate-700 hover:border-slate-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-white mb-2">Drop your chat file here</h3>
        <p className="text-slate-400 text-sm mb-6">
          or click to browse (.txt files only)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleChange}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          Select File
        </button>
        
        <button
          onClick={handleUseSample}
          className="ml-3 bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
        >
          Use Sample Chat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <FileText className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-white text-sm mb-2">Supported Formats</h3>
          <p className="text-slate-400 text-sm">
            WhatsApp .txt exports, Telegram, Discord, and custom chat formats
          </p>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <Shield className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-white text-sm mb-2">Privacy First</h3>
          <p className="text-slate-400 text-sm">
            All processing happens locally. Your data never leaves your device.
          </p>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <AlertCircle className="w-8 h-8 text-yellow-400 mb-3" />
          <h3 className="text-white text-sm mb-2">AI-Powered</h3>
          <p className="text-slate-400 text-sm">
            BERT-based transformer model trained on cyberbullying datasets
          </p>
        </div>
      </div>

      <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 text-sm mb-1">How to Export WhatsApp Chats</h4>
            <p className="text-slate-400 text-sm">
              Open chat → Menu (⋮) → More → Export chat → Without media → Save as .txt file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
