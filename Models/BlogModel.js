const BlogSchema = require("../Schemas/BlogSchema");
const UserSchema = require("../Schemas/UserSchema");
const ObjectId = require("mongodb").ObjectId;

const BlogClass = class {
  title;
  description;
  creationDate;
  userId;
  username;

  constructor({ title, description, creationDate, userId, username }) {
    this.title = title;
    this.description = description;
    this.creationDate = creationDate;
    this.userId = userId;
    this.username = username;
  }

  // function to create blog
  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.description.trim();
      // creating blog with BlogSchema
      const userObj = new BlogSchema({
        title: this.title,
        description: this.description,
        creationDate: this.creationDate,
        userId: this.userId,
        username: this.username
      })
      try {
        // saving blog into db
        const userDb = await userObj.save();
        resolve(userObj)
      } catch (error) {
        reject(error)
      }
    })
  }

  // function to get all blogs form DB
  static getAllBlogs({ SKIP }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogs = await BlogSchema.aggregate([
          {
            $sort: { creationDate: -1 }
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: 100 }]
            },
          },
        ])
        resolve(blogs[0].data);
      } catch (error) {
        reject(error);
      }
    })
  }

  // function to get user Blogs
  static getMyBlogs({ SKIP, userId }) {
    return new Promise(async (resolve, reject) => {
      // resolve("Working")
      try {
        const myBlogs = await BlogSchema.aggregate([
          {
            $match: { userId: new ObjectId(userId) }
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: 100 }]
            }
          }
        ])
        // console.log("FromClass==> ", myBlogs[0].data)
        resolve(myBlogs[0].data)
      } catch (error) {
        // console.log(error);
        reject(error)
      }
    })
  }

  //funciton to edit Blog
  static editBlog({ title, description, blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const toBeUpdatedObject = { title, description };
        const blogDb = await BlogSchema.findOneAndUpdate({ _id: blogId }, toBeUpdatedObject);
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    })
  }

  //function to delete blog
  static deleteBlog({ blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogDb = await BlogSchema.findOneAndDelete({ _id: blogId });
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    })
  }
}

module.exports = BlogClass;