const express = require('express');
const BlogRouter = express.Router();

const ValidateBlogData = require('../Utils/Blog');
const BlogClass = require('../Models/BlogModel')
const UserClass = require('../Models/UserModel');
const BlogSchema = require('../Schemas/BlogSchema');
const UserSchema = require('../Schemas/UserSchema');

//Api to creat Blog 
BlogRouter.post('/create-blog', async (req, res) => {
  //gettign title and desc from user
  const { title, description } = req.body;
  // getting session id of logged in user ot check user loggegin or not
  const userId = req.session.user.userId;
  const creationDate = new Date();
  let username;
  try {
    // validating given title and description
    await ValidateBlogData({ title, description })
    // validating user 
    username = await UserClass.verifyUserId({ userId });
  } catch (error) {
    res.send({
      status: 400,
      message: "Database Error",
      error : error
    })
  }
  // creating a object of BlogClass 
  const blogObj = new BlogClass({ title, description, creationDate, userId, username })
  try {
    // creates a new blog in DB using createblog method from BlogClass
    const userDb = await blogObj.createBlog();
    return res.send({
      status: 201,
      message: 'Blog created successfully',
      data : userDb
    })
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database error",
      error: error
    })
  }
})

//Api to Get All blogs
BlogRouter.get("/all-blogs", async(req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  try {
    const fetchedBlogs = await BlogClass.getAllBlogs({ SKIP });
    if (fetchedBlogs.length === 0) {
      return res.send({
        status: 200,
        message : "No blogs found"
      })
    }
    return res.send({
      status: 200,
      message: "Data Fetched successfully",
      data: fetchedBlogs,
    })
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database Error",
      error : error,
   }) 
  }
})

//Api to User blogs
BlogRouter.get("/my-blogs", async(req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  const userId = req.session.user.userId;
  try {
    // getting all blogs of logged in user by user id
    const userBlogs = await BlogClass.getMyBlogs({ SKIP,userId })
    return res.send({
      status: 200,
      message: "Data fetched successfully",
      data : userBlogs
    })
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database error",
      error
    })
  }
})

//Api to Edit Blog 
BlogRouter.post("/edit-blog", async (req, res) => {
  // getting title,desc, blogid from body
  const { title, description, blogId } = req.body;
  // getting loggedin user id
  const userId = req.session.user.userId;

  try {
    // fetching blog with id provided
    const blogDb = await BlogSchema.findOne({ _id: blogId });
    // sending error if logged in user and owner of blog not same 
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 401,
        message : "Cannot edit the blog, Please login again."
      })
    }
    // if all went fine ipdaitng blog with given title and description
    const updatedPreviousBlog = await BlogClass.editBlog({ title, description, blogId });
    return res.send({
      status: 200,
      message: "Blog Updated",
      previousBlog : updatedPreviousBlog,
    })
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database error",
      error
    })
  }
})

//Api to delete Blog
BlogRouter.post("/delete-blog", async (req, res) => {
  //getting blogid from client through body
  const { blogId } = req.body;
  try {
    // getting blog obj from db
    const blogDb = await BlogSchema.findOne({ _id: blogId });
    // if no blog found .. sending error
    if (!blogDb) {
      return res.send({
        status: 404,
        message: "Blog not found"
      })      
    }
    //logged in user and blog obj user are not same send error.
    if (!req.session.user.userId.equals(blogDb.userId)) {
      return res.send({
        status: 401,
        message: "Not allowed to Delete, Please login with your account",
      })
    }
    // function from blogModel(Class) to delete blog
    const deletedBlog = await BlogClass.deleteBlog({ blogId });
    return res.send({
      status: 200,
      message: "Blog deleted",
      data : deletedBlog,
    })
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database error",
      error
    })
  }
})

module.exports = BlogRouter;
