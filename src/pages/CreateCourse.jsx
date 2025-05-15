import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createCourse } from '../services/courseService';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');
const PlusIcon = getIcon('Plus');
const CheckIcon = getIcon('Check');
const InfoIcon = getIcon('Info');
const ImageIcon = getIcon('Image');
const BookOpenIcon = getIcon('BookOpen');

function CreateCourse() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const totalSteps = 4;
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
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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
    
    if (formData.topics.length === 0 && currentStep === totalSteps) {
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
        Name: formData.title, // Set Name field required by Apper
        rating: 0,            // New courses start with 0 rating
        students: 0,          // New courses start with 0 students
        topics: formData.topics.join(','), // Convert array to comma-separated string for MultiPicklist
        skills: formData.skills.join(','), // Convert array to comma-separated string for MultiPicklist
      };
      
      const response = await createCourse(courseData);
      toast.success('Course created successfully!');
      
      // Navigate back to home page after a delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error creating course:', error);

      let errorMessage = 'Failed to create course';
      
      // Extract more specific error message if available
      if (error?.response?.data?.error) {
        errorMessage += `: ${error.response.data.error}`;
      } else if (error?.message) {
        errorMessage += `: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer
                ${currentStep > index + 1 
                  ? 'bg-primary border-primary text-white' 
                  : currentStep === index + 1 
                    ? 'border-primary text-primary' 
                    : 'border-surface-300 text-surface-400'
                }`}
              onClick={() => setCurrentStep(index + 1)}
            >
              {currentStep > index + 1 ? <CheckIcon className="w-5 h-5" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`w-16 h-1 ${currentStep > index + 1 ? 'bg-primary' : 'bg-surface-300'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="mb-8 flex items-center">
        <Link to="/" className="mr-4 text-surface-600 hover:text-primary flex items-center transition-colors">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span>Back to Courses</span>
        </Link>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Create New Course</h1>
      </div>
      
      {renderStepIndicator()}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 rounded-lg p-2 mr-3">
                    <BookOpenIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input-field text-lg font-medium"
                      placeholder="e.g., Advanced JavaScript for Web Developers"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="A brief overview of what students will learn"
                      required
                      maxLength={200}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-surface-500">Brief overview visible in course listings</p>
                      <p className="text-xs text-surface-500">{formData.description.length}/200</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                      Course Image URL
                    </label>
                    <div className="flex">
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="input-field flex-grow"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <p className="text-xs text-surface-500 mt-1">Use a high-quality image that represents your course (1280×720 recommended)</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
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
                      <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                        Price (USD) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">$</span>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="49.99"
                          className="input-field pl-8"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="btn btn-primary"
                    disabled={!formData.title || !formData.description || !formData.level || !formData.price}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Course Details */}
            {currentStep === 2 && (
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 rounded-lg p-2 mr-3">
                    <InfoIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Course Details</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                      Full Description
                    </label>
                    <textarea
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleChange}
                      className="input-field min-h-[200px]"
                      placeholder="Provide a detailed description of your course, including what students will learn and key takeaways"
                      rows={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
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
                      <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                        Number of Lessons <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="lessons"
                        value={formData.lessons}
                        onChange={handleChange}
                        className="input-field"
                        min="1"
                        placeholder="e.g., 12"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="btn btn-primary"
                    disabled={!formData.duration || !formData.lessons}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Instructor Information */}
            {currentStep === 3 && (
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 rounded-lg p-2 mr-3">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Instructor Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                        Instructor Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., Dr. Jane Smith"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
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
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                      Instructor Bio
                    </label>
                    <textarea
                      name="instructorBio"
                      value={formData.instructorBio}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Share the instructor's background, experience, and qualifications"
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="btn btn-primary"
                    disabled={!formData.instructor}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 4: Topics & Skills */}
            {currentStep === 4 && (
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 rounded-lg p-2 mr-3">
                    <PlusIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Topics & Skills</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                      Topics <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-surface-500 mb-3">Select topics covered in this course (select at least one)</p>
                    <div className="flex flex-wrap gap-2 mt-2 p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800">
                      {topicOptions.map(topic => (
                        <div 
                          key={topic} 
                          onClick={() => handleTopicChange(topic)}
                          className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                            formData.topics.includes(topic)
                              ? 'bg-primary text-white shadow-md transform scale-105'
                              : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 border border-surface-200 dark:border-surface-600'
                          }`}
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                      Skills <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-surface-500 mb-3">Select skills students will develop (select at least one)</p>
                    <div className="flex flex-wrap gap-2 mt-2 p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800">
                      {skillOptions.map(skill => (
                        <div 
                          key={skill} 
                          onClick={() => handleSkillChange(skill)}
                          className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                            formData.skills.includes(skill)
                              ? 'bg-primary text-white shadow-md transform scale-105'
                              : 'bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 border border-surface-200 dark:border-surface-600'
                          }`}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || formData.topics.length === 0 || formData.skills.length === 0}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Course Preview */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 border border-surface-200 dark:border-surface-700 sticky top-24">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-primary" />
              Course Preview
            </h3>
            
            <div className="rounded-lg overflow-hidden mb-4 bg-surface-100 dark:bg-surface-700">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt="Course preview" 
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80";
                  }}
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-surface-200 dark:bg-surface-700">
                  <ImageIcon className="w-10 h-10 text-surface-400" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold">
                {formData.title || "Course Title"}
              </h3>
              
              <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-3">
                {formData.description || "Course description will appear here"}
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {formData.level || "Beginner"}
                </span>
                {formData.duration && (
                  <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs rounded">
                    {formData.duration}
                  </span>
                )}
                {formData.lessons && (
                  <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs rounded">
                    {formData.lessons} lessons
                  </span>
                )}
              </div>
              
              {formData.instructor && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {formData.instructor.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{formData.instructor}</p>
                    {formData.instructorRole && (
                      <p className="text-surface-500 text-xs">{formData.instructorRole}</p>
                    )}
                  </div>
                </div>
              )}
              
              {formData.price && (
                <div className="text-xl font-bold text-primary">
                  ${parseFloat(formData.price).toFixed(2)}
                {isSubmitting ? 'Creating...' : 'Create Course'}
              )}
              
              <div className="flex flex-wrap gap-1">
                {formData.topics.slice(0, 3).map(topic => (
                  <span key={topic} className="inline-block px-2 py-1 bg-surface-100 dark:bg-surface-700 text-xs rounded">
                    {topic}
                  </span>
                ))}
                {formData.topics.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-surface-100 dark:bg-surface-700 text-xs rounded">
                    +{formData.topics.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;