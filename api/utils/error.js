export const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.status = statusCode;
    error.message = message;
    return error;
}