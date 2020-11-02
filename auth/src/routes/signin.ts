import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { body } from "express-validator"
import { BadRequestError } from "@hptickets/common"
import { validateRequest } from "@hptickets/common"
import { User } from "../models/user"
import { Password } from "../services/password"

const router = express.Router()

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError("Invalid credential")
    }

    const matchPasword = await Password.compare(existingUser.password, password)
    if (!matchPasword) {
      throw new BadRequestError("Invalid credential")
    }

    const jwtUser = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    )

    req.session = {
      jwt: jwtUser,
    }

    res.status(201).send(existingUser)
  }
)

export { router as signinRouter }
