import likeModel from '../../../database/models/like.model.js';
import postModel from '../../../database/models/post.model.js';
import relashionModel from '../../../database/models/relashion.model.js';
import catchAsyncErr from '../../utils/catchAsyncErr.js';

/***************************************************************
 * Add Like
 ***************************************************************/
export const addLike = catchAsyncErr(async (req, res, next) => {
  const { postId } = req.body;
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
    return next(new AppError("You don't have permission to Like this post", 403));
  await likeModel.create({ postId, userId: currentUserId });
  res.status(200).json({ message: 'success' });
});
/***************************************************************
 * Remove Like
 ***************************************************************/
export const removeLike = catchAsyncErr(async (req, res, next) => {
  const { postId, likeId } = req.body;
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
    return next(new AppError("You don't have permission to remove likes from post", 403));
  await likeModel.findByIdAndDelete(likeId);
  res.status(200).json({ message: 'success' });
});

/***************************************************************
 * View all comments for single post
 ***************************************************************/

export const getpostLikes = catchAsyncErr(async (req, res, next) => {
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
    return next(new AppError("You don't have permission to view post Likes", 403));
  const likes = await likeModel.find({ postId }, 'userId -_id').populate('userId', 'name -_id');
  const peopleLikes = likes.reduce((acc, current) => [...acc, current.userId.name], []);
  res.status(200).json({ message: 'success', likes: peopleLikes, numOfLikes: likes.length });
});
