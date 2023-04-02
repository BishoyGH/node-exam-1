import Joi from 'joi';

const id = Joi.string().required().length(24).hex();
const text = Joi.string().required().min(1);
const visibility = Joi.string().valid('public', 'friends', 'only me', 'deleted');

export const createPost = {
  body: Joi.object({ text, visibility }),
};
export const updatePrivacy = {
  body: Joi.object({ postId: id, visibility }),
};
export const viewPost = {
  params: Joi.object({ id }),
};
export const viewUserPosts = {
  params: Joi.object({ id }),
};
