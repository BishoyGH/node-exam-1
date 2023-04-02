import Joi from 'joi';
/***********************************
 * RegEx Patterns
 ***********************************/
const PASSWORD_REGEXP = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const NAME_REGEXP = /^([a-zA-Z]{2,12} ?){2,5}$/; // Full Name
/***********************************
 * Rules
 **********************************/
const id = Joi.string().required().length(24).hex();
const name = Joi.string().required().pattern(NAME_REGEXP, { name: 'Full Name' }).messages({
  'string.pattern.name': '{:[.]} is not a valid name.',
});
const email = Joi.string().email().required().messages({
  'string.email': '{:[.]} is not a valid Email',
});
const password = Joi.string().required().pattern(PASSWORD_REGEXP, { name: 'Password' }).messages({
  'string.pattern.name':
    '{:[.]} is not a valid password. Password should be at least eight characters, one uppercase letter, one lowercase letter, one number and one special character.',
});
const repassword = Joi.string().required().valid(Joi.ref('password')).messages({
  'any.only': "Password doesn't match",
});
const passwordLogin = Joi.string().required();
const age = Joi.number().min(13).max(150);
/***********************************
 * Schemas
 **********************************/
export const signUp = {
  body: Joi.object({ name, email, password, repassword, age }),
};

export const login = {
  body: Joi.object({ email, password: passwordLogin }),
};

export const update = {
  body: Joi.object({
    name,
    password,
    repassword,
    age,
  }),
};
export const viewProfile = {
  params: Joi.object({ id }),
};
export const emailSchema = {
  body: Joi.object({ email }),
};
export const passwordSchema = {
  body: Joi.object({ password, repassword }),
};

export const friendRequest = {
  body: Joi.object({ targetId: id }),
};
export const confirmFriendRequest = {
  body: Joi.object({ requestId: id }),
};

export const deleteFriendRequest = {
  body: Joi.object({ requestId: id }),
};

export const unfriendUser = {
  body: Joi.object({ userId: id }),
};
