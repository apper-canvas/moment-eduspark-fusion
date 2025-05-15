import React from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ title, description, icon, colorClass, delay = 0 }) => {
  const IconComponent = getIcon(icon);
  
  // Default color class if none provided
  const defaultColorClass = 'bg-primary text-white';
  const iconBgClass = colorClass || defaultColorClass;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start space-x-4 p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card hover:shadow-lg transition-all duration-300"
    >
      <div className={`p-3 rounded-lg ${iconBgClass}`}>
        <IconComponent className="h-6 w-6" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-surface-900 dark:text-white">{title}</h3>
        <p className="text-surface-600 dark:text-surface-400">{description}</p>
      </div>
    </motion.div>
  );
};

export const MainFeatureGrid = ({ features }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <MainFeature
          key={index}
          {...feature}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default MainFeature;