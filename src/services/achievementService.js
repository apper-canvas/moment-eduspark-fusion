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
        Name: achievementData.title,
        title: achievementData.title,
        description: achievementData.description,
        earned: achievementData.earned || false,
        progress: achievementData.progress || 0,
        earnedDate: achievementData.earnedDate || null,
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

// Fetch a specific achievement by ID
export const fetchAchievementById = async (achievementId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById("achievement", achievementId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching achievement with ID ${achievementId}:`, error);
    throw error;
  }
};

// Update an achievement
export const updateAchievement = async (achievementId, achievementData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.updateRecord("achievement", {
      records: [{
        Id: achievementId,
        ...achievementData
      }]
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating achievement with ID ${achievementId}:`, error);
    throw error;
  }
};

// Award an achievement to a user (mark as earned with current date)
export const awardAchievement = async (achievementId) => {
  try {
    const apperClient = getApperClient();
    
    // First get the current achievement to preserve other data
    const currentAchievement = await fetchAchievementById(achievementId);
    
    if (!currentAchievement) {
      throw new Error(`Achievement with ID ${achievementId} not found`);
    }
    
    // Update the achievement to mark it as earned
    const response = await apperClient.updateRecord("achievement", {
      records: [{
        Id: achievementId,
        earned: true,
        progress: 100,
        earnedDate: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
      }]
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error awarding achievement with ID ${achievementId}:`, error);
    throw error;
  }
};

// Additional functions can be added as needed for specific achievement-related operations