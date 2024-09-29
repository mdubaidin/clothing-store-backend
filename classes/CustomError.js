class CustomError extends Error {
    statusCode = undefined;

    constructor(message, statusCode) {
        super(message);
        this.name = 'CustomError';
        this.message = message;
        this.statusCode = statusCode || 400;
    }
}

export default CustomError;
