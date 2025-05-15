// Helper function to initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Fetch progress records for a specific user
export const fetchUserProgress = async (userId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      where: [
        {
          fieldName: "userId",
          operator: "ExactMatch",
          values: [userId]
        }
      ],
      orderBy: [
        {
          field: "activityDate",
          direction: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("progress", params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
};

// Fetch progress records for a specific user and course
export const fetchUserCourseProgress = async (userId, courseId) => {
  try {
    if (!userId || !courseId) {
      throw new Error("User ID and Course ID are required");
    }
    
    const apperClient = getApperClient();
    
    const params = {
      where: [
        {
          fieldName: "userId",
          operator: "ExactMatch",
          values: [userId]
        },
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        }
      ],
      orderBy: [
        {
          field: "activityDate",
          direction: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("progress", params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching progress for user ${userId} and course ${courseId}:`, error);
    throw error;
  }
};

// Create a new progress record
export const createProgressRecord = async (progressData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord("progress", {
      records: [progressData]
    });
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error("Error creating progress record:", error);
    throw error;
  }
};