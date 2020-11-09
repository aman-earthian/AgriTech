const { model, Schema } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    aadhar: String,
    address: String,
    city: String,
    State : String,
    Zip : String
});

userSchema.plugin(passportLocalMongoose);

module.exports = model('User', userSchema);