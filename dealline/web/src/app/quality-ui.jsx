// Recovered from the Deal Line production build (app/quality-ui.tsx). Types were stripped by the build and are not recoverable.
import { useRef, useState } from "react";
import { CircleCheck, CloudUpload, FileText } from "lucide-react";

export function DemoDocumentPicker({ uploaded, onPick }) {
  const input = useRef(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  return (
    <div className="demo-file-picker">
      <input
        ref={input}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        aria-label="اختيار مستند تجريبي"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
            setError("اختر ملف PDF أو صورة PNG / JPEG.");
            event.target.value = "";
            return;
          }
          if (file.size > 10 * 1024 * 1024) {
            setError("الحد الأقصى للمستند 10 ميجابايت.");
            event.target.value = "";
            return;
          }
          setError("");
          setName(file.name);
          onPick(file.name);
        }}
      />
      <button
        className={uploaded ? "secondary-action" : "primary-action"}
        onClick={() => input.current?.click()}
      >
        {uploaded ? <CircleCheck size={18} /> : <CloudUpload size={18} />}
        {uploaded ? "تغيير الملف المختار" : "اختيار مستند للتجربة"}
      </button>
      {name && (
        <span>
          <FileText size={15} /> {name}
        </span>
      )}
      {error && <p role="alert">{error}</p>}
      <small>يبقى الملف على جهازك؛ لا يُرفع لأي جهة.</small>
    </div>
  );
}
