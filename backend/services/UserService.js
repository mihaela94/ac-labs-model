import User from '../models/User.js';

class UserService {
    /**
     * Retrieves a user by their ID.
     * @param {string} id - The ID of the user to retrieve.
     * @returns {Object|null} - The user object if found, otherwise null.
     */
    static async getUserById(id) {
        return User.findById(id);
    }

    /**
     * Adds a new user to the database.
     * @param {Object} userModel - The user object to add.
     */
    static createUser(userModel) {
        const user = new User(userModel);
        return user.save();
    }

    /**
     * Updates an existing user by their ID.
     * @param {string} id - The ID of the user to update.
     * @param {Object} userModel - The updated user data.
     * @returns {Object|null} - The updated user object if successful, otherwise null.
     */
    static updateUser(id, userModel) {
        return User.findByIdAndUpdate(id, userModel, { new: true });
    }

    /**
     * Deletes a user by their ID.
     * @param {string} id - The ID of the user to delete.
     * @returns {Object|null} - The deleted user object if successful, otherwise null.
     */
    static deleteUser(id) {
        return User.findByIdAndDelete(id);

    }
}

export default UserService;
