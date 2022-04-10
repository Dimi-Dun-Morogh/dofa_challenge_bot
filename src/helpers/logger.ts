function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

const logger = {
  getTimeStamp: () => new Date().toLocaleTimeString('en-GB', {
    hour12: false,
  }),
  info(namespace: string, message: string, object?: any) {
    console.log(`${this.getTimeStamp()} [INFO] [${namespace}] [${message}]`, object || '');
  },
  error(namespace: string, message: string| unknown, object?: any) {
    console.log(`${this.getTimeStamp()} [ERROR] [${namespace}] [${getErrorMessage(message)}]`, object || '');
  },
};

export default logger;
