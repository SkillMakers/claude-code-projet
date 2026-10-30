---
paths:
  - "src/test/**/*.java"
---

# Regles pour les tests

- JUnit 5 et AssertJ (`assertThat`), jamais les assertions JUnit classiques.
- Nom de methode en francais, qui dit le comportement : `refuser_l_annulation_d_une_commande_expediee`.
- Un test de service n'a pas besoin de Spring : `new BoutiqueService()`.
- Un test de controleur utilise `@WebMvcTest` + `MockMvc`, pas `@SpringBootTest`.
- Toujours tester le cas d'erreur, pas seulement le cas nominal.
