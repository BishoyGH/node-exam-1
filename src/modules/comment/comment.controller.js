import commentModel from '../../../database/models/comment.model.js';
import postModel from '../../../database/models/post.model.js';
import relashionModel from '../../../database/models/relashion.model.js';
import AppError from '../../utils/AppError.js';
import catchAsyncErr from '../../utils/catchAsyncErr.js';

/***************************************************************
 * Add Comment
 ***************************************************************/
export const addComment = catchAsyncErr(async (req, res, next) => {
  const { text, postId } = req.body;
  const post = await postModel.findById(postId);
  const currentUserId = req.user._id.toString();
  const postCreatorId = post.createdBy.toString();
  const isPostOwnerFriend = await relashionModel.findOne({
    $and: [
      {
        $or: [{ $and: [{ fromId: currentUserId }, { targetId: postCreatorId }] }, { $and: [{ fromId: postCreatorId }, { targetId: currentUserId }] }],
      },
      { approved: true },
    ],
  });
  if (!post || post.visibility === 'deleted') return next(new AppError('Post is not found', 400));
  if (currentUserId !== postCreatorId && !isPostOwnerFriend && post.visibility !== 'public')
    return next(new AppError("You don't have permission to comment on this post", 403));
  const comment = await commentModel.create({ text, postId, userId: req.user._id });
  res.json({ message: 'success', comment });
});
/***************************************************************
 * Delete Comment
 ***************************************************************/
export const deleteComment = catchAsyncErr(async (req, res, next) => {
  const { _id } = req.user;
  const { commentId } = req.body;
  const comment = await commentModel.findById(commentId);
  if (comment.userId.toString() !== _id.toString()) return next(new AppError("you can't delete this comment", 403));
  const post = await postModel.findById(comment.postId);
  if (!post || post.visibility === 'deleted') return next(new AppError("Couldn't find post", 404));
  await commentModel.findByIdAndUpdate(commentId, { isDeleted: true });
  res.status(200).json({ message: 'success' });
});
/***************************************************************
 * View all comments for single post
 ***************************************************************/
export const getpostComments = catchAsyncErr(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postModel.findById(postId);
  const currentUserId = req.user._id.toString();
  const postCreatorId = post.createdBy.toString();
  const isPostOwnerFriend = await relashionModel.findOne({
    $and: [
      {
        $or: [{ $and: [{ fromId: currentUserId }, { targetId: postCreatorId }] }, { $and: [{ fromId: postCreatorId }, { targetId: currentUserId }] }],
      },
      { approved: true },
    ],
  });
  if (!post || post.visibility === 'deleted') return next(new AppError('Post is not found', 400));
  if (currentUserId !== postCreatorId && !isPostOwnerFriend && post.visibility !== 'public')
    return next(new AppError("You don't have permission to view post comments", 403));
  const comments = await commentModel.find({ postId, isDeleted: { $not: { $eq: true } } });
  res.status(200).json({ message: 'success', comments });
});
