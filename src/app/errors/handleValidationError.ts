import mongoose from 'mongoose';

const handleValidationError = (error: mongoose.Error.ValidationError) => {
  const errorDetails = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return `${val?.path}: ${val?.message}`;
    },
  );

  const errorMessage = errorDetails.join(' ');

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
  };
};

export default handleValidationError;
