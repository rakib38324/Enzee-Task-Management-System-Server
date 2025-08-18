import mongoose from 'mongoose';

const handleCastError = (error: mongoose.Error.CastError) => {
  const id_Array = error?.message?.match(/"([^"]+)"/);
  const id_numbers = id_Array ? id_Array[1] : '';
  const errorMessage = `${id_numbers} is not a valid ID!`;

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID.',
    errorMessage,
  };
};

export default handleCastError;
