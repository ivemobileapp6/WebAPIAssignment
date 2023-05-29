// const JWT = require("jsonwebtoken")

// module.exports = function (req, res, next){
//   const token = req.header("auth-token");  
//   if(!token) return res.status(401).send("Access-Denied");

//   try{
//     const verified = JWT.verify(token, process.env.TOKEN_SECRET);
//     // req.user = verified;
//     next();
//   }catch (err){
//     res.status(400).send("invalid user");
//   }
// }

const JWT = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");  
  if (!token) {
    return res.status(401).send("Access-Denied");
  }

  try {
    const verified = JWT.verify(token, process.env.TOKEN_SECRET, { clockTimestamp: Math.floor(Date.now() / 1000) });
    // Verify the token's signature and expiration time.
    // If the token is expired, the "jwt.verify()" method will throw an error.
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token expired");
    } else {
      return res.status(400).send("Invalid token");
    }
  }
}

