import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import getIcon from '../utils/iconUtils';
import { AuthContext } from '../App';

const PlusIcon = getIcon('Plus');

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    searchTerm: ''
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCourses(filters);
        setCourses(data);
        setError(null);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  const handleLevelChange = (e) => {
    setFilters(prev => ({
      ...prev,
      level: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">
            Explore Courses
          </h1>
          <p className="text-surface-600 dark:text-surface-300">
            Discover learning resources tailored to help you grow
          </p>
        </div>
        {isAuthenticated && (
          <button 
            onClick={() => navigate('/create-course')}
            className="btn btn-primary flex items-center mt-4 md:mt-0"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create Course
          </button>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search courses..."
            className="input-field"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <select 
            className="input-field"
            value={filters.level}
            onChange={handleLevelChange}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>
      </div>

      {isLoading && <div className="text-center py-10">Loading courses...</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => <CourseCard key={course.Id} course={course} />)}
      </div>
    </div>
  );
}

export default Home;