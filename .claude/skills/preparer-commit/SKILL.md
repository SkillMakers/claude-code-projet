---
name: preparer-commit
description: Relit les changements en cours et propose un message de commit.
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *)
---

## Etat du depot

!`git status --short`

## Changements

!`git diff HEAD`

## Ta mission

1. Resume les changements ci-dessus en 2 ou 3 points.
2. Signale tout risque : test manquant, valeur en dur, secret, fichier sans rapport.
3. Propose un message de commit en francais : une ligne de 70 caracteres maximum, a l'imperatif,
   puis une ligne vide et le pourquoi en 1 a 3 lignes.
4. Attends mon accord avant de lancer `git commit`.
