const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");
const sendOTP = require("../config/sendOtp");

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }],
          }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }
});

const authUser = asyncHandler(async (req, res) => {
    // console.log(req);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error("Invalid input");
        return;
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
        return;
    }
    const otp = sendOTP(email);

    if (otp) {
        user.otp = otp;
        await user.save();
        res.status(201).json({ otp: otp });
    } else {
        res.status(500);
        throw new Error("Error sending OTP");
    }
});

const changePassword = asyncHandler(async (req, res) => {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
        res.status(400);
        throw new Error("Invalid input");
        return;
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
        return;
    }
    const storedOTP = user?.otp;
    if (storedOTP !== otp) {
        res.status(401);
        throw new Error("Invalid OTP");
        return;
    }
    user.password = password;
    await user.save();
    res.status(200).send("Password changed successfully.");
});

module.exports = { allUsers, registerUser, authUser, changePassword, sendOtp };
