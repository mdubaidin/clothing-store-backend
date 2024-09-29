import { Error as MongooseError } from 'mongoose';
import CustomError from '../classes/CustomError.js';

export default function (err, req, res, next) {
    console.log('Handling Error...');
    console.log(err);

    // if (err.name === 'Error') return res.error(err.message);

    // Any Error thrown by CustomError
    if (err instanceof CustomError) {
        return res.status(err.statusCode).error({ errors: [err.message] });
    }

    // Any Mongoose Error
    if (err instanceof MongooseError) {
        console.log('Mongoose Error');
        return handleMongooseError(err, req, res);
    }

    // Mongoose Server Error
    if (err.name === 'MongoServerError') {
        console.log('MongoServerError');
        const error = serverErrors[err.code];
        error.message += Object.keys(err.keyValue).pop();
        return res.status(error.code).error({
            errors: [error.message],
        });
    }

    // if (err.type === 'StripeInvalidRequestError') {
    //     console.log('StripeInvalidRequestError');
    //     return res.status(err.statusCode).error({
    //         message: err.message,
    //     });
    // }

    // If no error is matched then say 500
    return error500(res);
}

function error500(res) {
    return res.status(500).error('Something went wrong');
}

const serverErrors = {
    11000: { code: 409, message: 'Duplicate entry for ' },
};

function handleMongooseError(err, req, res) {
    const { ValidationError, CastError } = MongooseError;

    const errors = [];
    if (err instanceof ValidationError) {
        const errorKeys = Object.keys(err.errors);

        errorKeys.forEach(error => {
            const { message } = err.errors[error];
            errors.push(message.replace('Path', 'Field'));
        });
    }

    if (err instanceof CastError) {
        const { kind, path } = err;
        errors.push(`Field \`${path}\` should be of type \`${kind}\``);
    }

    console.log(errors);
    return res.status(400).error({ errors });
}
