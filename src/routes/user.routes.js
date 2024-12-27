

import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js";
import VerifyJwt from "../middlewares/auth.middlewares.js";
import {upload} from "../middlewares/multer.middlewares.js";

import {Router} from "express";

const router = Router();

router.route("/register").post(
    upload.fields([{
      name:"avatar",
      maxCount:1
    },
    {
       name:"coverimage",
       maxCount:1
    }])
    ,registerUser);

router.route("/login").post(loginUser)
router.route("/logout").post(VerifyJwt,logoutUser)  
router.route("/refresh_access").post(refreshAccessToken)  

export default router;
