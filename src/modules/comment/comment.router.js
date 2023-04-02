import express from 'express';
import auth from '../../middlewares/auth.js';
import * as commentController from './comment.controller.js';
import * as schema from './comment.validator.js';
import validation from '../../middlewares/validation.js';
const commentRouter = express.Router();

/***************************************************************
 * Add Comment
 ***************************************************************/
commentRouter.post('/', auth, validation(schema.add), commentController.addComment);
/***************************************************************
 * View all comments for single post
 ***************************************************************/
commentRouter.get('/:postId', auth, validation(schema.postComments), commentController.getpostComments);
/***************************************************************
 * Delete Comment
 ***************************************************************/
commentRouter.patch('/', auth, validation(schema.deleteComment), commentController.deleteComment);

export default commentRouter;
