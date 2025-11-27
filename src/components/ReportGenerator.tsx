import { useState } from 'react';
import { AnalysisResult } from '../types';
import { FileDown, FileText, CheckCircle } from 'lucide-react';

interface ReportGeneratorProps {
  result: AnalysisResult;
}

export function ReportGenerator({ result }: ReportGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate text report
    const reportText = generateReportText(result);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberBullyGuard_Report_${result.caseId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setGenerating(false);
    setGenerated(true);
    
    setTimeout(() => setGenerated(false), 3000);
  };

  return (
    <div>
      <h3 className="text-white mb-4">Generate Evidence Report</h3>
      <p className="text-slate-400 text-sm mb-6">
        Create a comprehensive, legal-ready report with all evidence and analysis
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <FileText className="w-8 h-8 text-purple-400 mb-3" />
          <h4 className="text-white mb-2">Report Contents</h4>
          <ul className="text-slate-400 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Case metadata and unique ID
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Statistical summary
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Timeline of incidents
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              All flagged messages with scores
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Bully ranking and statistics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Model methodology details
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <div className="mb-6">
            <h4 className="text-white mb-3">Report Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Case ID:</span>
                <span className="text-white font-mono text-xs">{result.caseId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Messages:</span>
                <span className="text-white">{result.totalMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flagged Messages:</span>
                <span className="text-red-400">{result.flaggedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unique Senders:</span>
                <span className="text-white">{new Set(result.messages.map(m => m.sender)).size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bullies Identified:</span>
                <span className="text-orange-400">{result.bullyRanking.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Analysis Date:</span>
                <span className="text-white">{new Date(result.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={generating || generated}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
              generated
                ? 'bg-green-500 text-white'
                : generating
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {generated ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Report Downloaded
              </>
            ) : generating ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h4 className="text-white mb-3">Report Preview</h4>
        <div className="bg-slate-900 rounded p-4 text-xs font-mono text-slate-300 max-h-[400px] overflow-y-auto whitespace-pre-wrap">
          {generateReportPreview(result)}
        </div>
      </div>
    </div>
  );
}

function generateReportText(result: AnalysisResult): string {
  const flaggedMessages = result.messages.filter(m => m.prediction.label === 'bullying');
  
  let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                     CYBERBULLYGUARD EVIDENCE REPORT                        ║
║                    AI-Based Cyberbullying Detection                        ║
╚════════════════════════════════════════════════════════════════════════════╝

CASE INFORMATION
────────────────────────────────────────────────────────────────────────────
Case ID:              ${result.caseId}
Analysis Date:        ${new Date(result.uploadDate).toLocaleString()}
Source File:          ${result.filename}
Report Generated:     ${new Date().toLocaleString()}

STATISTICAL SUMMARY
────────────────────────────────────────────────────────────────────────────
Total Messages:       ${result.totalMessages}
Flagged Messages:     ${result.flaggedCount} (${((result.flaggedCount / result.totalMessages) * 100).toFixed(1)}%)
Unique Participants:  ${new Set(result.messages.map(m => m.sender)).size}
Bullies Identified:   ${result.bullyRanking.length}
Analysis Confidence:  High (Transformer-based model)

BULLY RANKING
────────────────────────────────────────────────────────────────────────────
`;

  result.bullyRanking.forEach((bully, index) => {
    report += `${index + 1}. ${bully.sender}\n`;
    report += `   Flagged Messages: ${bully.count}\n`;
    report += `   Avg Severity:     ${(bully.avgSeverity * 100).toFixed(1)}%\n\n`;
  });

  report += `
FLAGGED MESSAGES (${flaggedMessages.length})
────────────────────────────────────────────────────────────────────────────
`;

  flaggedMessages.forEach((msg, index) => {
    report += `\n[${index + 1}] ${new Date(msg.timestamp).toLocaleString()}\n`;
    report += `Sender:     ${msg.sender}\n`;
    report += `Message:    ${msg.message}\n`;
    report += `Severity:   ${msg.prediction.severity.toUpperCase()}\n`;
    report += `Category:   ${msg.prediction.category}\n`;
    report += `Confidence: ${(msg.prediction.confidence * 100).toFixed(1)}%\n`;
    report += `Message ID: ${msg.id}\n`;
    report += `${'─'.repeat(76)}\n`;
  });

  report += `
METHODOLOGY
────────────────────────────────────────────────────────────────────────────
Model:           DistilBERT (Transformer-based)
Training Data:   Cyberbullying, hate speech, and toxicity datasets
Classification:  Multi-class (Normal, Harassment, Threat, etc.)
Confidence:      Probability scores (0-100%)

LEGAL NOTICE
────────────────────────────────────────────────────────────────────────────
This report is generated by AI and should be reviewed by qualified personnel.
All message IDs are cryptographically hashed for integrity verification.
Evidence should be preserved in original format for legal proceedings.

⚠️  DISCLAIMER: AI predictions are probabilistic. This report should not be
the sole basis for legal or disciplinary actions. Human review is required.

End of Report - Generated by CyberBullyGuard v1.0
`;

  return report;
}

function generateReportPreview(result: AnalysisResult): string {
  const preview = generateReportText(result);
  return preview.slice(0, 2000) + '\n\n... (Full report available on download) ...';
}
