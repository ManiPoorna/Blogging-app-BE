const express = require('express');
const FollowRouter = express.Router();
const UserClass = require('../Models/UserModel');
const { followUser, getFollowingList, unFollowUser, getFollowerList } = require('../Models/FollowModel');

// api to follow user
FollowRouter.post("/follow-user",async (req, res) => {
  // userid of logged in user
  const myAccountId = req.session.user.userId;
  // userid of user whom the logged in user wants to follow.
  const { userAccountId } = req.body
  if (!userAccountId) {
    return res.send({
      status: 401,
      message : "userAccountId Missing"
    })
  }
  
  try {
    // checking if provided userId valid or not
    const checkFollower = await UserClass.verifyUserId({ userId: myAccountId })
    const checkFollowing = await UserClass.verifyUserId({ userId: userAccountId})
    // creating follow entry in db with ref of user.
    try {
      const follow = await followUser({ myAccountId, userAccountId })
      return res.send({
        status: 201,
        message: "Following",
        data : follow,
      })
    } catch (error) {
      return res.send({
        status: 500,
        message: error,
        error
      })
    }
  } catch (error) {
    return res.send({
      status: 500,
      meassage: "Database error",
      error
    })
  }
})

//api to unfollow user
FollowRouter.post("/unfollow-user", async(req, res) => {
  const myAccountId = req.session.user.userId;
  const { userAccountId } = req.body;
  if (!myAccountId || !userAccountId) {
    return res.send({
      status: 400,
      message : "Invalid UserId's"
    })
  }
  try {
    const unfollowed = await unFollowUser({ myAccountId, userAccountId });
    return res.send({
      status: 200,
      message: "Unfollowed Successfully",
      data : unfollowed
    })
  } catch (error) {
    return res.send({
      status: 500,
      message : error
    })
  }
})

// api to get users following
FollowRouter.get("/following-list",async (req, res) => {
  // getting loggedin userid from session
  const myAccountId = req.session.user.userId;

  try {
    // checks whether userid valid or not
    await UserClass.verifyUserId({ userId: myAccountId });
    // if valid userid following list will be fetched
    const followingList = await getFollowingList(myAccountId);

    return res.send({
      status: 200,
      message : "Following Fetched successfully",
      data : followingList
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error
    })
  }
})

// api to get followers list
FollowRouter.get("/followers-list", async(req, res) => {
  const userId = req.session.user.userId;
  try {
    const followersList = await getFollowerList({ myAccountId: userId })
    return res.send({
      status: 200,
      message: "Fetch success",
      data : followersList
    })
  } catch (error) {
    return res.send({
      status: 500,
      message : error
    })
  }
})

module.exports = FollowRouter;