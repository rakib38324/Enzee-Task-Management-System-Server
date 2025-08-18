import { ZodError, ZodIssue } from 'zod';

const handleZodError = (error: ZodError) => {
  const errorDetails = error.issues.map((issue: ZodIssue) => {
    return `${issue?.message}`;
  });

  const errorMessage = errorDetails.join(' ');
  return {
    message: 'Validation Error',
    errorMessage,
  };
};

export default handleZodError;
