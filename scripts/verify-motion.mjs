import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

function load(file, globals = {}, react = React) {
  const module = { exports: {} };
  const result = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  runInNewContext(result.outputText, {
    module, exports: module.exports,
    require: (name) => name === "react" ? react
      : name === "@/lib/utils" ? { cn: (...items) => items.filter(Boolean).join(" ") }
      : require(name),
    ...globals,
  });
  return module.exports;
}

const typingFile = "src/components/shared/typing-text.tsx";
const revealFile = "src/components/shared/reveal.tsx";

function harness(file, { reduced = false } = {}) {
  const effects = [];
  const timers = new Map();
  const listeners = new Set();
  const animations = [];
  let nextId = 0;
  let observer;
  const preference = {
    matches: reduced,
    addEventListener: (_, fn) => listeners.add(fn),
    removeEventListener: (_, fn) => listeners.delete(fn),
  };
  const element = {
    textContent: "server phrase",
    animate: (frames, options) => {
      const animation = { frames, options, cancelled: false, cancel() { this.cancelled = true; } };
      animations.push(animation);
      return animation;
    },
  };
  class Observer {
    constructor(callback) { this.callback = callback; observer = this; }
    observe() {}
    unobserve() { this.unobserved = true; }
    disconnect() { this.disconnected = true; }
  }
  const exports = load(file, {
    window: { matchMedia: () => preference, IntersectionObserver: Observer },
    IntersectionObserver: Observer,
    setTimeout: (callback, delay) => { const id = ++nextId; timers.set(id, { callback, delay }); return id; },
    clearTimeout: (id) => timers.delete(id),
  }, { ...React, useRef: () => ({ current: element }), useEffect: (effect) => effects.push(effect) });
  return {
    exports, element, timers, listeners, animations,
    mount: () => effects[0](),
    next: () => {
      const [id, timer] = timers.entries().next().value;
      timers.delete(id); timer.callback(); return timer.delay;
    },
    preference: (matches) => { preference.matches = matches; for (const fn of listeners) fn(); },
    intersect: () => observer.callback([{ isIntersecting: true }]),
    observer: () => observer,
  };
}

test("server HTML includes meaningful localized text before any JavaScript", () => {
  const { TypingText } = load(typingFile);
  for (const locale of ["ar", "en"]) {
    const messages = JSON.parse(readFileSync(`src/messages/${locale}.json`, "utf8"));
    const phrases = [1, 2, 3, 4].map((n) => messages.heroMotion[`phrase${n}`]);
    assert.ok(phrases.every((text) => typeof text === "string" && text.length));
    const html = renderToStaticMarkup(React.createElement(TypingText, { phrases, locale }));
    assert.ok(html.includes(phrases[0]));
    assert.ok(html.includes('class="sr-only"'));
    assert.ok(html.includes('aria-hidden="true"'));
    assert.ok(html.includes("typing-reserve"));
  }
});

test("typing starts after mount, pauses, deletes, cycles, and cleans up on unmount", () => {
  const h = harness(typingFile);
  h.exports.TypingText({ phrases: ["AB", "CD"], locale: "en" });
  assert.equal(h.timers.size, 0);
  assert.equal(h.element.textContent, "server phrase");
  const cleanup = h.mount();
  assert.equal(h.next(), 650);
  assert.equal(h.element.textContent, "A");
  h.next(); assert.equal(h.element.textContent, "AB");
  assert.equal(h.next(), 2400);
  assert.equal(h.element.textContent, "A");
  h.next(); assert.equal(h.element.textContent, "");
  assert.equal(h.next(), 350);
  assert.equal(h.element.textContent, "C");
  cleanup();
  assert.equal(h.timers.size, 0);
  assert.equal(h.listeners.size, 0);
});

test("Arabic diacritics stay with their letter; preference changes stop and restart safely", () => {
  const h = harness(typingFile);
  h.exports.TypingText({ phrases: ["أَضئ"], locale: "ar" });
  const cleanup = h.mount();
  h.next(); assert.equal(h.element.textContent, "أَ");
  h.preference(true);
  assert.equal(h.element.textContent, "أَضئ");
  assert.equal(h.timers.size, 0);
  h.preference(false); assert.equal(h.timers.size, 1);
  cleanup(); assert.equal(h.timers.size, 0);
});

test("reduced motion uses a static phrase without scheduling a timer", () => {
  const h = harness(typingFile, { reduced: true });
  h.exports.TypingText({ phrases: ["Static", "Next"], locale: "en" });
  const cleanup = h.mount();
  assert.equal(h.element.textContent, "Static");
  assert.equal(h.timers.size, 0);
  cleanup();
});

test("all five reveal variants animate only after intersection and release observers", () => {
  for (const variant of ["fade-up", "fade-in", "fade-left", "fade-right", "scale-in"]) {
    const h = harness(revealFile);
    const tree = h.exports.AnimatedReveal({ variant, children: "Visible content", delay: 900 });
    assert.equal(tree.props.children, "Visible content");
    assert.equal(tree.props.style, undefined);
    assert.equal(h.animations.length, 0);
    const cleanup = h.mount();
    assert.equal(h.animations.length, 0);
    h.intersect(); assert.equal(h.animations.length, 1);
    assert.equal(h.animations[0].options.delay, 300);
    assert.equal(h.observer().unobserved, true);
    h.intersect(); assert.equal(h.animations.length, 1);
    h.preference(true); assert.equal(h.animations[0].cancelled, true);
    cleanup(); assert.equal(h.observer().disconnected, true);
    assert.equal(h.listeners.size, 0);
  }
});

test("repeatable image reveal can run again; reduced motion never hides content", () => {
  const h = harness(revealFile);
  h.exports.AnimatedReveal({ image: true, once: false, children: "Image" });
  const cleanup = h.mount();
  h.intersect(); h.intersect();
  assert.equal(h.animations.length, 2);
  assert.equal(h.animations[0].cancelled, true);
  assert.ok(h.animations[1].frames[0].clipPath);
  cleanup();
  const reduced = harness(revealFile, { reduced: true });
  reduced.exports.AnimatedReveal({ children: "Visible" });
  const stop = reduced.mount(); reduced.intersect();
  assert.equal(reduced.animations.length, 0); stop();
});
