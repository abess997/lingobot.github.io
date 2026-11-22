import { useCallback, useEffect, useState } from "react";
import { CircleAlert, Inbox, LoaderCircle } from "lucide-react";
import { statusLabel } from "./api.js";

/** Loads data and exposes { data, error, loading, reload }. */
export function useLoad(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      setState({ data: await fn(), error: null, loading: false });
    } catch (e) {
      setState({ data: null, error: e, loading: false });
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}

/** Runs an action, reports success/failure through the toast. */
export function useAction(notify) {
  const [busy, setBusy] = useState(false);
  const run = async (fn, success) => {
    setBusy(true);
    try {
      const out = await fn();
      if (success) notify(success);
      return out ?? true;
    } catch (e) {
      notify(e.message, "error");
      return null;
    } finally {
      setBusy(false);
    }
  };
  return [run, busy];
}

export function Loading({ label = "جارٍ التحميل…" }) {
  return (
    <div className="live-state" role="status">
      <LoaderCircle size={20} className="live-spin" /> {label}
    </div>
  );
}
export function ErrorNote({ error, retry }) {
  if (!error) return null;
  return (
    <div className="live-state error" role="alert">
      <CircleAlert size={20} /> {error.message}
      {retry && <button className="ghost-action" onClick={retry}>إعادة المحاولة</button>}
    </div>
  );
}
export function Empty({ children }) {
  return (
    <div className="live-state empty">
      <Inbox size={22} /> {children}
    </div>
  );
}

export function Loaded({ state, children, empty }) {
  if (state.loading && !state.data) return <Loading />;
  if (state.error) return <ErrorNote error={state.error} retry={state.reload} />;
  if (empty && (!state.data || (Array.isArray(state.data) && !state.data.length))) return <Empty>{empty}</Empty>;
  return children(state.data);
}

export function Badge({ status, children }) {
  return <span className={`live-badge s-${status}`}>{children ?? statusLabel(status)}</span>;
}

export function Panel({ title, subtitle, actions, children, id }) {
  return (
    <section className="panel live-panel" id={id}>
      {(title || actions) && (
        <div className="panel-head">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="live-actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, wide }) {
  return (
    <label className={`live-field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

/** Form with onSubmit receiving an object of field values (FormData by name). */
export function Form({ onSubmit, children, submit = "حفظ", busy, className = "" }) {
  return (
    <form
      className={`live-form ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const values = {};
        for (const [k, v] of fd.entries()) values[k] = typeof v === "string" ? v.trim() : v;
        onSubmit(values, e.currentTarget);
      }}
    >
      <div className="live-form-grid">{children}</div>
      <div className="live-form-foot">
        <button className="primary-action" disabled={busy} type="submit">
          {busy ? "جارٍ الحفظ…" : submit}
        </button>
      </div>
    </form>
  );
}

export function Kpi({ icon: Icon, tone = "mint", label, value, note, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={onClick ? undefined : "kpi-static"} type={onClick ? "button" : undefined}>
      <span className={`kpi-icon ${tone}`}><Icon size={20} /></span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {note && <em>{note}</em>}
      </div>
    </Tag>
  );
}

/** "" -> null, numbers parsed. */
export const opt = (v) => (v === "" || v == null ? null : v);
export const num = (v) => (v === "" || v == null ? null : Number(v));
