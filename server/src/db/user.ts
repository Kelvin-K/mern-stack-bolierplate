import mongoose, { Schema } from "mongoose";

let firstNameLastNameValidator = (value: string) => {
	return /^[a-z ,.'-]+$/i.test(value);
}

var userSchema = new mongoose.Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
	firstName: {
		type: "string",
		required: true,
		validate: {
			validator: firstNameLastNameValidator,
			message: (props: any) => `${props.value} is not a valid phone first name!`
		}
	},
	lastName: {
		type: "string",
		required: true,
		validate: {
			validator: firstNameLastNameValidator,
			message: (props: any) => `${props.value} is not a valid phone last name!`
		}
	}
});

const User = mongoose.model("user", userSchema);

export default User;