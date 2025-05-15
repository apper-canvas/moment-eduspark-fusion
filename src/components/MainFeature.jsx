import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { subDays } from 'date-fns';

import ProgressChart from './ProgressChart';

// Icons
const PlayIcon = getIcon('Play');
const BookOpenIcon = getIcon('BookOpen');
const ClockIcon = getIcon('Clock');
const UsersIcon = getIcon('Users');
const StarIcon = getIcon('Star');
const BookmarkIcon = getIcon('Bookmark');
const BookmarkPlusIcon = getIcon('BookmarkPlus');
const CheckCircleIcon = getIcon('CheckCircle');
const XCircleIcon = getIcon('XCircle');
const CheckIcon = getIcon('Check');
const ChevronDownIcon = getIcon('ChevronDown');
const BarChartIcon = getIcon('BarChart');
const ChevronRightIcon = getIcon('ChevronRight');

// Mock data for courses
const coursesData = {
  featured: [
    {
      id: 1,
      title: "Python for Beginners",
      description: "Learn the basics of Python programming language from scratch",
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "Sarah Johnson",
      duration: "10 hours",
      modules: 8,
      lessons: 32,
      enrolled: 4523,
      level: "Beginner",
      rating: 4.8,
      category: "programming",
      quizzes: [
        {
          id: "q1",
          title: "Python Basics Quiz",
          questions: [
            {
              id: "q1-1",
              question: "Which of the following is the correct way to comment in Python?",
              options: ["// This is a comment", "/* This is a comment */", "# This is a comment", "<!-- This is a comment -->"],
              correctAnswer: 2
            },
            {
              id: "q1-2",
              question: "What will the output of print(2**3) be?",
              options: ["6", "8", "5", "Error"],
              correctAnswer: 1
            },
            {
              id: "q1-3",
              question: "Which of these is NOT a Python data type?",
              options: ["List", "Dictionary", "Tuple", "Array"],
              correctAnswer: 3
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Spanish for Travelers",
      description: "Essential Spanish phrases and vocabulary for your next trip",
      thumbnail: "https://images.unsplash.com/photo-1551966775-a4ddc8912228?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "Maria Rodriguez",
      duration: "6 hours",
      modules: 5,
      lessons: 25,
      enrolled: 3278,
      level: "Beginner",
      rating: 4.6,
      category: "languages"
    },
    {
      id: 3,
      title: "Calculus Fundamentals",
      description: "Master derivatives, integrals and their applications",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "Prof. Michael Chen",
      duration: "15 hours",
      modules: 10,
      lessons: 45,
      enrolled: 2156,
      level: "Intermediate",
      rating: 4.9,
      category: "math"
    }
  ],
  programming: [
    {
      id: 4,
      title: "Web Development with React",
      description: "Build modern web applications with React and its ecosystem",
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "David Miller",
      duration: "20 hours",
      modules: 12,
      lessons: 48,
      enrolled: 5629,
      level: "Intermediate",
      rating: 4.7,
      category: "programming"
    }
  ],
  languages: [
    {
      id: 5,
      title: "Japanese for Beginners",
      description: "Learn to speak, read and write basic Japanese",
      thumbnail: "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "Yuki Tanaka",
      duration: "12 hours",
      modules: 8,
      lessons: 40,
      enrolled: 3847,
      level: "Beginner",
      rating: 4.9,
      category: "languages"
    }
  ],
  math: [
    {
      id: 6,
      title: "Statistics and Data Analysis",
      description: "Learn statistical concepts and how to analyze real-world data",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "Dr. Emily Wang",
      duration: "14 hours",
      modules: 9,
      lessons: 36,
      enrolled: 2974,
      level: "Intermediate",
      rating: 4.8,
      category: "math"
    }
  ],
  "data-science": [
    {
      id: 7,
      title: "Machine Learning Fundamentals",
      description: "Learn the core concepts of machine learning with Python",
      thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "Dr. Robert Lee",
      duration: "18 hours",
      modules: 10,
      lessons: 40,
      enrolled: 6248,
      level: "Advanced",
      rating: 4.9,
      category: "data-science"
    }
  ],
  ai: [
    {
      id: 8,
      title: "Deep Learning and Neural Networks",
      description: "Build and train neural networks for various AI applications",
      thumbnail: "https://images.unsplash.com/photo-1677442135273-860bbc3b8261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      instructor: "Prof. Alan Turing",
      duration: "22 hours",
      modules: 12,
      lessons: 48,
      enrolled: 4157,
      level: "Advanced",
      rating: 4.8,
      category: "ai"
    }
  ]
};

function MainFeature({ categoryId }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [quizResults, setQuizResults] = useState({ correct: 0, total: 0 });
  const [courseProgress, setCourseProgress] = useState({});
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    // Load courses for the selected category
    setCourses(coursesData[categoryId] || []);
    setSelectedCourse(null);
    setCurrentQuiz(null);
    setQuizSubmitted(false);
    
    // Mock progress data for courses
    const mockProgress = {};
    coursesData[categoryId]?.forEach(course => {
      mockProgress[course.id] = {
        overall: Math.floor(Math.random() * 61), // 0-60% completion
        lessons: Math.floor(Math.random() * 41), // 0-40% completed lessons
        quizzes: Math.floor(Math.random() * 76), // 0-75% completed quizzes
        lastAccessed: subDays(new Date(), Math.floor(Math.random() * 10)),
        timeSpent: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
        streak: Math.floor(Math.random() * 8) // 0-7 day streak
      };
    });
    
    setCourseProgress(mockProgress);
  }, [categoryId]);

  const toggleBookmark = (courseId) => {
    if (bookmarkedCourses.includes(courseId)) {
      setBookmarkedCourses(bookmarkedCourses.filter(id => id !== courseId));
      toast.success("Course removed from bookmarks");
    } else {
      setBookmarkedCourses([...bookmarkedCourses, courseId]);
      toast.success("Course bookmarked successfully");
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    if (!currentQuiz) return;
    
    let correctCount = 0;
    currentQuiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setQuizResults({
      correct: correctCount,
      total: currentQuiz.questions.length,
      percentage: Math.round((correctCount / currentQuiz.questions.length) * 100)
    });
    
    setQuizSubmitted(true);
    
    if (correctCount / currentQuiz.questions.length >= 0.7) {
      toast.success("Quiz completed successfully!");
    } else {
      toast.info("Quiz completed. You might want to review the material again.");
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const toggleModule = (moduleIndex) => {
    if (expandedModule === moduleIndex) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleIndex);
    }
  };
  
  // Function to generate random historical progress data for charts
  const generateProgressHistory = () => {
    const dates = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i).toISOString());
    return {
      categories: dates,
      series: [{
        name: 'Lessons Completed',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 4)) // 0-3 lessons per day
      }],
      yTitle: 'Count'
    };
  };

  const renderCourseList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length > 0 ? (
        courses.map(course => {
          const progress = courseProgress[course.id] || { overall: 0, lessons: 0, quizzes: 0 };
          
          return (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card hover:shadow-lg group overflow-hidden"
          >
            <div className="relative mb-4 overflow-hidden rounded-lg aspect-video">
              <img
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm bg-primary/80 px-2 py-1 rounded-full">
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>
                {/* Progress overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-surface-200/60 dark:bg-surface-700/60">
                  <div className="h-full bg-primary" style={{ width: `${progress.overall}%` }}></div>
                </div>
              </div>
             </div>
            
             <div>
              <button
                className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(course.id);
                }}
              >
                {bookmarkedCourses.includes(course.id) ? (
                  <BookmarkIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ) : (
                  <BookmarkPlusIcon className="w-5 h-5 text-white" />
                )}
              </button>
             
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex flex-wrap gap-y-2 text-sm text-surface-600 dark:text-surface-400 mb-4">
                <div className="flex items-center mr-4">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center mr-4">
                  <BookOpenIcon className="w-4 h-4 mr-1" />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  <span>{course.enrolled.toLocaleString()} students</span>
                </div>
              </div>

              {progress.overall > 0 && (
                <p className="text-sm text-primary font-medium">{progress.overall}% completed</p>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-medium text-surface-500 dark:text-surface-400">
                  Instructor: {course.instructor}
                </div>
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="btn btn-primary py-2 flex items-center"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Start Learning
                </button>
              </div>
            </div>
          </motion.div>
          );
        })
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-surface-100 dark:bg-surface-800 p-6 rounded-full mb-4">
            <BookOpenIcon className="w-12 h-12 text-surface-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No courses available</h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md">
            We don't have any courses in this category yet. Please check back soon!
          </p>
        </div>
      )}
    </div>
  );

  const renderCourseDetail = () => {
    if (!selectedCourse) return null;

    // Get or generate mock progress data for the selected course
    const progress = courseProgress[selectedCourse.id] || { overall: 0, lessons: 0, quizzes: 0 };

    const mockModules = Array.from({ length: selectedCourse.modules }, (_, i) => ({
      id: `module-${i}`,
      title: `Module ${i + 1}: ${i === 0 ? 'Introduction to ' + selectedCourse.title : 'Advanced Topic ' + (i + 1)}`,
      lessons: Array.from({ length: 4 }, (_, j) => ({
        id: `lesson-${i}-${j}`,
        title: `Lesson ${j + 1}: ${j === 0 ? 'Getting Started' : 'Topic ' + (j + 1)}`,
        duration: `${Math.floor(Math.random() * 20) + 10} min`
      })),
      // Random completion between 0-100% for each module
      completion: i === 0 ? Math.min(Math.floor(Math.random() * 101) + progress.overall, 100) : 
                  Math.max(0, Math.min(Math.floor(Math.random() * (100 - (3-i)*25)), 100))
    }));

    // Generate random progress history data
    const progressHistory = generateProgressHistory();

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col"
      >
        <div className="flex items-center mb-6">
          <button 
            onClick={() => {
              setSelectedCourse(null);
              setCurrentQuiz(null);
              setQuizSubmitted(false);
            }}
            className="btn bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 mr-4"
          >
            Back to Courses
          </button>
          <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
        </div>

        {currentQuiz ? (
          <div className="card">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{currentQuiz.title}</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Answer all questions to complete the quiz. You can attempt this quiz multiple times.
              </p>
            </div>

            {quizSubmitted ? (
              <div className="space-y-6">
                <div className="bg-surface-100 dark:bg-surface-700 rounded-xl p-6 text-center">
                  <div className="mb-4">
                    {quizResults.percentage >= 70 ? (
                      <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
                    ) : (
                      <XCircleIcon className="w-16 h-16 mx-auto text-red-500" />
                    )}
                  </div>
                  <h4 className="text-2xl font-bold mb-2">
                    {quizResults.percentage}% Score
                  </h4>
                  <p className="mb-2">
                    You answered {quizResults.correct} out of {quizResults.total} questions correctly.
                  </p>
                  <p className="text-surface-600 dark:text-surface-400">
                    {quizResults.percentage >= 70 
                      ? "Congratulations! You passed the quiz." 
                      : "You didn't pass this time. Review the material and try again."}
                  </p>
                </div>

                <div className="space-y-4">
                  {currentQuiz.questions.map((question, index) => (
                    <div 
                      key={question.id} 
                      className={`p-4 rounded-lg border ${
                        quizAnswers[question.id] === question.correctAnswer
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      }`}
                    >
                      <p className="font-medium mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correctAnswer
                                ? "border-green-300 bg-green-100 dark:border-green-700 dark:bg-green-900/30"
                                : optionIndex === quizAnswers[question.id] && optionIndex !== question.correctAnswer
                                  ? "border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/30"
                                  : "border-surface-200 dark:border-surface-700"
                            }`}
                          >
                            <div className="flex items-center">
                              {optionIndex === question.correctAnswer ? (
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                              ) : optionIndex === quizAnswers[question.id] && optionIndex !== question.correctAnswer ? (
                                <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                              ) : (
                                <div className="w-5 h-5 mr-2"></div>
                              )}
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={resetQuiz}
                    className="btn btn-primary"
                  >
                    Back to Course
                  </button>
                  <button 
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="btn bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
                  >
                    Retry Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {currentQuiz.questions.map((question, index) => (
                  <div key={question.id} className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <p className="font-medium mb-3">
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(question.id, optionIndex)}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            quizAnswers[question.id] === optionIndex
                              ? "border-primary bg-primary/5 dark:bg-primary/10"
                              : "border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                              quizAnswers[question.id] === optionIndex
                                ? "border-primary bg-primary text-white"
                                : "border-surface-300 dark:border-surface-600"
                            }`}>
                              {quizAnswers[question.id] === optionIndex && (
                                <CheckIcon className="w-3 h-3" />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < currentQuiz.questions.length}
                  className={`w-full btn ${
                    Object.keys(quizAnswers).length === currentQuiz.questions.length
                      ? "btn-primary"
                      : "bg-surface-200 dark:bg-surface-700 cursor-not-allowed"
                  }`}
                >
                  {Object.keys(quizAnswers).length === currentQuiz.questions.length
                    ? "Submit Quiz"
                    : `Answer all questions (${Object.keys(quizAnswers).length}/${currentQuiz.questions.length})`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card">
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={selectedCourse.thumbnail} 
                    alt={selectedCourse.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="p-4 bg-primary rounded-full hover:bg-primary-dark transition-colors">
                      <PlayIcon className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{selectedCourse.title}</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">{selectedCourse.description}</p>
                
                <div className="flex flex-col space-y-4">
                  {mockModules.map((module, index) => (
                    <div 
                      key={module.id}
                      className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden"
                    >
                      <button 
                        onClick={() => toggleModule(index)}
                        className="w-full p-4 flex items-center justify-between bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        <span className="font-medium">{module.title}</span>
                        {expandedModule === index ? (
                          <ChevronDownIcon className="w-5 h-5" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedModule === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 space-y-2">
                              {module.lessons.map((lesson) => (
                                <div 
                                  key={lesson.id}
                                  className="flex items-center justify-between p-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800"
                                >
                                  <div className="flex items-center">
                                    <PlayIcon className="w-4 h-4 text-primary mr-3" />
                                    <span>{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-surface-500 dark:text-surface-400">
                                    {lesson.duration}
                                  </span>
                                </div>
                              ))}
                              
                              {index === 0 && selectedCourse.quizzes && (
                                <div 
                                  onClick={() => startQuiz(selectedCourse.quizzes[0])}
                                  className="flex items-center justify-between p-3 border border-primary/30 dark:border-primary/50 bg-primary/5 dark:bg-primary/10 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <BookOpenIcon className="w-4 h-4 text-primary mr-3" />
                                    <span className="font-medium text-primary">Module Quiz: Test Your Knowledge</span>
                                  </div>
                                  <span className="text-sm text-primary">
                                    Take Quiz
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Instructor</span>
                      <span className="font-medium">{selectedCourse.instructor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Duration</span>
                      <span className="font-medium">{selectedCourse.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Lessons</span>
                      <span className="font-medium">{selectedCourse.lessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Level</span>
                      <span className="font-medium">{selectedCourse.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Students</span>
                      <span className="font-medium">{selectedCourse.enrolled.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Rating</span>
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{selectedCourse.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Your Progress</h3>
                    <button 
                      onClick={() => setShowProgressDetails(!showProgressDetails)}
                      className="text-primary hover:text-primary-dark flex items-center text-sm"
                    >
                      {showProgressDetails ? "Hide Details" : "Show Details"}
                      <BarChartIcon className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  {showProgressDetails && (
                    <div className="mb-6">
                      <ProgressChart
                        type="line"
                        data={progressHistory}
                        title="Learning Activity"
                        height={200}
                      />
                    </div>
                  )}
                  
                  <div className="mb-4 mt-2">
                    <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${progress.overall}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 text-center">
                      {progress.overall}% overall completion
                    </p>
                  </div>
                </div>
                
                <div className="card relative">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Completed Lessons</span>
                      <span className="font-medium">0/{selectedCourse.lessons}</span>
                    </div>
                    <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-1 mb-3">
                      <div 
                        className="h-full bg-secondary rounded-full transition-all duration-500" 
                        style={{ width: `${progress.lessons}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Quizzes Passed</span>
                      <span className="font-medium">0/{selectedCourse.quizzes ? selectedCourse.quizzes.length : '0'}</span>
                    </div>
                    <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-1 mb-3">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-500" 
                        style={{ width: `${progress.quizzes}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Certificates</span>
                      <span className="font-medium">0/1</span>
                    </div>
                    <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-1 mb-3">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500" 
                        style={{ width: `${progress.overall >= 100 ? 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    {showProgressDetails && (
                      <div className="mt-4 space-y-3 border-t border-surface-200 dark:border-surface-700 pt-4">
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Time Spent</span>
                          <span className="font-medium">{progress.timeSpent} mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Current Streak</span>
                          <span className="font-medium">{progress.streak} days</span>
                        </div>
                      </div>
                    )}
                    
                    
                  </div>
                  
                  <button 
                    className="w-full btn btn-primary mt-4"
                    onClick={() => {
                      if (selectedCourse.quizzes && selectedCourse.quizzes.length > 0) {
                        startQuiz(selectedCourse.quizzes[0]);
                      }
                    }}
                    disabled={!selectedCourse.quizzes || selectedCourse.quizzes.length === 0}
                  >
                    {selectedCourse.quizzes && selectedCourse.quizzes.length > 0 
                      ? "Take Quiz" 
                      : "No Quizzes Available"}
                  </button>
                  
                  <button 
                    className="w-full btn bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 mt-2"
                    onClick={() => toggleBookmark(selectedCourse.id)}
                  >
                    {bookmarkedCourses.includes(selectedCourse.id) ? (
                      <span className="flex items-center justify-center">
                        <BookmarkIcon className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
                        Bookmarked
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <BookmarkPlusIcon className="w-4 h-4 mr-2" />
                        Bookmark Course
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {selectedCourse ? renderCourseDetail() : renderCourseList()}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;