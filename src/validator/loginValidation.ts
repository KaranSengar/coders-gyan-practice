import { checkSchema } from "express-validator";

const loginValidator = checkSchema({
  email: {
    trim: true,
    isEmail: {
      errorMessage: "Must be a valid email address",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },

  password: {
    trim: true,
    notEmpty: {
      errorMessage: "password is a required",
    },
    isLength: {
      options: { min: 5 },
      errorMessage: "Password should be at least 5 chars",
    },
  },
});

export default loginValidator;
