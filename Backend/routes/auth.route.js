const AuthCont = require("../controllers/auth.controller.js")
const express = require("express")
const router = express.Router()

router.post("/register",AuthCont.register)
router.post("/login",AuthCont.login)
router.post("/logout",AuthCont.logout)
router.post("/verfiy",AuthCont.verfiyUser)
router.post("/update-profile", AuthCont.updateProfile)
router.get("/profile/:email", AuthCont.getProfile)

module.exports = router

