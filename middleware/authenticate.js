import Jwt from 'jsonwebtoken';
import CustomError from '../classes/CustomError.js';
import fs from 'fs';
import { Types } from 'mongoose';

const PUBLIC_KEY = fs.readFileSync('./certs/public.pem', 'utf8');

// Pure function for verifying token and extracting user
const verifyToken = (token, publicKey) => {
    if (typeof token !== 'string') throw new CustomError('Provided Auth token is invalid');
    if (!token) throw new CustomError('JWT must be provided', 401);
    return Jwt.verify(token, publicKey);
};

export default function (req, res, next) {
    try {
        const token = req.headers.accessToken;

        const user = verifyToken(token, PUBLIC_KEY);
        // console.log('user: ', user);

        // Immutably add ObjectId to the user object
        req.user = { ...user, _id: new Types.ObjectId(user.id) };

        next();
    } catch (err) {
        console.log(err);
        res.status(401).error(err.message || 'Unauthorized access');
    }
}
