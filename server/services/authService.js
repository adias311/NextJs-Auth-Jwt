import jwt from "jsonwebtoken";
import { prisma } from "../config/db/prismaClient.js";

const refreshAccessToken = async (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "ga da cookie" });
  }

  const user = await prisma.users.findFirst({
    where: {
      refresh_token: refreshToken
    }
  })

  if (!user) {
    return res.status(401).json({ message: "refresh token salah" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_JWT_TOKEN, (err) => {
    if (err) {
      return res.status(401).json({ message: "Forbidden" });
    }

    const accessToken = jwt.sign({ userId: user.id, name: user.name, email: user.email }, process.env.ACCESS_JWT_TOKEN, { expiresIn: '20s' });

    return res.status(200).json({ accessToken });
  })
}


export { refreshAccessToken };