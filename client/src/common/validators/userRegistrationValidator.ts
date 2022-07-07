import Joi from "joi";

const userRegistrationValidator = Joi.object({
	username: Joi.string()
		.required()
		.min(3)
		.max(30)
		.pattern(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
		.messages({
			'string.empty': 'Username is required.',
			'string.min': 'Username has to be at least 3 characters long.',
			'string.max': 'Username should be max 30 characters long.',
			'string.pattern.base': 'Username is not valid.'
		}),
	password: Joi.string()
		.required()
		.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)
		.messages({
			'string.empty': 'Password is required.',
			'string.pattern.base': 'Password is not valid.'
		}),
	confirmPassword: Joi.any()
		.required()
		.valid(Joi.ref('password'))
		.messages({
			'string.empty': "Confirm password is required",
			'any.only': 'Confirm password and password must match.'
		}),
	firstName: Joi.string()
		.required()
		.min(3)
		.max(30)
		.messages({
			'string.empty': 'First Name is required.',
			'string.min': 'First Name has to be at least 3 characters long.',
			'string.max': 'First Name should be max 30 characters long.',
		}),
	lastName: Joi.string()
		.required()
		.min(3)
		.max(30)
		.messages({
			'string.empty': 'Last Name is required.',
			'string.min': 'Last Name has to be at least 3 characters long.',
			'string.max': 'Last Name should be max 30 characters long.',
		}),
	email: Joi.string()
		.required()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.lowercase()
		.messages({
			'string.empty': 'Email is required.',
			'string.email': 'Email is not valid',
		}),
	contactNumber: Joi.string()
		.pattern(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)
		.messages({
			'string.empty': 'Email is required.',
			'string.pattern.base': 'Contact number is not valid',
		}),
});

export default userRegistrationValidator;