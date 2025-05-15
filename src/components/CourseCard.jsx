import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const StarIcon = getIcon('Star');
const UsersIcon = getIcon('Users');
const ClockIcon = getIcon('Clock');

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  
  // Handle missing data with fallback values
  const {
    Id = 0,
    title = 'Untitled Course',
    instructor = 'Unknown Instructor',
    level = 'All Levels',
    duration = 'Self-paced',
    rating = 0,
    students = 0,
    price = 0,
    image = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description = 'No description available'
  } = course;

  // Function to get level badge color
  const getLevelColor = () => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Format price to display as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="card h-full flex flex-col overflow-hidden cursor-pointer"
      onClick={() => navigate(`/course/${Id}`)}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className={`absolute top-2 right-2 py-1 px-2 rounded-md text-xs font-medium ${getLevelColor()}`}>
          {level}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-surface-900 dark:text-surface-50">{title}</h3>
      <p className="text-surface-600 dark:text-surface-300 mb-2">{instructor}</p>
      <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 line-clamp-2">{description}</p>
      
      <div className="flex items-center justify-between text-sm mt-auto">
        <div className="flex items-center">
          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-surface-800 dark:text-surface-200">{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
          <UsersIcon className="w-4 h-4 text-surface-500 dark:text-surface-400 mr-1" />
          <span className="text-surface-600 dark:text-surface-300">{students}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="w-4 h-4 text-surface-500 dark:text-surface-400 mr-1" />
          <span className="text-surface-600 dark:text-surface-300">{duration}</span>
        </div>
      </div>
      <div className="mt-4 font-semibold text-lg text-surface-900 dark:text-surface-50">{formatPrice(price)}</div>
    </motion.div>
  );
};

export default CourseCard;