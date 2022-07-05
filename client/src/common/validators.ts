export const validateEmail = (value: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
export const validateUsername = (value: string) => /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(value);
export const validatePassword = (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(value);
export const validateFirstOrLastName = (value: string) => /^[a-z ,.'-]+$/i.test(value);
export const validateContactNumber = (value: string) => /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(value);