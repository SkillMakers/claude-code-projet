---
name: preparer-commit
description: Relit les changements en cours et propose un message de commit.
disable-model-invocation: true
allowed-tools: Bash(git add *)
---

## Etat du depot (les fichiers nouveaux sont marques ??)

!`git status --short --untracked-files=all`

## Changements des fichiers deja suivis

!`git diff HEAD`

## Ta mission

1. Lis aussi les fichiers nouveaux (marques `??` ci-dessus) : ils n'apparaissent pas dans le diff.
2. Resume les changements en 2 ou 3 points.
3. Signale tout risque : test manquant, valeur en dur, secret, fichier sans rapport.
4. Propose un message de commit en francais : une ligne de 70 caracteres maximum, a l'imperatif,
   puis une ligne vide et le pourquoi en 1 a 3 lignes. Pas de ligne `Co-Authored-By`.
5. Attends mon accord avant de lancer `git commit` : il n'est pas pre-autorise, Claude Code me le demandera.
