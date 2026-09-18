import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Compass, CheckCircle, ArrowRight, Layers, Clock, ShieldCheck, Search } from 'lucide-react';

const careerPathsData = [
  {
    name: "Full Stack Developer",
    description: "Design and build complete web applications handling both responsive client UI and server backend APIs.",
    requiredSkills: ["JavaScript", "React", "Node.js", "Express", "SQL/MongoDB", "Git"],
    difficulty: "Intermediate to Advanced",
    roadmapDuration: "6 Months",
    readinessAreas: ["Frontend Architecture", "REST APIs", "Database Design", "Deployment"]
  },
  {
    name: "Backend Developer",
    description: "Build robust, scalable server side logic, database schemas, authentication systems, and cloud API endpoints.",
    requiredSkills: ["Node.js / Java / Python", "Express / Spring", "SQL Databases", "Redis", "REST/GraphQL"],
    difficulty: "Intermediate",
    roadmapDuration: "5 Months",
    readinessAreas: ["Server Architecture", "Database Query Optimization", "API Security"]
  },
  {
    name: "Frontend Developer",
    description: "Craft pixel-perfect, highly responsive, and accessible interactive interfaces using modern UI frameworks.",
    requiredSkills: ["HTML5", "CSS Grid/Tailwind", "JavaScript (ES6+)", "React.js", "TypeScript", "Redux"],
    difficulty: "Intermediate",
    roadmapDuration: "4 Months",
    readinessAreas: ["Component Design", "UI Performance", "State Management", "Cross-browser Compatibility"]
  },
  {
    name: "Data Scientist",
    description: "Extract actionable business insights and predictive models from structured and unstructured big datasets.",
    requiredSkills: ["Python", "Pandas", "NumPy", "Statistics", "SQL", "Scikit-Learn", "Data Visualization"],
    difficulty: "Advanced",
    roadmapDuration: "6-8 Months",
    readinessAreas: ["Exploratory Data Analysis", "Statistical Modeling", "Machine Learning Pipelines"]
  },
  {
    name: "AI/ML Engineer",
    description: "Design, train, and deploy deep learning neural networks, natural language processing models, and computer vision algorithms.",
    requiredSkills: ["Python", "PyTorch / TensorFlow", "Linear Algebra", "NLP", "Computer Vision", "MLOps"],
    difficulty: "Advanced",
    roadmapDuration: "8 Months",
    readinessAreas: ["Neural Networks", "Model Tuning", "Algorithm Complexity", "Model Deployment"]
  },
  {
    name: "Cybersecurity Analyst",
    description: "Protect institutional IT networks, systems, and sensitive data from cyber threats, vulnerabilities, and security breaches.",
    requiredSkills: ["Network Fundamentals", "Linux Administration", "Ethical Hacking", "SIEM Tools", "Cryptography"],
    difficulty: "Intermediate to Advanced",
    roadmapDuration: "6 Months",
    readinessAreas: ["Vulnerability Assessment", "Incident Response", "Security Compliance"]
  },
  {
    name: "Cloud Engineer",
    description: "Architect, deploy, and maintain scalable infrastructure on cloud platforms like AWS, Microsoft Azure, or GCP.",
    requiredSkills: ["AWS / Azure", "Linux CLI", "Networking & VPC", "Terraform", "Cloud Security"],
    difficulty: "Intermediate",
    roadmapDuration: "5 Months",
    readinessAreas: ["Cloud Resource Management", "Infrastructure as Code", "Cost Optimization"]
  },
  {
    name: "DevOps Engineer",
    description: "Bridge software development and IT operations through continuous integration, automated deployment pipelines, and containerization.",
    requiredSkills: ["Docker", "Kubernetes", "Jenkins / GitHub Actions", "Linux Bash", "AWS", "Monitoring"],
    difficulty: "Advanced",
    roadmapDuration: "6 Months",
    readinessAreas: ["CI/CD Automation", "Container Orchestration", "System Monitoring"]
  },
  {
    name: "UI/UX Designer",
    description: "Create intuitively structured wireframes, prototypes, user journeys, and visual design systems for digital products.",
    requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    difficulty: "Beginner to Intermediate",
    roadmapDuration: "4 Months",
    readinessAreas: ["User Psychology", "Interactive Prototyping", "Visual Hierarchy"]
  },
  {
    name: "Product Manager",
    description: "Lead product development strategy, define features, coordinate engineering teams, and deliver user-centric software solutions.",
    requiredSkills: ["Agile/Scrum", "User Story Mapping", "Market Research", "Data Analytics", "Roadmap Planning"],
    difficulty: "Intermediate",
    roadmapDuration: "4 Months",
    readinessAreas: ["Product Strategy", "Cross-Functional Leadership", "Metric Tracking"]
  }
];

const CareerPathsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPaths = careerPathsData.filter(path => 
    path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            EXPLORE CAREER PATHS
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            Discover in-demand technology specialization tracks, required skill benchmarks, and structured roadmap durations.
          </p>

          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search career, skill, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPaths.map((career, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{career.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {career.difficulty}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  {career.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Readiness Areas</h4>
                  <ul className="grid grid-cols-2 gap-1 text-xs text-slate-600">
                    {career.readinessAreas.map((area, aIdx) => (
                      <li key={aIdx} className="flex items-center space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Avg Duration: <strong>{career.roadmapDuration}</strong></span>
                </div>

                <a
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>View Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareerPathsPage;
