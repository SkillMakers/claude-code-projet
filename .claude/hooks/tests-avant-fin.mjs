// Stop : Claude ne peut pas annoncer « fini » si du code Java a change et que les tests echouent.
// Exit 2 = Claude reprend la main, avec les tests en echec comme consigne.
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const entree = JSON.parse(readFileSync(0, "utf8"));

// Garde-fou anti-boucle : si on relance deja Claude a cause de ce hook, on le laisse s'arreter.
if (entree.stop_hook_active) process.exit(0);

const modifies = execSync("git status --porcelain", { cwd: entree.cwd, encoding: "utf8" })
  .split("\n")
  .filter((ligne) => ligne.trim().endsWith(".java"));
if (modifies.length === 0) process.exit(0);

const projet = process.env.CLAUDE_PROJECT_DIR ?? entree.cwd;
const mvnw = `"${join(projet, process.platform === "win32" ? "mvnw.cmd" : "mvnw")}"`;
try {
  execSync(`${mvnw} -q test`, { cwd: projet, stdio: "pipe", encoding: "utf8" });
  process.exit(0);
} catch (e) {
  // On ne garde que l'essentiel : quel test echoue, et pourquoi.
  const essentiel = `${e.stdout ?? ""}${e.stderr ?? ""}`
    .split("\n")
    .filter((ligne) => !/^\s+at /.test(ligne))
    .filter((ligne) => /FAIL|Tests run:|xpect|but was|Exception/.test(ligne))
    .slice(0, 20)
    .join("\n");
  console.error(`Les tests echouent apres tes modifications. Corrige-les avant de terminer :\n${essentiel}`);
  process.exit(2);
}
