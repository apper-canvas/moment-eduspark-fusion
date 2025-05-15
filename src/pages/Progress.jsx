import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchUserProgress } from '../services/progressService';
import { fetchUserEnrollments } from '../services/enrollmentService';
import { fetchCourseById } from '../services/courseService';
import { fetchUserAchievements } from '../services/achievementService';
import ProgressChart from '../components/ProgressChart';
import getIcon from '../utils/iconUtils';
import { toast } from 'react-toastify';

// Icons
const ChartIcon = getIcon('BarChart');
const BookOpenIcon = getIcon('BookOpen');
const ClockIcon = getIcon('Clock');
const TrophyIcon = getIcon('Trophy');
const RefreshCwIcon = getIcon('RefreshCw');

const Progress = () => {
  const user = useSelector((state) => state.user.user);
  const [progress, setProgress] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMinutes: 0,
    coursesEnrolled: 0,
    achievementsEarned: 0,
    lastActivity: null
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        if (!user || !user.Id) {
          setLoading(false);
          return;
        }

        // Fetch user progress
        const progressData = await fetchUserProgress(user.Id);
        setProgress(progressData || []);

        // Fetch user enrollments if email is available
        if (user.emailAddress) {
          const enrollmentData = await fetchUserEnrollments(user.emailAddress);
          setEnrollments(enrollmentData || []);

          // Fetch course details for each enrollment
          const coursesData = {};
          for (const enrollment of enrollmentData) {
            try {
              if (enrollment.courseId && !coursesData[enrollment.courseId]) {
                const courseData = await fetchCourseById(enrollment.courseId);
                if (courseData) {
                  coursesData[enrollment.courseId] = courseData;
                }
              }
            } catch (error) {
              console.error(`Error fetching course ${enrollment.courseId}:`, error);
            }
          }
          setCourses(coursesData);
        }

        // Fetch user achievements
        const achievementsData = await fetchUserAchievements(user.Id);
        setAchievements(achievementsData || []);

        // Calculate stats
        const totalMinutes = progressData ? progressData.reduce((sum, item) => sum + (item.minutesStudied || 0), 0) : 0;
        const uniqueCourseIds = progressData ? [...new Set(progressData.map(item => item.courseId))] : [];
        const achievementsEarned = achievementsData ? achievementsData.filter(a => a.earned).length : 0;
        const lastActivityDate = progressData && progressData.length > 0 
          ? new Date(Math.max(...progressData.map(p => new Date(p.activityDate).getTime())))
          : null;

        setStats({
          totalMinutes,
          coursesEnrolled: uniqueCourseIds.length,
          achievementsEarned,
          lastActivity: lastActivityDate
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load your progress data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const refreshData = () => {
    setLoading(true);
    toast.info("Refreshing your progress data...");
    // Re-fetch all data by triggering the effect
    setProgress([]);
    setEnrollments([]);
    setCourses({});
    setAchievements([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Learning Progress</h1>
        <button 
          onClick={refreshData}
          className="flex items-center text-surface-600 dark:text-surface-400 hover:text-primary transition-colors"
        >
          <RefreshCwIcon className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
          <div className="flex items-center text-primary mb-2">
            <ClockIcon className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Total Study Time</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalMinutes} mins</p>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
          <div className="flex items-center text-secondary mb-2">
            <BookOpenIcon className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Courses Enrolled</h3>
          </div>
          <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
          <div className="flex items-center text-accent mb-2">
            <TrophyIcon className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <p className="text-2xl font-bold">{stats.achievementsEarned}</p>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
          <div className="flex items-center text-purple-500 mb-2">
            <ChartIcon className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Last Activity</h3>
          </div>
          <p className="text-2xl font-bold">{stats.lastActivity ? stats.lastActivity.toLocaleDateString() : "N/A"}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-surface-900 dark:text-white">Learning Activity</h2>
        <div className="h-80">
          {progress.length > 0 ? (
            <ProgressChart progressData={progress} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-surface-500 dark:text-surface-400">
              <p className="mb-4">No activity data available yet</p>
              <Link to="/" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Progress;