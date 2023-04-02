import express from 'express';
import * as postController from './post.controller.js';
import auth from '../../middlewares/auth.js';
import validation from '../../middlewares/validation.js';
import * as schema from './post.validation.js';
const postRouter = express.Router({ mergeParams: true });

/***************************************************************
 * Create Post
 ***************************************************************/
postRouter.post('/', auth, validation(schema.createPost), postController.createPost);
/***************************************************************
 * get User Posts
 ***************************************************************/
postRouter.get('/', validation(schema.viewUserPosts), postController.getUserPublicPosts, auth, postController.getUserPrivatePosts);
/***************************************************************
 * Update Post Visibility ('public', 'friends', 'only me', 'deleted')
 ***************************************************************/
postRouter.patch('/privacy', auth, validation(schema.updatePrivacy), postController.updatePrivacy);
/***************************************************************
 * View All available Posts
 ***************************************************************/
postRouter.get('/home', auth, postController.getAllPosts);
/***************************************************************
 * View Single Post
 ***************************************************************/
postRouter.get('/:id', validation(schema.viewPost), postController.viewPublicPost, auth, postController.viewPrivatePost);

export default postRouter;
