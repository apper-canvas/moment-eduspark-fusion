import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import { fetchCourses } from '../services/courseService';

// Icons
const SearchIcon = getIcon('Search');
const FilterIcon = getIcon('Filter');
const StarIcon = getIcon('Star');
const UsersIcon = getIcon('Users');
const ClockIcon = getIcon('Clock');
const BookOpenIcon = getIcon('BookOpen');

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        toast.error('Failed to load courses');
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...courses];
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply level filter
    if (levelFilter !== 'all') {
      results = results.filter(course => course.level === levelFilter);
    }
    
    setFilteredCourses(results);
  }, [searchTerm, levelFilter, courses]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLevelFilterChange = (e) => {
    setLevelFilter(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to EduSpark Learning</h1>
        <p className="text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
          Discover interactive courses designed to help you master new skills at your own pace.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8 bg-white dark:bg-surface-800 rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-surface-500" />
            </div>
            <input 
              type="search" 
              className="input-field pl-10"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FilterIcon className="w-5 h-5 text-surface-500" />
            <select 
              className="input-field"
              value={levelFilter}
              onChange={handleLevelFilterChange}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Courses */}
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
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Courses</h2>
            <p className="text-surface-600 dark:text-surface-400">
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Link key={course.Id} to={`/course/${course.Id}`} className="block group">
                  <div className="bg-white dark:bg-surface-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between mb-2">
                        <span className="bg-primary-100 text-primary text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">{course.level}</span>
                        <div className="flex items-center text-yellow-500">
                          <StarIcon className="w-4 h-4 mr-1" /><span className="text-sm">{course.rating || "4.5"}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between text-xs text-surface-500 dark:text-surface-400">
                        <div className="flex items-center"><ClockIcon className="w-3 h-3 mr-1" />{course.duration}</div>
                        <div className="flex items-center"><BookOpenIcon className="w-3 h-3 mr-1" />{course.lessons || 18} Lessons</div>
                        <div className="flex items-center"><UsersIcon className="w-3 h-3 mr-1" />{course.students || 4500}+ Students</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-surface-600 dark:text-surface-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Home;