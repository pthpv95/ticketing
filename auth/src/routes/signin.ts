import express from "express"
const router = express.Router()

router.get("/api/users/signin", (req, res) => {
  res.send("Hello World from Kebernetes!")
})

export { router as signinRouter }
