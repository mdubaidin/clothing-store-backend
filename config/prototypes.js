import express from 'express';

express.response.success = function (res) {
    if (typeof res === 'string')
        return this.json({
            success: true,
            message: res,
        });

    if (typeof res === 'number') return this.status(res).send(); // No Content

    return this.json({
        success: true,
        ...res,
    });
};

express.response.error = function (res) {
    if (typeof res === 'string' || Array.isArray(res))
        return this.json({
            errors: Array.isArray(res) ? res : [res],
            success: false,
        });

    return this.json({
        ...res,
        success: false,
    });
};

// Error.throw = function (msg, code = 400) {
//     const error = new Error(msg);
//     error.name = 'CustomError';
//     throw error;
// };
