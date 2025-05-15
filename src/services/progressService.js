// Helper function to initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Create a new progress record
export const createProgressRecord = async (progressData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord("progress", {
      records: [{
        Name: `${progressData.userId} - ${progressData.courseId} - ${progressData.activityTitle}`,
        userId: progressData.userId,
        courseId: progressData.courseId,
        completionPercentage: progressData.completionPercentage || 0,
        minutesStudied: progressData.minutesStudied || 0,
        activityType: progressData.activityType,
        activityTitle: progressData.activityTitle,
        activityDate: new Date().toISOString(),
        quizScore: progressData.quizScore
      }]
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating progress record:", error);
    throw error;
  }
};

// Fetch progress for a specific user
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
    console.error(`Error fetching progress for user ${userId}:`, error);
    throw error;
  }
};

// Fetch progress for a specific course and user
export const fetchUserCourseProgress = async (userId, courseId) => {
  try {
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

// Update a progress record
export const updateProgress = async (progressId, progressData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.updateRecord("progress", {
      records: [{ Id: progressId, ...progressData }]
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating progress with ID ${progressId}:`, error);
    throw error;
  }
};