import express from 'express';
import * as userController from './user.controller.js';
import auth from '../../middlewares/auth.js';
import hashPassword from '../../middlewares/hashPassword.js';
import validation from '../../middlewares/validation.js';
import * as schema from './user.validator.js';
import uploadImage from '../../middlewares/uploadImage.js';
import postRouter from '../post/post.router.js';
const userRouter = express.Router();

/***************************************************************
 * SignUp
 ***************************************************************/
userRouter.post('/signup', validation(schema.signUp), hashPassword, userController.signup);
/***************************************************************
 * Verify Email
 ***************************************************************/
userRouter.get('/verify/:token', userController.verifyEmail);
/***************************************************************
 * Login
 ***************************************************************/
userRouter.post('/login', validation(schema.login), userController.login);
/***************************************************************
 * Logout
 ***************************************************************/
userRouter.patch('/logout', auth, userController.logout);
/***************************************************************
 * Get User Friends
 ***************************************************************/
userRouter.get('/friends', auth, userController.getFriends);
/***************************************************************
 * Update User
 ***************************************************************/
userRouter.put('/update', auth, validation(schema.update), hashPassword, userController.update);
/***************************************************************
 * Update Password
 ***************************************************************/
userRouter.patch('/password/update', auth, validation(schema.passwordSchema), hashPassword, userController.changePassword);
/***************************************************************
 * Update user picture
 ***************************************************************/
userRouter.patch('/profile-pic', uploadImage({ fieldName: 'profile', pathName: 'profile-pics' }), userController.updateProfilePic);
/***************************************************************
 * Deactivate User
 ***************************************************************/
userRouter.put('/deactivate', auth, userController.deactivate);
/***************************************************************
 * Forgot Password: send email to user
 ***************************************************************/
userRouter.post('/password/forgot', validation(schema.emailSchema), userController.forgotPass);
/***************************************************************
 * Forgot Password: email token
 ***************************************************************/
userRouter.get('/password/:token', userController.getMailToken);
/***************************************************************
 * Requests: Send Friend Request
 ***************************************************************/
userRouter.post('/requests', auth, validation(schema.friendRequest), userController.sendFriendRequest);
/***************************************************************
 * Requests: View All Requests
 ***************************************************************/
userRouter.get('/requests', auth, userController.viewAllRequests);
/***************************************************************
 * Requests: Confirm Request
 ***************************************************************/
userRouter.patch('/requests/confirm/', auth, validation(schema.confirmFriendRequest), userController.confirmRequest);
/***************************************************************
 * Requests: delete Request
 ***************************************************************/
userRouter.delete('/requests/unfriend/', auth, validation(schema.unfriendUser), userController.deleteUser);
userRouter.delete('/requests/delete/', auth, validation(schema.deleteFriendRequest), userController.deleteRequest);
/***************************************************************
 * Get User Info
 ***************************************************************/
userRouter.get('/:id', validation(schema.viewProfile), userController.getData);
/***************************************************************
 * Get User Posts
 ***************************************************************/
userRouter.use('/:id/posts', postRouter);

export default userRouter;
