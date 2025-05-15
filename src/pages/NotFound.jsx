import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');
const HomeIcon = getIcon('Home');

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center"
    >
      <div className="mb-6">
        <h1 className="text-8xl font-bold text-primary-light mb-2">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/"
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Go to Home</span>
        </Link>
        
        <button 
          onClick={() => window.history.back()}
          className="btn bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-surface-800 dark:text-surface-100 flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Go Back</span>
        </button>
      </div>
    </motion.div>
  );
}

export default NotFound;