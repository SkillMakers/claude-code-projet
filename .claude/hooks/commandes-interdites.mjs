// PreToolUse (Bash) : refuse les commandes dangereuses, avec une raison structuree.
// Sortie JSON + exit 0 : plus precis qu'un exit 2 (allow / deny / ask).
import { readFileSync } from "node:fs";

const entree = JSON.parse(readFileSync(0, "utf8"));
const commande = entree.tool_input?.command ?? "";

const interdites = [
  { motif: /git\s+push\s+.*(--force|-f\b)/, raison: "git push --force est interdit sur ce depot." },
  { motif: /rm\s+-rf?\s+(\/|~|\.)(\s|$)/, raison: "Suppression recursive de la racine, du home ou du projet." },
  { motif: /mvnw?\s+.*\bdeploy\b/, raison: "Le deploiement passe par la CI, jamais depuis un poste." },
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
