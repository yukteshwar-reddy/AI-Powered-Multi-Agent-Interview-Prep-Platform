import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UploadResume from './pages/UploadResume';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import Dashboard from './pages/Dashboard';
import { LucideBrain } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0F172A] text-gray-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Navbar */}
        <nav className="w-full glass-panel border-b border-white/5 py-4 px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <LucideBrain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Nexus AI
            </span>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<UploadResume />} />
            <Route path="/interview/:interviewId" element={<Interview />} />
            <Route path="/feedback/:interviewId" element={<Feedback />} />
            <Route path="/dashboard/:userId" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
