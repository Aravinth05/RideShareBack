var mongoose = require("mongoose");

module.exports = function () {
    
    var DriverSchema = mongoose.Schema({
        username: {
            type: String,
            index: true
        },
        
        password: {
            type: String
        },
        email: {
            type: String
        }, 
        name: {
            type: String
        }
    });
    
    var DriverModel = mongoose.model('Driver', DriverSchema);
    var api = {
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        findUserById: findUserById,
        findAllUsers: findAllUsers,
        createUser: createUser,
        removeUser: removeUser,
        updateUser: updateUser,
        
        getMongooseModel: getMongooseModel
    };
    return api;
    
    
    function updateUser(userId, user) {
        return DriverModel.update({ _id: userId }, { $set: user });
    }
    
    function removeUser(userId) {
        return DriverModel.remove({ _id: userId });
    }
    
    function findAllUsers() {
        return DriverModel.find();
    }
    function createUser(user) {
        return DriverModel.create(user);
    }
    
    function findUserByUsername(username) {
        return DriverModel.findOne({ username: username });
    }
    
    function getMongooseModel() {
        return DriverModel;
    }
    
    function findUserById(userId) {
        return DriverModel.findById(userId);
    }
    
    function findUserByCredentials(credentials) {
        return DriverModel.findOne(
            {
                username: credentials.username,
                password: credentials.password
            }
        );
    }
}