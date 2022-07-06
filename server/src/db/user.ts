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
	refreshToken: string;
	setPassword: (password: string) => Promise<void>;
	validatePassword: (candidatePassword: string) => Promise<{ error: Error | null, isMatch?: boolean }>;
}

var userSchema = new Schema<IUserDocument>({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
	email: {
		type: String,
		required: true,
		index: {
			unique: true,
		},
		validate: {
			validator: validateEmail,
			message: () => `Invalid email address!`
		}
	},
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		},
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
	},
	refreshToken: {
		type: String
	}
});

userSchema.pre<IUserDocument>('save', function (next: any) {
	let user = this;

	if (user.email)
		user.email = user.email.toLowerCase();

	console.log("user modified:", user.isModified('password'));

	if (!user.isModified('password'))
		return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.post<IUserDocument>('save', function (error: any, res: any, next: any) {
	if (error.name === "MongoServerError" && error.code === 11000) {
		let duplicateFields: any[] = [];
		for (const key in error.keyValue) {
			duplicateFields.push(key);
		}
		next({
			code: "DUPLICATE_FIELD",
			duplicateFields: duplicateFields
		});
	}
	else
		next(error);
});

userSchema.methods.setPassword = function (candidatePassword: string) {
	return new Promise((resolve, reject) => {
		const user = this;
		bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
			if (err) return reject(err);
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return reject(err);
				user.password = hash;
				resolve(null);
			});
		});
	});
}

userSchema.methods.validatePassword = function (candidatePassword: string) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
			if (error) return reject({ error });
			resolve({ error: null, isMatch });
		});
	});
};

const User = model<IUserDocument>("user", userSchema);

export default User;
