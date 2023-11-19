const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
    {
        name: {
            type: "String",
            required: [true, "Name cannot be empty"],
            trim: true,
            minLength: [3, "Name must be at least 3 characters got {VALUE}"],
        },
        email: {
            type: "String",
            unique: [true, "Email already exists"],
            required: [true, "Email cannot be empty"],
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email",
            },
        },
        password: {
            type: "String",
            required: true,
            validate: {
                validator: (value) => {
                    return validator.isStrongPassword(value, {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    });
                },
                message:
                    "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
            },
        },
        pic: {
            type: "String",
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        },
    },
    { timestaps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
