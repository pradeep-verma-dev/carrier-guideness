import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Compass, Target, Map, Award, Briefcase, GraduationCap, 
  UserCheck, CheckCircle2, Sparkles, BookOpen, Layers, Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50/60 via-white to-white py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center space-x-2 bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Career Planning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            PLAN YOUR CAREER.<br />
            <span className="text-blue-600">BUILD YOUR SKILLS.</span><br />
            ACHIEVE YOUR GOALS.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A personalized platform to discover career paths, identify skill gaps, build learning roadmaps and prepare for your future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg shadow-sm transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/career-paths"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-8 py-3.5 rounded-lg transition"
            >
              <span>Explore Career Paths</span>
            </Link>
          </div>

          {/* VISUAL STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 border-t border-slate-200/80">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
              <div className="text-3xl font-extrabold text-blue-600 mb-1">10+</div>
              <div className="text-sm font-semibold text-slate-900">Career Paths</div>
              <div className="text-xs text-slate-500 mt-1">Software, Data Science, AI/ML & DevOps</div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
              <div className="text-3xl font-extrabold text-blue-600 mb-1">50+</div>
              <div className="text-sm font-semibold text-slate-900">Learning Resources</div>
              <div className="text-xs text-slate-500 mt-1">Courses, Certifications & Internship Prep</div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
              <div className="text-3xl font-extrabold text-blue-600 mb-1">Personalized</div>
              <div className="text-sm font-semibold text-slate-900">Roadmaps</div>
              <div className="text-xs text-slate-500 mt-1">Tailored step-by-step progress tracking</div>
            </div>
          </div>

        </div>
      </section>

      {/* WHY CAREER ROADMAP PORTAL */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              WHY CAREER ROADMAP PORTAL?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base">
              Designed specifically for engineering and college students to navigate career readiness with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Guidance</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Adaptive readiness scoring and tailored roadmap milestones aligned directly with your personal career aspirations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Skill-Focused Mapping</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Clear identification of technical and aptitude skill gaps with curated recommendations from top educational providers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mentor-Supported</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct communication channels with faculty advisors and AI Career Assistant for round-the-clock guidance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* WHAT YOU CAN DO */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              WHAT YOU CAN DO
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base">
              A single platform covering every phase of academic and professional advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition">
              <Compass className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Career Guidance</h4>
              <p className="text-slate-600 text-sm">Discover tech careers, required competencies, average timelines, and industry demand.</p>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition">
              <Target className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Skill Mapping</h4>
              <p className="text-slate-600 text-sm">Measure current proficiency against target benchmarks to uncover actionable skill gaps.</p>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition">
              <Map className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Learning Roadmap</h4>
              <p className="text-slate-600 text-sm">Follow structured step-by-step milestones from basic programming to job-ready projects.</p>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition">
              <Briefcase className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Internships</h4>
              <p className="text-slate-600 text-sm">Explore curated demo internship listings to gain practical experience and domain exposure.</p>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition">
              <Award className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Placement Preparation</h4>
              <p className="text-slate-600 text-sm">Prepare for campus recruitment with Aptitude, Coding, System Design, and HR mock guides.</p>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition">
              <GraduationCap className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Higher Education</h4>
              <p className="text-slate-600 text-sm">Explore M.Tech, MBA, MS abroad, and entrance exams like GATE, CAT, GRE, and CUET.</p>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              HOW IT WORKS
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base">
              A systematic 6-step journey from student enrollment to successful placement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs relative">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">01</span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">Create Profile</h4>
              <p className="text-slate-600 text-sm">Log in as a student to view assigned section and current academic baseline.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs relative">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">02</span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">Choose Career</h4>
              <p className="text-slate-600 text-sm">Select target domain such as Full Stack, Data Science, Cloud, or Product Management.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs relative">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">03</span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">Find Skill Gaps</h4>
              <p className="text-slate-600 text-sm">Analyze missing technical proficiencies and receive targeted course suggestions.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs relative">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">04</span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">Follow Roadmap</h4>
              <p className="text-slate-600 text-sm">Complete sequential learning milestones and mark steps as completed.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs relative">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">05</span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">Track Progress</h4>
              <p className="text-slate-600 text-sm">Watch career readiness percentage improve in real-time as you complete courses.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs relative">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">06</span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">Get Guidance</h4>
              <p className="text-slate-600 text-sm">Chat with the Gemini AI Assistant or submit queries to your assigned faculty mentor.</p>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            START YOUR CAREER JOURNEY
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Log in to your student or faculty account to access personalized roadmaps, skill tracking, and AI career tools.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-lg shadow-md transition"
          >
            <span>Access Portal Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
