export const errorHandler = (errs) => {
   const error = new Error();
   error.statusCode = errs.statusCode;
   error.message = errs.message;
   return error;
};
