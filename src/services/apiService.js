import { GoogleGenerativeAI } from '@google/generative-ai';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageService';

const SYSTEM_INSTRUCTION = `You are Career Roadmap AI Assistant, an educational career guidance assistant.

Help students with career planning, skill development, learning roadmaps, certifications, internships, placement preparation, competitive examinations, resume preparation and higher education.

Give practical and structured answers.

Do not pretend to be a real teacher or human.

Do not guarantee jobs, salaries or admission outcomes.

When recommending a roadmap, organize it step-by-step.

Keep answers understandable for college students.`;

export const loginUser = (email, password) => {
  const students = getStorageData(STORAGE_KEYS.STUDENTS);
  const teachers = getStorageData(STORAGE_KEYS.TEACHERS);
  const admins = getStorageData(STORAGE_KEYS.ADMINS);

  let user = students.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (!user) user = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
  if (!user) user = admins.find(a => a.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('Invalid credentials. User not found.');
  }

  // Plain text password comparison
  if (user.password !== password) {
    throw new Error('Invalid credentials. Incorrect password.');
  }

  const token = `token_${Date.now()}_${user.id}`;
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    studentId: user.studentId || null,
    section: user.section || user.assignedSection || null,
    careerGoal: user.careerGoal || null
  };

  return { user: userData, token };
};

export const getStudentProfile = (userId) => {
  const students = getStorageData(STORAGE_KEYS.STUDENTS);
  return students.find(s => s.id === userId) || null;
};

export const getStudentRoadmap = (userId) => {
  const roadmaps = getStorageData(STORAGE_KEYS.ROADMAPS);
  let studentRoadmap = roadmaps.find(r => r.studentId === userId);

  if (!studentRoadmap) {
    const student = getStudentProfile(userId);
    const careerGoal = student?.careerGoal || "Full Stack Developer";
    studentRoadmap = {
      studentId: userId,
      careerGoal: careerGoal,
      steps: [
        { id: "step1", name: "Programming Fundamentals", status: "Completed", skills: ["Logic", "Variables", "Loops"], description: "Master core programming concepts and problem solving." },
        { id: "step2", name: "HTML + CSS + JavaScript", status: "Completed", skills: ["HTML5", "CSS Grid", "DOM API"], description: "Learn fundamentals of responsive web interfaces." },
        { id: "step3", name: "Git & GitHub", status: "Completed", skills: ["Git Basics", "Pull Requests"], description: "Source code management and open source collaboration." },
        { id: "step4", name: "React Framework", status: "In Progress", skills: ["Components", "JSX", "Hooks"], description: "Modern reactive user interfaces and frontend state." },
        { id: "step5", name: "Node.js & Express Backend", status: "In Progress", skills: ["Node Runtime", "REST Endpoints"], description: "Server side development and API design." },
        { id: "step6", name: "Database Design (SQL)", status: "Not Started", skills: ["PostgreSQL/MySQL", "Queries"], description: "Relational database modeling and performance optimization." },
        { id: "step7", name: "Full Stack Projects", status: "Not Started", skills: ["Authentication", "Deployment"], description: "Build and deploy production-ready full-stack apps." },
        { id: "step8", name: "Tech Internship Preparation", status: "In Progress", skills: ["Resume", "Interview Practice"], description: "Gain industry experience through project internships." },
        { id: "step9", name: "Placement Preparation", status: "In Progress", skills: ["DSA", "Aptitude", "HR Mock"], description: "Rigorous preparation for campus placement drives." },
        { id: "step10", name: careerGoal, status: "Not Started", skills: ["Job Ready"], description: "Achieving target career position in tech industry." }
      ]
    };
    roadmaps.push(studentRoadmap);
    setStorageData(STORAGE_KEYS.ROADMAPS, roadmaps);
  }

  return studentRoadmap;
};

