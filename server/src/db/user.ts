import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
	firstName: 'string',
	lastName: 'string'
});

const User = mongoose.model("user", userSchema);

export default User;