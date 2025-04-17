import UserService from '../services/UserService.js';

class UserController {
    /**
     * Retrieves a user by their ID.
     * @param {string} id - The ID of the user to retrieve.
     * @returns {Object} - The user object if found.
     * @throws {Error} - If the user is not found.
     */
    static async getUserById(id) {
        const user = await UserService.getUserById(id);
        if (!user) {
            throw Error('User not found');
        }
        return user;
    }

    /**
     * Creates a new user.
     * @param {Object} userModel - The user data to create.
     */
    static async createUser(userModel) {
        await UserService.createUser(userModel);
    }

    /**
     * Updates an existing user by their ID.
     * @param {string} id - The ID of the user to update.
     * @param {Object} userModel - The updated user data.
     * @returns {Object} - The updated user object.
     * @throws {Error} - If the user is not found.
     */
    static async updateUser(id, userModel) {
        const updatedUser = await UserService.updateUser(id, userModel);
        if (!updatedUser) {
            throw Error('User not found');
        }
        return updatedUser;
    }

    /**
     * Deletes a user by their ID.
     * @param {string} id - The ID of the user to delete.
     * @returns {Object} - The deleted user object.
     * @throws {Error} - If the user is not found.
     */
    static async deleteUser(id) {
        const deletedUser = await UserService.deleteUser(id);
        if (!deletedUser) {
            throw Error('User not found');
        }
        return deletedUser;
    }
}

export default UserController;
