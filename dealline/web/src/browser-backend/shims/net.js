const v4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
export const isIP = (s) => (v4.test(s) ? 4 : s.includes(":") && /^[0-9a-f:.]+$/i.test(s) ? 6 : 0);
export default { isIP };
