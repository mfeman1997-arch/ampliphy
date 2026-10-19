// Turns the Vite build into one self-contained page for a Claude Artifact:
// JS and CSS are inlined (the viewer only loads scripts from approved CDNs); photos ship as files.
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const cssFile = html.match(/href="\.\/(assets\/[^"]+\.css)"/)?.[1];
const jsFile = html.match(/src="\.\/(assets\/[^"]+\.js)"/)?.[1];
if (!cssFile || !jsFile) throw new Error("Could not find the built CSS/JS in dist/index.html");

const css = fs.readFileSync(path.join(dist, cssFile), "utf8");
const js = fs.readFileSync(path.join(dist, jsFile), "utf8").replace(/<\/script/gi, "<\\/script");

const page = `<title>Ampliphy</title>
<meta name="description" content="Plan, publish and follow up on Facebook and Instagram posts from Canva and Gamma designs. Designed in Figma and built in React + TypeScript by Muhammad Feman.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;

const out = path.resolve("artifact");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "ampliphy.html"), page);
console.log(`artifact/ampliphy.html · ${(page.length / 1024).toFixed(0)} KB`);
