import supabase from "../../utils/Node Config/supabaseAdminConfig.jsx";

class userServices {
  /**
   * Creates a new user in the 'users' table.
   * @param {Object} userData
   * @param {string} userData.userID - Unique identifier from Auth (e.g. Firebase)
   * @param {string} userData.name - Full name of the user
   * @param {string} userData.email - User's email address
   * @param {string} userData.institution - Institution of study
   * @param {string} userData.course - Course enrolled in
   * @param {string} userData.degree - Degree pursued
   * @returns {Object} { success, data, error }
   */
  createUser = async (userData) => {
    const { userID, name, email, institution, course, degree } = userData;

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          userID,
          name,
          email,
          institution,
          course,
          degree,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating user:", error);
      return { success: false, error };
    }
    return { success: true, data: data[0] };
  };

  /**
   * Fetches a user by their userID.
   * @param {string} userID
   * @returns {Object} { success, data, error }
   */
  getUserById = async (userID) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("userID", userID)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  /**
   * Updates an existing user's information.
   * @param {string} userID
   * @param {Object} updateData - Fields to update (e.g., { name: 'New Name', course: 'New Course' })
   * @returns {Object} { success, data, error }
   */
  updateUser = async (userID, updateData) => {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("userID", userID)
      .select();

    if (error) {
      console.error("Error updating user:", error);
      return { success: false, error };
    }
    return { success: true, data: data[0] };
  };

  /**
   * Deletes a user from the 'users' table.
   * @param {string} userID
   * @returns {Object} { success, data, error }
   */
  deleteUser = async (userID) => {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("userID", userID)
      .select();

    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, error };
    }
    return { success: true, data: data[0] };
  };
}

const userservices = new userServices();

export default userservices;
