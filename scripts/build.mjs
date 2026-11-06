import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import zh from "../site.config.mjs";
import en from "../site.en.mjs";
import languages from "../site.ui.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
);
const text = escapeHtml;
const list = (values) => values.map((value) => "<li>" + text(value) + "</li>").join("\n");
const paragraphs = (values) => values.map((value) => "<p>" + text(value) + "</p>").join("\n");
const base = zh.site.url.replace(/\/$/, "") + "/";
const source = await readFile(path.join(root, "src/index.template.html"), "utf8");

function render(config, language) {
  const ui = languages[language];
  const prefix = language === "en" ? "../" : "";
  const canonical = language === "en" ? base + "en/" : base;
  const context = {
    ...Object.fromEntries(Object.entries(ui).map(([key,value]) => [key,text(value)])),
    prefix,
    title: text(config.site.title),
    description: text(config.site.description),
    canonical: text(canonical),
    alternateZh: text(base),
    alternateEn: text(base + "en/"),
    languageHref: language === "en" ? "../" : "en/",
    domain: text(new URL(base).hostname),
    brandName: text(config.site.brand),
    siteName: text(config.site.name),
    profileName: text(config.profile.name),
    ogImage: text(new URL(config.assets.hero, base).href),
    logo: text(prefix + config.assets.logo),
    hero: text(prefix + config.assets.hero),
    portrait: text(prefix + config.assets.portrait),
    qr: text(prefix + config.assets.wechatQr),
    heroLine1: text(config.hero.lines[0]),
    heroLine2: text(config.hero.lines[1]),
    heroSubtitle: text(config.hero.subtitle),
    credentials: text(config.hero.credentials),
    heroNote: text(config.hero.note),
    profileLead: text(config.profile.lead),
    profileParagraphs: paragraphs(config.profile.paragraphs),
    profileFacts: config.profile.facts.map((fact) =>
      "<div><dt>" + text(fact.label) + "</dt><dd>" + text(fact.value) + "</dd></div>"
    ).join("\n"),
    fullBackground: list(config.profile.fullBackground),
    topics: config.topics.map((topic) =>
      '<article class="topic-row"><span class="topic-index" aria-hidden="true"></span><h3>' +
      text(topic.title) + "</h3><p>" + text(topic.description) + "</p></article>"
    ).join("\n"),
    approachLead: text(config.approach.lead),
    approachDescription: text(config.approach.description),
    training: list(config.approach.training),
    integrated: text(config.approach.integrated),
    communityText: text(config.community.text),
    recognition: text(config.community.recognition),
    contactTitle: text(config.contact.title),
    contactDescription: text(config.contact.description),
    contactHelp: text(config.contact.help),
    personSchema: JSON.stringify({
      "@context": "https://schema.org", "@type": "Person",
      name: config.profile.name, url: canonical,
      image: new URL(config.assets.portrait, base).href,
      jobTitle: language === "en"
        ? ["Professor", "Postgraduate supervisor", "Psychological counselor"]
        : ["教授", "研究生导师", "心理咨询师"],
      knowsAbout: config.topics.map((topic) => topic.title)
    }).replace(/</g, "\\u003c")
  };
  return source.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
    if (!(key in context)) throw new Error("Unknown template field: " + key);
    return context[key];
  });
}

await mkdir(path.join(root, "dist/en"), { recursive: true });
await writeFile(path.join(root, "dist/index.html"), render(zh, "zh"), "utf8");
await writeFile(path.join(root, "dist/en/index.html"), render(en, "en"), "utf8");
await writeFile(path.join(root, "dist/robots.txt"), "User-agent: *\nAllow: /\nSitemap: " + base + "sitemap.xml\n", "utf8");
await writeFile(path.join(root, "dist/sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' +
  text(base) + "</loc></url><url><loc>" + text(base + "en/") + "</loc></url></urlset>\n", "utf8");
console.log("Built Chinese and English pages, robots.txt and sitemap.xml");
