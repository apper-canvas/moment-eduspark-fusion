import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import CourseCard from '../components/CourseCard';
import { MainFeatureGrid } from '../components/MainFeature';
import { fetchCourses } from '../services/courseService';
import { fetchUserEnrollments } from '../services/enrollmentService';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Icons
const SearchIcon = getIcon('Search');
const PlusCircleIcon = getIcon('PlusCircle');

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all courses
        const courseData = await fetchCourses();
        setCourses(courseData);
        
        // Load user enrollments if user is logged in
        if (user && user.emailAddress) {
          const enrollmentData = await fetchUserEnrollments(user.emailAddress);
          setUserEnrollments(enrollmentData);
        }
      } catch (error) {
        console.error("Error loading home data:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const features = [
    {
      title: "Interactive Learning",
      description: "Engage with dynamic content that makes learning enjoyable and effective.",
      icon: "Video",
      colorClass: "bg-primary text-white"
    },
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals with real-world experience.",
      icon: "Users",
      colorClass: "bg-secondary text-white"
    },
    {
      title: "Self-Paced Courses",
      description: "Study at your own pace and on your own schedule.",
      icon: "Clock",
      colorClass: "bg-accent text-white"
    }
  ];

  const filteredCourses = courses.filter(course => {
    // Apply text search
    const matchesSearch = !searchTerm || 
                         course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply level filter
    const matchesFilter = filter === 'all' || course.level === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Expand Your Knowledge</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Discover courses taught by industry experts and take your skills to the next level.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#courses" className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-surface-100 transition-colors">
              Explore Courses
            </a>
            <Link to="/create-course" className="bg-primary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center">
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Create Course
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-surface-900 dark:text-white">Why Choose EduSpark</h2>
        <MainFeatureGrid features={features} />
      </div>
      
      {/* Courses Section */}
      <div id="courses" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-surface-900 dark:text-white">Available Courses</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.Id} course={course} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
export default Home;