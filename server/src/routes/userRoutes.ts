import express from "express";
import { createValidator } from "express-joi-validation";
import {
  createOrLoginAdminSchema,
  userLoginSchema,
  userSignupSchema,
} from "../validation/userValidation";
import {
  createOrLoginAdmin,
  getAllUsers,
  login,
  signup,
} from "../controllers/userController";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware";
import { apiCallWrapper } from "../util/apiResponse";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/admin",
  validator.body(createOrLoginAdminSchema),
  apiCallWrapper(createOrLoginAdmin)
);
router.post(
  "/signup",
  validator.body(userSignupSchema),
  apiCallWrapper(signup)
);
router.post("/login", validator.body(userLoginSchema), apiCallWrapper(login));
router.get("/all_users", authMiddleware, apiCallWrapper(getAllUsers));

export default router;
