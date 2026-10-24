import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const slides = html.split(/<section class="slide/).slice(1);

test("the deck has ten slides, numbered 1 to 10", () => {
  assert.equal(slides.length, 10);
  slides.forEach((s, i) => assert.match(s, new RegExp(`${i + 1}\\s*/\\s*10`)));
});

test("every slide has a heading", () => {
  slides.forEach((s, i) => assert.match(s, /<h[12][^>]*>/, `slide ${i + 1}`));
});

test("every slide link is https", () => {
  const hrefs = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length > 0);
  hrefs.forEach((h) => assert.match(h, /^https:\/\//, h));
});

test("the sources listed in the README are linked in the deck", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const sources = readme.split(/^## (?:Data and sources|Sources)\s*$/m)[1].split("##")[0].match(/https:\/\/\S+/g);
  assert.ok(sources.length >= 4);
  sources.forEach((u) => assert.ok(html.includes(u), u));
});

test("authorship names John Khan", () => {
  assert.match(html, /<meta name="author" content="John Khan"/);
});
