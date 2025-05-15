import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useSelector } from 'react-redux';
import { fetchCourseById } from '../services/courseService';
import { createEnrollment } from '../services/enrollmentService';
import { createProgressRecord } from '../services/progressService';

// Icons
const ArrowLeftIcon = getIcon('ArrowLeft');
const UserIcon = getIcon('User');
const MailIcon = getIcon('Mail');
const PhoneIcon = getIcon('Phone');
const CalendarIcon = getIcon('Calendar');
const BookOpenIcon = getIcon('BookOpen');

const EnrollmentForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    educationLevel: 'highschool',
    preferredSchedule: 'weekday',
    specialRequirements: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const courseData = await fetchCourseById(courseId);
        if (!courseData) {
          setError('Course not found');
          toast.error('Course not found');
          navigate('/');
          return;
        }
        setCourse(courseData);
        
        // If user is logged in, pre-fill the form with their information
        if (user && user.emailAddress) {
          setFormData(prev => ({ ...prev, email: user.emailAddress, firstName: user.firstName || '', lastName: user.lastName || '' }));
        }
      } catch (err) {
        setError('Failed to load course details');
        toast.error('Failed to load course details');
        console.error('Error loading course:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, navigate, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setSubmitting(true);
        
        // Create enrollment record
        const enrollmentData = {
          ...formData,
          courseId: parseInt(courseId)
        };
        
        const enrollmentResult = await createEnrollment(enrollmentData);
        
        // Create progress record to track enrollment
        if (user && user.Id) {
          await createProgressRecord({
            userId: user.Id,
            courseId: parseInt(courseId),
            completionPercentage: 0,
            minutesStudied: 0,
            activityType: 'course',
            activityTitle: `Enrolled in ${course.title}`
          });
        }
        
        toast.success(`You've been enrolled in ${course.title}!`);
        // Redirect to course details after a short delay
        setTimeout(() => {
          navigate(`/course/${courseId}`);
        }, 2000);
      } catch (error) {
        toast.error('Enrollment failed. Please try again.');
        console.error('Enrollment error:', error);
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error('Please correct the errors in the form');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-6">We couldn't find the course you're looking for.</p>
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <Link to={`/course/${courseId}`} className="inline-flex items-center mb-6 text-surface-600 hover:text-primary transition-colors">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Course Details
      </Link>
      
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-primary text-white">
          <div className="flex items-center">
            <BookOpenIcon className="w-6 h-6 mr-2" />
            <h1 className="text-2xl font-bold">Enroll in Course</h1>
          </div>
          <p className="mt-2">{course.title} • {course.level} • {course.duration}</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-primary" />
              Course Information
            </h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-surface-700 dark:text-surface-300">
              <div>
                <p className="text-sm font-semibold">Instructor:</p>
                <p>{course.instructor}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Price:</p>
                <p>{course.price || 'Free'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Duration:</p>
                <p>{course.duration}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Level:</p>
                <p>{course.level}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4 text-surface-900 dark:text-white">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="firstName">
                  First Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="w-4 h-4 text-surface-500" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="lastName">
                  Last Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="w-4 h-4 text-surface-500" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="email">
                  Email*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MailIcon className="w-4 h-4 text-surface-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <PhoneIcon className="w-4 h-4 text-surface-500" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="dateOfBirth">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="w-4 h-4 text-surface-500" />
                  </div>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="educationLevel">
                  Education Level
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="highschool">High School</option>
                  <option value="associate">Associate Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold mb-4 text-surface-900 dark:text-white">Preferences</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="preferredSchedule">
                Preferred Schedule
              </label>
              <select
                id="preferredSchedule"
                name="preferredSchedule"
                value={formData.preferredSchedule}
                onChange={handleChange}
                className="input-field"
              >
                <option value="weekday">Weekday (Mon-Fri)</option>
                <option value="weekend">Weekend (Sat-Sun)</option>
                <option value="evening">Evening Classes</option>
                <option value="morning">Morning Classes</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1" htmlFor="specialRequirements">
                Special Requirements or Accommodations
              </label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                className="input-field h-24"
                placeholder="Let us know if you have any special requirements..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={`h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary ${errors.agreeToTerms ? 'border-red-500' : ''}`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="text-surface-700 dark:text-surface-300">
                    I agree to the <a href="#" className="text-primary hover:underline">terms and conditions</a> and <a href="#" className="text-primary hover:underline">privacy policy</a>*
                  </label>
                </div>
              </div>
              {errors.agreeToTerms && <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link 
                to={`/course/${courseId}`}
                className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Complete Enrollment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrollmentForm;