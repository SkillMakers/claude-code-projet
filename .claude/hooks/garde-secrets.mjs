// PreToolUse (Edit|Write) : refuse d'ecrire un secret en clair, dans n'importe quel fichier.
// Les regles de permission filtrent des chemins ; seul un hook peut lire le contenu.
// Exit 2 = action bloquee, le message sur stderr est renvoye a Claude.
import { readFileSync } from "node:fs";

const entree = JSON.parse(readFileSync(0, "utf8"));
const outil = entree.tool_input ?? {};
const texte = outil.content ?? outil.new_string ?? "";

const motifs = [
  /sk-(live|proj)-[A-Za-z0-9_-]{16,}/, // cle d'API de type sk-live-..., sk-proj-...
  /AKIA[0-9A-Z]{16}/, // cle d'acces AWS
  // nom de secret = valeur litterale d'au moins 16 caracteres, seule en fin de ligne
  // (laisse passer passwordEncoder.encode(...), ${VARIABLE} et les valeurs courtes d'exemple)
  /(password|secret|api[-_.]?key|cle[-_.]?api)\w*\s*[=:]\s*["']?[A-Za-z0-9+/_-]{16,}={0,2}["']?\s*;?\s*$/im,
];

const trouve = motifs.find((motif) => motif.test(texte));
if (trouve) {
  console.error(
    `Bloque : ce contenu ressemble a un secret en clair (${outil.file_path}). ` +
      "Utilise une variable d'environnement, par exemple ${PAIEMENT_CLE_API}, et laisse la valeur dans .env.",
  );
  process.exit(2);
}
process.exit(0);
