const extractErrorMsg = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return typeof error.message === "string"
      ? (error.message as string)
      : JSON.stringify(error.message);
  }

  return JSON.stringify(error);
};

export default extractErrorMsg;
