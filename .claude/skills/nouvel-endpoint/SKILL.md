---
name: nouvel-endpoint
description: Ajoute un endpoint REST a la boutique, du service au test. A utiliser quand on demande une nouvelle route, une nouvelle action sur une commande ou un produit.
argument-hint: "[description de l'endpoint]"
---

Ajoute cet endpoint : $ARGUMENTS

Procede dans cet ordre, sans sauter d'etape :

1. **Regle metier** dans `BoutiqueService`. Si elle peut echouer, une exception metier explicite.
2. **Test du service** dans `BoutiqueServiceTest` : cas nominal ET cas d'erreur. Lance-le, il doit echouer avant l'implementation.
3. **Route** dans `BoutiqueController`, en suivant `.claude/rules/api-rest.md`.
4. **Test du controleur** avec `MockMvc`, sur le modele de [modele-test.md](modele-test.md).
5. `./mvnw test` : tout doit passer.

Termine par un resume de 3 lignes : la route, le code HTTP de chaque cas, les tests ajoutes.
