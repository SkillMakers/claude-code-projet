---
paths:
  - "src/main/java/**/*Controller.java"
---

# Regles pour les controleurs REST

- Prefixe `/api`, ressources au pluriel : `/api/commandes/{numero}`.
- Une action metier qui n'est pas du CRUD devient une sous-ressource en POST : `/annulation`.
- Erreurs : `ProblemDetail`. Ressource absente = 404, etat incompatible = 409.
- Le controleur ne contient aucune regle metier : il appelle `BoutiqueService`.
