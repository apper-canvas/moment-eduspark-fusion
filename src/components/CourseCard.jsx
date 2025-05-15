import React from 'react';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

// Icons
const StarIcon = getIcon('Star');
const UsersIcon = getIcon('Users');
const ClockIcon = getIcon('Clock');

const CourseCard = ({ course }) => {
  // Default image if none provided
  const defaultImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97";
  
  return (
    <div className="group bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={course.image || defaultImage}
          alt={course.title} 
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white dark:bg-surface-700 rounded-full px-2 py-1 text-xs font-medium flex items-center shadow-sm">
          <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
          <span>{course.rating || '4.5'}</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">{course.level}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-surface-900 dark:text-white">{course.title}</h3>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex text-xs text-surface-500 dark:text-surface-400 mb-4">
          <div className="flex items-center mr-3">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-3 w-3 mr-1" />
            <span>{course.students?.toLocaleString() || "10,000+"} students</span>
          </div>
        </div>
        
        <Link to={`/course/${course.Id}`} className="block w-full text-center py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">View Course</Link>
      </div>
    </div>
  );
};
export default CourseCard;