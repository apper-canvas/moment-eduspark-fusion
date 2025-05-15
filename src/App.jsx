import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Progress from './pages/Progress';
import EnrollmentForm from './pages/EnrollmentForm';
import CourseDetails from './pages/CourseDetails';

// Components
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');
const BookOpenIcon = getIcon('BookOpen');
const ChartIcon = getIcon('BarChart');

function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="text-primary h-8 w-8" />
            <span className="text-xl font-bold text-primary">EduSpark</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/progress" className="flex items-center space-x-1 hover:text-primary transition-colors">
              <ChartIcon className="h-4 w-4" />
              <span>My Progress</span>
            </a>
          </div>
          
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? 
              <SunIcon className="h-5 w-5 text-yellow-300" /> : 
              <MoonIcon className="h-5 w-5 text-surface-600" />
            }
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/enroll/:courseId" element={<EnrollmentForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
        <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400">
          <p>© {new Date().getFullYear()} EduSpark. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;