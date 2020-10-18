import express from "express"
const router = express.Router()

router.get("/api/users/signout", (req, res) => {
  res.send("Hello World from Kebernetes!")
})

export { router as signoutRouter }
