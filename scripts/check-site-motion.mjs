import { spawnSync } from "node:child_process";

// Run every requested gate, even if an existing repository issue fails one.
const checks = [
  ["Motion lifecycle and SSR", ["--test", "scripts/verify-motion.mjs"]],
  ["TypeScript", ["node_modules/typescript/bin/tsc", "--noEmit", "--incremental", "false"]],
  ["ESLint", ["node_modules/eslint/bin/eslint.js", "."]],
  ["Production build", ["node_modules/next/dist/bin/next", "build"]],
];
const results = [];
for (const [name, args] of checks) {
  console.log(`\n${name}\n`);
  const result = spawnSync(process.execPath, args, { stdio: "inherit", windowsHide: true });
  if (result.error) console.error(result.error.message);
  results.push({ check: name, exitCode: result.status ?? 1 });
}
console.log("\nVerification results:", JSON.stringify(results));
process.exitCode = results.some((result) => result.exitCode !== 0) ? 1 : 0;
