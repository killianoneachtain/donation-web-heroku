'use strict';

const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: {
        type: String,
        min: 8,
        max: 15
    }
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

userSchema.statics.findById = function(id) {
    return this.findOne({ _id : id });
};

userSchema.statics.saveUser = function() {
    this.save();
}

userSchema.methods.comparePassword = function(candidatePassword) {
    const isMatch = this.password === candidatePassword;
    if (!isMatch) {
        throw Boom.unauthorized('Password mismatch.');
    }
    return this;
};

module.exports = Mongoose.model('User', userSchema);