export const updateRoadmapStepStatus = (userId, stepId, status) => {
  const roadmaps = getStorageData(STORAGE_KEYS.ROADMAPS);
  const studentRoadmap = roadmaps.find(r => r.studentId === userId);

  if (studentRoadmap) {
    const step = studentRoadmap.steps.find(s => s.id === stepId);
    if (step) {
      step.status = status;
      setStorageData(STORAGE_KEYS.ROADMAPS, roadmaps);

      // Recalculate readiness
      const completedCount = studentRoadmap.steps.filter(s => s.status === 'Completed').length;
      const readinessScore = Math.min(100, Math.round((completedCount / studentRoadmap.steps.length) * 100));

      const students = getStorageData(STORAGE_KEYS.STUDENTS);
      const student = students.find(s => s.id === userId);
      if (student) {
        student.readiness = readinessScore;
        setStorageData(STORAGE_KEYS.STUDENTS, students);
      }
      return { roadmap: studentRoadmap, readiness: readinessScore };
    }
  }
  return null;
};

export const updateSkillProgress = (userId, skillName, progress) => {
  const students = getStorageData(STORAGE_KEYS.STUDENTS);
  const student = students.find(s => s.id === userId);
  if (student && student.skills) {
    student.skills = student.skills.map(s => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        return { ...s, progress: Number(progress) };
      }
      return s;
    });
    setStorageData(STORAGE_KEYS.STUDENTS, students);
    return student.skills;
  }
  return [];
};

export const getResources = (type) => {
  const keyMap = {
    courses: STORAGE_KEYS.COURSES,
    certifications: STORAGE_KEYS.CERTS,
    internships: STORAGE_KEYS.INTERNSHIPS,
    exams: STORAGE_KEYS.EXAMS,
    placement: STORAGE_KEYS.PLACEMENT,
    'higher-education': STORAGE_KEYS.HIGHER_ED
  };
  return getStorageData(keyMap[type] || STORAGE_KEYS.COURSES);
};

export const saveAdminResource = (type, itemData, editId = null) => {
  const keyMap = {
    courses: STORAGE_KEYS.COURSES,
    certifications: STORAGE_KEYS.CERTS,
    internships: STORAGE_KEYS.INTERNSHIPS,
    exams: STORAGE_KEYS.EXAMS,
    placement: STORAGE_KEYS.PLACEMENT,
    'higher-education': STORAGE_KEYS.HIGHER_ED
  };
  const key = keyMap[type] || STORAGE_KEYS.COURSES;
  const items = getStorageData(key);

  if (editId) {
    const idx = items.findIndex(i => String(i.id) === String(editId));
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...itemData };
    }
  } else {
    items.push({ id: `item_${Date.now()}`, ...itemData });
  }

  setStorageData(key, items);
  return items;
};

export const deleteAdminResource = (type, id) => {
  const keyMap = {
    courses: STORAGE_KEYS.COURSES,
    certifications: STORAGE_KEYS.CERTS,
    internships: STORAGE_KEYS.INTERNSHIPS,
    exams: STORAGE_KEYS.EXAMS,
    placement: STORAGE_KEYS.PLACEMENT,
    'higher-education': STORAGE_KEYS.HIGHER_ED
  };
  const key = keyMap[type] || STORAGE_KEYS.COURSES;
  const items = getStorageData(key);
  const filtered = items.filter(i => String(i.id) !== String(id));
  setStorageData(key, filtered);
  return filtered;
};

export const submitStudentMessage = (userId, subject, category, message) => {
  const students = getStorageData(STORAGE_KEYS.STUDENTS);
  const student = students.find(s => s.id === userId);
  const messages = getStorageData(STORAGE_KEYS.MESSAGES);

  const newMsg = {
    id: `msg_${Date.now()}`,
    studentId: userId,
    studentName: student?.name || 'Student',
    section: student?.section || 'CSE-A',
    subject,
    category,
    message,
    date: new Date().toLocaleString(),
    status: 'Pending',
    reply: null,
    repliedAt: null
  };

  messages.unshift(newMsg);
  setStorageData(STORAGE_KEYS.MESSAGES, messages);
  return newMsg;
};

