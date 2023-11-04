const nodemailer = require("nodemailer");

const sendOTP = (email) => {
    // Generate a random OTP.
    const otp = Math.random().toString(36).substring(4);

    // Send the OTP to the user's email address.

    // Create a transporter object.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    // Create an email object.
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP for password change",
        text: `Your OTP is ${otp}.`,
    };

    // Send the email.
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`OTP sent to ${email}`);
        }
    });

    return otp;
};

module.exports = sendOTP;
