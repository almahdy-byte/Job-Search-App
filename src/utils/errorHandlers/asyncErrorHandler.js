import { StatusCodes } from "http-status-codes";

export const asyncErrorHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next({
        message: error?.message || "Something went wrong",
        statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        stack: error.stack
      });
    }
  };
};
