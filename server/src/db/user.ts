import bcrypt from "bcrypt";
import { Document, Model, model, Schema } from "mongoose";

const SALT_WORK_FACTOR = 10;

interface IUser extends Document {
	email: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	contactNumber: string;
	validatePassword: (candidatePassword: string, cb: (error: Error | null, isMatch?: boolean) => {}) => {};
}

let firstNameLastNameValidator = (value: string) => /^[a-z ,.'-]+$/i.test(value);

var userSchema: Schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
	email: {
		type: String,
		required: true,
		index: {
			unique: true
		},
		validate: {
			validator: (value: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
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
			validator: (value: string) => /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(value),
			message: (props: any) => `${props.value} does not fall within valid username criteria!`
		}
	},
	password: {
		type: String,
		required: true,
		validate: {
			validator: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(value),
			message: () => `Password does not fall within accepted criteria!`
		}
	},
	firstName: {
		type: String,
		required: true,
		validate: {
			validator: firstNameLastNameValidator,
			message: (props: any) => `${props.value} is not a valid first name!`
		}
	},
	lastName: {
		type: String,
		required: true,
		validate: {
			validator: firstNameLastNameValidator,
			message: (props: any) => `${props.value} is not a valid last name!`
		}
	},
	contactNumber: {
		type: String,
		validate: {
			validator: (value: string) => /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(value),
			message: (props: any) => `${props.value} is not a valid phone last name!`
		}
	}
});

userSchema.pre('save', function (this: IUser, next: any) {
	let user = this;

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

userSchema.methods.validatePassword = function (this: IUser, candidatePassword: string, cb: (error: Error | null, isMatch?: boolean) => {}) {
	bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
		if (error) return cb(error);
		cb(null, isMatch);
	});
};

const User: Model<IUser> = model("user", userSchema);

export default User;

