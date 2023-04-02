import Joi from 'joi';
const id = Joi.string().required().length(24).hex();

export const add = {
  body: Joi.object({ postId: id }),
};
export const remove = {
  body: Joi.object({ postId: id, likeId: id }),
};
export const postLikes = {
  params: Joi.object({ postId: id }),
};
