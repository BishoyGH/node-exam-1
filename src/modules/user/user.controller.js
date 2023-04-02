import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../../../database/models/user.model.js';
import catchAsyncError from '../../utils/catchAsyncErr.js';
import AppError from '../../utils/AppError.js';
import sendMail from './user.email.js';
import generateToken from '../../utils/generateToken.js';
import relashionModel from '../../../database/models/relashion.model.js';

/***************************************************************
 * SignUp
 ***************************************************************/
export const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, age } = req.body;
  // verify if email exists
  const userExist = await userModel.findOne({ email });
  if (userExist) return next(new AppError("can't use this email", 400));
  // create user document
  const user = await userModel.create({
    name,
    email,
    password: req.hashedPassword,
    age,
  });
  user.password = undefined;
  sendMail({ data: { email }, action: 'Confirm Email Address', actionURL: 'verify' });
  res.status(201).json({ message: 'success', user });
});
/***************************************************************
 * Verify Email
 ***************************************************************/
export const verifyEmail = (req, res, next) => {
  const { token } = req.params;
  jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    catchAsyncError(async (err, decoded) => {
      if (err) return next(new AppError('Invalid or Expired Token', 401));
      const { email } = decoded;
      await userModel.findOneAndUpdate({ email }, { isEmailValidated: true });
      res.status(200).json({ message: 'success' });
    })
  );
};
/***************************************************************
 * Login
 ***************************************************************/
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // check email and password
  const user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return next(new AppError('Incorrect email or password', 400));
  if (!user.isEmailValidated) return next(new AppError('email is not verified', 400));
  // Reactivate account if account is inactive
  if (!user.isAccountActive) {
    await userModel.findByIdAndUpdate(user._id, {
      isAccountActive: true,
    });
  }
  // generate token
  const token = generateToken({
    _id: user._id,
    name: user.name,
    isEmailValidated: user.isEmailValidated,
  });
  res.status(200).json({ message: 'success', token });
});
/***************************************************************
 * View User Profile
 ***************************************************************/
export const getData = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id).select(['name', 'profilePic']);
  if (!user) return next(new AppError("User doesn't exist", 404));
  res.status(200).json({ message: 'success', user });
});
/***************************************************************
 * View User Friends
 ***************************************************************/
export const getFriends = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const friendsQuery = await relashionModel
    .find({
      $or: [
        { fromId: userId, approved: true },
        { targetId: userId, approved: true },
      ],
    })
    .populate('targetId', ['name'])
    .populate('fromId', ['name']);
  const friends = friendsQuery
    .reduce((acc, current) => {
      if (current.fromId._id !== userId) return [...acc, current.targetId];
      return [...acc, current.fromId];
    }, [])
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  res.status(200).json({ message: 'success', user: { ...req.user._doc, friends } });
});
/***************************************************************
 * Update User
 ***************************************************************/
export const update = catchAsyncError(async (req, res, next) => {
  const { name, age } = req.body;
  // Update User Data
  const user = await userModel
    .findByIdAndUpdate(req.user._id, { name, password: req.hashedPassword, age }, { new: true, runValidators: true })
    .select({ password: 0, _id: 0, __v: 0 });
  res.status(200).json({ message: 'success', updatedUser: user });
});
/***************************************************************
 * Deactivate User
 ***************************************************************/
export const deactivate = catchAsyncError(async (req, res) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    isAccountActive: false,
  });
  res.status(200).json({ message: 'success' });
});
/***************************************************************
 * Forgot Password: Send Email
 ***************************************************************/
export const forgotPass = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !user.isAccountActive) return next(new AppError("user doesn't exist", 404));
  sendMail({
    data: { email, isEmailValidated: user.isEmailValidated },
    action: 'Reset Password',
    actionURL: 'password',
  });
  res.status(200).json({ message: 'success' });
});
/***************************************************************
 * Forgot Password: Email Token
 ***************************************************************/
export const getMailToken = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) return next(new AppError('Invalid or Expired Token', 401));
    res.json({ message: 'success', token });
  });
});
/***************************************************************
 * Update Password
 ***************************************************************/
export const changePassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { email: req.user.email, isAccountActive: true },
    { password: req.hashedPassword },
    {
      new: true,
    }
  );
  if (!user) return next(new AppError("This user doesn't exist", 404));
  user.password = undefined;
  res.status(200).json({ message: 'success', updatedUser: user });
});
/***************************************************************
 * Logout
 ***************************************************************/
export const logout = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, { lastLogout: Date.now() });
  if (!user) return next(new AppError("This user doesn't exist", 404));
  res.status(200).json({ message: 'success' });
});
/***************************************************************
 * Update user pciture
 ***************************************************************/
export const updateProfilePic = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next(new AppError('File did not uploaded', 400));
  res.status(200).json({ message: 'success', file: req.file });
});
/***************************************************************
 * Requests: Send Friend Request
 ***************************************************************/
export const sendFriendRequest = catchAsyncError(async (req, res, next) => {
  const { targetId } = req.body;
  const fromId = req.user._id;
  if (fromId == targetId) return next(new AppError("Can't send request to yourself", 400));
  if (!(await userModel.findById(targetId))) return next(new AppError('This User does not exist', 400));
  const duplicated = await relashionModel.findOne({
    $or: [{ $and: [{ targetId }, { fromId }] }, { $and: [{ fromId: targetId }, { targetId: fromId }] }],
  });
  if (duplicated) return next(new AppError('Duplicated or Invalid Request', 400));
  await relashionModel.create({ fromId, targetId });
  res.status(201).json({ message: 'success' });
});
/***************************************************************
 * Requests: View Friend Request
 ***************************************************************/
export const viewAllRequests = catchAsyncError(async (req, res, next) => {
  const requests = await relashionModel.find({ targetId: req.user._id, approved: false }).populate('fromId', ['name']).select(['fromId']);
  res.status(200).json({ message: 'success', requests });
});
/***************************************************************
 * Requests: Confirm Friend Request
 ***************************************************************/
export const confirmRequest = catchAsyncError(async (req, res, next) => {
  const { requestId } = req.body;
  await relashionModel.findByIdAndUpdate(requestId, { approved: true });
  res.status(200).json({ message: 'success' });
});
/***************************************************************
 * Requests: Delete Friend Request
 ***************************************************************/
export const deleteRequest = catchAsyncError(async (req, res, next) => {
  const { requestId } = req.body;
  const user = await relashionModel.findByIdAndDelete(requestId);
  if (!user) return next(new AppError('Invalid Request Id', 400));
  res.status(200).json({ message: 'success', deleted: user });
});
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { userId: targetId } = req.body;
  const { _id: currentUserId } = req.user;
  const user = await relashionModel.findOneAndDelete({
    $or: [{ $and: [{ fromId: currentUserId }, { targetId }] }, { $and: [{ fromId: targetId }, { targetId: currentUserId }] }],
  });
  if (!user) return next(new AppError('Invalid User Id', 400));
  res.status(200).json({ message: 'success' });
});
