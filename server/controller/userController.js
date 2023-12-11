import { userLoginService, userRegisterService, userLogoutService } from "../services/userService.js";

//User Register
const userRegister = async (req, res) => {
  try {

    const { status, message = null, data = null } = await userRegisterService(req.body)

    if (status != 200) {
      res.status(status).json({ error: message })
    } else {
      res.status(status).json({ data: data })
    }

  } catch (error) {
    res.status(500).json({ error: error })
  }
}

//User Login
const userLogin = async (req, res) => {
  try {

    const { status, message = null, data = null, refreshToken } = await userLoginService(req.body)

    if (status != 200) {
      res.status(status).json({ error: message })
    } else {

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(status).json({ data })
    }

  } catch (error) {
    res.status(500).json({ error: error })
  }
}

const userLogout = async (req, res) => {
  try {

    const { status, message } = await userLogoutService(req.cookies)

    if (status != 200) {
      res.status(status).json({ error: message })
    } else {
      res.status(status).json({ message: message }).clearCookie('refreshToken');
    }

  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export { userRegister, userLogin, userLogout } 