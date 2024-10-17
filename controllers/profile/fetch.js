import User from '../../models/User.js';

const fetch = async function (req, res, next) {
    const userId = req.user._id;

    console.log('fetching profile');

    try {
        const profile = await User.findById(userId).select('-password -refreshToken -otp');
        console.log({ profile });
        return res.success({ profile });
    } catch (err) {
        next(err);
    }
};

export default fetch;
