import registerUser from "../controllers/user.controller.js";
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

export default router;
