import User from '../../models/User.js';
import CustomError from '../../classes/CustomError.js';

const createPassword = async function (req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email) throw new CustomError('Email must be provided');

        const user = await User.findOne({ email });

        if (!user) throw new CustomError('User not found');

        user.password = password;

        await user.save();

        res.success(`Your password has been successfully reset.`);
    } catch (e) {
        next(e);
    }
};

export default createPassword;
