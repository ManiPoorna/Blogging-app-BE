const ValidateBlogData = function({ title, description, userId }){
  return new Promise(async (resolve, reject) => {
    if (!title) reject("Title is Missing ")
    if (!description) reject("Description is Missing ")
    resolve();
  })
}

module.exports = ValidateBlogData