const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ msg: "unAuthorized" });
    }
    const jwtToken = authHeader.split(" ")[1];
    console.log("jwt", jwtToken);
    // const originalUrl = req.originalUrl
    // const mainPath = originalUrl.split("/")[1]
    if (!jwtToken) {
      return res.status(400).json({ msg: "unAuthorized" });
    }
    jwt.verify(jwtToken, "qwerty", (err, user) => {
      if (err) {
        return res.status(400).json({ msg: "unAuthorized" });
      }

      // const {role} = user
      // if(role !== mainPath){
      //     return res.status(403).json({msg:"forbidden"})
      // }
      console.log("user", user);
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = authentication;
