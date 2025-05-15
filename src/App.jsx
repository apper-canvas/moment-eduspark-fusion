import React, { createContext, useState, useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded pages
const Progress = lazy(() => import('./pages/Progress'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const CreateCourse = lazy(() => import('./pages/CreateCourse'));
const EnrollmentForm = lazy(() => import('./pages/EnrollmentForm'));


// Components
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');
const BookOpenIcon = getIcon('BookOpen');
const ChartIcon = getIcon('BarChart');
const UserIcon = getIcon('User');

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // Get authentication status from Redux
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [dispatch, navigate]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

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
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="text-primary h-8 w-8" />
              <span className="text-xl font-bold text-primary">EduSpark</span>
            </div>
            
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="hover:text-primary transition-colors">Home</a>
                <a href="/progress" className="flex items-center space-x-1 hover:text-primary transition-colors">
                  <ChartIcon className="h-4 w-4" />
                  <span>My Progress</span>
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button 
                  onClick={authMethods.logout}
                  className="flex items-center text-surface-600 hover:text-primary transition-colors text-sm"
                >
                  <UserIcon className="h-4 w-4 mr-1" />
                  Logout
                </button>
              )}
              
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
          </div>
        </header>

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
                    <Progress />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/course/:courseId" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
                    <CourseDetails />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/enroll/:courseId" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
                    <EnrollmentForm />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/create-course" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
                    <CreateCourse />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/enroll/:courseId" element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
                    <EnrollmentForm />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
          <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400">
            <p>© {new Date().getFullYear()} EduSpark. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

export default App;