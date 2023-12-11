import { prisma } from "../config/db/prismaClient.js";
import bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";


//User Register Service
const userRegisterService = async ({ name, email, password, passwordConfirm }) => {

  if (!name || !email || !password) {
    return { message: 'name or email or password missing', status: 400 };
  }

  if (password !== passwordConfirm) {
    return { message: 'Passwords do not match', status: 400 };
  }

  const emailResgiter = await prisma.users.findUnique({
    where: {
      email: email
    }
  });

  if (emailResgiter) {
    return { message: 'email already taken', status: 409 };
  }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });


    return { data: user, status: 200 };

  } catch (error) {
    console.error('Error during registration:', error);
    return { message: 'Internal server error', status: 500 };
  }
};


//User Login Service
const userLoginService = async ({ email, password }) => {

  if (!email || !password) {
    return { status: 400, message: 'email or password missing' };
  }

  const user = await prisma.users.findFirst({
    where: {
      email: email
    }
  });

  if (!user) {
    return { status: 400, message: 'email not registered' };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return { status: 400, message: 'wrong password' };
  }

  const accessToken = Jwt.sign({ userId: user.id, name: user.name, email }, process.env.ACCESS_JWT_TOKEN, { expiresIn: '1d' });
  const refreshToken = Jwt.sign({ userId: user.id, name: user.name, email }, process.env.REFRESH_JWT_TOKEN, { expiresIn: '1d' });

  try {

    await prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        refresh_token: refreshToken
      }
    });

    return { status: 200, data: { accessToken }, refreshToken };

  } catch (error) {
    console.error('Error during login:', error);
    return { status: 500, message: 'Internal server error' };
  }

}

//User Logout Service
const userLogoutService = async ({ refreshToken }) => {

  if (!refreshToken) {
    return { status: 400, message: 'Bad Request' };
  }

  Jwt.verify(refreshToken, process.env.REFRESH_JWT_TOKEN, (err, decode) => {
    if (err) {
      return { status: 400, message: 'Bad Request' };
    }
  });

  const user = await prisma.users.findFirst({
    where: {
      refresh_token: refreshToken
    }
  });

  console.log(user)
  if (!user) {
    return { status: 400, message: 'Bad Request' };
  }

  await prisma.users.update({
    where: {
      id: user.id
    },
    data: {
      refresh_token: null
    }
  });

  return { status: 200, message: 'Logout success' };

}

export { userRegisterService, userLoginService, userLogoutService };
