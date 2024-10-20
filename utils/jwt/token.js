import User from '../../models/User.js';
import CustomError from '../../classes/CustomError.js';
import jwt from 'jsonwebtoken';
import { generateJwtPair } from './jwt.js';

const getAccessToken = async refresh_token => {
    const decode = jwt.verify(refresh_token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id);

    if (!user) {
        new CustomError('Refresh token is invalid', 401);
        return {};
    }

    const { accessToken, refreshToken } = await generateJwtPair(user);

    return { accessToken, refreshToken };
};

const isAccessTokenExpire = accessToken => {
    const decodedToken = jwt.decode(accessToken);
    if (!decodedToken) return true;

    const now = Date.now() / 1000;
    return decodedToken.exp ? decodedToken.exp < now : true;
};

const setTokenCookies = (res, accessToken, refreshToken, options) => {
    res.cookie('jwt-auth.access-token', accessToken, { secure: true, httpOnly: true, sameSite: 'strict', ...options });
    res.cookie('jwt-auth.refresh-token', refreshToken, { secure: true, httpOnly: true, sameSite: 'strict', ...options });
};

const clearTokenCookies = res => {
    res.clearCookie('jwt-auth.access-token', cookieConfig);
    res.clearCookie('jwt-auth.refresh-token', cookieConfig);
};

export { getAccessToken, isAccessTokenExpire, setTokenCookies, clearTokenCookies };
