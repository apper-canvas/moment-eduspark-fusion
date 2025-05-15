import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createCourse } from '../services/courseService';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');

function CreateCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    instructor: '',
    instructorRole: '',
    instructorBio: '',
    level: 'Beginner',
    duration: '',
    lessons: '',
    price: '',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
    topics: [],
    skills: []
  });

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  
  const topicOptions = [
    'Variables & Data Types', 'Functions & Objects', 'DOM Manipulation',
    'Event Handling', 'Asynchronous JavaScript', 'ES6+ Features',
    'Pandas & NumPy', 'Data Visualization', 'Statistical Analysis',
    'Machine Learning Basics', 'Data Cleaning', 'Predictive Modeling',
    'User Research', 'Wireframing', 'Prototyping',
    'Visual Design', 'Usability Testing', 'Accessibility'
  ];
  
  const skillOptions = [
    'Web Development', 'Front-end Programming', 'Interactive UI Creation', 
    'Data Analysis', 'Statistical Modeling', 'Machine Learning',
    'Interface Design', 'User Research', 'Prototyping Tools'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'lessons') {
      // Only allow numeric values
      if (value === '' || /^\d+$/.test(value) || (name === 'price' && /^\d+(\.\d{0,2})?$/.test(value))) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTopicChange = (topic) => {
    setFormData(prev => {
      const updatedTopics = prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic];
      
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleSkillChange = (skill) => {
    setFormData(prev => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      
      return { ...prev, skills: updatedSkills };
    });
  };

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'instructor', 'level', 'duration', 'lessons', 'price'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (formData.topics.length === 0) {
      toast.error('Please select at least one topic');
      return false;
    }
    
    if (formData.skills.length === 0) {
      toast.error('Please select at least one skill');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare data for submission
      const courseData = {
        ...formData,
        rating: 0, // New courses start with 0 rating
        students: 0, // New courses start with 0 students
        Name: formData.title // Set Name field required by Apper
      };
      
      await createCourse(courseData);
      toast.success('Course created successfully!');
      
      // Navigate back to home page after a delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 text-surface-600 hover:text-primary flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Courses
        </button>
        <h1 className="text-3xl font-bold">Create New Course</h1>
      </div>
      
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Basic Information */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Course Information</h2>
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                required
                maxLength={200}
              />
              <p className="text-xs text-surface-500 mt-1">Brief overview of the course (max 200 characters)</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Full Description
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                className="input-field min-h-[150px]"
                rows={5}
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 8 weeks, 10 hours"
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Number of Lessons <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="lessons"
                value={formData.lessons}
                onChange={handleChange}
                className="input-field"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="input-field"
                required
              >
                {levelOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="49.99"
                className="input-field"
                required
              />
            </div>
            
            {/* Instructor Information */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-xl font-semibold mb-4">Instructor Information</h2>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Instructor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Instructor Role
              </label>
              <input
                type="text"
                name="instructorRole"
                value={formData.instructorRole}
                onChange={handleChange}
                placeholder="e.g., Senior Developer, Data Scientist"
                className="input-field"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Instructor Bio
              </label>
              <textarea
                name="instructorBio"
                value={formData.instructorBio}
                onChange={handleChange}
                className="input-field"
                rows={3}
              />
            </div>
            
            {/* Topics and Skills */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-xl font-semibold mb-4">Topics & Skills</h2>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Topics <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {topicOptions.map(topic => (
                  <div 
                    key={topic} 
                    onClick={() => handleTopicChange(topic)}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      formData.topics.includes(topic)
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {skillOptions.map(skill => (
                  <div 
                    key={skill} 
                    onClick={() => handleSkillChange(skill)}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      formData.skills.includes(skill)
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="md:col-span-2 mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 mr-4"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;