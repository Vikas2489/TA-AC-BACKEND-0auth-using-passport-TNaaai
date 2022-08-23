var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var usersSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    image: { type: String }
});

usersSchema.pre('save', function(next) {
    if (this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 8, (err, hashed) => {
            if (err) return next(err);
            this.password = hashed;
            return next();
        });
    } else {
        return next();
    }
});

usersSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result);
    });
}


module.exports = mongoose.model("User", usersSchema);