const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const ObjectId = require('mongodb').ObjectId;

// controller to handle the Folowing another user
const followUser = ({ userAccountId, myAccountId }) => {
  return new Promise(async (resolve, reject) => {
    // checking if user already following
    try {
      const alreadyFollowing = await FollowSchema.findOne({
        userAccountId, myAccountId
      })
      if (alreadyFollowing) {
        reject("You are already following")
        return;
      }
      // creating new obj of follow 
      const obj = new FollowSchema({
        myAccountId,
        userAccountId,
        followedDate: Date.now()
      })
      // saving followobj in DB
      const followedObj = await obj.save();
      resolve(followedObj);
    } catch (error) {
      reject(error);
    }
  })
}

// controller to unfollow user
const unFollowUser = ({ userAccountId, myAccountId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // getting followSchema obj with following and follower userid's and deleting.
      const unfollowUser = await FollowSchema.findOneAndDelete({
        userAccountId, myAccountId
      })
      resolve(unfollowUser)
    } catch (error) {
      reject(error);
    }
  })
}

// controller to get folowing list
const getFollowingList = async (myAccountId ) => {
  return new Promise(async (resolve, reject) => {
    try {
      // getting all users whom the logged n user follows..
      const followingList = await FollowSchema.aggregate([
        {
          $match: {
            myAccountId: new ObjectId(myAccountId),
          },
        },
        {
          $sort: { followedDate: -1 },
        },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 5 }],
          },
        },
      ]);
      // gettign following user id's
      const followingAccountIds = [];
      followingList[0].data.forEach((userObj) => {
        followingAccountIds.push(userObj.userAccountId);
      })
      // getting user details from following userid's
      const followingUserDetails = await UserSchema.aggregate([
        {
          $match: {
            _id: { $in: followingAccountIds },
          },
        },
      ]);
      resolve(followingUserDetails)
    } catch (error) {
      reject(error);
    }
  })
}

// controller to get followers list
const getFollowerList = ({ myAccountId}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // getting all users whom the logged n user follows..
      const followersList = await FollowSchema.aggregate([
        {
          $match: {
            userAccountId: new ObjectId(myAccountId),
          },
        },
        {
          $sort: { followedDate: 1 },
        },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 10 }],
          },
        },
      ]);
      if (followersList[0].data.length === 0) {
        return resolve("No followers Yet.")
      }
      // gettign following user id's
      const followersAccountIds = [];
      followersList[0].data.forEach((userObj) => {
        followersAccountIds.push(userObj.userAccountId);
      })
      // getting user details from following userid's
      const followersUserDetails = await UserSchema.aggregate([
        {
          $match: {
            _id: { $in: followersAccountIds },
          },
        },
      ]);
      resolve(followersUserDetails)
    } catch (error) {
      reject(error);
    }
  })
}



module.exports = { followUser, getFollowingList, unFollowUser, getFollowerList };