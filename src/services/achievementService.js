// Helper function to initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Create a new achievement
export const createAchievement = async (achievementData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord("achievement", {
      records: [{
        Name: `${achievementData.title} - ${achievementData.userId}`,
        title: achievementData.title,
        description: achievementData.description,
        earned: achievementData.earned || false,
        progress: achievementData.progress || 0,
        earnedDate: achievementData.earnedDate,
        userId: achievementData.userId
      }]
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating achievement:", error);
    throw error;
  }
};

// Fetch achievements for a specific user
export const fetchUserAchievements = async (userId) => {
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
          field: "earnedDate",
          direction: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("achievement", params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching achievements for user ${userId}:`, error);
    throw error;
  }
};

// Update an achievement
export const updateAchievement = async (achievementId, achievementData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.updateRecord("achievement", {
      records: [{ Id: achievementId, ...achievementData }]
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating achievement with ID ${achievementId}:`, error);
    throw error;
  }
};

// Mark achievement as earned
export const markAchievementAsEarned = async (achievementId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.updateRecord("achievement", {
      records: [{ Id: achievementId, earned: true, earnedDate: new Date().toISOString() }]
    });
    return response.data;
  } catch (error) {
    console.error(`Error marking achievement ${achievementId} as earned:`, error);
    throw error;
  }
};