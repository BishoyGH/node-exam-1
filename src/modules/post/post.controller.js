import postModel from '../../../database/models/post.model.js';
import relashionModel from '../../../database/models/relashion.model.js';
import userModel from '../../../database/models/user.model.js';
import AppError from '../../utils/AppError.js';
import catchAsyncErr from '../../utils/catchAsyncErr.js';

/***************************************************************
 * Create Post
 ***************************************************************/
export const createPost = catchAsyncErr(async (req, res) => {
  const { text, visibility } = req.body;
  const createdBy = req.user._id;
  const post = await postModel.create({ text, visibility, createdBy });
  res.status(201).json({ message: 'success', post });
});
/***************************************************************
 * Update Post Privacy ('public', 'friends', 'only me', 'deleted')
 ***************************************************************/
export const updatePrivacy = catchAsyncErr(async (req, res, next) => {
  const { postId, visibility } = req.body;
  const post = await postModel.findOneAndUpdate({ _id: postId, createdBy: req.user._id }, { visibility });
  if (!post) return next(new AppError('Invalid request body data', 400));
  res.status(200).json({ message: 'success' });
});
/***************************************************************
 * View Single Post
 ***************************************************************/
export const viewPublicPost = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params;
  const post = await postModel.findById(id);
  req.postData = post;
  if (post.visibility === 'deleted') return next(new AppError('This post no longer exists', 404));
  if (post.visibility !== 'public') return next();
  res.json({ message: 'success', post });
});
export const viewPrivatePost = catchAsyncErr(async (req, res, next) => {
  const currentUserId = req.user._id.toString();
  const postCreatorId = req.postData.createdBy.toString();
  const isPostOwnerFriend = await relashionModel.findOne({
    $and: [
      {
        $or: [{ $and: [{ fromId: currentUserId }, { targetId: postCreatorId }] }, { $and: [{ fromId: postCreatorId }, { targetId: currentUserId }] }],
      },
      { approved: true },
    ],
  });
  if (currentUserId === postCreatorId || isPostOwnerFriend) return res.json({ message: 'success', post: req.postData });
  next(new AppError("You can't access this post", 400));
});
/***************************************************************
 * View All Available Posts
 ***************************************************************/
export const getAllPosts = catchAsyncErr(async (req, res, next) => {
  const userId = req.user._id;
  const friends = await relashionModel.find({
    $or: [
      { fromId: userId, approved: true },
      { targetId: userId, approved: true },
    ],
  });
  const friendsArray = friends.reduce((acc, current) => {
    if (current.targetId == userId) return [...acc, current.fromId];
    return [...acc, current.targetId];
  }, []);
  const posts = await postModel
    .find({
      $or: [
        { createdBy: userId, visibility: { $not: { $eq: 'deleted' } } },
        { visibility: 'public' },
        { visibility: 'friends', createdBy: { $in: friendsArray } },
      ],
    })
    .populate('createdBy', 'name -_id');
  res.status(200).json({ posts });
});
/***************************************************************
 * View All Users Posts
 ***************************************************************/
export const getUserPublicPosts = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id).select(['name', 'profilePic']);
  const posts = await postModel.find({ createdBy: id });
  req.posts = posts;
  if (req.headers['token']) return next();
  res.status(200).json({ message: 'success', user, posts: posts.filter((p) => p.visibility === 'public') });
});

export const getUserPrivatePosts = catchAsyncErr(async (req, res, next) => {
  const currentUserId = req.user._id.toString();
  const postCreatorId = req.posts[0].createdBy.toString();
  const { name, age, profilePic } = req.user;
  const isPostOwnerFriend = await relashionModel.findOne({
    $and: [
      {
        $or: [{ $and: [{ fromId: currentUserId }, { targetId: postCreatorId }] }, { $and: [{ fromId: postCreatorId }, { targetId: currentUserId }] }],
      },
      { approved: true },
    ],
  });
  if (currentUserId === postCreatorId || isPostOwnerFriend) return res.json({ message: 'success', user: { name, age, profilePic }, post: req.posts });
});
