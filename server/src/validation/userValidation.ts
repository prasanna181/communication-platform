import Joi from "joi";

export const createOrLoginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Password should be a type of string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should be of atleast 6 characters",
    "string.max": "Password should have a maximum of 20 characters",
    "any.required": "Password is required",
  }),
});

export const userSignupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().optional().allow(null),
  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .allow(null),
  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Password should be a type of string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should be of atleast 6 characters",
    "string.max": "Password should have a maximum of 20 characters",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().min(6).max(20).required().messages({
    "string.base": "Confirm Password should be a type of string",
    "string.empty": "Confirm Password cannot be empty",
    "string.min": "Confirm Password should be of atleast 6 characters",
    "string.max": "Confirm Password should have a maximum of 20 characters",
    "any.required": "Confirm Password is required",
  }),
}).or("email", "mobile");

export const userLoginSchema = Joi.object({
  email: Joi.string().email().optional().allow(null),
  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .allow(null),
  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Password should be a type of string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should be of atleast 6 characters",
    "string.max": "Password should have a maximum of 20 characters",
    "any.required": "Password is required",
  }),
}).or("email", "mobile");
