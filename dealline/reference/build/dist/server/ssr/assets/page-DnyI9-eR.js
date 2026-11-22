import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
//#region app/property-data.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var projects = [
	{
		name: "بيوت تلال — واجهة الدمام",
		city: "الدمام",
		type: "فلل",
		price: "يبدأ من 1,120,000 ر.س",
		area: "210–286 م²",
		tag: "جاهز للسكن",
		tone: "sea",
		code: "TD",
		image: "/images/saudi-villa.webp",
		district: "واجهة الدمام",
		basePrice: 112e4,
		baseArea: 210,
		beds: 4,
		baths: 4,
		description: "مساحات عائلية مستقلة، مجلس بمدخل خاص، وصالة معيشة تطل على الحديقة. توزيع عملي يجمع الخصوصية وقرب الخدمات.",
		amenities: [
			"حديقة خاصة",
			"موقفان للسيارة",
			"مدخل مستقل",
			"غرفة غسيل",
			"غرفة عاملة",
			"تأسيس تكييف مخفي"
		]
	},
	{
		name: "قلب الخبر",
		city: "الخبر",
		type: "شقق تمليك",
		price: "يبدأ من 890,000 ر.س",
		area: "132–208 م²",
		tag: "جاهز للسكن",
		tone: "city",
		code: "KH",
		image: "/images/khobar-apartments.webp",
		district: "وسط الخبر",
		basePrice: 89e4,
		baseArea: 132,
		beds: 3,
		baths: 3,
		description: "شقق بمساحات مفتوحة وإضاءة طبيعية، قريبة من الخدمات اليومية. صالة واسعة وشرفة خاصة تناسب بداية جديدة في قلب المدينة.",
		amenities: [
			"شرفة خاصة",
			"مصعد",
			"موقف خاص",
			"دخول ذكي",
			"صالة معيشة مفتوحة",
			"مساحات مشتركة"
		]
	},
	{
		name: "بيوت تلال — قمرة",
		city: "صفوى",
		type: "تاون هاوس",
		price: "يبدأ من 980,000 ر.س",
		area: "198–274 م²",
		tag: "جاهز للسكن",
		tone: "sand",
		code: "QM",
		image: "/images/saudi-townhouses.webp",
		district: "قمرة",
		basePrice: 98e4,
		baseArea: 198,
		beds: 4,
		baths: 3,
		description: "تاون هاوس على دورين مع فناء خاص ومساحات مرنة للعائلة. المعيشة والاستقبال في الدور الأرضي وغرف النوم في الدور العلوي.",
		amenities: [
			"فناء خاص",
			"دوران",
			"مدخل مستقل",
			"موقف خاص",
			"غرفة تخزين",
			"مسارات مشي"
		]
	},
	{
		name: "واحة النرجس",
		city: "الرياض",
		type: "فلل",
		price: "يبدأ من 1,650,000 ر.س",
		area: "260–336 م²",
		tag: "جاهز للسكن",
		tone: "sand",
		code: "NR",
		image: "/images/saudi-villa.webp",
		district: "النرجس",
		basePrice: 165e4,
		baseArea: 260,
		beds: 5,
		baths: 5,
		description: "فيلا عائلية بمجلس مستقل وجناح رئيسي وصالة علوية. فناء واسع وإضاءة طبيعية في مساحات البيت اليومية.",
		amenities: [
			"جناح رئيسي",
			"حديقة خاصة",
			"موقفان للسيارة",
			"مجلس مستقل",
			"صالة علوية",
			"غرفة عاملة"
		]
	},
	{
		name: "إطلالة الروضة",
		city: "جدة",
		type: "شقق تمليك",
		price: "يبدأ من 760,000 ر.س",
		area: "145–221 م²",
		tag: "جاهز للسكن",
		tone: "city",
		code: "RD",
		image: "/images/khobar-apartments.webp",
		district: "الروضة",
		basePrice: 76e4,
		baseArea: 145,
		beds: 3,
		baths: 3,
		description: "شقة رحبة تجمع المجلس والصالة العائلية مع شرفة خارجية. مداخل منظمة وموقف مخصص وقرب من مرافق الحي.",
		amenities: [
			"شرفة",
			"مصعد",
			"موقف خاص",
			"مجلس ضيوف",
			"دخول ذكي",
			"غرفة غسيل"
		]
	},
	{
		name: "روابي الخبر",
		city: "الخبر",
		type: "تاون هاوس",
		price: "يبدأ من 1,350,000 ر.س",
		area: "248–324 م²",
		tag: "جاهز للسكن",
		tone: "sea",
		code: "RW",
		image: "/images/saudi-townhouses.webp",
		district: "العزيزية",
		basePrice: 135e4,
		baseArea: 248,
		beds: 4,
		baths: 4,
		description: "بيت متدرج المساحات مع حديقة أمامية وصالة عائلية كبيرة. غرف موزعة بعناية لتمنح كل فرد مساحته وخصوصيته.",
		amenities: [
			"حديقة أمامية",
			"دوران",
			"موقف خاص",
			"غرفة عاملة",
			"مستودع",
			"صالة عائلية"
		]
	}
];
function projectUnits(project) {
	return [
		0,
		1,
		2
	].map((i) => ({
		id: `${project.code}-${[
			101,
			102,
			201
		][i]}`,
		available: i !== 1,
		area: project.baseArea + [
			0,
			36,
			76
		][i],
		price: project.basePrice + [
			0,
			85e3,
			17e4
		][i],
		beds: project.beds + (i === 2 ? 1 : 0),
		baths: project.baths,
		floor: project.type === "شقق تمليك" ? [
			"الأول",
			"الثاني",
			"الثالث"
		][i] : "دوران",
		facing: [
			"شمالية",
			"شرقية",
			"شمالية شرقية"
		][i]
	}));
}
var money = (value) => new Intl.NumberFormat("en-US").format(value);
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region node_modules/lucide-react/dist/esm/defaultAttributes.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region node_modules/lucide-react/dist/esm/context.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LucideContext = (0, import_react.createContext)({});
var useLucideContext = () => (0, import_react.useContext)(LucideContext);
//#endregion
//#region node_modules/lucide-react/dist/esm/Icon.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon = (0, import_react.forwardRef)(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
	const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
	const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
	return (0, import_react.createElement)("svg", {
		ref,
		...defaultAttributes,
		width: size ?? contextSize ?? defaultAttributes.width,
		height: size ?? contextSize ?? defaultAttributes.height,
		stroke: color ?? contextColor,
		strokeWidth: calculatedStrokeWidth,
		className: mergeClasses("lucide", contextClass, className),
		...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
		...rest
	}, [...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
});
//#endregion
//#region node_modules/lucide-react/dist/esm/createLucideIcon.mjs
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => {
	const Component = (0, import_react.forwardRef)(({ className, ...props }, ref) => (0, import_react.createElement)(Icon, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleCheck = createLucideIcon("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FileText = createLucideIcon("file-text", [
	["path", {
		d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
		key: "1oefj6"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["path", {
		d: "M10 9H8",
		key: "b1mrlr"
	}],
	["path", {
		d: "M16 13H8",
		key: "t4e002"
	}],
	["path", {
		d: "M16 17H8",
		key: "z1uh3a"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CloudUpload = createLucideIcon("cloud-upload", [
	["path", {
		d: "M12 13v8",
		key: "1l5pq0"
	}],
	["path", {
		d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
		key: "1pljnt"
	}],
	["path", {
		d: "m8 17 4-4 4 4",
		key: "1quai1"
	}]
]);
//#endregion
//#region app/quality-ui.tsx
var import_jsx_runtime = require_jsx_runtime();
function DemoDocumentPicker({ uploaded, onPick }) {
	const input = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "demo-file-picker",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: input,
				type: "file",
				accept: "application/pdf,image/jpeg,image/png",
				"aria-label": "اختيار مستند تجريبي",
				hidden: true,
				onChange: (event) => {
					const file = event.target.files?.[0];
					if (!file) return;
					if (![
						"application/pdf",
						"image/jpeg",
						"image/png"
					].includes(file.type)) {
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
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: uploaded ? "secondary-action" : "primary-action",
				onClick: () => input.current?.click(),
				children: [uploaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { size: 18 }), uploaded ? "تغيير الملف المختار" : "اختيار مستند للتجربة"]
			}),
			name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 15 }),
				" ",
				name
			] }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "يبقى الملف على جهازك؛ لا يُرفع لأي جهة." })
		]
	});
}
//#endregion
//#region app/demo-domain.ts
function periodRange(period, today, from, to) {
	const date = /* @__PURE__ */ new Date(`${today}T12:00:00Z`);
	if (!Number.isFinite(date.getTime())) throw new Error("Invalid report date");
	const iso = (d) => d.toISOString().slice(0, 10);
	if (period === "custom") {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || !Number.isFinite(Date.parse(from)) || !Number.isFinite(Date.parse(to)) || from > to) return null;
		return {
			from,
			to
		};
	}
	const start = new Date(date);
	if (period === "weekly") start.setUTCDate(start.getUTCDate() - start.getUTCDay());
	if (period === "monthly") start.setUTCDate(1);
	if (period === "quarterly") {
		start.setUTCDate(1);
		start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3);
	}
	if (period === "yearly") start.setUTCMonth(0, 1);
	return {
		from: iso(start),
		to: today
	};
}
function withinRange(date, range) {
	return !!range && date >= range.from && date <= range.to;
}
function indicativePrincipal(monthlyPayment, annualRate, years) {
	if (![
		monthlyPayment,
		annualRate,
		years
	].every(Number.isFinite) || monthlyPayment < 0 || annualRate < 0 || years <= 0) return 0;
	const months = years * 12;
	const rate = annualRate / 1200;
	return Math.round(rate === 0 ? monthlyPayment * months : monthlyPayment * (1 - Math.pow(1 + rate, -months)) / rate);
}
function walletSummary(entries) {
	return entries.reduce((totals, entry) => {
		if (!Number.isFinite(entry.amount) || entry.amount < 0) throw new Error("Invalid ledger amount");
		if (entry.state === "available") totals.available += entry.amount;
		if (entry.state === "paid" || entry.state === "reversed") totals.available -= entry.amount;
		if (entry.state === "paid") totals.paid += entry.amount;
		if (entry.state === "pending") totals.pending += entry.amount;
		return totals;
	}, {
		available: 0,
		pending: 0,
		paid: 0
	});
}
function csvCell(value) {
	return `"${(/^[=+\-@\t\r]/.test(value) ? `'${value}` : value).replaceAll("\"", "\"\"")}"`;
}
var demoInventory = [
	{
		id: "A-204",
		project: "روابي الخبر",
		type: "تاون هاوس",
		state: "محجوزة",
		inquiries: 14
	},
	{
		id: "T-118",
		project: "تلال الواجهة",
		type: "فيلا",
		state: "محجوزة",
		inquiries: 9
	},
	{
		id: "B-311",
		project: "واحة الدمام",
		type: "شقة",
		state: "محجوزة",
		inquiries: 5
	},
	{
		id: "V-027",
		project: "بيوت قمرة",
		type: "فيلا",
		state: "مباعة",
		inquiries: 21
	},
	{
		id: "T-122",
		project: "تلال الواجهة",
		type: "فيلا",
		state: "متاحة",
		inquiries: 2
	}
];
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowLeft = createLucideIcon("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowUpLeft = createLucideIcon("arrow-up-left", [["path", {
	d: "M7 17V7h10",
	key: "11bw93"
}], ["path", {
	d: "M17 17 7 7",
	key: "2786uv"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Bath = createLucideIcon("bath", [
	["path", {
		d: "M10 4 8 6",
		key: "1rru8s"
	}],
	["path", {
		d: "M17 19v2",
		key: "ts1sot"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}],
	["path", {
		d: "M7 19v2",
		key: "12npes"
	}],
	["path", {
		d: "M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",
		key: "14ym8i"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var BedDouble = createLucideIcon("bed-double", [
	["path", {
		d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",
		key: "1k78r4"
	}],
	["path", {
		d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",
		key: "fb3tl2"
	}],
	["path", {
		d: "M12 4v6",
		key: "1dcgq2"
	}],
	["path", {
		d: "M2 18h20",
		key: "ajqnye"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Building2 = createLucideIcon("building-2", [
	["path", {
		d: "M10 12h4",
		key: "a56b0p"
	}],
	["path", {
		d: "M10 8h4",
		key: "1sr2af"
	}],
	["path", {
		d: "M14 21v-3a2 2 0 0 0-4 0v3",
		key: "1rgiei"
	}],
	["path", {
		d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
		key: "secmi2"
	}],
	["path", {
		d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",
		key: "16ra0t"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = createLucideIcon("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronLeft = createLucideIcon("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleQuestionMark = createLucideIcon("circle-question-mark", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
		key: "1u773s"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Clock3 = createLucideIcon("clock-3", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6h4",
	key: "135r8i"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Download = createLucideIcon("download", [
	["path", {
		d: "M12 15V3",
		key: "m9g1x1"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["path", {
		d: "m7 10 5 5 5-5",
		key: "brsn70"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Expand = createLucideIcon("expand", [
	["path", {
		d: "m15 15 6 6",
		key: "1s409w"
	}],
	["path", {
		d: "m15 9 6-6",
		key: "ko1vev"
	}],
	["path", {
		d: "M21 16v5h-5",
		key: "1ck2sf"
	}],
	["path", {
		d: "M21 8V3h-5",
		key: "1qoq8a"
	}],
	["path", {
		d: "M3 16v5h5",
		key: "1t08am"
	}],
	["path", {
		d: "m3 21 6-6",
		key: "wwnumi"
	}],
	["path", {
		d: "M3 8V3h5",
		key: "1ln10m"
	}],
	["path", {
		d: "M9 9 3 3",
		key: "v551iv"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FingerprintPattern = createLucideIcon("fingerprint-pattern", [
	["path", {
		d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",
		key: "1nerag"
	}],
	["path", {
		d: "M14 13.12c0 2.38 0 6.38-1 8.88",
		key: "o46ks0"
	}],
	["path", {
		d: "M17.29 21.02c.12-.6.43-2.3.5-3.02",
		key: "ptglia"
	}],
	["path", {
		d: "M2 12a10 10 0 0 1 18-6",
		key: "ydlgp0"
	}],
	["path", {
		d: "M2 16h.01",
		key: "1gqxmh"
	}],
	["path", {
		d: "M21.8 16c.2-2 .131-5.354 0-6",
		key: "drycrb"
	}],
	["path", {
		d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",
		key: "1tidbn"
	}],
	["path", {
		d: "M8.65 22c.21-.66.45-1.32.57-2",
		key: "13wd9y"
	}],
	["path", {
		d: "M9 6.8a6 6 0 0 1 9 5.2v2",
		key: "1fr1j5"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var House = createLucideIcon("house", [["path", {
	d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
	key: "5wwlr5"
}], ["path", {
	d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
	key: "r6nss1"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Info = createLucideIcon("info", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 16v-4",
		key: "1dtifu"
	}],
	["path", {
		d: "M12 8h.01",
		key: "e9boi3"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LockKeyhole = createLucideIcon("lock-keyhole", [
	["circle", {
		cx: "12",
		cy: "16",
		r: "1",
		key: "1au0dj"
	}],
	["rect", {
		x: "3",
		y: "10",
		width: "18",
		height: "12",
		rx: "2",
		key: "6s8ecr"
	}],
	["path", {
		d: "M7 10V7a5 5 0 0 1 10 0v3",
		key: "1pqi11"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MapPin = createLucideIcon("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessageCircleMore = createLucideIcon("message-circle-more", [
	["path", {
		d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
		key: "1sd12s"
	}],
	["path", {
		d: "M8 12h.01",
		key: "czm47f"
	}],
	["path", {
		d: "M12 12h.01",
		key: "1mp3jc"
	}],
	["path", {
		d: "M16 12h.01",
		key: "1l6xoz"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MoveUpRight = createLucideIcon("move-up-right", [["path", {
	d: "M13 5H19V11",
	key: "1n1gyv"
}], ["path", {
	d: "M19 5L5 19",
	key: "72u4yj"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Ruler = createLucideIcon("ruler", [
	["path", {
		d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
		key: "icamh8"
	}],
	["path", {
		d: "m14.5 12.5 2-2",
		key: "inckbg"
	}],
	["path", {
		d: "m11.5 9.5 2-2",
		key: "fmmyf7"
	}],
	["path", {
		d: "m8.5 6.5 2-2",
		key: "vc6u1g"
	}],
	["path", {
		d: "m17.5 15.5 2-2",
		key: "wo5hmg"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ShieldCheck = createLucideIcon("shield-check", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Wallet = createLucideIcon("wallet", [["path", {
	d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
	key: "18etb6"
}], ["path", {
	d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
	key: "xoc0q4"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var X = createLucideIcon("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region app/experience.tsx
var motionSelector = ".project-card, .sales-kpis > button, .sales-kpis > article, .welcome-visual, .wallet-balance, .journey-card, .focus-card, .intro-step-card, .portal-login-grid > button, .next-action, .calculator-launch";
function SpatialSurface({ children, className = "" }) {
	const motion = (0, import_react.useRef)({
		element: null,
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		tx: 0,
		ty: 0,
		frame: 0,
		time: 0
	});
	(0, import_react.useEffect)(() => () => cancelAnimationFrame(motion.current.frame), []);
	const animate = (time) => {
		const m = motion.current;
		const dt = Math.min((time - (m.time || time - 16)) / 1e3, .032);
		m.time = time;
		m.vx += (190 * (m.tx - m.x) - 28 * m.vx) * dt;
		m.vy += (190 * (m.ty - m.y) - 28 * m.vy) * dt;
		m.x += m.vx * dt;
		m.y += m.vy * dt;
		m.element?.style.setProperty("--tilt-x", `${m.x}deg`);
		m.element?.style.setProperty("--tilt-y", `${m.y}deg`);
		if (Math.abs(m.x - m.tx) + Math.abs(m.y - m.ty) + Math.abs(m.vx) + Math.abs(m.vy) > .008) m.frame = requestAnimationFrame(animate);
		else {
			m.frame = 0;
			m.time = 0;
		}
	};
	const reset = () => {
		const m = motion.current;
		m.tx = 0;
		m.ty = 0;
		if (!m.frame) m.frame = requestAnimationFrame(animate);
	};
	const move = (event) => {
		if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
		const target = event.target.closest(motionSelector);
		if (!target) {
			reset();
			return;
		}
		const m = motion.current;
		if (m.element !== target) {
			m.element?.style.removeProperty("--tilt-x");
			m.element?.style.removeProperty("--tilt-y");
			m.element = target;
			m.x = 0;
			m.y = 0;
			m.vx = 0;
			m.vy = 0;
		}
		const box = target.getBoundingClientRect();
		m.tx = -(event.clientY - box.top - box.height / 2) / box.height * 4;
		m.ty = (event.clientX - box.left - box.width / 2) / box.width * 5;
		if (!m.frame) m.frame = requestAnimationFrame(animate);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `spatial-surface ${className}`,
		onPointerMove: move,
		onPointerLeave: reset,
		children
	});
}
function ExperienceDialog({ title, children, close, wide = false }) {
	const ref = (0, import_react.useRef)(null);
	const closeRef = (0, import_react.useRef)(close);
	closeRef.current = close;
	(0, import_react.useEffect)(() => {
		const dialog = ref.current;
		const focusBefore = document.activeElement;
		dialog?.showModal();
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			dialog?.close();
			document.body.style.overflow = overflow;
			focusBefore?.focus();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dialog", {
		ref,
		className: `experience-dialog ${wide ? "wide" : ""}`,
		dir: "rtl",
		"aria-label": title,
		onCancel: (event) => {
			event.preventDefault();
			closeRef.current();
		},
		onClick: (event) => {
			if (event.target === event.currentTarget) closeRef.current();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "experience-dialog-inner",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "eyebrow",
				children: "ديل لاين"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "icon-button",
				autoFocus: true,
				onClick: close,
				"aria-label": "إغلاق النافذة",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 22 })
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "experience-dialog-body",
				children
			})]
		})
	});
}
var steps = [
	{
		title: "اختَر البيت اللي يناسبك",
		short: "اكتشف",
		icon: House,
		text: "تصفّح المشاريع، افتح تفاصيل الوحدة، وقارن المساحة والسعر والمميزات قبل ما تبدأ.",
		note: "البداية من الوحدة المناسبة لك"
	},
	{
		title: "اعرف خياراتك بوضوح",
		short: "احسب",
		icon: FingerprintPattern,
		text: "بعد اختيار الوحدة، تبدأ رحلة التحقق وموافقتك على مشاركة البيانات اللازمة للحسبة المبدئية.",
		note: "الحسبة المبدئية ليست موافقة تمويلية"
	},
	{
		title: "تواصل في نفس المكان",
		short: "تواصل",
		icon: MessageCircleMore,
		text: "اسأل موظف المشروع وتابع مع موظف التمويل المختص في مسار يجمع محادثاتك وطلبك.",
		note: "المسؤول عن الخطوة واضح لك"
	},
	{
		title: "تابع لين تكتمل صفقتك",
		short: "تملّك",
		icon: CircleCheck,
		text: "تعرف وين وصل الطلب، وش المستند الناقص، ومتى تنتقل للخطوة التالية إلى اكتمال الرحلة.",
		note: "حالة الصفقة والمطلوب منك في مكان واحد"
	}
];
function WelcomePage({ enter, browse, children, returning = false }) {
	const [step, setStep] = (0, import_react.useState)(0);
	const Icon = steps[step].icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpatialSurface, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "welcome-page",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "welcome-header",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "welcome-brand",
						href: "#welcome-top",
						"aria-label": "ديل لاين الرئيسية",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "brand-mark",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "د" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ديل لاين" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": "التنقل التعريفي",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#how-it-works",
							children: "كيف تبدأ؟"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#market",
							children: "العقارات"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "primary-action",
						onClick: enter,
						children: [returning ? "ارجع لبوابتك" : "الدخول للمنصة", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 17 })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-hero",
				id: "welcome-top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "welcome-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "intro-kicker",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " بيتك. قرارك. مسارك."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"بيتك الجاي،",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "تبدأ حكايته هنا." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "من البحث عن البيت إلى متابعة التمويل والصفقة. ديل لاين تجمعك مع المطور والجهة التمويلية في مسار واحد، وتخلّي كل خطوة أوضح." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "welcome-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-action",
								onClick: browse,
								children: ["استكشف العقارات", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 19 })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "welcome-secondary",
								href: "#how-it-works",
								children: ["خلّنا نعرّفك على ديل لاين", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "welcome-assurance",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بياناتك بموافقتك. وقرارك بيدك." })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "welcome-visual",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/saudi-villa.webp",
							alt: "تصور معماري لفيلا سعودية حديثة بواجهة حجرية وحديقة",
							width: 960,
							height: 720,
							fetchPriority: "high"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "visual-caption",
							children: "صورة تصورية"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-property-caption",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 15 }), " مساحة لحياتك الجديدة"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								"تفاصيل تشوفها.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"وخطوات تعرفها."
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-floating-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "floating-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 25 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "رحلة واحدة تجمع الأطراف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "العقار + التمويل + المتابعة" })] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-journey",
				id: "how-it-works",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "intro-section-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow",
							children: "أول مرة تدخل؟ حيّاك الله"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "من وين تبدأ؟ خطوة بخطوة." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "اختر أي خطوة وخلّنا نوضحها لك." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "intro-journey-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "intro-steps",
						role: "tablist",
						"aria-label": "خطوات رحلة العميل",
						children: steps.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "tab",
							"aria-selected": step === index,
							"aria-controls": "intro-step-panel",
							id: `intro-step-${index}`,
							tabIndex: step === index ? 0 : -1,
							onKeyDown: (event) => {
								if ([
									"ArrowLeft",
									"ArrowRight",
									"Home",
									"End"
								].includes(event.key)) {
									event.preventDefault();
									const next = event.key === "Home" ? 0 : event.key === "End" ? 3 : (step + (event.key === "ArrowLeft" ? 1 : 3)) % 4;
									setStep(next);
									document.getElementById(`intro-step-${next}`)?.focus();
								}
							},
							className: step === index ? "active" : "",
							onClick: () => setStep(index),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", index + 1] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.short }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpLeft, { size: 18 })
							]
						}, item.short))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "intro-step-card",
						id: "intro-step-panel",
						role: "tabpanel",
						"aria-labelledby": `intro-step-${step}`,
						tabIndex: 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "intro-step-content",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "intro-step-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 30 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: steps[step].title }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: steps[step].text }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "intro-step-note",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), steps[step].note]
								})
							] })]
						}, step)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "welcome-catalog",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-finish",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "خطوتك الأولى بيدك"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "شوف التفاصيل، وخذ وقتك بالقرار." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "المنصة في هذه النسخة للتجربة؛ بيانات العقارات والتمويل توضيحية." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "primary-action",
					onClick: enter,
					children: [returning ? "ارجع لبوابتك" : "الدخول إلى البوابات", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 18 })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "welcome-footer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ديل لاين" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رحلة التملك في مكان واحد" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "© 2026 · نسخة تفاعلية تجريبية" })
				]
			})
		]
	}) });
}
function PropertyDetails({ project, contact, isVisitor = false, savedUnits, toggleSaved }) {
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [selected, setSelected] = (0, import_react.useState)(0);
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const units = projectUnits(project);
	const unit = units[selected];
	const interested = savedUnits.includes(unit.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "property-experience",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `property-photo ${expanded ? "expanded" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: project.image,
						alt: `صورة تصورية لنمط ${project.type} في ${project.name}`,
						width: 1200,
						height: 800
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "صورة تصورية · ليست صورة فعلية للمشروع" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setExpanded(!expanded),
						"aria-label": expanded ? "تصغير الصورة" : "تكبير صورة العقار",
						"aria-pressed": expanded,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { size: 20 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "property-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 16 }),
					project.city,
					" · ",
					project.district
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: project.name })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "سعر الوحدة المختارة · تجريبي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
					money(unit.price),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })
				] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "property-specs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BedDouble, { size: 21 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: unit.beds }),
						" غرف نوم"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bath, { size: 21 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: unit.baths }),
						" دورات مياه"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { size: 21 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: unit.area }),
						" م²"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 21 }), unit.floor] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "property-tabs",
				role: "tablist",
				"aria-label": "تفاصيل العقار",
				children: [
					["overview", "عن العقار"],
					["units", "الوحدات"],
					["location", "الموقع والخدمات"]
				].map(([key, label], index, all) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					role: "tab",
					id: `property-tab-${key}`,
					"aria-controls": `property-panel-${tab}`,
					"aria-selected": tab === key,
					tabIndex: tab === key ? 0 : -1,
					className: tab === key ? "active" : "",
					onKeyDown: (event) => {
						if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
							event.preventDefault();
							const next = all[(index + (event.key === "ArrowLeft" ? 1 : 2)) % 3][0];
							setTab(next);
							document.getElementById(`property-tab-${next}`)?.focus();
						}
					},
					onClick: () => setTab(key),
					children: label
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "property-tab-panel",
				role: "tabpanel",
				id: `property-panel-${tab}`,
				"aria-labelledby": `property-tab-${tab}`,
				tabIndex: 0,
				children: [
					tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "بيت يناسب يومك" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: project.description }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "amenity-grid",
							children: project.amenities.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 17 }), item] }, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "property-facts-table",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "نوع العقار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.type })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "حالة البناء في النموذج" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.tag })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "واجهة الوحدة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: unit.facing })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "رمز الوحدة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									dir: "ltr",
									children: unit.id
								})] })
							]
						})
					] }),
					tab === "units" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "units-section-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "اختر وحدة وشوف مواصفاتها" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "وحدتان متاحتان في النموذج" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "unit-choice-list",
						children: units.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: !item.available,
							"aria-pressed": selected === i,
							className: selected === i ? "selected" : "",
							onClick: () => {
								setSelected(i);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "unit-choice-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { size: 21 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									dir: "ltr",
									children: item.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									item.area,
									" م² · ",
									item.beds,
									" غرف · ",
									item.facing
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [money(item.price), " ر.س"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.available ? selected === i ? "الوحدة المختارة" : "متاحة للتجربة" : "غير متاحة" })] }),
								selected === i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 20 })
							]
						}, item.id))
					})] }),
					tab === "location" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "location-summary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 29 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", { children: [
								project.city,
								" · ",
								project.district
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "موقع تقريبي على مستوى الحي. موقع المشروع الفعلي يحتاج اعتماد المطور." })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "المرافق التي تهمك" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "amenity-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }), " خدمات الحي"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }), " خيارات التسوق"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }), " مدارس ومرافق تعليمية"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }), " طرق الوصول"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "property-location-note",
							children: "هذه قائمة للمراجعة عند الزيارة؛ لم يتم تأكيد القرب أو المسافات في النموذج."
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "property-detail-bottom",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الوحدة المختارة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						unit.id,
						" · ",
						unit.area,
						" م²"
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "ghost-action",
						onClick: () => contact ? contact(unit.id) : setTab("units"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 17 }), contact ? isVisitor ? "سجّل دخولك للاستفسار" : "اسأل موظف المشروع" : "راجع الوحدات"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "primary-action",
						onClick: () => toggleSaved(unit.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 17 }), interested ? "محفوظة للمعاينة" : "احفظ للمعاينة"]
					})
				]
			}),
			interested && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "property-saved-note",
				role: "status",
				children: [
					"حفظنا اهتمامك بالوحدة ",
					unit.id,
					" داخل هذه الجلسة التجريبية. هذا لا ينشئ حجزًا أو طلب تمويل."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "property-demo-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { size: 17 }), " الصور تصورية والأسعار والمواصفات والتوفر بيانات تجريبية، ولا تمثل نشرة بيع رسمية."]
			})
		]
	});
}
var walletEntries = [
	{
		id: "TX-1048",
		date: "2026-09-04",
		label: "استحقاق صفقة مكتملة",
		deal: "HI-24071",
		state: "available",
		amount: 1200,
		note: "قيد إتاحة بعد اكتمال فترة التحقق التجريبية."
	},
	{
		id: "TX-1046",
		date: "2026-09-02",
		label: "استحقاق قيد التحقق",
		deal: "HI-24081",
		state: "pending",
		amount: 600,
		note: "مثال لاستحقاق ينتظر انتهاء مدة التحقق، ولا يدخل في الرصيد المتاح."
	},
	{
		id: "TX-1042",
		date: "2026-08-28",
		label: "تحويل مستحقات سابق",
		deal: "HI-24063",
		state: "paid",
		amount: 800,
		note: "قيد تحويل توضيحي يخفض الرصيد المتاح. لم يحدث تحويل بنكي حقيقي."
	},
	{
		id: "TX-1040",
		date: "2026-08-27",
		label: "عكس استحقاق سابق",
		deal: "HI-24059",
		state: "reversed",
		amount: 200,
		note: "قيد تعويضي مستقل يعكس استحقاقًا متاحًا؛ السجل الأصلي محفوظ."
	},
	{
		id: "TX-1038",
		date: "2026-08-24",
		label: "إتاحة مستحقات سابقة",
		deal: "HI-24059 / HI-24063",
		state: "available",
		amount: 1e3,
		note: "قيد إتاحة سابق مرتبط بقيود التحويل والعكس اللاحقة."
	}
];
var stateLabels = {
	available: "متاح",
	pending: "قيد التحقق",
	paid: "محوّل",
	reversed: "معكوس"
};
function WalletPanel({ bank }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [section, setSection] = (0, import_react.useState)("transactions");
	const entries = bank ? [] : walletEntries;
	const { available, pending, paid } = walletSummary(entries);
	const shown = entries.filter((row) => filter === "all" || row.state === filter);
	const exportLedger = () => {
		const rows = [[
			"رقم القيد",
			"التاريخ",
			"الوصف",
			"الصفقة",
			"الحالة",
			"المبلغ (ر.س)"
		], ...shown.map((row) => [
			row.id,
			row.date,
			row.label,
			row.deal,
			stateLabels[row.state],
			String(row.amount)
		])];
		const url = URL.createObjectURL(new Blob(["﻿" + rows.map((row) => row.map((cell) => csvCell(cell)).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "Deal_Line_Wallet_Demo.csv";
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpatialSurface, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wallet-experience",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wallet-balance",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 20 }),
							" محفظة ",
							bank ? "موظف مبيعات البنك" : "موظف مبيعات العقار"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: bank ? "بانتظار التفعيل" : "الرصيد المتاح · توضيحي" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							money(available),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })
						] })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 56 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: bank ? "لا توجد مستحقات مفعّلة على حسابك" : "عرض للمستحقات من سجل العمليات" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wallet-metrics",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 19 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "قيد التحقق" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						money(pending),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })
					] })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveUpRight, { size: 19 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "سبق تحويله" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						money(paid),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })
					] })
				] })]
			}),
			bank && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wallet-gate",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 21 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "عرض المحفظة متاح، والصرف غير مفعّل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تظهر المستحقات بعد اعتماد نموذج الحوافز وسياسة جهة العمل واستكمال المتطلبات النظامية. ما فيه عمليات صرف في هذه النسخة." })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wallet-section-switch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: section === "transactions" ? "active" : "",
					"aria-pressed": section === "transactions",
					onClick: () => setSection("transactions"),
					children: "سجل العمليات"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: section === "policy" ? "active" : "",
					"aria-pressed": section === "policy",
					onClick: () => setSection("policy"),
					children: "كيف تظهر مستحقاتي؟"
				})]
			}),
			section === "transactions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wallet-toolbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["الحالة", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					"aria-label": "فلترة عمليات المحفظة",
					value: filter,
					onChange: (event) => {
						setFilter(event.target.value);
						setSelected(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "كل العمليات"
					}), Object.entries(stateLabels).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: key,
						children: value
					}, key))]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "ghost-action",
					disabled: !shown.length,
					onClick: exportLedger,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), " تنزيل السجل"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wallet-ledger",
				children: [shown.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					"aria-expanded": selected === row.id,
					onClick: () => setSelected(selected === row.id ? null : row.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `ledger-icon ${row.state}`,
							children: row.state === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 19 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 19 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							row.date,
							" · ",
							row.id
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							row.state === "paid" || row.state === "reversed" ? "−" : "+",
							money(row.amount),
							" ر.س"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: stateLabels[row.state] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 17 })
					]
				}), selected === row.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ledger-detail",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["مرجع الصفقة: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("bdi", { children: row.deal })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: row.note }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "قيد توضيحي للعرض، وليس معاملة مالية حقيقية." })
					]
				})] }, row.id)), !shown.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "wallet-empty",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 35 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: bank ? "محفظتك جاهزة لاستقبال السجل" : "ما فيه عمليات بهذه الحالة" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: bank ? "بتظهر العمليات هنا عند تفعيل النموذج واعتماد المستحقات." : "اختر حالة ثانية لعرض العمليات." })
					]
				})]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wallet-policy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "كل مبلغ له حالة ومرجع" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 18 }), " قيد التحقق: استحقاق ينتظر اكتمال الشروط، ولا يُحسب ضمن المتاح."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 18 }), " المتاح: المستحقات التي أُتيحت، بعد خصم التحويلات والقيود العكسية."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveUpRight, { size: 18 }), " المحوّل: مبلغ مسجل كتحويل سابق في السجل التوضيحي."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 18 }), " أي تصحيح يظهر كقيد مستقل، مع حفظ تاريخ العملية."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "صرف المستحقات يخضع للسياسة المعتمدة؛ وجود المحفظة لا يعني استحقاقًا تلقائيًا." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "property-demo-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 17 }), bank ? "المحفظة للعرض فقط حتى اعتماد التفعيل." : "كل الأرصدة والقيود المعروضة تجريبية؛ التحويل والسحب الفعلي غير مفعّلين."]
			})
		]
	}) });
}
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var BadgeCheck = createLucideIcon("badge-check", [["path", {
	d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
	key: "3c2336"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Bell = createLucideIcon("bell", [["path", {
	d: "M10.268 21a2 2 0 0 0 3.464 0",
	key: "vwvbt9"
}], ["path", {
	d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
	key: "11g9vi"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Bot = createLucideIcon("bot", [
	["path", {
		d: "M12 8V4H8",
		key: "hb8ula"
	}],
	["rect", {
		width: "16",
		height: "12",
		x: "4",
		y: "8",
		rx: "2",
		key: "enze0r"
	}],
	["path", {
		d: "M2 14h2",
		key: "vft8re"
	}],
	["path", {
		d: "M20 14h2",
		key: "4cs60a"
	}],
	["path", {
		d: "M15 13v2",
		key: "1xurst"
	}],
	["path", {
		d: "M9 13v2",
		key: "rq6x2g"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var BriefcaseBusiness = createLucideIcon("briefcase-business", [
	["path", {
		d: "M12 12h.01",
		key: "1mp3jc"
	}],
	["path", {
		d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
		key: "1ksdt3"
	}],
	["path", {
		d: "M22 13a18.15 18.15 0 0 1-20 0",
		key: "12hx5q"
	}],
	["rect", {
		width: "20",
		height: "14",
		x: "2",
		y: "6",
		rx: "2",
		key: "i6l2r4"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Calculator = createLucideIcon("calculator", [
	["rect", {
		width: "16",
		height: "20",
		x: "4",
		y: "2",
		rx: "2",
		key: "1nb95v"
	}],
	["line", {
		x1: "8",
		x2: "16",
		y1: "6",
		y2: "6",
		key: "x4nwl0"
	}],
	["line", {
		x1: "16",
		x2: "16",
		y1: "14",
		y2: "18",
		key: "wjye3r"
	}],
	["path", {
		d: "M16 10h.01",
		key: "1m94wz"
	}],
	["path", {
		d: "M12 10h.01",
		key: "1nrarc"
	}],
	["path", {
		d: "M8 10h.01",
		key: "19clt8"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CalendarClock = createLucideIcon("calendar-clock", [
	["path", {
		d: "M16 14v2.2l1.6 1",
		key: "fo4ql5"
	}],
	["path", {
		d: "M16 2v3",
		key: "otl347"
	}],
	["path", {
		d: "M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338",
		key: "7hb8p4"
	}],
	["path", {
		d: "M3 9h5.859",
		key: "numkqi"
	}],
	["path", {
		d: "M8 2v3",
		key: "1ioesn"
	}],
	["circle", {
		cx: "16",
		cy: "16",
		r: "6",
		key: "qoo3c4"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FileCheckCorner = createLucideIcon("file-check-corner", [
	["path", {
		d: "M10.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6",
		key: "g5mvt7"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["path", {
		d: "m14 20 2 2 4-4",
		key: "15kota"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FolderLock = createLucideIcon("folder-lock", [
	["rect", {
		width: "8",
		height: "5",
		x: "14",
		y: "17",
		rx: "1",
		key: "19aais"
	}],
	["path", {
		d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
		key: "1w6v7t"
	}],
	["path", {
		d: "M20 17v-2a2 2 0 1 0-4 0v2",
		key: "pwaxnr"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Headphones = createLucideIcon("headphones", [["path", {
	d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
	key: "1xhozi"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Landmark = createLucideIcon("landmark", [
	["path", {
		d: "M10 18v-7",
		key: "wt116b"
	}],
	["path", {
		d: "M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z",
		key: "yxxwt6"
	}],
	["path", {
		d: "M14 18v-7",
		key: "vav6t3"
	}],
	["path", {
		d: "M18 18v-7",
		key: "aexdmj"
	}],
	["path", {
		d: "M3 22h18",
		key: "8prr45"
	}],
	["path", {
		d: "M6 18v-7",
		key: "1ivflk"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LayoutDashboard = createLucideIcon("layout-dashboard", [
	["rect", {
		width: "7",
		height: "9",
		x: "3",
		y: "3",
		rx: "1",
		key: "10lvy0"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "14",
		y: "3",
		rx: "1",
		key: "16une8"
	}],
	["rect", {
		width: "7",
		height: "9",
		x: "14",
		y: "12",
		rx: "1",
		key: "1hutg5"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "3",
		y: "16",
		rx: "1",
		key: "ldoo1y"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Menu = createLucideIcon("menu", [
	["path", {
		d: "M4 5h16",
		key: "1tepv9"
	}],
	["path", {
		d: "M4 12h16",
		key: "1lakjw"
	}],
	["path", {
		d: "M4 19h16",
		key: "1djgab"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Ellipsis = createLucideIcon("ellipsis", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}],
	["circle", {
		cx: "19",
		cy: "12",
		r: "1",
		key: "1wjl8i"
	}],
	["circle", {
		cx: "5",
		cy: "12",
		r: "1",
		key: "1pcz8c"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Phone = createLucideIcon("phone", [["path", {
	d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
	key: "9njp5v"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Search = createLucideIcon("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Send = createLucideIcon("send", [["path", {
	d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
	key: "1ffxy3"
}], ["path", {
	d: "m21.854 2.147-10.94 10.939",
	key: "12cjpa"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Settings = createLucideIcon("settings", [["path", {
	d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
	key: "1i5ecw"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SlidersHorizontal = createLucideIcon("sliders-horizontal", [
	["path", {
		d: "M10 5H3",
		key: "1qgfaw"
	}],
	["path", {
		d: "M12 19H3",
		key: "yhmn1j"
	}],
	["path", {
		d: "M14 3v4",
		key: "1sua03"
	}],
	["path", {
		d: "M16 17v4",
		key: "1q0r14"
	}],
	["path", {
		d: "M21 12h-9",
		key: "1o4lsq"
	}],
	["path", {
		d: "M21 19h-5",
		key: "1rlt1p"
	}],
	["path", {
		d: "M21 5h-7",
		key: "1oszz2"
	}],
	["path", {
		d: "M8 10v4",
		key: "tgpxqk"
	}],
	["path", {
		d: "M8 12H3",
		key: "a7s4jb"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sparkles = createLucideIcon("sparkles", [
	["path", {
		d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
		key: "1s2grr"
	}],
	["path", {
		d: "M20 2v4",
		key: "1rf3ol"
	}],
	["path", {
		d: "M22 4h-4",
		key: "gwowj6"
	}],
	["circle", {
		cx: "4",
		cy: "20",
		r: "2",
		key: "6kqj1y"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Target = createLucideIcon("target", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "6",
		key: "1vlfrh"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "2",
		key: "1c9p78"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TrendingUp = createLucideIcon("trending-up", [["path", {
	d: "M16 7h6v6",
	key: "box55l"
}], ["path", {
	d: "m22 7-8.5 8.5-5-5L2 17",
	key: "1t1m79"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var UserRound = createLucideIcon("user-round", [["circle", {
	cx: "12",
	cy: "8",
	r: "5",
	key: "1hypcn"
}], ["path", {
	d: "M20 21a8 8 0 0 0-16 0",
	key: "rfgkzh"
}]]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var UsersRound = createLucideIcon("users-round", [
	["path", {
		d: "M18 21a8 8 0 0 0-16 0",
		key: "3ypg7q"
	}],
	["circle", {
		cx: "10",
		cy: "8",
		r: "5",
		key: "o932ke"
	}],
	["path", {
		d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",
		key: "10s06x"
	}]
]);
/**
* @license lucide-react v1.31.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Zap = createLucideIcon("zap", [["path", {
	d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
	key: "1v7up4"
}]]);
//#endregion
//#region app/page.tsx
var buyerNav = [
	{
		key: "home",
		label: "الرئيسية",
		icon: House
	},
	{
		key: "market",
		label: "اكتشف المشاريع",
		icon: Building2
	},
	{
		key: "deal",
		label: "رحلة الصفقة",
		icon: LayoutDashboard
	},
	{
		key: "offers",
		label: "عروض التمويل",
		icon: Landmark
	},
	{
		key: "property",
		label: "العقار المحجوز",
		icon: Building2
	},
	{
		key: "documents",
		label: "مستنداتي",
		icon: FolderLock
	}
];
var salesNav = [
	{
		key: "home",
		label: "مساحة اليوم",
		icon: House
	},
	{
		key: "leads",
		label: "Mini CRM",
		icon: UsersRound
	},
	{
		key: "followups",
		label: "المتابعات",
		icon: CalendarClock
	},
	{
		key: "deal",
		label: "صفقاتي",
		icon: BriefcaseBusiness
	},
	{
		key: "calculator",
		label: "الحاسبة السريعة",
		icon: Calculator
	}
];
var bankEmployeeNav = [
	{
		key: "home",
		label: "مساحة اليوم",
		icon: House
	},
	{
		key: "applications",
		label: "الملفات الواردة",
		icon: Landmark
	},
	{
		key: "leads",
		label: "Mini CRM",
		icon: UsersRound
	},
	{
		key: "tasks",
		label: "النواقص والمهام",
		icon: FileCheckCorner
	},
	{
		key: "deal",
		label: "صفقاتي",
		icon: BriefcaseBusiness
	}
];
var developerNav = [
	{
		key: "home",
		label: "لوحة الإدارة",
		icon: LayoutDashboard
	},
	{
		key: "inventory",
		label: "المشاريع والمخزون",
		icon: Building2
	},
	{
		key: "reservations",
		label: "الحجوزات",
		icon: FileCheckCorner
	},
	{
		key: "leads",
		label: "CRM الشركة",
		icon: UsersRound
	},
	{
		key: "team",
		label: "تقارير المبيعات",
		icon: TrendingUp
	},
	{
		key: "tracking",
		label: "تتبع بيع الصفقة",
		icon: BriefcaseBusiness
	},
	{
		key: "storefront",
		label: "المتجر الإلكتروني",
		icon: House
	}
];
var bankAdminNav = [
	{
		key: "home",
		label: "لوحة الإدارة",
		icon: LayoutDashboard
	},
	{
		key: "queue",
		label: "طابور الطلبات",
		icon: Landmark
	},
	{
		key: "leads",
		label: "CRM البنك",
		icon: UsersRound
	},
	{
		key: "team",
		label: "أداء موظفي التمويل",
		icon: TrendingUp
	},
	{
		key: "tracking",
		label: "تتبع طلبات التمويل",
		icon: BriefcaseBusiness
	},
	{
		key: "rules",
		label: "سياسات البنك",
		icon: Settings
	}
];
var platformAdminNav = [
	{
		key: "home",
		label: "نظرة تشغيلية",
		icon: LayoutDashboard
	},
	{
		key: "organizations",
		label: "الجهات والمنظمات",
		icon: Building2
	},
	{
		key: "integrations",
		label: "التكاملات",
		icon: Zap
	},
	{
		key: "tracking",
		label: "الصفقات والمنصة",
		icon: BriefcaseBusiness
	},
	{
		key: "audit",
		label: "التدقيق والامتثال",
		icon: ShieldCheck
	},
	{
		key: "rules",
		label: "الإعدادات والفوترة",
		icon: Settings
	}
];
var roleMeta = {
	buyer: {
		label: "لوحة العميل",
		subtitle: "رحلة تملكك في مكان واحد",
		name: "عباس السالم",
		initials: "ع"
	},
	sales: {
		label: "بوابة موظف مبيعات العقار",
		subtitle: "مساحة عمل المبيعات",
		name: "نورة العتيبي",
		initials: "ن"
	},
	developer: {
		label: "بوابة إدارة المطور العقاري",
		subtitle: "إدارة المشاريع والفريق",
		name: "مدير تلال العقارية",
		initials: "ت"
	},
	bankEmployee: {
		label: "بوابة موظف مبيعات البنك",
		subtitle: "ملفات التمويل المسندة",
		name: "فيصل الشهري",
		initials: "ف"
	},
	bankAdmin: {
		label: "بوابة إدارة البنك",
		subtitle: "الفريق والسياسات والأحمال",
		name: "مدير مصرف الراجحي",
		initials: "ر"
	},
	platformAdmin: {
		label: "إدارة منصة ديل لاين",
		subtitle: "التشغيل والتكاملات والامتثال",
		name: "إدارة المنصة",
		initials: "ح"
	}
};
var scopeAdditions = [
	"5.1 العميل/المشتري: يمكن للعميل التواصل مع البنك بعد اختيار الوحدة المطابقة.",
	"5.2 موظف مبيعات المطور: يمكنه التواصل والتنسيق مع موظف البنك عبر محادثة آمنة في حال حجز عميله واختياره للبنك لتقديم الدعم والمتابعة، ويظهر زر «متاح الآن» لاستقبال الطلبات له كما لدى موظف مبيعات البنك.",
	"5.4 موظف الجهة التمويلية: لديه Mini CRM خاص به، ويمكنه التواصل مع موظف مبيعات العقار عبر محادثة في نفس طلب العميل عند الحاجة إلى معلومات أو دعم للصفقة من الجهة العقارية."
];
var journey = [
	{
		label: "تأكيد الهوية",
		meta: "مكتمل",
		done: true
	},
	{
		label: "حجز الوحدة",
		meta: "مكتمل",
		done: true
	},
	{
		label: "طلب التمويل",
		meta: "مكتمل",
		done: true
	},
	{
		label: "مقارنة العروض",
		meta: "أنت هنا",
		active: true
	},
	{
		label: "العقد",
		meta: "الخطوة التالية"
	},
	{
		label: "اكتمال الصفقة",
		meta: "—"
	}
];
var offers = [
	{
		bank: "مصرف الراجحي",
		mark: "ر",
		payment: "7,840",
		term: "25 سنة",
		down: "150,000 ر.س",
		color: "#0a8b78",
		rate: "نسبة سنوية تجريبية 4.18%"
	},
	{
		bank: "البنك الأهلي السعودي",
		mark: "أ",
		payment: "8,120",
		term: "20 سنة",
		down: "135,000 ر.س",
		color: "#196947",
		rate: "نسبة سنوية تجريبية 4.34%"
	},
	{
		bank: "مصرف الإنماء",
		mark: "إ",
		payment: "7,960",
		term: "25 سنة",
		down: "165,000 ر.س",
		color: "#7b5648",
		rate: "نسبة سنوية تجريبية 4.25%"
	}
];
var leadSeed = [
	{
		id: "LD-1842",
		name: "سلمان العتيبي",
		initials: "سع",
		project: "روابي الخبر",
		unit: "A-204",
		status: "متابعة اليوم",
		tone: "urgent",
		source: "المتجر",
		last: "قبل 18 دقيقة",
		next: "تأكيد موعد زيارة المعرض",
		sla: "متبقي 42 دقيقة",
		phone: "05•• ••• 2841",
		note: "مهتم بوحدة زاوية ويرغب بزيارة بعد الدوام.",
		eligibility: "ملخص أهلية مبدئي متاح",
		eligible: true
	},
	{
		id: "LD-1839",
		name: "نجلاء القحطاني",
		initials: "نق",
		project: "تلال الواجهة",
		unit: "T-118",
		status: "عميل مؤهل",
		tone: "qualified",
		source: "معرض الظهران",
		last: "قبل ساعة",
		next: "اختيار الوحدة المناسبة",
		sla: "ضمن الوقت",
		phone: "05•• ••• 9175",
		note: "تفضّل الدور الأرضي وتحتاج مساحة لا تقل عن 220م².",
		eligibility: "ملخص أهلية مبدئي متاح",
		eligible: true
	},
	{
		id: "LD-1835",
		name: "محمد الدوسري",
		initials: "مد",
		project: "واحة الدمام",
		unit: "لم يحدد",
		status: "بانتظار رد العميل",
		tone: "waiting",
		source: "إحالة",
		last: "أمس، 7:40 م",
		next: "إعادة التواصل الساعة 4:00 م",
		sla: "متبقي 3 ساعات",
		phone: "05•• ••• 5032",
		note: "يبحث عن تاون هاوس قريب من الخدمات.",
		eligibility: "لم يبدأ التحقق المبدئي",
		eligible: false
	},
	{
		id: "LD-1827",
		name: "ريم الشمري",
		initials: "رش",
		project: "روابي الخبر",
		unit: "B-311",
		status: "جديد",
		tone: "new",
		source: "حملة رقمية",
		last: "قبل 6 دقائق",
		next: "أول اتصال",
		sla: "متبقي 54 دقيقة",
		phone: "05•• ••• 6628",
		note: "سجلت اهتمامها من صفحة المشروع.",
		eligibility: "لم يبدأ التحقق المبدئي",
		eligible: false
	}
];
function HomePage() {
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	const [welcomeOpen, setWelcomeOpen] = (0, import_react.useState)(true);
	const [walletOpen, setWalletOpen] = (0, import_react.useState)(false);
	const [savedUnits, setSavedUnits] = (0, import_react.useState)([]);
	const toggleSavedUnit = (unit) => setSavedUnits((items) => items.includes(unit) ? items.filter((id) => id !== unit) : [...items, unit]);
	const [propertyInquiry, setPropertyInquiry] = (0, import_react.useState)(null);
	const [nafathPending, setNafathPending] = (0, import_react.useState)(false);
	const [role, setRole] = (0, import_react.useState)("buyer");
	const [activeNav, setActiveNav] = (0, import_react.useState)("home");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [chatOpen, setChatOpen] = (0, import_react.useState)(false);
	const [noticeOpen, setNoticeOpen] = (0, import_react.useState)(false);
	const [uploaded, setUploaded] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)("");
	const [operationPreview, setOperationPreview] = (0, import_react.useState)(null);
	const [selectedLead, setSelectedLead] = (0, import_react.useState)(leadSeed[0]);
	const [leadDrawer, setLeadDrawer] = (0, import_react.useState)(false);
	const [calculatorOpen, setCalculatorOpen] = (0, import_react.useState)(false);
	const [qualified, setQualified] = (0, import_react.useState)(["LD-1839"]);
	const [sharedCalc, setSharedCalc] = (0, import_react.useState)("pending");
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [selectedOffer, setSelectedOffer] = (0, import_react.useState)(null);
	const [availableNow, setAvailableNow] = (0, import_react.useState)(true);
	const navItems = role === "buyer" ? buyerNav : role === "sales" ? salesNav : role === "developer" ? developerNav : role === "bankEmployee" ? bankEmployeeNav : role === "bankAdmin" ? bankAdminNav : platformAdminNav;
	const meta = roleMeta[role];
	const chatEnabled = role === "buyer" || role === "sales" || role === "bankEmployee";
	const title = (0, import_react.useMemo)(() => navItems.find((item) => item.key === activeNav)?.label ?? "الرئيسية", [activeNav, navItems]);
	const showToast = (message) => {
		if (/^تم فتح|^تقرير SLA:|^جهّزنا نموذج|^تم تجهيز|^سجلنا طلب اتصال/.test(message)) {
			setOperationPreview(message.replace(/^تم فتح|^تم تجهيز|^جهّزنا/, "معاينة"));
			return;
		}
		setToast(message);
		window.setTimeout(() => setToast(""), 2800);
	};
	const navigate = (key) => {
		setActiveNav(key);
		setSidebarOpen(false);
		if (key === "calculator" && role === "sales") setCalculatorOpen(true);
		const target = (role === "developer" || role === "bankAdmin") && (key === "team" || key === "tracking") ? "operations" : key === "home" ? "top" : key;
		window.setTimeout(() => document.getElementById(target)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}), 40);
	};
	const openLead = (lead) => {
		setSelectedLead(lead);
		setLeadDrawer(true);
	};
	const openDetail = (kind, id) => setDetail({
		kind,
		id
	});
	const searchResults = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [];
		const projectResults = projects.filter((p) => `${p.name} ${p.city} ${p.type}`.toLowerCase().includes(q)).map((p) => ({
			label: p.name,
			meta: `${p.city} • ${p.type}`,
			run: () => openDetail("project", p.name)
		}));
		const offerResults = role === "buyer" ? offers.filter((o) => o.bank.toLowerCase().includes(q)).map((o) => ({
			label: o.bank,
			meta: `عرض تمويلي • ${o.payment} ر.س`,
			run: () => openDetail("offer", o.bank)
		})) : [];
		const leadResults = role === "sales" ? leadSeed.filter((l) => `${l.name} ${l.project} ${l.unit} ${l.id}`.toLowerCase().includes(q)).map((l) => ({
			label: l.name,
			meta: `${l.project} • ${l.unit}`,
			run: () => openLead(l)
		})) : [];
		const bankResults = role === "bankEmployee" || role === "bankAdmin" ? financeApplications.filter((item) => `${item.name} ${item.project} ${item.unit} ${item.id}`.toLowerCase().includes(q)).map((item) => ({
			label: item.name,
			meta: `${item.id} • ${item.stage}`,
			run: () => openDetail("deal", item.name)
		})) : [];
		return [
			...projectResults,
			...offerResults,
			...leadResults,
			...bankResults
		].slice(0, 6);
	}, [searchQuery, role]);
	if (welcomeOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomePage, {
		returning: signedIn,
		enter: () => {
			setWelcomeOpen(false);
			setDetail(null);
			window.scrollTo({
				top: 0,
				behavior: "instant"
			});
		},
		browse: () => document.getElementById("market")?.scrollIntoView({ behavior: "smooth" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectMarketplace, {
			navigate: () => document.getElementById("market")?.scrollIntoView({ behavior: "smooth" }),
			openDetail
		})
	}), detail?.kind === "project" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceDialog, {
		title: detail.id ?? "تفاصيل العقار",
		close: () => setDetail(null),
		wide: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyDetails, {
			savedUnits,
			toggleSaved: toggleSavedUnit,
			project: projects.find((p) => p.name === detail.id) ?? projects[0],
			isVisitor: !signedIn,
			contact: (unit) => {
				setPropertyInquiry({
					name: detail.id ?? projects[0].name,
					unit
				});
				setDetail(null);
				setWelcomeOpen(false);
				if (signedIn) setChatOpen(true);
				window.scrollTo({
					top: 0,
					behavior: "instant"
				});
			}
		}, detail.id)
	})] });
	if (!signedIn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalLogin, {
		welcome: () => setWelcomeOpen(true),
		pending: nafathPending,
		begin: () => setNafathPending(true),
		complete: () => {
			setSignedIn(true);
			setRole("buyer");
			setActiveNav("home");
			if (propertyInquiry) setChatOpen(true);
		},
		portal: (next) => {
			setSignedIn(true);
			setRole(next);
			setAvailableNow(true);
			setNoticeOpen(false);
			setToast("");
			setOperationPreview(null);
			setActiveNav("home");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpatialSurface, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `app-shell ${role !== "buyer" ? "sales-mode" : ""}`,
		"data-portal": role,
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mobile-overlay ${sidebarOpen ? "show" : ""}`,
				onClick: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `sidebar ${sidebarOpen ? "open" : ""}`,
				"aria-label": "التنقل الرئيسي",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "brand-mark",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "د" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ديل لاين" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: meta.subtitle })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "icon-button close-sidebar",
								onClick: () => setSidebarOpen(false),
								"aria-label": "إغلاق القائمة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "profile-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "avatar",
								children: meta.initials
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "profile-copy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: meta.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: meta.name })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "more-button",
								"aria-label": "خيارات الحساب",
								onClick: () => openDetail("account"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { size: 20 })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "main-nav",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "nav-label",
								children: role === "buyer" ? "حسابي" : "عملي"
							}),
							navItems.map(({ key, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: activeNav === key ? "active" : "",
								onClick: () => navigate(key),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									size: 19,
									strokeWidth: 1.9
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
							}, key)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "nav-label second",
								children: "المساعدة"
							}),
							role === "buyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setWelcomeOpen(true);
									window.scrollTo({
										top: 0,
										behavior: "instant"
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعرّف على ديل لاين" })]
							}),
							chatEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setChatOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المحادثات" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => openDetail("scope"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافات نطاق المشروع" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => openDetail("support"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الدعم والمساعدة" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sidebar-trust",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 20 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: role === "buyer" ? "بياناتك محمية" : "وصول حسب الصلاحية" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: role === "buyer" ? "لا نشاركها دون موافقتك" : role === "sales" || role === "bankEmployee" ? "ترى فقط الطلبات المسندة لك" : role === "developer" ? "بيانات شركة المطور وفريقها فقط" : role === "bankAdmin" ? "بيانات البنك وفريقه فقط" : "وصول تشغيلي مقيد ومسجل" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sidebar-footer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setSignedIn(false);
								setChatOpen(false);
								setNoticeOpen(false);
								setWalletOpen(false);
								setSavedUnits([]);
								setPropertyInquiry(null);
								setDetail(null);
								setAiOpen(false);
								setLeadDrawer(false);
								setCalculatorOpen(false);
								setSearchQuery("");
								setSearchOpen(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 17 }), " تسجيل الخروج"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نسخة تفاعلية تجريبية" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "workspace",
				id: "top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "topbar",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "topbar-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-button menu-button",
									onClick: () => setSidebarOpen(true),
									"aria-label": "فتح القائمة",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 22 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: meta.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: title })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "topbar-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "global-search",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "search-box",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												"aria-label": "بحث",
												value: searchQuery,
												onFocus: () => setSearchOpen(true),
												onChange: (event) => {
													setSearchQuery(event.target.value);
													setSearchOpen(true);
												},
												placeholder: role === "buyer" ? "ابحث في المشاريع والعروض..." : "ابحث باسم العميل أو الوحدة..."
											})]
										}), searchOpen && searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "search-results",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نتائج البحث" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setSearchOpen(false),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 15 })
											})] }), searchResults.length ? searchResults.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													result.run();
													setSearchOpen(false);
													setSearchQuery("");
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 16 }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: result.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: result.meta })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
												]
											}, `${result.label}-${result.meta}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ما لقينا نتيجة مطابقة. جرّب اسم مشروع، بنك، عميل أو وحدة." })]
										})]
									}),
									(role === "sales" || role === "bankEmployee") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "icon-button wallet-top-button",
										title: "المحفظة",
										"aria-label": "فتح المحفظة",
										onClick: () => setWalletOpen(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 22 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المحفظة" })]
									}),
									chatEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "icon-button chat-top-button",
										"aria-label": "المحادثات",
										onClick: () => setChatOpen(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 20 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "icon-button notification-button",
										"aria-label": "الإشعارات",
										onClick: () => setNoticeOpen(!noticeOpen),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 20 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "help-button",
										onClick: () => role === "sales" ? setCalculatorOpen(true) : chatEnabled ? setChatOpen(true) : openDetail("support"),
										children: [role === "sales" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { size: 18 }) : chatEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: role === "sales" ? "حسبة سريعة" : chatEnabled ? "فتح المحادثة" : "الدعم" })]
									})
								]
							}),
							noticeOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notifications, {
								role,
								close: () => setNoticeOpen(false),
								openDetail: (id) => {
									setNoticeOpen(false);
									openDetail("notification", id);
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "demo-environment",
						role: "status",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 17 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "بيئة تجريبية" }), " · بيانات توضيحية. نفاذ والبنوك والمدفوعات غير متصلة بخدمات حقيقية."] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "portal-stage",
						children: role === "buyer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyerDashboard, {
							uploaded,
							setUploaded,
							showToast,
							navigate,
							openChat: () => setChatOpen(true),
							sharedCalc,
							approveCalc: () => {
								setSharedCalc("approved");
								showToast("تمت الموافقة التجريبية وربط الحسبة داخل الجلسة");
							},
							openAi: () => setAiOpen(true),
							openDetail,
							selectedOffer
						}) : role === "sales" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesDashboard, {
							openLead,
							openCalculator: () => setCalculatorOpen(true),
							showToast,
							qualified,
							openDetail,
							openChat: () => setChatOpen(true),
							available: availableNow,
							toggleAvailable: () => setAvailableNow((value) => !value)
						}) : role === "developer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeveloperAdminDashboard, {
							activeNav,
							showToast,
							openDetail
						}) : role === "bankEmployee" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankDashboard, {
							showToast,
							openChat: () => setChatOpen(true),
							openDetail,
							available: availableNow,
							toggleAvailable: () => setAvailableNow((value) => !value)
						}) : role === "bankAdmin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankAdminDashboard, {
							activeNav,
							showToast,
							openDetail
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformAdminDashboard, {
							showToast,
							openDetail
						})
					}, role)
				]
			}),
			role === "buyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyerChat, {
				projectContext: propertyInquiry,
				open: chatOpen,
				close: () => setChatOpen(false),
				showToast
			}, propertyInquiry ? `${propertyInquiry.name}-${propertyInquiry.unit}` : "default"),
			role === "sales" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesChat, {
				open: chatOpen,
				close: () => setChatOpen(false),
				showToast
			}),
			role === "bankEmployee" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankChat, {
				open: chatOpen,
				close: () => setChatOpen(false),
				showToast
			}),
			role === "sales" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadDrawer, {
				lead: selectedLead,
				open: leadDrawer,
				close: () => setLeadDrawer(false),
				qualified: qualified.includes(selectedLead.id),
				onQualify: () => {
					setQualified((items) => [...new Set([...items, selectedLead.id])]);
					showToast("تم تحديث الحالة إلى عميل مؤهل");
				},
				openChat: () => {
					setLeadDrawer(false);
					setChatOpen(true);
				},
				showToast
			}),
			role === "sales" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickCalculator, {
				open: calculatorOpen,
				close: () => setCalculatorOpen(false),
				showToast,
				onShare: () => setSharedCalc("pending")
			}),
			role === "buyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiAssistant, {
				open: aiOpen,
				close: () => setAiOpen(false),
				showToast
			}),
			walletOpen && (role === "sales" || role === "bankEmployee") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceDialog, {
				title: "محفظتي",
				close: () => setWalletOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletPanel, { bank: role === "bankEmployee" })
			}),
			detail?.kind === "project" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceDialog, {
				title: detail.id ?? "تفاصيل العقار",
				close: () => setDetail(null),
				wide: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyDetails, {
					savedUnits,
					toggleSaved: toggleSavedUnit,
					project: projects.find((p) => p.name === detail.id) ?? projects[0],
					contact: role === "buyer" ? (unit) => {
						setPropertyInquiry({
							name: detail.id ?? projects[0].name,
							unit
						});
						setDetail(null);
						setChatOpen(true);
					} : void 0
				}, detail.id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailModal, {
				role,
				logout: () => {
					setSignedIn(false);
					setDetail(null);
					setChatOpen(false);
					setWalletOpen(false);
					setNoticeOpen(false);
					setSearchQuery("");
				},
				detail: detail?.kind === "project" ? null : detail,
				close: () => setDetail(null),
				openChat: () => {
					setDetail(null);
					setChatOpen(true);
				},
				showToast,
				selectedOffer,
				selectOffer: (bank) => {
					setSelectedOffer(bank);
					showToast(`حفظنا ${bank} كخيارك للمراجعة`);
				}
			}),
			role === "buyer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "ai-fab",
				onClick: () => setAiOpen(true),
				"aria-label": "افتح مساعد ديل لاين الذكي",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اسأل ديل لاين" })]
			}),
			operationPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceDialog, {
				title: operationPreview,
				close: () => setOperationPreview(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "operation-preview",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 32 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "هذه العملية تحتاج ربطًا تشغيليًا" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الواجهة تعرض النموذج التجريبي فقط. لا توجد بيانات مباشرة أو خدمة خارجية متصلة بهذا الإجراء، ولم يتم إرسال طلب أو تغيير بيانات في جهة أخرى." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "ghost-action",
							onClick: () => setOperationPreview(null),
							children: "رجوع للبوابة"
						})
					]
				})
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toast",
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 19 }), toast]
			})
		]
	}) });
}
function PortalLogin({ pending, begin, complete, portal, welcome }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpatialSurface, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "login-shell",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "login-story",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "login-brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "brand-mark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "د" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ديل لاين" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "story-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "login-kicker",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 15 }), " تملك بيتك بوضوح"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"من أول حسبة",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"إلى مفتاح بيتك."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "مشاريع، حسبة تمويل، عروض ومتابعة الصفقة—كلها في تجربة سعودية واحدة، سهلة وواضحة." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "story-cards",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 20 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "خصوصية من البداية" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "أنت تحدد وش توافق عليه ومين يشوفه." })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 20 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "خطوتك واضحة" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نعلمك وين وصلت وش المطلوب منك." })
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "login-orbit orbit-one" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "login-orbit orbit-two" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "login-panel",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "login-box portal-login-box",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "back-to-welcome",
						onClick: welcome,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 17 }), " تعرّف على ديل لاين واستكشف العقارات"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "client-login-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "nafath-symbol",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { size: 29 })
						}), !pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow",
									children: "دخول العميل المستقل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "بوابة العميل" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الدخول عبر نفاذ للوصول إلى العقارات والحسبة والطلب والمستندات." })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "nafath-button",
								onClick: begin,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { size: 20 }),
									" تجربة دخول العميل ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 18 })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "login-assurance",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 15 }), " لا يمكن الانتقال من حساب العميل إلى بوابات الجهات"]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow",
									children: "بانتظار موافقتك"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "محاكاة التحقق عبر نفاذ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "هذه محاكاة للعرض؛ لا يوجد طلب حقيقي في تطبيق نفاذ." })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "nafath-code",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "رمز التحقق" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "47" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " رمز عرض ثابت · لا يوجد طلب توثيق حقيقي"] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "nafath-button",
								onClick: complete,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 20 }), " متابعة التجربة كعميل"]
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "portal-divider",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بوابات الجهات والموظفين — دخول مستقل حسب الصلاحية" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "portal-login-grid",
						children: [
							{
								role: "sales",
								icon: UserRound,
								title: "موظف مبيعات العقار",
								copy: "عملائي، الحاسبة السريعة وصفقاتي"
							},
							{
								role: "developer",
								icon: Building2,
								title: "إدارة المطور العقاري",
								copy: "المشاريع، المخزون، CRM والفريق"
							},
							{
								role: "bankEmployee",
								icon: Landmark,
								title: "موظف مبيعات البنك",
								copy: "الملفات المسندة، Mini CRM والعروض"
							},
							{
								role: "bankAdmin",
								icon: LayoutDashboard,
								title: "إدارة البنك",
								copy: "الأحمال، الموظفون والسياسات"
							},
							{
								role: "platformAdmin",
								icon: Settings,
								title: "إدارة المنصة",
								copy: "الجهات، التكاملات والامتثال"
							}
						].map(({ role, icon: Icon, title, copy }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => portal(role),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 19 }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: copy })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 17 })
							]
						}, role))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "portal-security-note",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 15 }), " كل بوابة لها صلاحياتها وبياناتها؛ لا يوجد تبديل أدوار من داخل الحساب."]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ديل لاين — منتج سعودي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نسخة تفاعلية • تكامل نفاذ غير مفعّل بعد" })] })]
		})]
	}) });
}
function Notifications({ role, close, openDetail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "notifications-popover",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الإشعارات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: close,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 17 })
		})] }), role === "sales" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("followup"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "متابعة تستحق الآن" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "سلمان العتيبي ينتظر تأكيد موعد الزيارة." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "منذ 4 دقائق" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("newLead"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon green",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "عميل جديد أُسند إليك" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ريم الشمري مهتمة بمشروع روابي الخبر." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "منذ 6 دقائق" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		})] }) : role === "bankEmployee" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("followup"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "طلب جديد بانتظار القبول" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "سلمان العتيبي • الوحدة A-208." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "منذ 3 دقائق" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("document"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon green",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "رد من موظفة المطور" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تم رفع عرض سعر الوحدة T-118." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "منذ 5 دقائق" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		})] }) : role === "buyer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("document"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مستند جديد مطلوب" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ارفع كشف الحساب لاستكمال مراجعة الطلب." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "منذ 12 دقيقة" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("newOffer"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon green",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "وصل عرض تمويلي جديد" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "لديك الآن 3 عروض جاهزة للمقارنة." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "اليوم، 10:42 ص" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("management"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "تنبيه إداري جديد" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "يوجد إجراء يحتاج مراجعة ضمن صلاحيات بوابتك." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "منذ 8 دقائق" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "notice-row",
			onClick: () => openDetail("managementReport"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "notice-icon green",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "اكتمل التقرير اليومي" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ملخص الأداء وSLA جاهز للمراجعة." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "اليوم، 11:00 ص" })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
			]
		})] })]
	});
}
function SalesDashboard({ openLead, openCalculator, showToast, qualified, openDetail, openChat, available, toggleAvailable }) {
	const reservedLeadCount = leadSeed.filter((lead) => [
		"نجلاء القحطاني",
		"عبدالله الحربي",
		"مشاعل الغامدي"
	].includes(lead.name)).length;
	const [crmFilter, setCrmFilter] = (0, import_react.useState)("الكل");
	const [crmQuery, setCrmQuery] = (0, import_react.useState)("");
	const crmLeads = leadSeed.filter((lead) => {
		const matchesQuery = `${lead.name} ${lead.project} ${lead.unit} ${lead.id}`.includes(crmQuery.trim());
		const currentStatus = qualified.includes(lead.id) ? "مؤهل" : lead.tone === "urgent" ? "متابعة اليوم" : lead.tone === "waiting" ? "بانتظار العميل" : "جديد";
		return matchesQuery && (crmFilter === "الكل" || crmFilter === currentStatus);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "content-wrap sales-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-row sales-welcome",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), " صباح الخير يا نورة"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "فرصك اليوم، أقرب للإغلاق." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "رتبنا العملاء حسب الوقت والأولوية. ابدئي بالأعلى، والباقي تحت السيطرة." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: `shift-status availability-toggle ${available ? "online" : "offline"}`,
					onClick: toggleAvailable,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						" ",
						available ? "متاحة الآن لاستقبال الطلبات" : "غير متاحة لاستقبال الطلبات"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: available ? "اضغطي لإيقاف الاستقبال" : "اضغطي لتفعيل الاستقبال" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sales-kpis",
				"aria-label": "ملخص الأداء اليومي",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => openDetail("performance", "followups"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon coral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "متابعات اليوم" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "2 خلال ساعة" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setCrmFilter("الكل");
							document.getElementById("leads")?.scrollIntoView({ behavior: "smooth" });
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon mint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "عملاء مسندون" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: leadSeed.length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "حسب قائمة العملاء" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setCrmFilter("مؤهل");
							document.getElementById("leads")?.scrollIntoView({ behavior: "smooth" });
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon blue",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "عملاء مؤهلون" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: qualified.length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [Math.round(qualified.length / leadSeed.length * 100), "% من النشطين"] })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => openDetail("performance", "reservations"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حجوزات نشطة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "لا توجد حجوزات متعثرة" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "focus-card",
				id: "followups",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "focus-top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "focus-mark",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 20 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow",
							children: "ابدئي من هنا"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "تأكيد زيارة سلمان للمعرض" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "موعد المتابعة يستحق خلال 42 دقيقة • مشروع روابي الخبر" })
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "sla-chip urgent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 14 }), " متبقي 42 دقيقة"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "focus-person",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lead-avatar",
							children: "سع"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "سلمان العتيبي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "آخر تواصل قبل 18 دقيقة • مهتم بالوحدة A-204" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "ghost-action",
							onClick: () => openLead(leadSeed[0]),
							children: "فتح الملف"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "primary-action",
							onClick: () => showToast("تم تسجيل محاولة التواصل في النشاط"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 17 }), " تسجيل اتصال"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sales-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel lead-queue sales-mini-crm",
					id: "leads",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "eyebrow",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 14 }), " خاص بعملائك المسندين"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Mini CRM موظف المبيعات" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "إدارة العميل والاهتمام والمتابعة والخطوة التالية من سجل واحد" })
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => showToast("تم تحديث ترتيب الأولويات ومواعيد المتابعة"),
								children: "تحديث القائمة"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mini-crm-toolbar",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "بحث داخل Mini CRM",
								value: crmQuery,
								onChange: (event) => setCrmQuery(event.target.value),
								placeholder: "اسم العميل، المشروع أو الوحدة"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [
								"الكل",
								"جديد",
								"متابعة اليوم",
								"مؤهل",
								"بانتظار العميل"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: crmFilter === item ? "active" : "",
								onClick: () => setCrmFilter(item),
								children: item
							}, item)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mini-crm-summary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setCrmFilter("الكل"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: leadSeed.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "كل العملاء" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setCrmFilter("متابعة اليوم"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: leadSeed.filter((lead) => lead.tone === "urgent").length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "متابعة اليوم" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setCrmFilter("مؤهل"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: qualified.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مؤهلون" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setCrmFilter("بانتظار العميل"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: leadSeed.filter((lead) => lead.tone === "waiting").length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بانتظار رد" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lead-list",
							children: [crmLeads.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "lead-row",
								onClick: () => openLead(lead),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "lead-avatar",
										children: lead.initials
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "lead-identity",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lead.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											lead.project,
											" • ",
											lead.unit
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `status-pill ${qualified.includes(lead.id) ? "qualified" : lead.tone}`,
										children: qualified.includes(lead.id) ? "عميل مؤهل" : lead.status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "lead-next",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الإجراء التالي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lead.next })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `lead-sla ${lead.tone === "urgent" ? "urgent" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 13 }),
											" ",
											lead.sla
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
								]
							}, lead.id)), !crmLeads.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "crm-empty",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 21 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ما فيه عملاء مطابقين" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "غيّر الفلتر أو كلمة البحث." })
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sales-side",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "panel pulse-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "panel-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "نبض مسارك" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "من العملاء المسندين لك فقط" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 19 })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "funnel",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: leadSeed.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "نشط" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: qualified.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "مؤهل" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: reservedLeadCount }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حجز" })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "progress-label",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "التحويل إلى حجز" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [Math.round(reservedLeadCount / leadSeed.length * 100), "%"] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "progress-track",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${reservedLeadCount / leadSeed.length * 100}%` } })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "privacy-copy",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 15 }), " تظهر لك حالة الأهلية المختصرة فقط، دون الدخل أو الالتزامات أو عروض البنوك."]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "calculator-launch",
							id: "calculator",
							onClick: openCalculator,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { size: 23 }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "للعميل أمامك الآن" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "افتح الحاسبة السريعة" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "نتيجة مبدئية خلال أقل من دقيقة" })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 20 })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "panel reservation-mini",
							id: "deal",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "panel-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "الصفقات النشطة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "آخر حالة تشغيلية" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("activeDeal", "نجلاء القحطاني"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "deal-dot green" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نجلاء القحطاني" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الحجز مؤكد • اختيار التمويل" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ضمن الوقت" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("activeDeal", "عبدالله الحربي"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "deal-dot amber" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "عبدالله الحربي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "بانتظار مستند من العميل" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "متبقي 5 س" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("activeDeal", "مشاعل الغامدي"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "deal-dot blue" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مشاعل الغامدي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "مرحلة التعاقد" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "محدثة اليوم" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "bank-coordination",
									onClick: openChat,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "deal-dot green" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "تنسيق مع موظف البنك" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "صفقة نجلاء • مصرف الراجحي" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "محادثة آمنة" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 15 })
									]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 ديل لاين" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("privacy", "privacy"),
						children: "الخصوصية"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("privacy", "access"),
						children: "سياسة الوصول"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("support"),
						children: "الدعم"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "saudi",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " صُممت في السعودية"]
				})
			] })
		]
	});
}
var financeApplications = [
	{
		id: "FN-2841",
		name: "نجلاء القحطاني",
		project: "تلال الواجهة",
		unit: "T-118",
		stage: "مراجعة المستندات",
		sla: "متبقي 1:20 س",
		status: "urgent"
	},
	{
		id: "FN-2838",
		name: "عباس السالم",
		project: "روابي الخبر",
		unit: "A-204",
		stage: "بانتظار مستند",
		sla: "متبقي 5 ساعات",
		status: "waiting"
	},
	{
		id: "FN-2829",
		name: "مشاعل الغامدي",
		project: "واحة الدمام",
		unit: "B-311",
		stage: "العرض جاهز",
		sla: "ضمن الوقت",
		status: "qualified"
	},
	{
		id: "FN-2824",
		name: "سلمان العتيبي",
		project: "روابي الخبر",
		unit: "A-208",
		stage: "طلب جديد",
		sla: "متبقي 36 دقيقة",
		status: "new"
	}
];
function BankDashboard({ showToast, openChat, openDetail, available, toggleAvailable }) {
	const [filter, setFilter] = (0, import_react.useState)("الكل");
	const [applications, setApplications] = (0, import_react.useState)(financeApplications);
	const [activeApplicationId, setActiveApplicationId] = (0, import_react.useState)(financeApplications[0].id);
	const activeApplication = applications.find((item) => item.id === activeApplicationId) ?? applications[0];
	const applicationStage = activeApplication.stage;
	const setApplicationStage = (stage) => setApplications((items) => items.map((item) => item.id === activeApplicationId ? {
		...item,
		stage
	} : item));
	const shown = applications.filter((item) => filter === "الكل" || item.stage === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "content-wrap sales-content bank-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-row sales-welcome",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 14 }), " صباح الخير يا فيصل"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "كل طلب أقرب لخطوته الجاية." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mini CRM يجمع الطلب والمستندات والـSLA والتنسيق العقاري في نفس سجل العميل." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: `shift-status availability-toggle ${available ? "online" : "offline"}`,
					onClick: toggleAvailable,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						" ",
						available ? "متاح الآن لاستقبال الطلبات" : "غير متاح لاستقبال الطلبات"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: available ? "اضغط لإيقاف الإسناد الجديد" : "اضغط لتفعيل الإسناد" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sales-kpis",
				"aria-label": "ملخص طلبات التمويل",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilter("الكل"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon mint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "طلبات نشطة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: applications.length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "طلبات النموذج المسندة لك" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilter("طلب جديد"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon blue",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "طلبات جديدة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: applications.filter((a) => a.stage === "طلب جديد").length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "حسب سجل الطلبات" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilter("بانتظار مستند"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon coral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "نواقص معلقة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: applications.filter((a) => a.stage === "بانتظار مستند").length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "تحتاج مستندًا إضافيًا" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilter("العرض جاهز"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "عروض جاهزة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: applications.filter((a) => a.stage === "العرض جاهز").length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "حسب سجل الطلبات" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "focus-card bank-focus",
				id: "tasks",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "focus-top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "focus-mark",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 20 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow",
							children: "الأولوية الآن"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "راجع مستندات نجلاء القحطاني" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الوحدة محجوزة لدى تلال الواجهة • الموظفة العقارية نورة العتيبي" })
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "sla-chip urgent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 14 }), " متبقي 1:20 س"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "focus-person",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lead-avatar",
							children: "نق"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "FN-2841 • الوحدة T-118" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "آخر تحديث قبل 12 دقيقة • 4 من 5 مستندات مكتملة" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "ghost-action",
							onClick: openChat,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 17 }), " تواصل مع المطور"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "primary-action",
							onClick: () => {
								setApplicationStage("العرض جاهز");
								showToast("تم تحديث الطلب إلى: العرض جاهز");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { size: 17 }), " إنهاء المراجعة"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bank-crm-grid",
				id: "leads",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel mini-crm",
					id: "applications",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Mini CRM التمويل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "كل طلب رسمي مرتبط بوحدة وموظف عقاري مسؤول" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "crm-filters",
							children: [
								"الكل",
								"طلب جديد",
								"بانتظار مستند",
								"العرض جاهز"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: filter === item ? "active" : "",
								onClick: () => setFilter(item),
								children: item
							}, item))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "finance-list",
						children: shown.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: activeApplication.id === item.id ? "active" : "",
							onClick: () => {
								setActiveApplicationId(item.id);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lead-avatar",
									children: item.name.slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									item.id,
									" • ",
									item.project,
									" • ",
									item.unit
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
									className: `status-pill ${item.status}`,
									children: item.stage
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: item.status === "urgent" ? "urgent-text" : "",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 13 }),
										" ",
										item.sla
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 17 })
							]
						}, item.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "panel application-inspector",
					id: "deal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "ملف الطلب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: activeApplication.id })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "status-pill qualified",
								children: applicationStage
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "application-person",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "lead-avatar large",
								children: activeApplication.name.slice(0, 2)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeApplication.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								activeApplication.project,
								" • الوحدة ",
								activeApplication.unit
							] })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => showToast("تم فتح خزنة المستندات المصرح بها"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المستندات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "4 / 5 مكتملة" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => showToast("الحسبة داخل سياسة الجهة التمويلية"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الحسبة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "7,840 ر.س شهرياً" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("deal", activeApplication.name),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المرحلة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: applicationStage })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: openChat,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الموظف العقاري" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نورة العتيبي" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "stage-select",
							id: "calculator",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحديث حالة الطلب والعرض" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: applicationStage,
								onChange: (event) => {
									setApplicationStage(event.target.value);
									showToast(`تم حفظ الحالة: ${event.target.value}`);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "طلب جديد" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "مراجعة المستندات" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بانتظار مستند" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "العرض جاهز" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "أُرسل للعميل" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "primary-action full-action",
							onClick: openChat,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 17 }), " محادثة موظف مبيعات العقار"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "privacy-copy",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 15 }), " المحادثة مرتبطة بهذا الطلب فقط، ولا تكشف CRM المطور أو عروض البنوك الأخرى."]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 ديل لاين" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("scope"),
						children: "إضافات النطاق"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("privacy", "access"),
						children: "سياسة الوصول"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("support"),
						children: "الدعم"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "saudi",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " صُممت في السعودية"]
				})
			] })
		]
	});
}
function DeveloperAdminDashboard({ activeNav, showToast, openDetail }) {
	const [inventoryFilter, setInventoryFilter] = (0, import_react.useState)("الكل");
	const [storeEnabled, setStoreEnabled] = (0, import_react.useState)(true);
	const [selectedReservation, setSelectedReservation] = (0, import_react.useState)("RSV-90172");
	const units = demoInventory;
	const shown = units.filter((unit) => inventoryFilter === "الكل" || unit.state === inventoryFilter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "content-wrap sales-content management-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-row sales-welcome",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 14 }), " إدارة تلال العقارية"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "مشاريعك وفريقك، في صورة واضحة." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "هنا تُدار المشاريع والمخزون والحجوزات والفريق وسياسات المتجر؛ بدون الدخول إلى محادثات الموظفين الخاصة." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: `shift-status availability-toggle ${storeEnabled ? "online" : "offline"}`,
					onClick: () => {
						setStoreEnabled((value) => !value);
						showToast(storeEnabled ? "تم إيقاف استقبال الاهتمامات من المتجر" : "تم تفعيل المتجر واستقبال الاهتمامات");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						" المتجر ",
						storeEnabled ? "منشور" : "متوقف"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تغيير حالة قناة البيع العامة" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sales-kpis",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setInventoryFilter("الكل"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon mint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "إجمالي الوحدات" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: units.length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [new Set(units.map((u) => u.project)).size, " مشاريع تجريبية"] })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setInventoryFilter("متاحة"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon blue",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الوحدات المتاحة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: units.filter((u) => u.state === "متاحة").length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "حسب الوحدات الظاهرة" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("reservations")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حجوزات نشطة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "حجوزات في سجل النموذج" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon coral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "فريق المبيعات" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "2 متاحين في النموذج" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "management-grid",
				id: "inventory",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel management-table",
					id: "leads",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "المشاريع والمخزون" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "مصدر الحالة الموحد للمنصة والمتجر والحجوزات وCRM الشركة" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "crm-filters",
							children: [
								"الكل",
								"متاحة",
								"محجوزة",
								"مباعة"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: inventoryFilter === item ? "active" : "",
								onClick: () => setInventoryFilter(item),
								children: item
							}, item))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "management-list",
						children: shown.map((unit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => openDetail("project", projects.find((p) => p.name.includes(unit.project) || p.name.includes(unit.project.replace("تلال الواجهة", "واجهة الدمام").replace("بيوت قمرة", "قمرة")))?.name ?? projects[0].name),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lead-avatar",
									children: unit.id.slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									unit.project,
									" • ",
									unit.id
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									unit.type,
									" • ",
									unit.inquiries,
									" اهتمام"
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
									className: `status-pill ${unit.state === "متاحة" ? "qualified" : unit.state === "محجوزة" ? "waiting" : "new"}`,
									children: unit.state
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 17 })
							]
						}, unit.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "panel",
					id: "team",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "أداء فريق المبيعات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "إنتاجية وSLA — بدون فتح محادثاتهم" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 19 })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "staff-list",
						children: [
							[
								"نورة العتيبي",
								"متاحة الآن",
								"12 عميل",
								"92%"
							],
							[
								"ماجد الشهري",
								"متاح الآن",
								"9 عملاء",
								"88%"
							],
							[
								"ريم الدوسري",
								"غير متاحة",
								"7 عملاء",
								"84%"
							]
						].map(([name, state, load, score]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => showToast(`تم فتح تقرير أداء ${name}`),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lead-avatar",
									children: name.slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									state,
									" • ",
									load
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: score })
							]
						}, name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "management-grid lower-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					id: "reservations",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "الحجوزات النشطة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "قرارات المطور فقط: تأكيد، تمديد أو إلغاء موثق" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "status-pill waiting",
								children: "3 في النموذج"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "reservation-selector",
							children: [
								"RSV-90172",
								"RSV-90168",
								"RSV-90161"
							].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: selectedReservation === id ? "active" : "",
								onClick: () => setSelectedReservation(id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: id === "RSV-90172" ? "عباس السالم • A-204" : id === "RSV-90168" ? "نجلاء القحطاني • T-118" : "مشاعل الغامدي • B-311" })]
							}, id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ghost-action",
								onClick: () => showToast(`تم تسجيل تمديد ${selectedReservation}`),
								children: "تمديد الحجز"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-action",
								onClick: () => showToast(`تم تأكيد الحجز ${selectedReservation}`),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }), " تأكيد الحجز"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					id: "storefront",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "المتجر الإلكتروني" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "إدارة العرض العام وتحويل الاهتمامات إلى CRM الشركة" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `status-pill ${storeEnabled ? "qualified" : "waiting"}`,
								children: storeEnabled ? "منشور" : "متوقف"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "store-summary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { size: 24 }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "واجهة مشاريع تلال" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الوحدات المعروضة تجريبية • لا يوجد اتصال بمخزون حي" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ghost-action",
								onClick: () => showToast("تم فتح إعدادات المتجر"),
								children: "إدارة العرض"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "primary-action",
								onClick: () => openDetail("project", projects[0].name),
								children: "معاينة المتجر"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesCommandCenter, {
				mode: "developer",
				initialView: activeNav === "tracking" ? "deals" : "performance",
				showToast
			})
		]
	});
}
function BankAdminDashboard({ activeNav, showToast, openDetail }) {
	const [autoAssign, setAutoAssign] = (0, import_react.useState)(true);
	const [assignments, setAssignments] = (0, import_react.useState)({
		"FN-2841": "فيصل الشهري",
		"FN-2838": "عمر الحربي",
		"FN-2829": "سارة الدوسري",
		"FN-2824": "فيصل الشهري"
	});
	const [assignmentReason, setAssignmentReason] = (0, import_react.useState)("");
	const [reviewed, setReviewed] = (0, import_react.useState)([]);
	const [rateDelta, setRateDelta] = (0, import_react.useState)("0.35");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "content-wrap sales-content management-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-row sales-welcome",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 14 }), " إدارة مصرف الراجحي"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "إدارة البنك تراقب وتوزّع؛ الموظف يعالج الطلب." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "هذه البوابة للفريق والأحمال والسياسات والمراجعة الإدارية، وليست Mini CRM شخصياً لموظف التمويل." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: `shift-status availability-toggle ${autoAssign ? "online" : "offline"}`,
					onClick: () => setAutoAssign((value) => !value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						" الإسناد الآلي ",
						autoAssign ? "مفعّل" : "متوقف"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المتاح الآن والأقل حملاً يستقبل الطلب" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sales-kpis",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("queue")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon mint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "طلبات تحت الإجراء" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: financeApplications.length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "طلبات النموذج الحالي" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon blue",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الموظفون المتاحون" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "2 / 3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "توفّر توضيحي للموظفين" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => openDetail("performance", "bank-sla"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "متوسط أول رد" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "8 د" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "الهدف أقل من 15 دقيقة" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon coral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "موافقات مبدئية" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "لا موافقات مصرفية حقيقية" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "management-grid",
				id: "queue",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel management-table",
					id: "leads",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "طابور الطلبات وCRM البنك" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "إعادة الإسناد داخل البنك بسبب موثق" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "status-pill waiting",
								children: [financeApplications.length - reviewed.length, " تحتاج إجراء"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "assignment-reason",
							children: ["سبب إعادة الإسناد", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "سبب إعادة الإسناد",
								placeholder: "مثال: توزيع حمل العمل",
								value: assignmentReason,
								onChange: (event) => setAssignmentReason(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "management-list",
							children: financeApplications.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "manager-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "lead-avatar",
										children: item.name.slice(0, 2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										item.id,
										" • ",
										item.stage
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										"aria-label": `موظف الطلب ${item.id}`,
										value: assignments[item.id],
										onChange: (event) => {
											if (!assignmentReason.trim()) {
												showToast("اكتب سبب إعادة الإسناد أولًا.");
												return;
											}
											setAssignments((items) => ({
												...items,
												[item.id]: event.target.value
											}));
											showToast(`إسناد تجريبي: ${item.id} إلى ${event.target.value} · السبب: ${assignmentReason}`);
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "فيصل الشهري" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "عمر الحربي" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "سارة الدوسري" })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: reviewed.includes(item.id),
										onClick: () => {
											setReviewed((items) => [...items, item.id]);
											showToast(`اعتمدت المراجعة داخل التجربة: ${item.id}`);
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }),
											" ",
											reviewed.includes(item.id) ? "مراجعة معتمدة تجريبيًا" : "اعتماد المراجعة"
										]
									})
								]
							}, item.id))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "panel",
					id: "team",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "الموظفون والأحمال" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "حالة التوفر والإنتاجية" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 19 })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "staff-list",
						children: [
							[
								"فيصل الشهري",
								"متاح",
								"3 طلبات",
								"9 د"
							],
							[
								"عمر الحربي",
								"متاح",
								"4 طلبات",
								"11 د"
							],
							[
								"سارة الدوسري",
								"غير متاحة",
								"2 طلب",
								"7 د"
							]
						].map(([name, state, load, response]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => showToast(`تقرير SLA: ${name}`),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lead-avatar",
									children: name.slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
									state,
									" • ",
									load
								] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: response })
							]
						}, name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "management-grid lower-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "ملخص رحلة التمويل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "حالة مشتركة ضمن صلاحية البنك" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 19 })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "vertical-timeline",
						children: journey.slice(1, 6).map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: index < 3 ? "done" : index === 3 ? "active" : "",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: index < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }) : index + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: step.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: index < 3 ? "مكتملة" : index === 3 ? "تحت الإجراء" : "لاحقاً" })] })]
						}, step.label))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					id: "rules",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "سياسات البنك" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "مصدر الحقيقة للحاسبات والعروض" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { size: 19 })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "stage-select",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "فرق نسبة افتراضي للتجربة (0–10)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: rateDelta,
								onChange: (event) => setRateDelta(event.target.value),
								onBlur: () => showToast(Number.isFinite(Number(rateDelta)) && Number(rateDelta) >= 0 && Number(rateDelta) <= 10 ? "حُفظ الافتراض داخل التجربة فقط؛ لم تتغير سياسة البنك." : "أدخل قيمة من 0 إلى 10. لم تُحفظ القيمة غير الصحيحة.")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "consent-check",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: autoAssign,
								onChange: () => setAutoAssign((value) => !value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "توزيع الطلبات الجديدة تلقائياً على الموظف المتاح الأقل حملاً." })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesCommandCenter, {
				mode: "bank",
				initialView: activeNav === "tracking" ? "deals" : "performance",
				showToast
			})
		]
	});
}
function PlatformAdminDashboard({ showToast, openDetail }) {
	const [maintenance, setMaintenance] = (0, import_react.useState)(false);
	const [orgFilter, setOrgFilter] = (0, import_react.useState)("الكل");
	const organizations = [
		[
			"تلال العقارية",
			"مطور",
			"نشطة"
		],
		[
			"مصرف الراجحي",
			"جهة تمويل",
			"نشطة"
		],
		[
			"واحة العقارية",
			"مطور",
			"تحتاج مراجعة"
		],
		[
			"شركة تمويل الأولى",
			"جهة تمويل",
			"تجريبية"
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "content-wrap sales-content management-content admin-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-row sales-welcome",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 14 }), " مركز تشغيل ديل لاين"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "تشغيل المنصة بدون تجاوز صلاحيات الجهات." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "إدارة المنظمات والتكاملات والامتثال والفوترة؛ لا يوجد اطلاع روتيني على محادثات العملاء أو قرارات البنك." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: `shift-status availability-toggle ${maintenance ? "offline" : "online"}`,
					onClick: () => setMaintenance((value) => !value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						" المنصة ",
						maintenance ? "في وضع الصيانة" : "تعمل بشكل طبيعي"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تغيير تجريبي لحالة التشغيل" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sales-kpis",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOrgFilter("الكل"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon mint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الجهات النشطة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: organizations.filter((org) => org[2] === "نشطة").length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [
									"من ",
									organizations.length,
									" جهات في النموذج"
								] })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon blue",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "صفقات نشطة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: trackedSalesSeed.filter((sale) => sale.stage !== "مكتملة").length }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "صفقات تجريبية مفتوحة" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("integrations")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تكاملات تحتاج انتباه" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "لا يوجد توقف شامل" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon coral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تنبيهات امتثال" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ضمن مدة المعالجة" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "management-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel management-table",
					id: "organizations",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "الجهات والمنظمات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "عزل مستقل لكل مطور وجهة تمويل" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "crm-filters",
							children: [
								"الكل",
								"مطور",
								"جهة تمويل"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: orgFilter === item ? "active" : "",
								onClick: () => setOrgFilter(item),
								children: item
							}, item))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "management-list",
						children: organizations.filter((item) => orgFilter === "الكل" || item[1] === orgFilter).map(([name, type, status]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => showToast(`تم فتح ملف منظمة ${name}`),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "lead-avatar",
									children: name.slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [type, " • وصول متعدد المستأجرين"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
									className: `status-pill ${status === "نشطة" ? "qualified" : "waiting"}`,
									children: status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 17 })
							]
						}, name))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "panel",
					id: "integrations",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "صحة التكاملات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "مراقبة القنوات الخارجية" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 19 })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "integration-list",
						children: [
							[
								"نفاذ",
								"تجريبي",
								"waiting"
							],
							[
								"SIMAH",
								"خلف بوابة",
								"waiting"
							],
							[
								"مخزون المطورين",
								"بيانات تجريبية",
								"waiting"
							],
							[
								"الإشعارات",
								"محلية في التجربة",
								"waiting"
							]
						].map(([name, state, tone]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => showToast(`تم فتح سجل تكامل ${name}`),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حالة العرض التجريبي؛ غير متصل" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								className: `status-pill ${tone}`,
								children: state
							})]
						}, name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "management-grid lower-grid",
				id: "rules",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					id: "tracking",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "نبض الصفقات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "إحصاءات تشغيلية مجمعة بدون كشف بيانات حساسة" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 19 })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "performance-chart",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "52%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "اكتشاف" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "78%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حسبة" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "64%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حجز" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "43%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تمويل" })] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					id: "audit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "التدقيق والامتثال والفوترة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "وصول مؤقت ومسبب فقط" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 19 })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "audit-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("تم فتح سجل الوصول الإداري"),
								children: ["مراجعة وصول إداري مؤقت ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حالتان" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("تم فتح سجل الموافقات"),
								children: ["موافقات العملاء حسب الغرض ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "98.7%" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => openDetail("scope"),
								children: ["حوكمة نطاق المشروع ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الإصدار 2.0" })]
							})
						]
					})]
				})]
			})
		]
	});
}
function downloadCsv(filename, rows) {
	const csv = "﻿" + rows.map((row) => row.map((cell) => csvCell(String(cell))).join(",")).join("\n");
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
var developerAgents = [
	{
		id: "SA-101",
		name: "عباس السالم",
		role: "مستشار مبيعات",
		target: 8,
		closed: 6,
		sales: 724e4,
		reservations: 9,
		active: 7,
		projectSales: {
			"تلال الواجهة": 284e4,
			"روابي الخبر": 236e4,
			"واحة الدمام": 204e4
		}
	},
	{
		id: "SA-102",
		name: "نورة العتيبي",
		role: "مستشارة مبيعات",
		target: 10,
		closed: 8,
		sales: 936e4,
		reservations: 12,
		active: 9,
		projectSales: {
			"تلال الواجهة": 426e4,
			"روابي الخبر": 318e4,
			"بيوت قمرة": 192e4
		}
	},
	{
		id: "SA-103",
		name: "ماجد الشهري",
		role: "مستشار مبيعات",
		target: 9,
		closed: 5,
		sales: 586e4,
		reservations: 7,
		active: 6,
		projectSales: {
			"روابي الخبر": 354e4,
			"واحة الدمام": 143e4,
			"بيوت قمرة": 89e4
		}
	},
	{
		id: "SA-104",
		name: "ريم الدوسري",
		role: "منسقة مبيعات",
		target: 7,
		closed: 4,
		sales: 412e4,
		reservations: 6,
		active: 4,
		projectSales: {
			"تلال الواجهة": 142e4,
			"واحة الدمام": 18e5,
			"بيوت قمرة": 9e5
		}
	}
];
var bankAgents = [
	{
		id: "BA-201",
		name: "فيصل الشهري",
		role: "أخصائي تمويل",
		target: 15,
		closed: 12,
		sales: 128e5,
		reservations: 0,
		active: 8,
		projectSales: {
			"تلال الواجهة": 42e5,
			"روابي الخبر": 51e5,
			"واحة الدمام": 35e5
		}
	},
	{
		id: "BA-202",
		name: "عمر الحربي",
		role: "أخصائي تمويل",
		target: 14,
		closed: 9,
		sales: 965e4,
		reservations: 0,
		active: 7,
		projectSales: {
			"تلال الواجهة": 325e4,
			"روابي الخبر": 28e5,
			"بيوت قمرة": 36e5
		}
	},
	{
		id: "BA-203",
		name: "سارة الدوسري",
		role: "أخصائية تمويل",
		target: 16,
		closed: 11,
		sales: 117e5,
		reservations: 0,
		active: 9,
		projectSales: {
			"تلال الواجهة": 39e5,
			"واحة الدمام": 47e5,
			"بيوت قمرة": 31e5
		}
	}
];
var trackedSalesSeed = [
	{
		id: "DL-4101",
		reservation: "RSV-90168",
		client: "نجلاء القحطاني",
		project: "تلال الواجهة",
		unit: "T-118",
		value: 142e4,
		financing: "تمويل بنكي",
		stage: "مراجعة التمويل",
		developerAgent: "نورة العتيبي",
		bank: "مصرف الراجحي",
		bankAgent: "فيصل الشهري",
		bankStage: "مراجعة المستندات",
		updated: "قبل 12 دقيقة",
		nextAction: "استكمال كشف الحساب",
		sla: "متبقي 1:20 س",
		createdAt: "2026-11-01"
	},
	{
		id: "DL-4102",
		reservation: "RSV-90172",
		client: "عباس السالم",
		project: "روابي الخبر",
		unit: "A-204",
		value: 135e4,
		financing: "تمويل بنكي",
		stage: "موافقة مبدئية",
		developerAgent: "عباس السالم",
		bank: "البنك الأهلي السعودي",
		bankAgent: "عمر الحربي",
		bankStage: "العرض الائتماني جاهز",
		updated: "قبل 38 دقيقة",
		nextAction: "اعتماد العرض من العميل",
		sla: "ضمن الوقت",
		createdAt: "2026-11-02"
	},
	{
		id: "DL-4103",
		reservation: "RSV-90161",
		client: "مشاعل الغامدي",
		project: "واحة الدمام",
		unit: "B-311",
		value: 89e4,
		financing: "نقدي",
		stage: "العقود والإفراغ",
		developerAgent: "ريم الدوسري",
		bank: "—",
		bankAgent: "—",
		bankStage: "لا ينطبق",
		updated: "اليوم 10:40 ص",
		nextAction: "توقيع العقد الإلكتروني",
		sla: "موعد غداً",
		createdAt: "2026-11-03"
	},
	{
		id: "DL-4104",
		reservation: "RSV-90154",
		client: "عبدالله الحربي",
		project: "بيوت قمرة",
		unit: "V-027",
		value: 126e4,
		financing: "تمويل بنكي",
		stage: "مكتملة",
		developerAgent: "ماجد الشهري",
		bank: "مصرف الإنماء",
		bankAgent: "سارة الدوسري",
		bankStage: "تم الصرف",
		updated: "2 نوفمبر 2026",
		nextAction: "اكتملت الصفقة",
		sla: "مكتمل",
		createdAt: "2026-10-29",
		closedAt: "2026-11-02"
	},
	{
		id: "DL-4105",
		reservation: "RSV-90180",
		client: "ريم الشمري",
		project: "تلال الواجهة",
		unit: "T-122",
		value: 138e4,
		financing: "تمويل بنكي",
		stage: "حجز الوحدة",
		developerAgent: "عباس السالم",
		bank: "لم يُحدد",
		bankAgent: "لم يُسند",
		bankStage: "بانتظار اختيار البنك",
		updated: "قبل 6 دقائق",
		nextAction: "اختيار الجهة التمويلية",
		sla: "متبقي 23 ساعة",
		createdAt: "2026-11-04"
	}
];
var salesStages = [
	"حجز الوحدة",
	"مراجعة التمويل",
	"موافقة مبدئية",
	"العقود والإفراغ",
	"مكتملة"
];
var periodLabels = {
	daily: "يومي",
	weekly: "أسبوعي",
	monthly: "شهري",
	quarterly: "ربع سنوي",
	yearly: "سنوي",
	custom: "مدة مخصصة"
};
function SalesCommandCenter({ mode, initialView, showToast }) {
	const [view, setView] = (0, import_react.useState)(initialView);
	(0, import_react.useEffect)(() => setView(initialView), [initialView]);
	const [period, setPeriod] = (0, import_react.useState)("monthly");
	const [fromDate, setFromDate] = (0, import_react.useState)("2026-11-01");
	const [toDate, setToDate] = (0, import_react.useState)("2026-11-04");
	const agents = mode === "developer" ? developerAgents : bankAgents;
	const [agentFilter, setAgentFilter] = (0, import_react.useState)("الكل");
	const [projectFilter, setProjectFilter] = (0, import_react.useState)("الكل");
	const [stageFilter, setStageFilter] = (0, import_react.useState)("الكل");
	const [financeFilter, setFinanceFilter] = (0, import_react.useState)("الكل");
	const [sales, setSales] = (0, import_react.useState)(trackedSalesSeed);
	const [selectedSaleId, setSelectedSaleId] = (0, import_react.useState)(trackedSalesSeed[0].id);
	const projectsData = [...new Set(demoInventory.map((unit) => unit.project))].map((name) => {
		const units = demoInventory.filter((unit) => unit.project === name);
		return {
			name,
			total: units.length,
			available: units.filter((u) => u.state === "متاحة").length,
			reserved: units.filter((u) => u.state === "محجوزة").length,
			sold: units.filter((u) => u.state === "مباعة").length
		};
	});
	const reportToday = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Riyadh",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(/* @__PURE__ */ new Date());
	const range = periodRange(period, reportToday, fromDate, toDate);
	const scopedSales = sales.filter((sale) => mode === "developer" || sale.bank === "مصرف الراجحي");
	const chosenAgents = agents.map((agent) => {
		const own = scopedSales.filter((sale) => (mode === "developer" ? sale.developerAgent : sale.bankAgent) === agent.name);
		const closed = own.filter((sale) => sale.stage === "مكتملة" && withinRange(sale.closedAt ?? sale.createdAt, range));
		return {
			...agent,
			closedPeriod: closed.length,
			salesPeriod: closed.reduce((sum, sale) => sum + sale.value, 0),
			targetPeriod: agent.target,
			active: own.filter((sale) => sale.stage !== "مكتملة").length
		};
	}).filter((agent) => agentFilter === "الكل" || agent.name === agentFilter);
	const closedTotal = chosenAgents.reduce((sum, agent) => sum + agent.closedPeriod, 0);
	const salesTotal = chosenAgents.reduce((sum, agent) => sum + agent.salesPeriod, 0);
	const targetTotal = chosenAgents.reduce((sum, agent) => sum + agent.targetPeriod, 0);
	const agentSales = scopedSales.filter((sale) => agentFilter === "الكل" || (mode === "developer" ? sale.developerAgent : sale.bankAgent) === agentFilter);
	const reservationTotal = agentSales.filter((sale) => sale.stage !== "مكتملة" && withinRange(sale.createdAt, range)).length;
	const inventoryTotal = projectsData.reduce((sum, project) => sum + project.available, 0);
	const projectChart = projectsData.map((project) => ({
		...project,
		value: agentSales.filter((sale) => sale.project === project.name && sale.stage === "مكتملة" && withinRange(sale.closedAt ?? sale.createdAt, range)).reduce((sum, sale) => sum + sale.value, 0)
	}));
	const chartMax = Math.max(...projectChart.map((item) => item.value), 1);
	const filteredSales = agentSales.filter((sale) => withinRange(sale.closedAt ?? sale.createdAt, range) && (projectFilter === "الكل" || sale.project === projectFilter) && (stageFilter === "الكل" || sale.stage === stageFilter) && (financeFilter === "الكل" || sale.financing === financeFilter));
	const selectedSale = filteredSales.find((sale) => sale.id === selectedSaleId) ?? filteredSales[0];
	const changeStage = (stage) => {
		if (!selectedSale) return;
		if (selectedSale.stage === "مكتملة" && stage !== "مكتملة") {
			showToast("الصفقة مكتملة؛ عكسها يحتاج إجراءً موثقًا مستقلًا.");
			return;
		}
		if (salesStages.indexOf(stage) > salesStages.indexOf(selectedSale.stage) + 1) {
			showToast("أكمل المرحلة التالية أولًا؛ لا يمكن القفز إلى إغلاق الصفقة.");
			return;
		}
		setSales((items) => items.map((item) => item.id === selectedSale.id ? {
			...item,
			stage,
			updated: "الآن · تجربة",
			closedAt: stage === "مكتملة" ? reportToday : void 0
		} : item));
		showToast(`تم تحديث المرحلة داخل التجربة إلى: ${stage}`);
	};
	const exportPerformance = () => downloadCsv(`${mode}-sales-performance.csv`, [
		["الفترة", periodLabels[period]],
		[
			"الموظف",
			"التارقت",
			"الصفقات المغلقة",
			"نسبة التحقيق",
			"إجمالي المبيعات"
		],
		...chosenAgents.map((agent) => [
			agent.name,
			String(agent.targetPeriod),
			String(agent.closedPeriod),
			`${Math.round(agent.closedPeriod / agent.targetPeriod * 100)}%`,
			String(agent.salesPeriod)
		])
	]);
	const exportTracking = () => downloadCsv(`${mode}-deal-tracking.csv`, [[
		"الصفقة",
		"الحجز",
		"العميل",
		"المشروع",
		"الوحدة",
		"القيمة",
		"نوع السداد",
		"مرحلة البيع",
		"موظف المطور",
		"البنك",
		"موظف البنك",
		"مرحلة البنك"
	], ...filteredSales.map((sale) => [
		sale.id,
		sale.reservation,
		sale.client,
		sale.project,
		sale.unit,
		String(sale.value),
		sale.financing,
		sale.stage,
		sale.developerAgent,
		sale.bank,
		sale.bankAgent,
		sale.bankStage
	])]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "sales-command",
		id: "operations",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sales-command-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 14 }),
							" ",
							mode === "developer" ? "مركز قيادة مبيعات المطور" : "مركز قيادة تمويل البنك"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: mode === "developer" ? "الحجوزات، التارقت، المبيعات ومسار الصفقة" : "طلبات التمويل، أداء الموظفين ومسار الموافقات" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: mode === "developer" ? "قياس كل موظف وكل مشروع من الحجز حتى إقفال البيع، مع رؤية حالة البنك دون كشف بيانات العميل الحساسة." : "قياس إنجاز موظفي البنك ومتابعة كل طلب تمويل والموظف العقاري المرتبط به ضمن نفس الصفقة." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "command-tabs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: view === "performance" ? "active" : "",
						onClick: () => setView("performance"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 16 }), " الأداء والمبيعات"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: view === "deals" ? "active" : "",
						onClick: () => setView("deals"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 16 }), " تتبع بيع الصفقة"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "report-method",
				children: "الأرقام محسوبة من سجلات الصفقات التجريبية المؤرخة. التارقت المعروض شهري، والفترة حسب توقيت الرياض. حجم القيمة يمثل أسعار العقارات، وليس مبالغ قروض أو إيراد المنصة."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "report-filters",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "period-buttons",
						children: Object.keys(periodLabels).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: period === key ? "active" : "",
							onClick: () => setPeriod(key),
							children: periodLabels[key]
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الموظف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "فلترة تقرير الموظفين",
						value: agentFilter,
						onChange: (event) => setAgentFilter(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "الكل" }), agents.map((agent) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: agent.name }, agent.id))]
					})] }),
					period === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "custom-dates",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "من" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "بداية فترة التقرير",
							type: "date",
							value: fromDate,
							onInput: (event) => setFromDate(event.currentTarget.value),
							onChange: (event) => setFromDate(event.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إلى" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "نهاية فترة التقرير",
							type: "date",
							value: toDate,
							onInput: (event) => setToDate(event.currentTarget.value),
							onChange: (event) => setToDate(event.target.value)
						})] })]
					})
				]
			}),
			!range && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "report-error",
				role: "alert",
				children: "اختر تاريخين صحيحين؛ البداية يجب أن تسبق النهاية."
			}),
			view === "performance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "command-body",
				id: "team",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "command-kpis",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { size: 19 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: mode === "developer" ? "الحجوزات القائمة" : "طلبات التمويل القائمة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: reservationTotal }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: ["خلال ", periodLabels[period]] })
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon mint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { size: 19 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الصفقات المقفلة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: closedTotal }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: ["من تارقت ", targetTotal] })
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon blue",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { size: 19 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: mode === "developer" ? "إجمالي المبيعات" : "قيمة العقارات الممولة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(salesTotal / 1e6).toFixed(2), "م"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ريال سعودي" })
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kpi-icon coral",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 19 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: mode === "developer" ? "المخزون المتاح" : "نسبة تحقيق التارقت" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: mode === "developer" ? inventoryTotal : `${Math.round(closedTotal / Math.max(targetTotal, 1) * 100)}%` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: mode === "developer" ? "وحدة عبر 4 مشاريع" : "حسب الفترة المختارة" })
							] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sales-analytics-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "sales-chart-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "command-section-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: mode === "developer" ? "المبيعات حسب المشروع" : "قيمة العقارات حسب المشروع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									periodLabels[period],
									" ",
									period === "custom" ? `• ${fromDate} إلى ${toDate}` : "• يتحدث حسب الفلتر"
								] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: exportPerformance,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 15 }), " تصدير التقرير"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "horizontal-sales-chart",
								children: projectChart.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [(item.value / 1e6).toFixed(2), "م ر.س"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { width: `${item.value / chartMax * 100}%` } }) })] }, item.name))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "inventory-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "command-section-head",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: mode === "developer" ? "المخزون حسب المشروع" : "حالة طلبات التمويل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "صورة تشغيلية فورية" })] })
							}), mode === "developer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inventory-projects",
								children: projectsData.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: project.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "available" }),
										" متاح ",
										project.available
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "reserved" }),
										" محجوز ",
										project.reserved
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sold" }),
										" مباع ",
										project.sold
									] })
								] }, project.name))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bank-stage-summary",
								children: [
									"مراجعة المستندات",
									"تقييم ائتماني",
									"عرض جاهز",
									"تم الصرف"
								].map((stage, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stage }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: scopedSales.filter((sale) => sale.bankStage === stage).length })] }, stage))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "agent-sales-table",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "command-section-head",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "أداء الموظفين" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "كم صفقة أُقفلت، نسبة التارقت، وقيمة الإنجاز في المدة المختارة" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "agent-table-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الموظف" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الهدف الشهري" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المقفل" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نسبة التحقيق" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إجمالي القيمة" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "صفقات نشطة" })
								]
							}),
							chosenAgents.map((agent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setAgentFilter(agent.name),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: "lead-avatar",
										children: agent.name.slice(0, 2)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [agent.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: agent.role })] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: agent.targetPeriod }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: agent.closedPeriod }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "target-achievement",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { width: `${Math.min(100, agent.closedPeriod / agent.targetPeriod * 100)}%` } }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [Math.round(agent.closedPeriod / agent.targetPeriod * 100), "%"] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(agent.salesPeriod / 1e6).toFixed(2), "م ر.س"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: agent.active })
								]
							}, agent.id))
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "command-body",
				id: "tracking",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "deal-filter-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المشروع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "مشروع الصفقة",
								value: projectFilter,
								onChange: (event) => setProjectFilter(event.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "الكل" }), projectsData.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: project.name }, project.name))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مرحلة البيع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "مرحلة البيع",
								value: stageFilter,
								onChange: (event) => setStageFilter(event.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "الكل" }), salesStages.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: stage }, stage))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "طريقة السداد" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "طريقة سداد الصفقة",
								value: financeFilter,
								onChange: (event) => setFinanceFilter(event.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "الكل" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "تمويل بنكي" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "نقدي" })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: exportTracking,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 15 }), " تصدير التفاصيل"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tracked-layout",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "tracked-sales-list",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العميل والصفقة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مرحلة البيع" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mode === "developer" ? "موظف المطور" : "موظف البنك" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حالة البنك" })
							] }), filteredSales.map((sale) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: selectedSale?.id === sale.id ? "selected" : "",
								onClick: () => setSelectedSaleId(sale.id),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										className: "lead-avatar",
										children: sale.client.slice(0, 2)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [sale.client, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										sale.reservation,
										" • ",
										sale.project,
										" • ",
										sale.unit
									] })] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
										className: "status-pill qualified",
										children: sale.stage
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: mode === "developer" ? sale.developerAgent : sale.bankAgent }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: sale.financing === "تمويل بنكي" ? sale.bank : "نقدي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: sale.bankStage })] })
								]
							}, sale.id))]
						}), selectedSale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "sale-tracker-detail",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "tracker-title",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "status-pill waiting",
											children: selectedSale.financing
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: selectedSale.client }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											selectedSale.id,
											" • ",
											selectedSale.reservation,
											" • ",
											selectedSale.project,
											" • ",
											selectedSale.unit
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sale-value",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "قيمة الصفقة" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [selectedSale.value.toLocaleString("en-US"), " ر.س"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["آخر تحديث: ", selectedSale.updated] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ownership-grid",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "موظف مبيعات المطور" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedSale.developerAgent }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedSale.project })
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "موظف البنك المسؤول" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedSale.bankAgent }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedSale.bank })
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bank-progress",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مرحلة البنك الحالية" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: selectedSale.bankStage })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [
										"اختيار البنك",
										"رفع الطلب",
										"مراجعة البنك",
										"العرض",
										"الصرف"
									].map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("i", {
										className: selectedSale.financing === "نقدي" ? "disabled" : index <= Math.max(0, salesStages.indexOf(selectedSale.stage)) ? "done" : "",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: index + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: step })]
									}, step)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "tracker-stage-select",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحديث مرحلة بيع الصفقة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										"aria-label": "مرحلة الصفقة المختارة",
										value: selectedSale.stage,
										onChange: (event) => changeStage(event.target.value),
										children: salesStages.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: stage }, stage))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "next-sale-action",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["الإجراء التالي • ", selectedSale.sla] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedSale.nextAction })] })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "report-empty",
							role: "status",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 26 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "لا توجد صفقات تطابق الفترة والفلاتر" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جرّب فترة أو موظفًا آخر." })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "ops-audit-note",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 15 }), " المدير يرى مسار البيع، الحجز، موظف المطور، البنك وموظف البنك والمرحلة الحالية فقط ضمن الصفقة المصرّح بها؛ بيانات دخل العميل والتزاماته لا تظهر للمطور."]
					})
				]
			})
		]
	});
}
function BuyerDashboard({ uploaded, setUploaded, showToast, navigate, openChat, sharedCalc, approveCalc, openAi, openDetail, selectedOffer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "content-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "welcome-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }), " صباح الخير يا عباس"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "حيّاك في رحلة بيتك الجديد." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جمعنا لك حالة العقار والتمويل والمستندات في شاشة واحدة؛ فقط نفّذ الخطوة التالية." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "deal-reference",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "رقم معاملتك" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							dir: "ltr",
							children: "HI-24081"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " نشطة الآن"] })
					]
				})]
			}),
			sharedCalc !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SharedCalculationCard, {
				status: sharedCalc,
				approve: approveCalc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectMarketplace, {
				navigate,
				openDetail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "journey-card",
				id: "deal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "section-icon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 20 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "رحلة تملكك" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "نعرض لك المهم فقط، ونخبرك من المسؤول عن كل خطوة." })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "updated",
						onClick: () => openDetail("deal"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 14 }), " حُدثت الآن"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "journey-track",
					children: journey.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `journey-step ${step.done ? "done" : ""} ${step.active ? "active" : ""}`,
						onClick: () => openDetail("deal", step.label),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "step-dot",
							children: step.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }) : index + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "step-copy",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: step.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.meta })]
						})]
					}, step.label))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `next-action ${uploaded ? "completed" : ""}`,
				id: "documents",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "action-accent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "action-icon",
						children: uploaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 25 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { size: 25 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "action-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow",
								children: "خطوتك الآن"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: uploaded ? "اختير المستند في التجربة" : "ارفع كشف الحساب البنكي" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: uploaded ? "الملف محلي على جهازك؛ لن يصل لموظف البنك قبل تفعيل التكامل." : "مطلوب لاستكمال مراجعة طلبك لدى الجهة التمويلية. الملف يبقى مشفّراً ولا يراه إلا الطرف المخوّل." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "action-meta",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 14 }), " يستغرق أقل من دقيقة"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 14 }), " PDF أو صورة، حتى 10MB"] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoDocumentPicker, {
						uploaded,
						onPick: (name) => {
							setUploaded(true);
							showToast(`اختير ${name} محليًا في التجربة؛ لم يُرسل للبنك.`);
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dashboard-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel property-panel",
					id: "property",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "عقارك المحجوز" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "آخر حالة مؤكدة من سجل الوحدة" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => openDetail("property"),
								children: ["عرض التفاصيل ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "property-visual property-click",
							onClick: () => openDetail("property"),
							"aria-label": "عرض تفاصيل مشروع روابي الخبر",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									className: "reserved-property-image",
									src: "/images/saudi-townhouses.webp",
									alt: "صورة تصورية لتاون هاوس، وليست صورة فعلية للوحدة المحجوزة",
									width: 960,
									height: 640,
									loading: "lazy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "reserved-image-note",
									children: "صورة تصورية"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "visual-label",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مشروع روابي الخبر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "واجهة بحرية • الخبر" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "available-pill",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " الحجز مؤكد"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "property-details",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("property"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الوحدة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "A-204" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("property"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "النوع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "فيلا تاون هاوس" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("property"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المساحة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "248 م²" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openDetail("property"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "السعر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "1,350,000 ر.س" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "agent-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "agent-avatar",
									children: "ن"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "مستشارة المبيعات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نورة العتيبي" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " متاحة الآن"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: openChat,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 18 }), " مراسلة"]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OffersPanel, {
					openDetail,
					selectedOffer
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "quick-tools",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: openAi,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { size: 20 }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "اسأل حِسبة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "مساعدك لفهم المشاريع والخطوة الجاية" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => navigate("documents"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { size: 20 }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مستنداتك" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: uploaded ? "لا توجد نواقص جديدة" : "ملفان ينتظران الرفع" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: openChat,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 20 }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "محادثات الصفقة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "كل طرف يرى ما يخصه فقط" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 ديل لاين" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("privacy", "privacy"),
						children: "الخصوصية"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("privacy", "terms"),
						children: "الشروط والأحكام"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => openDetail("support"),
						children: "تواصل معنا"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "saudi",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " صُممت في السعودية"]
				})
			] })
		]
	});
}
function SharedCalculationCard({ status, approve }) {
	const [reviewing, setReviewing] = (0, import_react.useState)(false);
	const [consentChecked, setConsentChecked] = (0, import_react.useState)(false);
	if (status === "approved") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "shared-calc-card approved",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shared-icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 23 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: "حسبة مشارَكة ومعتمدة منك"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "نتيجتك المبدئية صارت في حسابك" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "أرسلها لك نورة العتيبي من شركة تلال العقارية • مشروع واجهة الدمام" })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "calc-attribution",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "مصدر الفرصة موثّق" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نورة العتيبي" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10 أغسطس 2026 • 10:42 م" })
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "shared-calc-card pending",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shared-icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 22 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow",
					children: "طلب جديد ينتظر موافقتك"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "نورة أرسلت لك حسبة تمويل مبدئية" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "مرتبطة بمشروع بيوت تلال — واجهة الدمام. راجع الغرض والبيانات قبل القبول." })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "primary-action",
				onClick: () => setReviewing(true),
				children: ["مراجعة وقبول ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 17 })]
			}),
			reviewing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "consent-sheet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "modal-scrim",
					"aria-label": "إغلاق",
					onClick: () => setReviewing(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "consent-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "consent-head",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "section-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 20 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "موافقة محددة وواضحة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "اربط الحسبة بحسابك؟" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setReviewing(false),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 19 })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "consent-source",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "lead-avatar large",
								children: "نع"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "أرسل الطلب" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نورة العتيبي" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "شركة تلال العقارية • واجهة الدمام" })
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "consent-details",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الغرض" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض نتيجة تمويل مبدئية في حسابك وربطها باهتمامك بالمشروع." })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "البيانات المستخدمة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رقم الهوية للتحقق والربط، الدخل المدخل، سعر العقار ونتيجة الحسبة." })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ما يراه الموظف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حالة قبول الطلب وملخص أهلية فقط—بدون التزاماتك أو عروض البنوك." })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "consent-check",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: consentChecked,
								onChange: (event) => setConsentChecked(event.target.checked)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "قرأت الغرض ونطاق البيانات وأوافق على ربط الحسبة بحسابي." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ghost-action",
								onClick: () => setReviewing(false),
								children: "ليس الآن"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-action",
								disabled: !consentChecked,
								onClick: () => {
									approve();
									setReviewing(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }), " موافق، اعرض الحسبة"]
							})]
						})
					]
				})]
			})
		]
	});
}
function OffersPanel({ openDetail, selectedOffer }) {
	const [filter, setFilter] = (0, import_react.useState)("payment");
	const ordered = [...offers].sort((a, b) => {
		if (filter === "payment") return Number(a.payment.replace(",", "")) - Number(b.payment.replace(",", ""));
		if (filter === "term") return Number(b.term.split(" ")[0]) - Number(a.term.split(" ")[0]);
		return Number(a.down.replace(/\D/g, "")) - Number(b.down.replace(/\D/g, ""));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel offers-panel",
		id: "offers",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "عروض التمويل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "نماذج توضيحية بأسماء جهات تمويل حقيقية" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => openDetail("offer", "compare"),
					children: ["مقارنة كاملة ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "offer-filters",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: filter === "payment" ? "active" : "",
						onClick: () => setFilter("payment"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 13 }), " الأقل قسطاً"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: filter === "term" ? "active" : "",
						onClick: () => setFilter("term"),
						children: "25 سنة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: filter === "down" ? "active" : "",
						onClick: () => setFilter("down"),
						children: "دفعة أقل"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "offer-list",
				children: ordered.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: `offer-row ${selectedOffer === offer.bank ? "selected" : ""}`,
					onClick: () => openDetail("offer", offer.bank),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bank-mark",
							style: { background: offer.color },
							children: offer.mark
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "offer-name",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: offer.bank }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: offer.rate })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "payment",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "القسط الشهري" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								offer.payment,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "offer-terms",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: offer.term }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["دفعة ", offer.down] })]
						}),
						selectedOffer === offer.bank ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "selected-badge",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), " للمراجعة"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
					]
				}, offer.bank))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "offer-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 17 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مقارنة حيادية وواضحة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الأسماء حقيقية، لكن الأرقام محاكاة للتجربة وليست عروضاً صادرة من البنوك أو موافقات نهائية." })] })]
			})
		]
	});
}
function DetailModal({ detail, close, openChat, showToast, selectedOffer, selectOffer, role, logout }) {
	if (!detail) return null;
	const project = detail.kind === "project" ? projects.find((item) => item.name === detail.id) ?? projects[0] : null;
	const offer = detail.kind === "offer" && detail.id !== "compare" ? offers.find((item) => item.bank === detail.id) ?? offers[0] : null;
	const title = (detail.kind === "offer" && detail.id === "compare" ? "مقارنة عروض التمويل" : null) ?? project?.name ?? offer?.bank ?? {
		property: "تفاصيل العقار المحجوز",
		deal: detail.id || "تفاصيل رحلة الصفقة",
		documents: "مستنداتي",
		privacy: detail.id === "terms" ? "الشروط والأحكام" : detail.id === "access" ? "سياسة الوصول" : "الخصوصية والموافقات",
		support: "الدعم والمساعدة",
		account: "الحساب والإعدادات",
		notification: "تفاصيل الإشعار",
		performance: "تفاصيل الأداء",
		activeDeal: `صفقة ${detail.id ?? "نشطة"}`,
		scope: "إضافات نطاق المشروع"
	}[detail.kind] ?? "التفاصيل";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "detail-modal-wrap",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "modal-scrim",
			onClick: close,
			"aria-label": "إغلاق التفاصيل"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "detail-modal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "section-icon",
				children: project ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 20 }) : offer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 20 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 20 })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تفاصيل النموذج التجريبي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: close,
				"aria-label": "إغلاق",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 21 })
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "detail-body",
				children: [
					offer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "offer-detail-head",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bank-mark large",
									style: { background: offer.color },
									children: offer.mark
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "عرض تمويلي تجريبي" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: offer.bank }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: offer.rate })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "status-pill qualified",
									children: "صالح للمقارنة"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "القسط الشهري" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [offer.payment, " ر.س"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المدة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: offer.term })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الدفعة الأولى" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: offer.down })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "انتهاء النموذج" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "30 نوفمبر 2026 · تجريبي" })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "terms-list",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "تفاصيل المقارنة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }), " التمويل التقديري: 1,200,000 ر.س"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }), " الرسوم الإدارية: 6,000 ر.س (تجريبي)"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }), " التقييم والتأمين: حسب الجهة"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }), " النتيجة لا تعني موافقة نهائية"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "ghost-action",
								onClick: () => downloadCsv("Deal_Line_Offer_Demo.csv", [[
									"الجهة",
									"القسط التجريبي",
									"المدة",
									"الدفعة"
								], [
									offer.bank,
									offer.payment,
									offer.term,
									offer.down
								]]),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 17 }), " ملخص العرض"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "primary-action",
								disabled: selectedOffer === offer.bank,
								onClick: () => selectOffer(offer.bank),
								children: selectedOffer === offer.bank ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }), " محفوظ للمراجعة"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["احفظه للمراجعة ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 17 })] })
							})]
						})
					] }),
					detail.kind === "offer" && detail.id === "compare" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "comparison-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "comparison-row head",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الجهة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "القسط" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المدة" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الدفعة" })
							]
						}), [...offers].sort((a, b) => Number(a.payment.replaceAll(",", "")) - Number(b.payment.replaceAll(",", ""))).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "comparison-row",
							onClick: () => showToast(`اختر ${item.bank} من قائمة العروض لفتح شروطه كاملة`),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.bank }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.payment, " ر.س"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.term }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.down })
							]
						}, item.bank))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "detail-disclaimer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 15 }), " الترتيب الحالي حسب الأقل قسطًا، وليس توصية مالية أو ترتيبًا مدفوعًا."]
					})] }),
					detail.kind === "property" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reserved-detail-photo",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/saudi-townhouses.webp",
								alt: "تصور معماري لتاون هاوس",
								width: 960,
								height: 640
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "صورة تصورية · ليست صورة فعلية للوحدة" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "property-summary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "status-pill qualified",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), " الحجز مؤكد"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "روابي الخبر • الوحدة A-204" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "فيلا تاون هاوس • 248 م² • 1,350,000 ر.س" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "رقم الحجز" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "RSV-90172" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تاريخ التأكيد" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "8 أغسطس 2026" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حالة الوحدة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "محجوزة لك" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المسؤول الحالي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نورة العتيبي" })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "terms-list",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ما الخطوة الجاية؟" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }), " اختيار العرض التمويلي المناسب"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 15 }), " متوقع خلال يومي عمل"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 15 }), " سجل الوحدة هو المرجع النهائي للتوفر"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "ghost-action",
								onClick: openChat,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 17 }), " مراسلة نورة"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-action",
								onClick: () => downloadCsv("Deal_Line_Reservation_Demo.csv", [[
									"الحجز",
									"الوحدة",
									"المشروع",
									"الحالة",
									"القيمة"
								], [
									"RSV-90172",
									"A-204",
									"روابي الخبر",
									"حجز تجريبي",
									"1350000"
								]]),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 17 }), " عرض ملخص الحجز"]
							})]
						})
					] }),
					detail.kind === "deal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "deal-detail-summary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المعاملة HI-24081" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: detail.id ?? "مقارنة العروض" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "المسؤول الحالي: العميل • المتوقع: خلال يومين عمل" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "vertical-timeline",
							children: journey.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: step.done ? "done" : step.active ? "active" : "",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: step.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }) : index + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: step.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: step.done ? "اكتملت وسُجلت" : step.active ? "بانتظار اختيارك" : "تبدأ بعد إكمال المرحلة السابقة" })] })]
							}, step.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ghost-action",
								onClick: openChat,
								children: "اسأل عن الصفقة"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "primary-action",
								onClick: () => {
									close();
									document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
								},
								children: "راجع العروض"
							})]
						})
					] }),
					detail.kind === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "document-summary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderLock, { size: 30 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "خزنة المستندات" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "يمكن اختيار PDF أو صورة من الصفحة الرئيسية للتجربة. الملفات تبقى محلية؛ الرفع والتشفير والمشاركة مع البنك تحتاج التكامل الخلفي." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "حالة التكامل: غير مفعّل." })
						]
					}),
					detail.kind === "notification" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationDetail, {
						id: detail.id,
						showToast,
						close
					}),
					detail.kind === "performance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceDetail, { id: detail.id }),
					detail.kind === "activeDeal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "property-summary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "status-pill qualified",
									children: "صفقة نشطة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: detail.id }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "المشروع: بيوت تلال • المسؤول الحالي موضح أدناه" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المرحلة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: detail.id === "نجلاء القحطاني" ? "اختيار التمويل" : detail.id === "عبدالله الحربي" ? "استكمال المستندات" : "التعاقد" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حالة SLA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ضمن الوقت" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ملخص الأهلية" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مؤهل مبدئيًا" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "البيانات التمويلية" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "محجوبة حسب الصلاحية" })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ghost-action",
								onClick: openChat,
								children: "فتح المحادثة"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "primary-action",
								onClick: () => showToast("تم تسجيل فتح سجل الصفقة في النشاط"),
								children: "فتح سجل الصفقة"
							})]
						})
					] }),
					detail.kind === "account" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "account-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "avatar",
							children: roleMeta[role].initials
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حساب تجريبي؛ الهوية غير موثقة فعليًا" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: roleMeta[role].name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: roleMeta[role].label })
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "settings-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("تم تفعيل التنبيهات"),
								children: ["التنبيهات ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["مفعّلة ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("تم حفظ اللغة العربية"),
								children: ["اللغة ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["العربية ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("لا توجد جلسات أخرى نشطة"),
								children: ["الأجهزة والجلسات ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["جهاز واحد ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: logout,
								children: ["تسجيل الخروج ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 }) })]
							})
						]
					})] }),
					detail.kind === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "privacy-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 25 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: detail.id === "access" ? "صلاحياتك تُحدد حسب دورك والمنظمة والعلاقة والغرض. لا يملك أي دور وصولًا مفتوحًا تلقائيًا." : detail.id === "terms" ? "هذه نسخة تفاعلية للتجربة. لا تمثل الأرقام عروضًا ملزمة أو موافقات تمويلية أو نشرة بيع رسمية." : "نجمع أقل قدر لازم من البيانات، ونوضح الغرض والمستلم والنطاق قبل أي موافقة." })] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "settings-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("تم فتح موافقة الحسبة المشاركة"),
								children: ["موافقة الحسبة المشاركة ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["نشطة ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("لا توجد موافقات تسويق نشطة"),
								children: ["موافقات التسويق ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["غير مفعّلة ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("جهّزنا نموذج طلب البيانات"),
								children: ["طلب نسخة من بياناتي ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 }) })]
							})
						]
					})] }),
					detail.kind === "scope" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "scope-additions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "scope-note",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 22 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "إضافات مستقلة على نطاق الإصدار 2.0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جُمعت النقاط المطلوبة في خانة واحدة، ولم يُعدّل أي نص داخل تقرير نطاق المشروع الأصلي." })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: scopeAdditions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })] }, item)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "scope-flow",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 17 }), " العميل"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 17 }), " موظف المطور"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 17 }), " موظف التمويل"] })
								]
							})
						]
					}),
					detail.kind === "support" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "support-options",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("الدعم في هذه النسخة توضيحي؛ لم تُفعّل قناة دعم خارجية بعد."),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 22 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "حالة الدعم" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "القناة الخارجية غير مفعّلة" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("سجلنا طلب اتصال تجريبي"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 22 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "اطلب اتصال" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "خلال ساعات العمل" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => showToast("تم فتح مركز المساعدة"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 22 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مركز المساعدة" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إجابات سريعة وواضحة" })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "support-ticket",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "رقم مرجع الدعم" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SUP-24081" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مرتبط بمعاملتك لتسهيل المتابعة" })
						]
					})] })
				]
			})]
		})]
	});
}
function NotificationDetail({ id, showToast, close }) {
	const data = id === "document" ? {
		title: "كشف الحساب مطلوب",
		text: "ارفع آخر كشف حساب لاستكمال مراجعة الطلب. يقبل PDF أو صورة حتى 10MB.",
		action: "رفع المستند"
	} : id === "newOffer" ? {
		title: "وصل عرض تمويلي جديد",
		text: "صار عندك ثلاثة نماذج عروض جاهزة للمقارنة. راجع القسط والمدة والدفعة قبل حفظ خيار للمراجعة.",
		action: "عرض المقارنة"
	} : id === "newLead" ? {
		title: "ريم الشمري أُسندت لك",
		text: "مهتمة بمشروع روابي الخبر، ولم يبدأ معها التواصل حتى الآن. أول رد متوقع خلال 54 دقيقة.",
		action: "فتح ملف العميل"
	} : id === "management" ? {
		title: "إجراء إداري يحتاج مراجعة",
		text: "يوجد طلب أو إعداد ضمن صلاحيات بوابتك يحتاج قراراً موثقاً. لم تُكشف لك أي بيانات خارج نطاق منظمتك.",
		action: "فتح الإجراء"
	} : id === "managementReport" ? {
		title: "اكتمل التقرير اليومي",
		text: "ملخص الأداء والأحمال والـSLA جاهز للمراجعة داخل بوابتك الإدارية.",
		action: "عرض التقرير"
	} : {
		title: "متابعة سلمان مستحقة",
		text: "العميل ينتظر تأكيد موعد زيارة المعرض لمعاينة الوحدة A-204.",
		action: "تسجيل المتابعة"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "notification-detail",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "notice-icon",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 20 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "إشعار نشط" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: data.title }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: data.text })
		] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "detail-actions",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "ghost-action",
			onClick: close,
			children: "لاحقًا"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "primary-action",
			onClick: () => {
				showToast(`تم تنفيذ: ${data.action}`);
				close();
			},
			children: data.action
		})]
	})] });
}
function PerformanceDetail({ id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "performance-chart",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "48%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الأحد" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "72%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الاثنين" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "58%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الثلاثاء" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { height: "88%" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "اليوم" })] })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "performance-list",
		children: (id === "followups" ? [
			["سلمان العتيبي", "خلال 42 دقيقة"],
			["ريم الشمري", "خلال 54 دقيقة"],
			["محمد الدوسري", "4:00 م"],
			["نجلاء القحطاني", "غدًا"]
		] : id === "qualified" ? [
			["نجلاء القحطاني", "جاهزة للحجز"],
			["سلمان العتيبي", "ملخص أهلية متاح"],
			["أحمد الشهري", "بانتظار اختيار وحدة"]
		] : id === "reservations" ? [
			["A-204", "مؤكد"],
			["T-118", "مؤكد"],
			["B-311", "بانتظار مستند"]
		] : [
			["سلمان العتيبي", "روابي الخبر"],
			["نجلاء القحطاني", "تلال الواجهة"],
			["محمد الدوسري", "واحة الدمام"],
			["ريم الشمري", "روابي الخبر"]
		]).map(([name, meta]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: meta })] }, name))
	})] });
}
function ProjectMarketplace({ navigate, openDetail }) {
	const [city, setCity] = (0, import_react.useState)("الكل");
	const [query, setQuery] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("الكل");
	const [sort, setSort] = (0, import_react.useState)("featured");
	const shown = projects.filter((project) => (city === "الكل" || project.city === city) && (kind === "الكل" || project.type === kind) && `${project.name} ${project.city} ${project.district} ${project.type}`.includes(query.trim())).sort((a, b) => sort === "price-low" ? a.basePrice - b.basePrice : sort === "area" ? b.baseArea - a.baseArea : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "market-section enriched-market",
		id: "market",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "market-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 16 }), " اكتشف مكانك الجاي"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "عقارات تستاهل تشوف تفاصيلها" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "فلل وشقق وتاون هاوس. اختَر اللي يناسب مساحتك وميزانيتك." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setCity("الكل");
						setKind("الكل");
						setQuery("");
						setSort("featured");
						navigate("market");
					},
					children: ["كل العقارات ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 17 })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "property-search-controls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "catalog-search",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "ابحث في المشاريع",
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "اسم المشروع، الحي أو المدينة"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "المدينة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						"aria-label": "المدينة",
						value: city,
						onChange: (event) => setCity(event.target.value),
						children: ["الكل", ...new Set(projects.map((p) => p.city))].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "نوع العقار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						"aria-label": "نوع العقار",
						value: kind,
						onChange: (event) => setKind(event.target.value),
						children: ["الكل", ...new Set(projects.map((p) => p.type))].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "catalog-results-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					role: "status",
					children: [shown.length, " مشاريع للمعاينة"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["ترتيب حسب", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					"aria-label": "ترتيب العقارات",
					value: sort,
					onChange: (event) => setSort(event.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "featured",
							children: "المقترحة للمعاينة"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price-low",
							children: "السعر: الأقل أولًا"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "area",
							children: "المساحة: الأكبر أولًا"
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "project-grid",
				children: shown.map((project, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "project-card",
					style: { animationDelay: `${index * 65}ms` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `project-art photo-art ${project.tone}`,
						onClick: () => openDetail("project", project.name),
						"aria-label": `تفاصيل ${project.name}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: project.image,
								alt: `تصور معماري لنمط ${project.type} — ${project.name}`,
								width: 960,
								height: 640,
								loading: "lazy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "project-tag",
								children: project.type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "concept-image-label",
								children: "صورة تصورية"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "project-image-action",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 20 })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "project-body",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 15 }),
								" ",
								project.city,
								" · ",
								project.district
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: project.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "project-facts",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BedDouble, { size: 16 }),
										" ",
										project.beds,
										" غرف"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bath, { size: 16 }),
										" ",
										project.baths
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { size: 16 }),
										" ",
										project.area
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "project-price",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "السعر التجريبي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: project.price })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => openDetail("project", project.name),
								children: ["اكتشف التفاصيل والوحدات ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 17 })]
							})
						]
					})]
				}, project.name))
			}),
			shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "empty-state",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 25 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ما لقينا عقار يطابق بحثك" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "جرّب مدينة أو نوع عقار ثاني." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "ghost-action",
						onClick: () => {
							setCity("الكل");
							setKind("الكل");
							setQuery("");
						},
						children: "مسح الفلاتر"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
				className: "demo-data-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 16 }), " صور تصورية وبيانات تجريبية للمعاينة؛ ليست عروض بيع رسمية أو إثباتًا لتوفر الوحدات."]
			})
		]
	});
}
function LeadDrawer({ lead, open, close, qualified, onQualify, openChat, showToast }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `lead-drawer ${open ? "open" : ""}`,
		"aria-hidden": !open,
		inert: !open,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "drawer-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "lead-avatar large",
					children: lead.initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: lead.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lead.name })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: close,
					"aria-label": "إغلاق ملف العميل",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "drawer-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "drawer-status",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `status-pill ${qualified ? "qualified" : lead.tone}`,
							children: qualified ? "عميل مؤهل" : lead.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 14 }),
							" ",
							lead.sla
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "drawer-label",
							children: "الإجراء التالي"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: lead.next }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "drawer-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-action",
								onClick: () => showToast("تم تسجيل محاولة الاتصال في النشاط"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 17 }), " تسجيل اتصال"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "ghost-action",
								onClick: openChat,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleMore, { size: 17 }), " مراسلة"]
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "drawer-label",
						children: "اهتمام العميل"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "detail-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المشروع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lead.project })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الوحدة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lead.unit })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المصدر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lead.source })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الجوال" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								dir: "ltr",
								children: lead.phone
							})] })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "eligibility-summary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 18 }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ملخص الأهلية المسموح" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lead.eligibility }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: lead.eligible || qualified ? "يمكن متابعة رحلة العقار. النتيجة مبدئية وليست موافقة تمويلية." : "لا تظهر أي بيانات دخل أو التزامات لموظف المبيعات." })
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "drawer-label",
						children: "آخر ملاحظة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "note-box",
						children: lead.note
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "timeline",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "drawer-label",
								children: "النشاط"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "أُسند العميل إليك" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: lead.last })] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "تم حفظ الاهتمام بالمشروع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "المحادثة مرتبطة بسجل العميل وتستمر عند تحويله إلى صفقة" })] })] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "drawer-footer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "ghost-action",
					onClick: () => showToast("تمت إضافة متابعة جديدة"),
					children: "إضافة متابعة"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "primary-action",
					disabled: qualified,
					onClick: onQualify,
					children: [qualified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { size: 17 }), qualified ? "تم التأهيل" : "تأهيل العميل"]
				})]
			})
		]
	});
}
function QuickCalculator({ open, close, showToast, onShare }) {
	const [income, setIncome] = (0, import_react.useState)("18000");
	const [property, setProperty] = (0, import_react.useState)("1350000");
	const [nationalId, setNationalId] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	const maxPayment = Math.round((Number(income) || 0) * .45);
	const indicative = Math.min(Number(property) || 0, indicativePrincipal(maxPayment, 5, 25));
	const gap = Math.max(0, (Number(property) || 0) - indicative);
	const submit = (event) => {
		event.preventDefault();
		if (nationalId.length !== 10) {
			showToast("أدخل رقم هوية مكوّن من 10 أرقام");
			return;
		}
		setSent(true);
		onShare();
		showToast("أرسلنا طلب الموافقة للعميل ووثّقنا مصدر الحسبة");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `modal-wrap ${open ? "open" : ""}`,
		"aria-hidden": !open,
		inert: !open,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-scrim",
			onClick: close
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "calculator-modal",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "modal-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "section-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { size: 20 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "وضع المعرض السريع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "حسبة تمويل مبدئية" })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "إغلاق الحاسبة",
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
				})]
			}), !sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shared-flow-steps",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "active",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "1" }), " احسب"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "2" }), " موافقة العميل"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "3" }), " ربط وتوثيق"] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "calc-fields",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "id-field",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رقم هوية العميل" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "رقم هوية العميل",
										inputMode: "numeric",
										maxLength: 10,
										placeholder: "10 أرقام",
										value: nationalId,
										onChange: (e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 10))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { size: 17 })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "يُستخدم لإرسال الطلب للحساب الصحيح—ولا يكفي وحده لعرض أي بيانات." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الدخل الشهري" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "numeric",
								value: income,
								onChange: (e) => setIncome(e.target.value.replace(/\D/g, ""))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "سعر العقار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "numeric",
								value: property,
								onChange: (e) => setProperty(e.target.value.replace(/\D/g, ""))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "calc-result",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow",
								children: "مثال حسابي: 5% سنويًا · 25 سنة · سقف افتراضي 45% من الدخل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "قسط تقديري أعلى" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								maxPayment.toLocaleString("en-US"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س / شهر" })
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "تمويل تقديري" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								indicative.toLocaleString("en-US"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "ر.س" })
							] })] }),
							gap > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["الفارق التقريبي المطلوب تغطيته: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [gap.toLocaleString("en-US"), " ر.س"] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "calc-warning",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "هذه ليست موافقة تمويلية" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "لن تظهر النتيجة في حساب العميل إلا بعد دخوله عبر نفاذ وموافقته على الربط." })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ghost-action",
							onClick: close,
							children: "إلغاء"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "primary-action",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 17 }), " إرسال طلب الحسبة للعميل"]
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "calc-sent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sent-pulse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 31 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow",
						children: "تم إنشاء المثال التجريبي"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "طلب تجريبي داخل الجلسة" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"نموذج طلب للهوية التجريبية المنتهية بـ ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: nationalId.slice(-4) }),
						". تظهر النتيجة بعد موافقته فقط."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "attribution-receipt",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الموظف المستقبِل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "نورة العتيبي" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "الشركة / المشروع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "تلال العقارية • واجهة الدمام" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "حالة التوثيق" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " مسجل بانتظار موافقة العميل"] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "calc-warning",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "التوثيق لا يعني مكافأة تلقائية" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "يثبت مصدر الفرصة، ويبدأ تقييم الاستحقاق فقط بعد اكتمال الصفقة ووفق السياسة المعتمدة." })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-action",
						onClick: () => {
							setSent(false);
							setNationalId("");
							close();
						},
						children: "تم"
					})
				]
			})]
		})]
	});
}
function AiAssistant({ open, close, showToast }) {
	const [question, setQuestion] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)("حيّاك يا عباس 👋 أنا مساعد ديل لاين، معك أفهمك الخيارات وأرتب لك الخطوة الجاية، بدون ما أتخذ قرار عنك.");
	const ask = (value) => {
		const text = value || question;
		if (!text.trim()) return;
		if (text.includes("قسط") || text.includes("تمويل")) setAnswer("حسب الحسبة المبدئية الحالية، نطاق القسط المعروض بين 7,840 و8,120 ر.س. الأرقام تجريبية وتحتاج عرضاً رسمياً من الجهة التمويلية.");
		else if (text.includes("مشروع") || text.includes("بيت")) setAnswer("لو تفضّل الدمام وبيت جاهز، ابدأ بمشروع بيوت تلال — واجهة الدمام. أقدر أساعدك تقارن السعر والمساحة، لكن تأكد من النشرة الرسمية قبل القرار.");
		else setAnswer("أقدر أساعدك في مقارنة المشاريع، فهم العروض، أو معرفة الخطوة المطلوبة في صفقتك. وش الجانب اللي ودك نبدأ فيه؟");
		setQuestion("");
		showToast("جهّز مساعد ديل لاين الرد");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `ai-drawer ${open ? "open" : ""}`,
		"aria-hidden": !open,
		inert: !open,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ai-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 19 }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "مساعد ديل لاين" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " جاهز يساعدك"] })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ai-context",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 15 }), " ردود إرشادية تجريبية، وليست خدمة ذكاء اصطناعي متصلة أو موافقة تمويلية."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ai-body",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ai-bubble",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bot-mark",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { size: 17 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: answer })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ai-prompts",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "جرّب تسأل:" }), [
						"وش أقل قسط؟",
						"وش المشروع المناسب في الدمام؟",
						"وش خطوتي الجاية؟"
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => ask(item),
						children: item
					}, item))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "ai-compose",
				onSubmit: (event) => {
					event.preventDefault();
					ask(question);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "سؤالك لمساعد ديل لاين",
					value: question,
					onChange: (event) => setQuestion(event.target.value),
					placeholder: "اكتب سؤالك هنا..."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "إرسال",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 18 })
				})]
			})
		]
	});
}
function BuyerChat({ open, close, showToast, projectContext }) {
	const [channel, setChannel] = (0, import_react.useState)(projectContext ? "developer" : "bank");
	const bank = channel === "bank";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `chat-drawer ${open ? "open" : ""}`,
		"aria-hidden": !open,
		inert: !open,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "agent-avatar",
					children: bank ? "ف" : "ن"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bank ? "فيصل الشهري" : "نورة العتيبي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					" متاح الآن • ",
					bank ? "مصرف الراجحي" : "مبيعات المطور"
				] })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-tabs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: bank ? "active" : "",
					onClick: () => setChannel("bank"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 15 }), " البنك"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: !bank ? "active" : "",
					onClick: () => setChannel("developer"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 15 }), " المطور"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-context",
				children: [bank ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 17 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 17 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: projectContext ? `${projectContext.name} • ${projectContext.unit}` : "روابي الخبر • A-204" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bank ? "فُتحت قناة البنك بعد اختيار الوحدة والبنك" : "مرتبطة بالمعاملة HI-24081" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "messages",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "اليوم" }), bank ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["حيّاك عباس، استلمت طلبك للوحدة A-204. أراجع المستندات وأوضح لك أي نقص من هنا.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:32 ص" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message outgoing",
						children: ["هل العرض الحالي نهائي؟", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:34 ص ✓✓" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["العرض الظاهر مبدئي. بعد اكتمال المراجعة أرفع لك العرض الرسمي داخل نفس الطلب.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:35 ص" })]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["أهلاً عباس، تم تأكيد حجز الوحدة A-204. أنا معك لأي استفسار يخص العقار.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:18 ص" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message outgoing",
						children: ["ممتاز، هل أحتاج أي إجراء الآن من جهة المطور؟", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:23 ص ✓✓" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["لا، المطلوب الآن فقط رفع كشف الحساب للجهة التمويلية.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:25 ص" })]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "privacy-hint",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 14 }),
					" ",
					bank ? "موظف البنك يرى فقط بيانات الطلب المصرح بها." : "لا تظهر للمطور تفاصيلك التمويلية أو عروض البنوك."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatForm, { showToast }, channel)
		]
	});
}
function SalesChat({ open, close, showToast }) {
	const [channel, setChannel] = (0, import_react.useState)("bank");
	const bank = channel === "bank";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `chat-drawer ${open ? "open" : ""}`,
		"aria-hidden": !open,
		inert: !open,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "agent-avatar",
					children: bank ? "ف" : "س"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bank ? "فيصل الشهري" : "سلمان العتيبي" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					" ",
					bank ? "موظف التمويل • مصرف الراجحي" : "عميل محتمل • روابي الخبر"
				] })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-tabs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: bank ? "active" : "",
					onClick: () => setChannel("bank"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 15 }), " موظف البنك"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: !bank ? "active" : "",
					onClick: () => setChannel("customer"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 15 }), " العميل"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-context",
				children: [bank ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 17 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 17 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bank ? "صفقة نجلاء • FN-2841" : "سجل العميل LD-1842" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bank ? "قناة تنسيق آمنة داخل طلب العميل نفسه" : "تستمر المحادثة عند التحويل إلى صفقة" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "messages",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "اليوم" }), bank ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["نورة، أحتاج نسخة محدثة من عرض سعر الوحدة T-118 لإكمال مراجعة الطلب.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "11:04 ص" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message outgoing",
						children: ["تم، برفعها الآن في خزنة الصفقة وأحدثك هنا.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "11:06 ص ✓✓" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["وصلت، شكراً. ما احتجنا نطلب من العميل يعيد إرسالها.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "11:08 ص" })]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "message incoming",
					children: ["السلام عليكم، هل الوحدة A-204 ما زالت متاحة؟", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:18 ص" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "message outgoing",
					children: ["وعليكم السلام سلمان، أراجع لك آخر حالة للوحدة قبل تأكيد التوفر. هل يناسبك موعد زيارة اليوم بعد المغرب؟", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:22 ص ✓✓" })]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "privacy-hint",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 14 }),
					" ",
					bank ? "تظهر فقط للموظفين المسؤولين عن هذه الصفقة وتُسجل في مسار التدقيق." : "المحادثة ضمن نطاق العميل المسند لك."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatForm, { showToast }, channel)
		]
	});
}
function BankChat({ open, close, showToast }) {
	const [channel, setChannel] = (0, import_react.useState)("developer");
	const developer = channel === "developer";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `chat-drawer ${open ? "open" : ""}`,
		"aria-hidden": !open,
		inert: !open,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "agent-avatar",
					children: developer ? "ن" : "نق"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: developer ? "نورة العتيبي" : "نجلاء القحطاني" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					" ",
					developer ? "موظفة المطور • تلال العقارية" : "العميل • الطلب FN-2841"
				] })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-tabs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: developer ? "active" : "",
					onClick: () => setChannel("developer"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 15 }), " موظف المطور"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: !developer ? "active" : "",
					onClick: () => setChannel("customer"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 15 }), " العميل"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat-context",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 17 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الطلب FN-2841 • الوحدة T-118" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "محادثة مرتبطة بطلب نجلاء القحطاني" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "messages",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: "اليوم" }), developer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message outgoing",
						children: ["نورة، أحتاج نسخة محدثة من عرض سعر الوحدة T-118 لإكمال مراجعة الطلب.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "11:04 ص ✓✓" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["تم، رفعتها في خزنة الصفقة.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "11:06 ص" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message outgoing",
						children: ["وصلت، شكراً. بكمل المراجعة الآن.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "11:08 ص ✓✓" })]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message outgoing",
						children: ["حيّاك، استلمت طلبك وأراجع المستندات الآن.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:32 ص ✓✓" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message incoming",
						children: ["هل فيه شيء ناقص؟", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:34 ص" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message outgoing",
						children: ["حالياً نحتاج كشف الحساب فقط، وتقدر ترفعه من خانة مستنداتك.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10:35 ص ✓✓" })]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "privacy-hint",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 14 }),
					" ",
					developer ? "لا تظهر لموظف المطور بيانات الدخل أو الالتزامات أو تفاصيل العرض." : "لا يشارك هذا الحوار مع المطور إلا بإجراء صريح ومحدد."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatForm, { showToast }, channel)
		]
	});
}
function ChatForm({ showToast }) {
	const [message, setMessage] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [sent.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-sent-message",
		children: [item, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الآن ✓✓" })]
	}, `${item}-${index}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "chat-compose",
		onSubmit: (event) => {
			event.preventDefault();
			if (!message.trim()) return;
			setSent((items) => [...items, message.trim()]);
			setMessage("");
			showToast("أضيفت الرسالة داخل التجربة؛ لم تُرسل لأي جهة خارجية.");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "إرفاق ملف",
				onClick: () => showToast("يمكنك اختيار PDF أو صورة حتى 10MB في الربط الفعلي"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { size: 19 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "الرسالة",
				value: message,
				onChange: (event) => setMessage(event.target.value),
				placeholder: "اكتب رسالتك..."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				"aria-label": "إرسال",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 19 })
			})
		]
	})] });
}
//#endregion
export { HomePage as default };
