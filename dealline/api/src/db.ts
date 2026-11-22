import pg from "pg";

export type Row = Record<string, any>;
export interface Q {
  query<T extends Row = Row>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}
export interface Db extends Q {
  /** Runs fn in a transaction as dealline_app with app.org_id set: RLS applies. */
  asOrg<T>(orgId: string, fn: (q: Q) => Promise<T>): Promise<T>;
  /** Runs fn in a transaction as the table owner (RLS bypassed).
   *  Only for: auth tables, the public site endpoints, and payment webhooks.
   *  Every query inside must filter by org explicitly. */
  asSystem<T>(fn: (q: Q) => Promise<T>): Promise<T>;
}

async function scoped<T>(q: Q, orgId: string, fn: (q: Q) => Promise<T>) {
  await q.query("set local role dealline_app");
  await q.query("select set_config('app.org_id', $1, true)", [orgId]);
  return fn(q);
}

export function pgDb(connectionString: string): Db {
  pg.types.setTypeParser(20, (v) => Number(v)); // bigint halalas -> number (safe below 9e15)
  const pool = new pg.Pool({ connectionString, max: 10 });
  const tx = async <T>(fn: (q: Q) => Promise<T>) => {
    const c = await pool.connect();
    try {
      await c.query("begin");
      const r = await fn(c as unknown as Q);
      await c.query("commit");
      return r;
    } catch (e) {
      await c.query("rollback");
      throw e;
    } finally {
      c.release();
    }
  };
  return {
    query: (s, p) => pool.query(s, p as any[]) as any,
    asOrg: (orgId, fn) => tx((q) => scoped(q, orgId, fn)),
    asSystem: (fn) => tx(fn),
  };
}

/** Adapter for PGlite (tests, local dev without Postgres). */
export function pgliteDb(lite: { query: Function; transaction: Function }): Db {
  return {
    query: (s, p) => lite.query(s, p),
    asOrg: (orgId, fn) => lite.transaction((t: Q) => scoped(t, orgId, fn)),
    asSystem: (fn) => lite.transaction((t: Q) => fn(t)),
  };
}
