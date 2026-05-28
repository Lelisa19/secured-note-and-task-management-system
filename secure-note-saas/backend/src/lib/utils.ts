export const getSingleQueryParam = (param: any): string | undefined => {
  if (Array.isArray(param)) {
    return param[0];
  }
  if (typeof param === 'string') {
    return param;
  }
  return undefined;
};
