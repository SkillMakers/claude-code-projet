# Boutique — API Spring Boot

API REST d'une boutique en ligne : recherche de produits, consultation et annulation de commandes.
Spring Boot 4.1, Java 21, Maven. Donnees en memoire (pas de base de donnees).

## Commandes

- Compiler et tester : `./mvnw test`
- Un seul test : `./mvnw test -Dtest=BoutiqueServiceTest`
- Lancer l'application : `./mvnw spring-boot:run` (port 8080)

## Architecture

- `BoutiqueController` : couche HTTP uniquement, aucune regle metier.
- `BoutiqueService` : toutes les regles metier (statuts, annulation).
- `Commande`, `Produit` : records immuables. Un changement d'etat cree un nouveau record.
- Erreurs : exception metier -> `@ExceptionHandler` -> `ProblemDetail` (RFC 9457).

## Conventions

- Code, noms et commentaires en francais, sans accents dans les identifiants.
- Un statut de commande est une valeur de `StatutCommande`, jamais une chaine.
- Toute regle metier nouvelle arrive avec son test dans `BoutiqueServiceTest`.
- Pas de nouvelle dependance Maven sans le demander.

## A ne jamais faire

- Lire ou modifier `.env` et `application-prod.properties` (refuse par les permissions).
- Ecrire un secret en clair dans un fichier (bloque par un hook).
- `git push --force`.
