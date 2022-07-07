import Joi from "joi";

const userLoginValidator = Joi.object({
	username: Joi.string()
		.required()
		.min(3)
		.max(30)
		.pattern(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
		.messages({
			'string.empty': 'Username is required.',
			'string.min': 'Username has to be at least 3 characters long.',
			'string.max': 'Username should be max 30 characters long.',
			'string.pattern.base': 'Username is invalid.'
		}),
	password: Joi.string()
		.required()
		.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)
		.messages({
			'string.empty': 'Password is required.',
			'string.pattern.base': 'Password is invalid.'
		}),
});

export default userLoginValidator;