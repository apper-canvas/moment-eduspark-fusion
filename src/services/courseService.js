// Helper function to initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Fetch all courses
export const fetchCourses = async (filters = {}, page = 1, limit = 10) => {
  try {
    const apperClient = getApperClient();
    
    // Build where conditions based on filters
    const whereConditions = [];
    
    if (filters.level) {
      whereConditions.push({
        fieldName: "level",
        operator: "ExactMatch",
        values: [filters.level]
      });
    }
    
    if (filters.searchTerm) {
      whereConditions.push({
        fieldName: "title",
        operator: "Contains",
        values: [filters.searchTerm]
      });
    }
    
    const params = {
      where: whereConditions,
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      },
      orderBy: [
        {
          field: "Id",
          direction: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("course", params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Fetch a single course by ID
export const fetchCourseById = async (courseId) => {
  try {
    const apperClient = getApperClient();
    if (!courseId) {
      throw new Error("Course ID is required");
    }
    
    const response = await apperClient.getRecordById("course", Number(courseId));
    return response && response.data ? response.data : null;
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    error.message = `Failed to fetch course: ${error.message || 'Unknown error'}`;
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const apperClient = getApperClient();
    // Create a properly structured record for Apper
    // Create record with proper table format
    const record = {
      Name: courseData.title || courseData.Name || "New Course", // Ensure Name field is set
      IsDeleted: false,
      InSandbox: false,
      ...courseData // Include all other course data fields
    };
    
    const response = await apperClient.createRecord("course", {
      records: [record]
    });
    
    if (response && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    return null;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.updateRecord("course", {
      records: [{
        Id: courseId,
        ...courseData
      }]
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating course with ID ${courseId}:`, error);
    throw error;
  }
};