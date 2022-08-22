var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
});

module.exports = mongoose.model("User", usersSchema);