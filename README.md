# Node Social Network

## Project Requirements

- [x] `users` model (name, email, password, age, profilePic, lastLogout, isEmailValidated, isAccountActive)
  - [x] create user
  - [x] verify user
  - [x] login
  - [x] forget password
  - [x] logout
  - [x] update user settings
  - [x] view user profile
  - [x] view user => friends
  - [x] view user => posts
  - [x] deactivate User
  - [x] update profile image
- [x] `relashions` model (from: id, to: id, approved: bool)
  - [x] make friend request
  - [x] view all requests
  - [x] confirm friend request
  - [x] delete friend request or unfriend user
- [x] `posts` model (text, attachments, createdBy, visibility)
  - [x] create post
  - [x] update post privacy [public, friends, only me]
  - [x] view single post
  - [x] view all posts
  - [x] delete post (soft)
- [x] `comments` model (text, postId, userId)
  - [x] create comment
  - [x] view post => comments
  - [x] delete comment (soft)
- [x] `likes` model (postId, userId)
  - [x] like post
  - [x] view post => likes
  - [x] remove like
