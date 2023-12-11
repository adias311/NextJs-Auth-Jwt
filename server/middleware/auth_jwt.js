import Jwt from "jsonwebtoken";

const authMidlleware = (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  Jwt.verify(token, process.env.ACCESS_JWT_TOKEN, (err, decoded) => {

    if (err) {
      return res.status(401).json({ message: "Forbidden" });
    }

    req.email = decoded.email;
    next();
  });

}


export default authMidlleware;