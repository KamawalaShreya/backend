
module.exports.baseUrl = (path = null) => {
  let url = `${process.env.BASE_URL}:${process.env.PORT}`;
 
  return url;
};
