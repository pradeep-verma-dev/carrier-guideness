import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Download, RefreshCw, X } from 'lucide-react';
import { importDatabaseJSON, resetDatabaseToDefaults, exportAllDatabase, downloadJSONFile } from '../services/storageService';

export default function DataUploadModal({ isOpen, onClose, onDataUpdated }) {
  const [file, setFile] = useState(null);
  const [importMode, setImportMode] = useState('merge'); // 'merge' or 'replace'
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.json')) {
        setStatus({ type: 'error', msg: 'Please select a valid .json file.' });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setStatus({ type: '', msg: '' });
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select a JSON file to upload.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const res = importDatabaseJSON(parsed, importMode);
          setStatus({
            type: 'success',
            msg: `Successfully imported ${res.count} items into website database!`
          });
          setFile(null);
          if (onDataUpdated) onDataUpdated();
        } catch (err) {
          setStatus({ type: 'error', msg: `Failed to parse JSON: ${err.message}` });
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } catch (e) {
      setStatus({ type: 'error', msg: e.message });
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset the database to original initial JSON files? Custom changes will be reset.')) {
      resetDatabaseToDefaults();
      setStatus({ type: 'success', msg: 'Database successfully reset to original seed JSON data.' });
      if (onDataUpdated) onDataUpdated();
    }
  };

  const handleBackupDownload = () => {
    const dbData = exportAllDatabase();
    downloadJSONFile(`career_portal_full_backup_${Date.now()}.json`, dbData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              Direct JSON Data Upload Hub
            </h3>
            <p className="text-xs text-indigo-200 mt-1">
              Upload JSON database files directly to serverless storage
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Status alert */}
          {status.msg && (
            <div className={`p-4 rounded-xl text-xs font-medium flex items-start gap-2.5 ${
              status.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {status.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{status.msg}</span>
            </div>
          )}

          {/* Upload Area */}
          <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition bg-indigo-50/40">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileChange} 
              id="json-file-input" 
              className="hidden" 
            />
            <label htmlFor="json-file-input" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {file ? file.name : "Click to select .JSON file from computer"}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Supports complete DB backup JSON or specific tables (students.json, courses.json, etc.)
              </span>
            </label>
          </div>

          {/* Import Mode Options */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Import Behavior:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setImportMode('merge')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                  importMode === 'merge' 
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-800">Merge Datasets</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Append new entries without overwriting existing IDs</div>
              </button>

              <button
                type="button"
                onClick={() => setImportMode('replace')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                  importMode === 'replace' 
                    ? 'border-amber-600 bg-amber-50/60 text-amber-900 ring-2 ring-amber-500/20' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-800">Overwrite / Replace</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Replace current database with uploaded file content</div>
              </button>
            </div>
          </div>

        {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleUploadSubmit}
              disabled={!file || loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload & Update Website Database
            </button>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBackupDownload}
                className="text-xs text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Current DB Backup
              </button>

              <button
                type="button"
                onClick={handleResetToDefaults}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Seed Data
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
