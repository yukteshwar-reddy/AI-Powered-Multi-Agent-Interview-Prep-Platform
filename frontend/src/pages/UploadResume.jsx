import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, startInterview } from '../api/api';
import { LucideUploadCloud, LucideLoader2 } from 'lucide-react';

export default function UploadResume() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch('/Bharath_Kumar_Resume.pdf')
      .then(r => r.blob())
      .then(blob => setFile(new File([blob], 'Bharath_Kumar_Resume.pdf', { type: 'application/pdf' })))
      .catch(e => console.error("Could not load dummy file", e));
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job_role: "",
    company: "",
    level: "Mid-Level"
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!file) {
    //   setError("Please upload a PDF resume.");
    //   return;
    // }

    setLoading(true);
    setError("");

    try {
      // 1. Upload Resume
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("name", formData.name);
      uploadData.append("email", formData.email);
      
      const uploadRes = await uploadResume(uploadData);
      const userId = uploadRes.user_id;

      // 2. Start Interview
      const interviewRes = await startInterview({
        user_id: userId,
        job_role: formData.job_role,
        company: formData.company,
        level: formData.level
      });

      // Navigate to Interview page
      navigate(`/interview/${interviewRes.interview_id}`, { state: { questions: interviewRes.questions }});
      
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "An error occurred during setup.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <h2 className="text-3xl font-bold mb-2">Set up your Interview</h2>
        <p className="text-gray-400 mb-8">Provide your details and target role to generate a personalized session.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Job Role</label>
              <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" value={formData.job_role} onChange={e => setFormData({...formData, job_role: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Company (Optional)</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Google" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white [&>option]:bg-gray-800" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume (PDF)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl hover:border-indigo-500/50 transition-colors bg-white/5">
              <div className="space-y-1 text-center">
                <LucideUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                {file && <p className="text-emerald-400 text-sm mt-2 font-medium">{file.name}</p>}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <><LucideLoader2 className="animate-spin mr-2 h-6 w-6" /> Analyzing & Generating...</> : "Start Interview"}
          </button>
        </form>
      </div>
    </div>
  );
}
