import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import getIcon from '../utils/iconUtils';
import { toast } from 'react-toastify';

// Icons
const ArrowLeftIcon = getIcon('ArrowLeft');
const ClockIcon = getIcon('Clock');
const UserIcon = getIcon('User');
const BookIcon = getIcon('Book');
const AwardIcon = getIcon('Award');
const TagIcon = getIcon('Tag');

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock course data with extended details
  const coursesData = [
    {
      id: 1,
      title: "Introduction to JavaScript",
      instructor: "Sarah Johnson",
      instructorRole: "Senior Web Developer",
      instructorBio: "Sarah has 10+ years of experience in web development and has taught over 50,000 students online.",
      description: "Learn the fundamentals of JavaScript programming and build interactive web applications.",
      fullDescription: "This comprehensive course covers JavaScript from the ground up. You'll learn variables, data types, functions, objects, DOM manipulation, event handling, and modern ES6+ features. By the end, you'll be able to build fully interactive web applications and understand the core concepts that make JavaScript the backbone of modern web development.",
      level: "Beginner",
      duration: "8 weeks",
      lessons: 24,
      rating: 4.8,
      students: 12543,
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      topics: ["Variables & Data Types", "Functions & Objects", "DOM Manipulation", "Event Handling", "Asynchronous JavaScript", "ES6+ Features"],
      skills: ["Web Development", "Front-end Programming", "Interactive UI Creation"]
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "Michael Chen",
      instructorRole: "Data Scientist",
      instructorBio: "Michael is a data scientist at a Fortune 500 company with expertise in machine learning and data visualization.",
      description: "Explore data analysis, visualization, and machine learning using Python.",
      fullDescription: "This specialized course teaches you how to use Python specifically for data science applications. You'll learn pandas for data manipulation, matplotlib and seaborn for visualization, and scikit-learn for machine learning. The course includes real-world projects analyzing actual datasets, giving you practical experience that employers are looking for in data science roles.",
      level: "Intermediate",
      duration: "10 weeks",
      lessons: 32,
      rating: 4.9,
      students: 8976,
      image: "https://images.unsplash.com/photo-1542903660-eedba2cda473",
      topics: ["Pandas & NumPy", "Data Visualization", "Statistical Analysis", "Machine Learning Basics", "Data Cleaning", "Predictive Modeling"],
      skills: ["Data Analysis", "Statistical Modeling", "Machine Learning"]
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      instructor: "Elena Rodriguez",
      instructorRole: "UX Design Lead",
      instructorBio: "Elena has worked on UX design for major tech companies and specializes in user-centered design approaches.",
      description: "Master the principles of effective user interface and experience design.",
      fullDescription: "This design-focused course will teach you both the theory and practice of UI/UX design. You'll learn how to conduct user research, create wireframes and prototypes, design visual interfaces, and test your designs with real users. The course emphasizes accessibility and inclusive design principles to ensure your products work for everyone.",
      level: "All Levels",
      duration: "6 weeks",
      lessons: 18,
      rating: 4.7,
      students: 5432,
      image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd",
      topics: ["User Research", "Wireframing", "Prototyping", "Visual Design", "Usability Testing", "Accessibility"],
      skills: ["Interface Design", "User Research", "Prototyping Tools"]
    }
  ];

  useEffect(() => {
    // Simulate API fetch with a short delay
    setLoading(true);
    const timer = setTimeout(() => {
      const foundCourse = coursesData.find(c => c.id === parseInt(courseId));
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        toast.error("Course not found!");
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [courseId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
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
      <Link to="/" className="inline-flex items-center mb-6 text-surface-600 hover:text-primary transition-colors">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Courses
      </Link>
      
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3">
            <img className="h-48 w-full object-cover md:h-full" src={course.image} alt={course.title} />
          </div>
          <div className="p-8 md:w-2/3">
            <div className="flex items-center">
              <span className="bg-primary-100 text-primary text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">{course.level}</span>
              <div className="ml-2 text-xs text-surface-500 dark:text-surface-400 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {course.duration}
              </div>
              <div className="ml-2 text-xs text-surface-500 dark:text-surface-400 flex items-center">
                <UserIcon className="w-3 h-3 mr-1" />
                {course.students.toLocaleString()} students
              </div>
            </div>
            
            <h1 className="mt-2 text-2xl font-bold text-surface-900 dark:text-white">{course.title}</h1>
            
            <div className="mt-2 flex items-center">
              <img className="h-10 w-10 rounded-full mr-2" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random`} alt={course.instructor} />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{course.instructor}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{course.instructorRole}</p>
              </div>
            </div>
            
            <p className="mt-4 text-surface-600 dark:text-surface-300">{course.fullDescription || course.description}</p>
            
            <div className="mt-6 border-t border-surface-200 dark:border-surface-700 pt-4">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-3">What you'll learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.topics && course.topics.map((topic, index) => (
                  <div key={index} className="flex items-center text-sm text-surface-600 dark:text-surface-300">
                    <BookIcon className="w-4 h-4 mr-2 text-primary" />
                    {topic}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 border-t border-surface-200 dark:border-surface-700 pt-4">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Skills you'll gain</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills && course.skills.map((skill, index) => (
                  <span key={index} className="bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-300 text-xs px-3 py-1 rounded-full flex items-center">
                    <TagIcon className="w-3 h-3 mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                to={`/enroll/${course.id}`}
                className="inline-flex px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors items-center justify-center mx-auto"
              ><AwardIcon className="w-5 h-5 mr-2" />
                Enroll in This Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetails;