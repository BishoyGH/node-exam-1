import express from 'express';
import * as likeController from './like.controller.js';
import * as schema from './like.validator.js';
import auth from '../../middlewares/auth.js';
import validation from '../../middlewares/validation.js';
const likeRouter = express.Router();

/***************************************************************
 * Add Like
 ***************************************************************/
likeRouter.post('/', auth, validation(schema.add), likeController.addLike);
/***************************************************************
 * View all comments for single post
 ***************************************************************/
likeRouter.get('/:postId', auth, validation(schema.postLikes), likeController.getpostLikes);
/***************************************************************
 * Remove Like
 ***************************************************************/
likeRouter.patch('/', auth, validation(schema.remove), likeController.removeLike);

export default likeRouter;
