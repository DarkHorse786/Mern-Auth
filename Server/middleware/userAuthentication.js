import jwt from "jsonwebtoken";
const userAuthentication = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) res.send({ status: false, message: "Not Authorized! Login First" });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!req.body) {
      req.body = {}; 
    }
    if (decodedToken.id) req.body.userId = decodedToken.id;
    else res.send({ status: false, message: "Not Authorized! Login First" });
    next();
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};

export default userAuthentication;
