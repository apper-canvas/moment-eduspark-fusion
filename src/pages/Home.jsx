import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Icons
const GraduationCapIcon = getIcon('GraduationCap');
const CodeIcon = getIcon('Code');
const LanguagesIcon = getIcon('Languages');
const ActivityIcon = getIcon('Activity');
const BarChart4Icon = getIcon('BarChart4');
const BrainCircuitIcon = getIcon('BrainCircuit');

function Home() {
  const [activeTab, setActiveTab] = useState('featured');
  
  const categories = [
    { id: 'featured', name: 'Featured Courses', icon: GraduationCapIcon },
    { id: 'programming', name: 'Programming', icon: CodeIcon },
    { id: 'languages', name: 'Languages', icon: LanguagesIcon },
    { id: 'math', name: 'Mathematics', icon: ActivityIcon },
    { id: 'data-science', name: 'Data Science', icon: BarChart4Icon },
    { id: 'ai', name: 'Artificial Intelligence', icon: BrainCircuitIcon },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Expand Your Knowledge with EduSpark</h1>
            <p className="text-lg opacity-90 mb-6">
              Explore interactive courses in programming, languages, math, and more.
              Track your progress and earn certifications.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn bg-white text-primary hover:bg-opacity-90 focus:ring-white">
                Explore Courses
              </button>
              <button className="btn bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 focus:ring-white">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Students learning online" 
              className="rounded-xl shadow-lg w-full max-w-md mx-auto object-cover h-64 md:h-80"
            />
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex overflow-x-auto pb-3 scrollbar-hide space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                activeTab === category.id
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <MainFeature categoryId={activeTab} />
    </motion.div>
  );
}

export default Home;