// Un hook se teste sans Claude : on lui envoie le JSON qu'il recevrait, et on regarde sa reponse.
// Lancer : node .claude/hooks/tester-les-hooks.mjs
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dossier = dirname(fileURLToPath(import.meta.url));

function bloque(hook, tool_input) {
  const r = spawnSync("node", [join(dossier, hook)], { input: JSON.stringify({ tool_input }), encoding: "utf8" });
  return r.status === 2 || r.stdout.includes('"deny"');
}

const cas = [
  ["garde-secrets.mjs", { new_string: "paiement.cle-api=sk-live-4f9a8b7c6d5e4f3a2b1c0d9e" }, true],
  ["garde-secrets.mjs", { new_string: "password=Ab+cd/efGHijkl12345==" }, true],
  ["garde-secrets.mjs", { new_string: "paiement.cle-api=${PAIEMENT_CLE_API}" }, false],
  ["garde-secrets.mjs", { new_string: "String password = passwordEncoder.encode(brut);" }, false],
  ["garde-secrets.mjs", { content: "PAIEMENT_CLE_API=a-renseigner" }, false],
  ["commandes-interdites.mjs", { command: "git push --force origin main" }, true],
  ["commandes-interdites.mjs", { command: "git push -uf origin main" }, true],
  ["commandes-interdites.mjs", { command: "git push origin +main" }, true],
  ["commandes-interdites.mjs", { command: "git push origin release-f" }, false],
  ["commandes-interdites.mjs", { command: "rm -fr ./" }, true],
  ["commandes-interdites.mjs", { command: "rm -rf target" }, false],
  ["commandes-interdites.mjs", { command: "./mvnw clean deploy" }, true],
];

let echecs = 0;
for (const [hook, entree, attendu] of cas) {
  const obtenu = bloque(hook, entree);
  if (obtenu !== attendu) echecs++;
  console.log(`${obtenu === attendu ? "OK  " : "ECHEC"} ${hook} ${attendu ? "bloque" : "laisse passer"} : ${JSON.stringify(entree)}`);
}
console.log(echecs === 0 ? `\n${cas.length} cas, tous conformes.` : `\n${echecs} cas en echec.`);
process.exit(echecs === 0 ? 0 : 1);
