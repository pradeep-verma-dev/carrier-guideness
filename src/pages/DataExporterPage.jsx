import React, { useState, useMemo } from 'react';
import { Download, Filter, FileSpreadsheet, FileJson, Search, Upload, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import DataUploadModal from '../components/DataUploadModal';
import { getStorageData, STORAGE_KEYS, downloadJSONFile, downloadCSVFile } from '../services/storageService';

export default function DataExporterPage() {
  const [activeCategory, setActiveCategory] = useState('students');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [readinessFilter, setReadinessFilter] = useState('ALL');
  const [goalFilter, setGoalFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch raw dataset based on selected category
  const rawData = useMemo(() => {
    switch (activeCategory) {
      case 'students':
        return getStorageData(STORAGE_KEYS.STUDENTS);
      case 'courses':
        return getStorageData(STORAGE_KEYS.COURSES);
      case 'roadmaps':
        return getStorageData(STORAGE_KEYS.ROADMAPS);
      case 'certifications':
        return getStorageData(STORAGE_KEYS.CERTS);
      case 'internships':
        return getStorageData(STORAGE_KEYS.INTERNSHIPS);
      case 'placement':
        return getStorageData(STORAGE_KEYS.PLACEMENT);
      case 'higherEducation':
        return getStorageData(STORAGE_KEYS.HIGHER_ED);
      case 'teachers':
        return getStorageData(STORAGE_KEYS.TEACHERS);
      default:
        return getStorageData(STORAGE_KEYS.STUDENTS);
    }
  }, [activeCategory, refreshKey]);

  // Extract unique sections & goals for dropdowns
  const availableSections = useMemo(() => {
    if (activeCategory !== 'students' && activeCategory !== 'teachers') return [];
    const set = new Set(rawData.map(item => item.section || item.assignedSection).filter(Boolean));
    return Array.from(set);
  }, [rawData, activeCategory]);

  const availableGoals = useMemo(() => {
    if (activeCategory !== 'students' && activeCategory !== 'roadmaps') return [];
    const set = new Set(rawData.map(item => item.careerGoal || item.goal).filter(Boolean));
    return Array.from(set);
  }, [rawData, activeCategory]);

  // Apply filters
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      // Section filter
      if (sectionFilter !== 'ALL') {
        const itemSec = item.section || item.assignedSection;
        if (itemSec !== sectionFilter) return false;
      }

      // Readiness filter (for students)
      if (readinessFilter !== 'ALL' && activeCategory === 'students') {
        const r = item.readiness || 0;
        if (readinessFilter === 'LOW' && r >= 40) return false;
        if (readinessFilter === 'MEDIUM' && (r < 40 || r > 75)) return false;
        if (readinessFilter === 'HIGH' && r <= 75) return false;
      }

      // Goal filter
      if (goalFilter !== 'ALL') {
        const itemGoal = item.careerGoal || item.goal;
        if (itemGoal !== goalFilter) return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const strVal = JSON.stringify(item).toLowerCase();
        if (!strVal.includes(q)) return false;
      }

      return true;
    });
  }, [rawData, sectionFilter, readinessFilter, goalFilter, searchQuery, activeCategory]);

  // Handle Downloads
  const handleDownloadJSON = () => {
    const filename = `filtered_${activeCategory}_${sectionFilter}_${Date.now()}.json`;
    downloadJSONFile(filename, filteredData);
  };

  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;

    let headers = [];
    if (activeCategory === 'students') {
      headers = [
        { key: 'studentId', label: 'Student ID' },
        { key: 'name', label: 'Student Name' },
        { key: 'email', label: 'Email' },
        { key: 'section', label: 'Section' },
        { key: 'careerGoal', label: 'Career Goal' },
        { key: 'readiness', label: 'Readiness (%)' },
        { key: 'skills', label: 'Skills' }
      ];
    } else if (activeCategory === 'courses') {
      headers = [
        { key: 'title', label: 'Course Title' },
        { key: 'provider', label: 'Provider' },
        { key: 'duration', label: 'Duration' },
        { key: 'rating', label: 'Rating' },
        { key: 'skills', label: 'Skills Covered' },
        { key: 'link', label: 'Course Link' }
      ];
    } else {
      const sample = filteredData[0];
      headers = Object.keys(sample).map(k => ({ key: k, label: k.toUpperCase() }));
    }

    const filename = `filtered_${activeCategory}_${sectionFilter}_${Date.now()}.csv`;
    downloadCSVFile(filename, headers, filteredData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* Header Title Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/30">
              <Layers className="w-3.5 h-3.5" /> Direct Data Management & Filter Engine
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Data Upload & Filtered Download Hub</h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">
              Upload custom JSON database files directly to your serverless site, or filter datasets by section, readiness, and stream to download customized JSON and CSV files.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition flex items-center gap-2 text-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Direct Upload JSON
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200/80 mb-6 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'students', label: 'Students' },
            { id: 'courses', label: 'Courses' },
            { id: 'roadmaps', label: 'Career Roadmaps' },
            { id: 'certifications', label: 'Certifications' },
            { id: 'internships', label: 'Internships' },
            { id: 'placement', label: 'Placement Prep' },
            { id: 'higherEducation', label: 'Higher Ed' },
            { id: 'teachers', label: 'Teachers' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSectionFilter('ALL');
                setReadinessFilter('ALL');
                setGoalFilter('ALL');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" /> Filter Criteria
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-indigo-600">{filteredData.length}</strong> of {rawData.length} records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, name, skill..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Section / Stream Filter */}
            {availableSections.length > 0 && (
              <div>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="ALL">All Sections / Streams</option>
                  {availableSections.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Readiness Filter (For Students) */}
            {activeCategory === 'students' && (
              <div>
                <select
                  value={readinessFilter}
                  onChange={(e) => setReadinessFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="ALL">All Readiness Levels</option>
                  <option value="HIGH">High Readiness (&gt;75%)</option>
                  <option value="MEDIUM">Medium Readiness (40-75%)</option>
                  <option value="LOW">Low Readiness (&lt;40%)</option>
                </select>
              </div>
            )}

            {/* Career Goal Filter */}
            {availableGoals.length > 0 && (
              <div>
                <select
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="ALL">All Career Goals</option>
                  {availableGoals.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Download Buttons Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Download Filtered Output:</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadJSON}
                disabled={filteredData.length === 0}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <FileJson className="w-4 h-4 text-indigo-200" />
                Download JSON ({filteredData.length})
              </button>

              <button
                onClick={handleDownloadCSV}
                disabled={filteredData.length === 0}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                Download CSV Excel ({filteredData.length})
              </button>
            </div>
          </div>

        </div>

        {/* Data Preview Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Live Filtered Preview ({filteredData.length} Records)
            </h3>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            {filteredData.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="text-sm font-semibold">No records match your filter criteria.</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing filters or uploading new JSON data.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="p-3.5">#</th>
                    {Object.keys(filteredData[0]).slice(0, 6).map(key => (
                      <th key={key} className="p-3.5">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/30 transition">
                      <td className="p-3.5 text-slate-400 font-sans">{idx + 1}</td>
                      {Object.keys(filteredData[0]).slice(0, 6).map(key => {
                        const val = row[key];
                        const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                        return (
                          <td key={key} className="p-3.5 max-w-xs truncate text-slate-700">
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>

      {/* Upload Modal */}
      <DataUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDataUpdated={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  );
}
