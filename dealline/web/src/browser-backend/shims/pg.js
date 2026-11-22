// db.ts imports pg for the server adapter; the browser build only uses pgliteDb.
export default {
  types: { setTypeParser() {} },
  Pool: class { constructor() { throw new Error("pg is not available in the browser build; use PGlite"); } },
};
