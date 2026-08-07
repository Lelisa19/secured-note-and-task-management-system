import { ZodError } from 'zod';

export const getSingleQueryParam = (param: any): string | undefined => {
  if (Array.isArray(param)) {
    return param[0];
  }
  if (typeof param === 'string') {
    return param;
  }
  return undefined;
};

export const formatErrorMessage = (error: any): string => {
  if (error instanceof ZodError) {
    const issues = error.issues;
    if (issues.length > 0) {
      return issues[0].message;
    }
    return 'Validation failed';
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

export const logRequestError = (endpoint: string, error: any, body?: any) => {
  console.error(`[ERROR] ${endpoint}:`);
  if (body) {
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) sanitizedBody.password = '***REDACTED***';
    console.error('  Request body:', JSON.stringify(sanitizedBody, null, 2));
  }
  if (error instanceof ZodError) {
    console.error('  Validation issues:', JSON.stringify(error.issues, null, 2));
  } else {
    console.error('  Error message:', error?.message || error);
    console.error('  Stack:', error?.stack);
  }
};
