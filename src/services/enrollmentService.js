// Helper function to initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Create a new enrollment
export const createEnrollment = async (enrollmentData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord("enrollment", {
      records: [{
        // Ensure we have a proper record name that identifies the enrollment
        Name: `${enrollmentData.firstName} ${enrollmentData.lastName} - ${enrollmentData.courseId}`,
        courseId: enrollmentData.courseId,
        firstName: enrollmentData.firstName,
        lastName: enrollmentData.lastName,
        email: enrollmentData.email,
        phone: enrollmentData.phone,
        dateOfBirth: enrollmentData.dateOfBirth,
        educationLevel: enrollmentData.educationLevel,
        preferredSchedule: enrollmentData.preferredSchedule,
        specialRequirements: enrollmentData.specialRequirements
      }]
    });
    
    // Return the created record data
    return response.data;
  } catch (error) {
    console.error("Error creating enrollment:", error);
    throw error;
  }
};

// Fetch enrollments for a specific user by email
export const fetchUserEnrollments = async (email) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      where: [
        {
          fieldName: "email",
          operator: "ExactMatch",
          values: [email]
        }
      ],
      orderBy: [
        {
          field: "Id",
          direction: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("enrollment", params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    throw error;
  }
};

// Fetch enrollments for a specific course
export const fetchCourseEnrollments = async (courseId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      where: [
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        }
      ],
      orderBy: [
        {
          field: "Id",
          direction: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("enrollment", params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching enrollments for course ${courseId}:`, error);
    throw error;
  }
};

// Fetch enrollment by ID
export const fetchEnrollmentById = async (enrollmentId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById("enrollment", enrollmentId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching enrollment with ID ${enrollmentId}:`, error);
    throw error;
  }
};

// Update an enrollment record
export const updateEnrollment = async (enrollmentId, enrollmentData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.updateRecord("enrollment", {
      records: [{
        Id: enrollmentId,
        ...enrollmentData
      }]
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating enrollment with ID ${enrollmentId}:`, error);
    throw error;
  }
};

// Check if a user is already enrolled in a course
export const checkUserEnrollment = async (email, courseId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      where: [
        {
          fieldName: "email",
          operator: "ExactMatch",
          values: [email]
        },
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        }
      ],
      pagingInfo: {
        limit: 1
      }
    };
    
    const response = await apperClient.fetchRecords("enrollment", params);
    
    // Return true if enrollment exists, false otherwise
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error(`Error checking enrollment for email ${email} and course ${courseId}:`, error);
    throw error;
  }
};