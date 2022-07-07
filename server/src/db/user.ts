import bcrypt from "bcrypt";
import { Document, model, Schema } from "mongoose";
import { validateContactNumber, validateEmail, validateFirstOrLastName, validatePassword, validateUsername } from "../common/validators";

const SALT_WORK_FACTOR = 10;

interface IUser {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	email: string;
	contactNumber: string;
}

export interface IUserDocument extends IUser, Document {
	setPassword: (password: string) => void;
	isValidPassword: (password: string) => boolean;
}

var userSchema = new Schema<IUserDocument>({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: {
			validator: validateEmail,
			message: () => `Invalid email address!`
		}
	},
	username: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: validateUsername,
			message: (props: any) => `${props.value} does not fall within valid username criteria!`
		}
	},
	password: {
		type: String,
		required: true,
		validate: {
			validator: validatePassword,
			message: () => `Password does not fall within accepted criteria!`
		}
	},
	firstName: {
		type: String,
		required: true,
		validate: {
			validator: validateFirstOrLastName,
			message: (props: any) => `${props.value} is not a valid first name!`
		}
	},
	lastName: {
		type: String,
		required: true,
		validate: {
			validator: validateFirstOrLastName,
			message: (props: any) => `${props.value} is not a valid last name!`
		}
	},
	contactNumber: {
		type: String,
		validate: {
			validator: validateContactNumber,
			message: (props: any) => `${props.value} is not a valid phone last name!`
		}
	}
});

userSchema.pre<IUserDocument>('save', async function (next: any) {
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		const hashedPassword = await bcrypt.hash(this.password, salt)
		this.password = hashedPassword;
		next()
	}
	catch (error) {
		next(error);
	}
});

userSchema.methods.setPassword = async function (password: string) {
	const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
	const hashedPassword = await bcrypt.hash(password, salt)
	this.password = hashedPassword;
}

userSchema.methods.isValidPassword = async function (password: string) {
	try {
		return await bcrypt.compare(password, this.password)
	} catch (error) {
		throw error;
	}
};

const User = model<IUserDocument>("user", userSchema);

export default User;
