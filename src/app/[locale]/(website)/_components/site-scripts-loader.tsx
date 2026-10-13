"use client";

import { PublicSiteScript } from "@/lib/services/public-site-scripts";
import Script from "next/script";



const strategyMap: Record<PublicSiteScript["placement"], PublicSiteScript["strategy"]> = {
  head: "beforeInteractive",
  body_start: "afterInteractive",
  body_end: "lazyOnload",
};

function ScriptTag({ script }: { script: PublicSiteScript }) {
  const strategy = script.strategy ?? strategyMap[script.placement];
  const scriptBody = script.code?.trim();

  return (
    <Script
      id={`site-script-${script.id}`}
      strategy={strategy}
      src={script.url || undefined}
      dangerouslySetInnerHTML={
        script.url ? undefined : { __html: scriptBody || "" }
      }
    />
  );
}

export default function SiteScriptsLoader({
  scripts,
  placement,
}: {
  scripts: PublicSiteScript[];
  placement: PublicSiteScript["placement"];
}) {
  const filteredScripts = scripts.filter((script) => script.placement === placement);

  if (!filteredScripts.length) {
    return null;
  }

  return (
    <>
      {filteredScripts.map((script) => (
        <ScriptTag key={script.id} script={script} />
      ))}
    </>
  );
}