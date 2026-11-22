import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "@fontsource/alexandria/600.css";
import "@fontsource/alexandria/700.css";
import "@fontsource/alexandria/800.css";
import "./styles/app.css";
import HomePage from "./app/page.jsx";
import { PublicSite } from "./live/PublicSite.jsx";

// Hash routes so the build works on any static host:
//   #/site/<slug>  an office website made with the builder
//   #/office       the office workspace (handled inside HomePage)
//   anything else  the recovered Deal Line experience
function Router() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const site = hash.match(/^#\/site\/([a-z0-9-]+)/);
  if (site) return <PublicSite key={site[1]} slug={site[1]} />;
  // remount on route change so #/office and #/buy take effect from anywhere
  return <HomePage key={hash === "#/office" || hash === "#/buy" ? hash : "home"} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
