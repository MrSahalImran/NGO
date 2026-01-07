const isDev = process.env.NODE_ENV === "development";

module.exports = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },
  error: (...args) => {
    // Errors should ALWAYS be logged (even in prod)
    console.error(...args);
  },
};
