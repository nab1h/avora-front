"use client";

import { useEffect, useRef } from "react";

export function TypingText({ phrases, locale }: { phrases: string[]; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const phraseKey = JSON.stringify(phrases.filter((phrase) => phrase.trim()));

  useEffect(() => {
    const element = ref.current;
    const words: string[] = JSON.parse(phraseKey);
    if (!element || !words.length) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const segmenter = typeof Intl.Segmenter === "function"
      ? new Intl.Segmenter(locale, { granularity: "grapheme" }) : null;
    const sentences = words.map((word) => segmenter
      ? Array.from(segmenter.segment(word), (part) => part.segment) : Array.from(word));
    let timer: ReturnType<typeof setTimeout> | undefined;
    let phrase = 0;
    let count = 0;
    let deleting = false;
    let stopped = false;

    const tick = () => {
      if (stopped || preference.matches) return;
      const letters = sentences[phrase];
      count += deleting ? -1 : 1;
      element.textContent = letters.slice(0, count).join("");
      let wait = deleting ? 38 : 85;
      if (!deleting && count === letters.length) {
        deleting = true; wait = 2400;
      } else if (deleting && count === 0) {
        deleting = false; phrase = (phrase + 1) % sentences.length; wait = 350;
      }
      timer = setTimeout(tick, wait);
    };
    const start = () => {
      clearTimeout(timer);
      element.textContent = words[0];
      phrase = 0; count = 0; deleting = false;
      if (!preference.matches) {
        timer = setTimeout(() => { element.textContent = ""; tick(); }, 650);
      }
    };
    start();
    preference.addEventListener("change", start);
    return () => {
      stopped = true; clearTimeout(timer);
      preference.removeEventListener("change", start);
    };
  }, [phraseKey, locale]);

  const words: string[] = JSON.parse(phraseKey);
  if (!words.length) return null;
  return (
    <span className="typing-phrase">
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true" className="typing-reserve">
        {words.map((phrase, index) => <span key={index}>{phrase}<span className="typing-cursor">&#8203;</span></span>)}
      </span>
      <span aria-hidden="true" className="typing-visible">
        <span ref={ref}>{words[0]}</span><span className="typing-cursor">&#8203;</span>
      </span>
    </span>
  );
}
