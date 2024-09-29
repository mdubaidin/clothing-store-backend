import User from '../../models/User.js';
import { generateRandomBytes, generateTemplate } from '../../utils/functions.js';
import OTP from '../../models/OTP.js';
import CustomError from '../../classes/CustomError.js';
import fs from 'fs';
import transporter from '../../libs/nodemailer.js';

const createAccount = async function (req, res, next) {
    try {
        const { name, username, email, password, otp } = req.body;

        if (!otp) throw new CustomError('OTP must be provided');

        const isVerified = await OTP.countDocuments({ email, otp });

        if (!isVerified) throw new CustomError('Your entered code is Invalid', 200);

        const newUser = new User({
            name,
            username,
            email,
            password,
        });

        await newUser.save();

        await OTP.deleteOne({ email, type: 'email-confirmation' });

        const user = newUser.removeSensitiveInfo();

        res.success({
            message: 'user created',
            user,
        });
    } catch (e) {
        next(e);
    }
};

const initiateEmail = async function (req, res, next) {
    try {
        const { email } = req.body;
        const otp = generateRandomBytes(6);

        const isEmailExists = await User.countDocuments({ email });

        if (isEmailExists) throw new CustomError('Email address already taken by someone');

        await OTP.deleteMany({ email, type: 'email-confirmation' });

        await OTP.create({ email, otp, type: 'email-confirmation' });

        const html = fs.readFileSync('templates/email/emailConfirmation.html', {
            encoding: 'utf-8',
        });

        const template = generateTemplate(html, { email, code: otp });
        const platform = process.env.PLATFORM;

        transporter.sendMail({
            from: `${platform} <${process.env.GMAIL_USER}>`,
            to: email, // list of receivers
            subject: `${platform}: Email verification`,
            html: template, // html body
        });

        res.success({});
    } catch (e) {
        next(e);
    }
};

export { createAccount, initiateEmail };
