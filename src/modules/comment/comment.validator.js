import Joi from 'joi';
const id = Joi.string().required().length(24).hex();
const text = Joi.string().required().min(1);

export const add = {
  body: Joi.object({ text, postId: id }),
};
export const deleteComment = {
  body: Joi.object({ commentId: id }),
};
export const postComments = {
  params: Joi.object({ postId: id }),
};
