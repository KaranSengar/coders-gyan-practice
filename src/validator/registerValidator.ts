import { checkSchema } from "express-validator";

const registerValidator = checkSchema({
    email: {
        trim: true,
        isEmail: {
            errorMessage: "Must be a valid email address",
        },
        notEmpty: {
            errorMessage: "Email is required",
        },
    },
    firstName: {
        trim: true,
        notEmpty: {
            errorMessage: "FirstName is required"
        }
    },
    lastName: {
        trim: true,
        notEmpty: {
            errorMessage: "Lastname is required"
        }
    },
    password: {
        trim: true,
        notEmpty: {
            errorMessage: "password is a required"
        },
        isLength: {
            options: { min: 5 },
            errorMessage: 'Password should be at least 5 chars'
        }
    }

});

export default registerValidator;
