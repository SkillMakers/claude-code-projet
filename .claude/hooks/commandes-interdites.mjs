// PreToolUse (Bash) : refuse les commandes dangereuses, avec une raison structuree.
// Sortie JSON + exit 0 : plus precis qu'un exit 2 (allow / deny / ask).
import { readFileSync } from "node:fs";

const entree = JSON.parse(readFileSync(0, "utf8"));
const commande = entree.tool_input?.command ?? "";

const interdites = [
  {
    // --force, --force-with-lease, -f, -uf..., ou +branche
    motif: /\bgit\s+push\b.*(\s--force\b|\s-[a-zA-Z]*f\b|\s\+\S)/,
    raison: "git push --force est interdit sur ce depot.",
  },
  {
    // rm -r, -rf, -fr, -Rf... sur /, ~, . ou *, avec ou sans / final
    motif: /\brm\s+(-[a-zA-Z]*[rR][a-zA-Z]*\s+)+(\/|~|\.|\*)\/?(\s|$)/,
    raison: "Suppression recursive de la racine, du home ou du projet.",
  },
  { motif: /\bmvnw?(\.cmd)?\s+.*\bdeploy\b/, raison: "Le deploiement passe par la CI, jamais depuis un poste." },
];

const trouvee = interdites.find((r) => r.motif.test(commande));
if (trouvee) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: trouvee.raison,
    },
  }));
}
process.exit(0);
