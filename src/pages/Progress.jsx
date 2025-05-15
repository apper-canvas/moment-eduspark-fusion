import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
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
  overallCompletion: 32,
  courseCount: {
    total: 12,
    started: 8,
    completed: 3
  },
  quizzes: {
    total: 24,
    attempted: 18,
    passed: 15
  },
  categories: {
    programming: { completed: 45, inProgress: 2 },
    languages: { completed: 20, inProgress: 1 },
    math: { completed: 30, inProgress: 1 },
    "data-science": { completed: 15, inProgress: 0 },
    ai: { completed: 10, inProgress: 1 }
  },
  recentActivity: [
    { date: new Date(), type: 'lesson', title: 'Python Variables and Data Types', course: 'Python for Beginners' },
    { date: subDays(new Date(), 1), type: 'quiz', title: 'Python Basics Quiz', course: 'Python for Beginners', score: 85 },
    { date: subDays(new Date(), 2), type: 'course', title: 'Started Spanish for Travelers', course: 'Spanish for Travelers' },
    { date: subDays(new Date(), 3), type: 'certification', title: 'JavaScript Fundamentals Certificate', course: 'Web Development with React' },
    { date: subDays(new Date(), 5), type: 'lesson', title: 'Introduction to React Hooks', course: 'Web Development with React' }
  ],
  achievements: [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', earned: true, date: subDays(new Date(), 30) },
    { id: 2, title: 'Quick Learner', description: 'Complete 10 lessons in a week', earned: true, date: subDays(new Date(), 20) },
    { id: 3, title: 'Quiz Master', description: 'Score 100% on 5 quizzes', earned: false, progress: 3 },
    { id: 4, title: 'Course Collector', description: 'Enroll in 10 different courses', earned: false, progress: 8 },
    { id: 5, title: 'Polyglot', description: 'Complete courses in 3 different languages', earned: false, progress: 1 }
  ],
  weeklyProgress: {
    categories: [subDays(new Date(), 6), subDays(new Date(), 5), subDays(new Date(), 4), 
                 subDays(new Date(), 3), subDays(new Date(), 2), subDays(new Date(), 1), new Date()].map(date => date.toISOString()),
    series: [
      {
        name: 'Minutes Studied',
        data: [45, 30, 0, 60, 15, 90, 45]
      }
    ],
    yTitle: 'Minutes'
  },
  categoryCompletion: {
    categories: ['Programming', 'Languages', 'Math', 'Data Science', 'AI'],
    series: [
      {
        name: 'Completion',
        data: [45, 20, 30, 15, 10]
      }
    ],
    yTitle: 'Completion %',
    tooltipSuffix: '%'
  }
};

const Progress = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Apply filters
  const getFilteredAchievements = () => {
    let filtered = [...progressData.achievements];
    
    if (timeFilter === 'recent') {
      filtered = filtered.filter(achievement => 
        achievement.earned && new Date(achievement.date) > subDays(new Date(), 30)
      );
    }
    
    return filtered;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-center">
          <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg mr-4">
            <BookOpenIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Courses</h3>
            <p className="text-2xl font-bold">{progressData.courseCount.completed} / {progressData.courseCount.total}</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              {progressData.courseCount.started - progressData.courseCount.completed} in progress
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="bg-secondary/10 dark:bg-secondary/20 p-3 rounded-lg mr-4">
            <ClockIcon className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Study Time</h3>
            <p className="text-2xl font-bold">48 hrs</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm">+5.2 hrs this week</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-lg mr-4">
            <CheckCircleIcon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quizzes</h3>
            <p className="text-2xl font-bold">{progressData.quizzes.passed} / {progressData.quizzes.total}</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              Avg. Score: 82%
            </p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg mr-4">
            <GraduationCapIcon className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Certificates</h3>
            <p className="text-2xl font-bold">2</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              1 in progress
            </p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <ProgressChart 
            type="radial" 
            data={[progressData.overallCompletion]} 
            title="Overall Completion" 
          />
        </div>
        
        <div className="lg:col-span-2">
          <ProgressChart 
            type="line" 
            data={progressData.weeklyProgress} 
            title="Study Time This Week" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProgressChart 
          type="bar" 
          data={progressData.categoryCompletion} 
          title="Completion by Category" 
        />
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {progressData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`rounded-full p-2 mr-3 ${
                  activity.type === 'lesson' ? 'bg-primary/10 text-primary' :
                  activity.type === 'quiz' ? 'bg-secondary/10 text-secondary' :
                  activity.type === 'course' ? 'bg-accent/10 text-accent' :
                  'bg-green-500/10 text-green-500'
                }`}>
                  {activity.type === 'lesson' ? <BookOpenIcon className="w-5 h-5" /> :
                   activity.type === 'quiz' ? <TargetIcon className="w-5 h-5" /> :
                   activity.type === 'course' ? <BookmarkIcon className="w-5 h-5" /> :
                   <AwardIcon className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{activity.course}</p>
                  <div className="flex items-center text-xs text-surface-500 dark:text-surface-400 mt-1">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {format(new Date(activity.date), 'MMM d, yyyy')}
                    {activity.score && (
                      <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded">
                        {activity.score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
        Achievements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {getFilteredAchievements().map(achievement => (
          <div key={achievement.id} className={`card ${achievement.earned ? '' : 'opacity-70'}`}>
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
              <p className="text-sm text-green-600 dark:text-green-400">Earned on {format(new Date(achievement.date), 'MMM d, yyyy')}</p>
            ) : (
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5 mt-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(achievement.progress / (parseInt(achievement.description.match(/\d+/)[0])) * 100)}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Progress;