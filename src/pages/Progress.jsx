import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchUserProgress } from '../services/progressService';
import { fetchUserAchievements } from '../services/achievementService';
import getIcon from '../utils/iconUtils';
import ProgressChart from '../components/ProgressChart';

// Icons
const TrophyIcon = getIcon('Trophy');
const BookOpenIcon = getIcon('BookOpen');
const ClockIcon = getIcon('Clock');
const CheckCircleIcon = getIcon('CheckCircle');
const GraduationCapIcon = getIcon('GraduationCap');
const BarChartIcon = getIcon('BarChart');
const BrainIcon = getIcon('Brain');
const ActivityIcon = getIcon('Activity');
const AwardIcon = getIcon('Award');
const TargetIcon = getIcon('Target');
const BookmarkIcon = getIcon('Bookmark');
const FilterIcon = getIcon('Filter');

// Mock data to simulate user progress
const progressData = {
  courseCount: {
    total: 12,
    started: 8,
    completed: 3
  },
  weeklyMinutes: 0
};

const Progress = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userProgress, setUserProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(progressData);
  const [chartData, setChartData] = useState(null);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const loadUserProgressData = async () => {
      try {
        setLoading(true);
        if (user && user.Id) {
          // Load progress data
          const progressData = await fetchUserProgress(user.Id);
          setUserProgress(progressData);
          
          // Load achievements
          const achievementsData = await fetchUserAchievements(user.Id);
          setAchievements(achievementsData);
          
          // Process data for charts
          processChartData(progressData);
          
          // Calculate stats
          calculateStats(progressData);
        }
      } catch (err) {
        setError('Failed to load progress data');
        toast.error('Failed to load progress data');
        console.error('Error loading progress:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProgressData();
  }, [user]);
  
  const processChartData = (progressData) => {
    if (!progressData || progressData.length === 0) {
      return;
    }
    
    // Create weekly progress chart data
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i).toISOString().split('T')[0]);
    const minutesData = last7Days.map(day => {
      const dayEntries = progressData.filter(p => p.activityDate.split('T')[0] === day);
      return dayEntries.reduce((sum, entry) => sum + (entry.minutesStudied || 0), 0);
    });
    
    setChartData({
      weeklyProgress: {
        categories: last7Days.map(day => format(new Date(day), 'MMM d')),
        series: [
          {
            name: 'Minutes Studied',
            data: minutesData
          }
        ],
        yTitle: 'Minutes'
      }
    });
  };
  
  const calculateStats = (progressData) => {
    if (!progressData || progressData.length === 0) {
      return;
    }
    
    // Calculate weekly minutes
    const oneWeekAgo = subDays(new Date(), 7).getTime();
    const weeklyMinutes = progressData
      .filter(p => new Date(p.activityDate).getTime() > oneWeekAgo)
      .reduce((sum, entry) => sum + (entry.minutesStudied || 0), 0);
    
    // Count quiz passes
    const quizzes = progressData.filter(p => p.activityType === 'quiz');
    const passedQuizzes = quizzes.filter(q => (q.quizScore || 0) >= 70);
    
    // Get unique courses
    const uniqueCourseIds = [...new Set(progressData.map(p => p.courseId))];
    
    setStats({
      weeklyMinutes,
      courseCount: {
        total: uniqueCourseIds.length,
        started: uniqueCourseIds.length,
        completed: progressData.filter(p => p.completionPercentage >= 100).length
      },
      quizzes: {
        total: quizzes.length,
        attempted: quizzes.length,
        passed: passedQuizzes.length
      }
    });
  };

  // Calculate overall completion percentage
  const getOverallCompletion = () => {
    if (!userProgress || userProgress.length === 0) return 0;
    
    // Get the highest completion percentage for each course
    const uniqueCourses = [...new Set(userProgress.map(p => p.courseId))];
    const courseCompletions = uniqueCourses.map(courseId => {
      const courseEntries = userProgress.filter(p => p.courseId === courseId);
      return Math.max(...courseEntries.map(entry => entry.completionPercentage || 0));
    });
    
    // Average of all course completions
    return Math.round(courseCompletions.reduce((sum, val) => sum + val, 0) / courseCompletions.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Learning Progress</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center mr-4">
          <FilterIcon className="w-5 h-5 mr-2 text-surface-500" />
          <span className="font-medium">Filter by:</span>
        </div>
        
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="input-field !py-1 !px-3 max-w-[150px]"
        >
          <option value="all">All Time</option>
          <option value="recent">Last 30 Days</option>
          <option value="week">This Week</option>
        </select>
        
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-field !py-1 !px-3 max-w-[150px]"
        >
          <option value="all">All Categories</option>
          <option value="programming">Programming</option>
          <option value="languages">Languages</option>
          <option value="math">Math</option>
          <option value="data-science">Data Science</option>
          <option value="ai">AI</option>
        </select>
      </div>
      
      {/* Stats Overview */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card flex items-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg mr-4">
                <BookOpenIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Courses</h3>
                <p className="text-2xl font-bold">{stats.courseCount.completed} / {stats.courseCount.total}</p>
                <p className="text-surface-500 dark:text-surface-400 text-sm">
                  {stats.courseCount.started - stats.courseCount.completed} in progress
                </p>
              </div>
            </div>
            
            <div className="card flex items-center">
              <div className="bg-secondary/10 dark:bg-secondary/20 p-3 rounded-lg mr-4">
                <ClockIcon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Study Time</h3>
                <p className="text-2xl font-bold">{Math.floor(userProgress.reduce((sum, p) => sum + (p.minutesStudied || 0), 0) / 60)} hrs</p>
                <p className="text-surface-500 dark:text-surface-400 text-sm">+{(stats.weeklyMinutes / 60).toFixed(1)} hrs this week</p>
              </div>
            </div>
            
            <div className="card flex items-center">
              <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-lg mr-4">
                <CheckCircleIcon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Activities</h3>
                <p className="text-2xl font-bold">{userProgress.length}</p>
                <p className="text-surface-500 dark:text-surface-400 text-sm">
                  Last: {userProgress.length > 0 ? format(new Date(userProgress[0].activityDate), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="card flex items-center">
              <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg mr-4">
                <GraduationCapIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Achievements</h3>
                <p className="text-2xl font-bold">{achievements.filter(a => a.earned).length}</p>
                <p className="text-surface-500 dark:text-surface-400 text-sm">
                  {achievements.filter(a => !a.earned).length} in progress
                </p>
              </div>
            </div>
          </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <ProgressChart 
            type="radial" 
            data={[getOverallCompletion()]} 
            title="Overall Completion" 
          />
        </div>
        
        <div className="lg:col-span-2">
          {chartData && <ProgressChart 
            type="line" 
            data={chartData.weeklyProgress} 
            title="Study Time This Week" 
          />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {userProgress.length === 0 ? (
            <div className="text-center py-8 text-surface-500">
              <p>No activity recorded yet. Start learning to see your progress!</p>
            </div>
          ) : (
          <div className="space-y-4">
            {userProgress.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`rounded-full p-2 mr-3 ${
                  activity.activityType === 'lesson' ? 'bg-primary/10 text-primary' :
                  activity.activityType === 'quiz' ? 'bg-secondary/10 text-secondary' :
                  activity.activityType === 'course' ? 'bg-accent/10 text-accent' :
                  'bg-green-500/10 text-green-500'
                }`}>
                  {activity.activityType === 'lesson' ? <BookOpenIcon className="w-5 h-5" /> :
                   activity.activityType === 'quiz' ? <TargetIcon className="w-5 h-5" /> :
                   activity.activityType === 'course' ? <BookmarkIcon className="w-5 h-5" /> :
                   <AwardIcon className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium">{activity.activityTitle}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Course ID: {activity.courseId}</p>
                  <div className="flex items-center text-xs text-surface-500 dark:text-surface-400 mt-1">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {format(new Date(activity.activityDate), 'MMM d, yyyy')}
                    {activity.quizScore && (
                      <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded">
                        {activity.quizScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      
      {/* Achievements */}
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
        Achievements
        <span className="ml-2 text-sm font-normal text-surface-500">({achievements.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {achievements.length === 0 ? (
          <div className="col-span-full text-center py-8 bg-white dark:bg-surface-800 rounded-xl shadow-md p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
            <p className="text-surface-600 dark:text-surface-400">Complete courses and activities to earn achievements!</p>
          </div>
        ) : (
          achievements.map(achievement => (
            <div key={achievement.Id} className={`card ${achievement.earned ? '' : 'opacity-70'}`}>
              <div className="flex items-center mb-3">
                <div className={`rounded-full p-3 mr-3 ${achievement.earned ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-surface-100 dark:bg-surface-800'}`}>
                  <TrophyIcon className={`w-6 h-6 ${achievement.earned ? 'text-yellow-500' : 'text-surface-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">{achievement.description}</p>
                </div>
              </div>
              {achievement.earned ? (
                <p className="text-sm text-green-600 dark:text-green-400">Earned on {format(new Date(achievement.earnedDate), 'MMM d, yyyy')}</p>
              ) : (
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5 mt-2">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${achievement.progress}%` }}></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      </>
      )}
    </motion.div>
  );
};

export default Progress;