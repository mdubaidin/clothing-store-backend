import { model, Schema } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt';
import { emailValidator } from '../utils/validators.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const PRIVATE_KEY = fs.readFileSync('./certs/private.pem', 'utf8');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: emailValidator,
                message: props => `${props.value} is not a valid email address!`,
            },
        },
        name: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 40,
            required: true,
        },
        password: {
            type: String,
            minlength: 8,
            required: true,
        },
        picture: String,
        refreshToken: String,
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

function hashPassword(next) {
    if (this.isModified('password')) {
        this.password = this.hash(this.password);
    }
    next();
}

userSchema.pre(['save'], hashPassword);

userSchema.methods = {
    isAuthorized: async function (password) {
        return compareSync(password, this.password);
    },

    hash: async function (password) {
        return hashSync(password, 10);
    },
    isUnauthorized: async function (password) {
        const authorized = await this.isAuthorized(password);
        return Boolean(!authorized);
    },

    removeSensitiveInfo: function () {
        var obj = this.toObject();
        delete obj.password;
        delete obj.otp;
        return obj;
    },

    signAccessToken: function () {
        return jwt.sign({ id: this._id }, PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: process.env.EXPIRE_JWT_ACCESS_TOKEN,
        });
    },

    signRefreshToken: function () {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error('JWT_SECRET is undefined');

        return jwt.sign({ id: this._id }, JWT_SECRET, {
            expiresIn: process.env.EXPIRE_JWT_REFRESH_TOKEN,
        });
    },
};

export default model('User', userSchema);
