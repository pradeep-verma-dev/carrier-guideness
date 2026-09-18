import studentsData from '../data/students.json';
import teachersData from '../data/teachers.json';
import adminsData from '../data/admins.json';
import coursesData from '../data/courses.json';
import certsData from '../data/certifications.json';
import internshipsData from '../data/internships.json';
import examsData from '../data/exams.json';
import placementData from '../data/placement.json';
import higherEdData from '../data/higherEducation.json';
import roadmapsData from '../data/roadmaps.json';
import messagesData from '../data/messages.json';
import chatHistoryData from '../data/chatHistory.json';

const STORAGE_KEYS = {
  STUDENTS: 'crp_students',
  TEACHERS: 'crp_teachers',
  ADMINS: 'crp_admins',
  COURSES: 'crp_courses',
  CERTS: 'crp_certifications',
  INTERNSHIPS: 'crp_internships',
  EXAMS: 'crp_exams',
  PLACEMENT: 'crp_placement',
  HIGHER_ED: 'crp_higherEducation',
  ROADMAPS: 'crp_roadmaps',
  MESSAGES: 'crp_messages',
  CHAT_HISTORY: 'crp_chatHistory',
  AUTH_USER: 'user',
  AUTH_TOKEN: 'token'
};

// Initialize localStorage with preset JSON seed data if missing
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachersData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(adminsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(coursesData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CERTS)) {
    localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INTERNSHIPS)) {
    localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(internshipsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(examsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PLACEMENT)) {
    localStorage.setItem(STORAGE_KEYS.PLACEMENT, JSON.stringify(placementData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HIGHER_ED)) {
    localStorage.setItem(STORAGE_KEYS.HIGHER_ED, JSON.stringify(higherEdData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROADMAPS)) {
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmapsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistoryData));
  }
};

export const getStorageData = (key, defaultVal = []) => {
  initStorage();
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Export entire database as a single combined JSON object
export const exportAllDatabase = () => {
  initStorage();
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    students: getStorageData(STORAGE_KEYS.STUDENTS),
    teachers: getStorageData(STORAGE_KEYS.TEACHERS),
    admins: getStorageData(STORAGE_KEYS.ADMINS),
    courses: getStorageData(STORAGE_KEYS.COURSES),
    certifications: getStorageData(STORAGE_KEYS.CERTS),
    internships: getStorageData(STORAGE_KEYS.INTERNSHIPS),
    exams: getStorageData(STORAGE_KEYS.EXAMS),
    placement: getStorageData(STORAGE_KEYS.PLACEMENT),
    higherEducation: getStorageData(STORAGE_KEYS.HIGHER_ED),
    roadmaps: getStorageData(STORAGE_KEYS.ROADMAPS),
    messages: getStorageData(STORAGE_KEYS.MESSAGES),
    chatHistory: getStorageData(STORAGE_KEYS.CHAT_HISTORY)
  };
};

// Direct JSON Upload & Database Import Engine
export const importDatabaseJSON = (jsonData, mode = 'merge') => {
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Invalid JSON format');
  }

  const keyMap = {
    students: STORAGE_KEYS.STUDENTS,
    teachers: STORAGE_KEYS.TEACHERS,
    admins: STORAGE_KEYS.ADMINS,
    courses: STORAGE_KEYS.COURSES,
    certifications: STORAGE_KEYS.CERTS,
    internships: STORAGE_KEYS.INTERNSHIPS,
    exams: STORAGE_KEYS.EXAMS,
    placement: STORAGE_KEYS.PLACEMENT,
    higherEducation: STORAGE_KEYS.HIGHER_ED,
    roadmaps: STORAGE_KEYS.ROADMAPS,
    messages: STORAGE_KEYS.MESSAGES,
    chatHistory: STORAGE_KEYS.CHAT_HISTORY
  };

  let importedCount = 0;

  // Case 1: Uploading a full multi-table JSON export file
  Object.keys(keyMap).forEach(tableKey => {
    const storageKey = keyMap[tableKey];
    if (Array.isArray(jsonData[tableKey])) {
      if (mode === 'replace') {
        setStorageData(storageKey, jsonData[tableKey]);
      } else {
        const existing = getStorageData(storageKey);
        const existingIds = new Set(existing.map(item => item.id || item.studentId));
        const newItems = jsonData[tableKey].filter(item => !existingIds.has(item.id || item.studentId));
        setStorageData(storageKey, [...existing, ...newItems]);
      }
      importedCount += jsonData[tableKey].length;
    }
  });

  // Case 2: Uploading a single array (e.g. uploaded students list or courses list directly)
  if (Array.isArray(jsonData)) {
    if (jsonData.length > 0 && jsonData[0].studentId && jsonData[0].readiness !== undefined) {
      // Detected student array
      setStorageData(STORAGE_KEYS.STUDENTS, mode === 'replace' ? jsonData : [...getStorageData(STORAGE_KEYS.STUDENTS), ...jsonData]);
      importedCount += jsonData.length;
    } else if (jsonData.length > 0 && jsonData[0].provider) {
      // Detected courses/certifications array
      setStorageData(STORAGE_KEYS.COURSES, mode === 'replace' ? jsonData : [...getStorageData(STORAGE_KEYS.COURSES), ...jsonData]);
      importedCount += jsonData.length;
    }
  }

  return { success: true, count: importedCount };
};

// Reset database back to default JSON seed data
export const resetDatabaseToDefaults = () => {
  Object.values(STORAGE_KEYS).forEach(k => {
    if (k !== STORAGE_KEYS.AUTH_USER && k !== STORAGE_KEYS.AUTH_TOKEN) {
      localStorage.removeItem(k);
    }
  });
  initStorage();
};

// Helper: Download JSON object to user's computer
export const downloadJSONFile = (filename, data) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Helper: Download Array of objects to CSV file
export const downloadCSVFile = (filename, headers, rows) => {
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map(h => escapeCSV(h.label || h.key || h)).join(',');
  const dataRows = rows.map(row => {
    return headers.map(h => {
      const key = h.key || h;
      const val = row[key];
      if (Array.isArray(val)) return escapeCSV(val.join('; '));
      if (typeof val === 'object' && val !== null) return escapeCSV(JSON.stringify(val));
      return escapeCSV(val);
    }).join(',');
  });

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export { STORAGE_KEYS };