export const replyTeacherMessage = (msgId, reply, teacherName) => {
  const messages = getStorageData(STORAGE_KEYS.MESSAGES);
  const msg = messages.find(m => m.id === msgId);
  if (msg) {
    msg.reply = reply;
    msg.status = 'Resolved';
    msg.repliedAt = new Date().toLocaleString();
    msg.teacherName = teacherName;
    setStorageData(STORAGE_KEYS.MESSAGES, messages);
  }
  return messages;
};

export const processAIChat = async (userId, userMessage, chatId = null) => {
  const student = getStudentProfile(userId);
  const careerGoal = student?.careerGoal || "Software Engineering";
  const userSkills = student?.skills?.map(s => s.name).join(', ') || "Programming";
  const skillGaps = student?.skillGaps?.join(', ') || "Advanced topics";

  let replyText = "";
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `${SYSTEM_INSTRUCTION}

[STUDENT CONTEXT]
Student Name: ${student?.name || 'Student'}
Career Goal: ${careerGoal}
Current Skills: ${userSkills}
Identified Skill Gaps: ${skillGaps}
Readiness Level: ${student?.readiness || 50}%

[STUDENT QUESTION]
${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      replyText = response.text();
    } catch (e) {
      replyText = getFallbackResponse(userMessage, careerGoal);
    }
  } else {
    replyText = getFallbackResponse(userMessage, careerGoal);
  }

  const chatHistory = getStorageData(STORAGE_KEYS.CHAT_HISTORY);
  let currentChat = null;
  let targetChatId = chatId;

  if (targetChatId) {
    currentChat = chatHistory.find(c => c.chatId === targetChatId && c.userId === userId);
  }

  const now = new Date().toISOString();

  if (!currentChat) {
    targetChatId = `chat_${Date.now()}`;
    currentChat = {
      chatId: targetChatId,
      userId: userId,
      title: userMessage.length > 30 ? userMessage.substring(0, 30) + '...' : userMessage,
      createdAt: now,
      messages: []
    };
    chatHistory.unshift(currentChat);
  }

  currentChat.messages.push(
    { role: 'user', content: userMessage, timestamp: now },
    { role: 'assistant', content: replyText, timestamp: new Date().toISOString() }
  );

  setStorageData(STORAGE_KEYS.CHAT_HISTORY, chatHistory);

  return { chatId: targetChatId, reply: replyText, chat: currentChat };
};

function getFallbackResponse(message, careerGoal) {
  const query = message.toLowerCase();
  if (query.includes('after b.tech') || query.includes('career path') || query.includes('choose')) {
    return `### Recommended Career Direction After B.Tech:
1. **Core Development Path**: Focus on **${careerGoal}** or Full Stack Engineering. Demand is extremely high for engineers proficient in JavaScript/React and Node.js.
2. **Specialized AI/Data Path**: Explore Data Science or AI/ML if you have strong statistical foundations.
3. **Higher Education**: Consider GATE for M.Tech at top IITs or GRE for MS abroad.

**Next Steps**: Focus on building 2-3 portfolio projects and resolving core DSA topics.`;
  }

  if (query.includes('full stack') || query.includes('skills')) {
    return `### Key Skill Blueprint for Full Stack Developers:
- **Frontend Mastery**: HTML5, CSS Flexbox/Grid, JavaScript (ES6+), React.js.
- **Backend Architecture**: Node.js & Express.js, RESTful API design.
- **Data Persistence**: Relational DB (SQL/PostgreSQL) and NoSQL (MongoDB).
- **Tooling & Cloud**: Git/GitHub, Docker basics, deployment on Vercel/AWS.

*Tip: Complete the Courses & Certifications modules in your dashboard to track progress.*`;
  }

  return `### AI Career Guidance:
To excel in **${careerGoal}**, ensure you maintain a balance between technical domain skills and project execution. 

- **Focus Area**: Work on bridging your identified skill gaps.
- **Action Plan**: Complete 1 industrial certification and apply for demo internships to validate your expertise.`;
}
