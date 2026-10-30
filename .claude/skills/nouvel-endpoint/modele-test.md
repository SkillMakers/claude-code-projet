# Modele de test de controleur

```java
@Test
void annulation_d_une_commande_expediee_renvoie_409() throws Exception {
    mvc.perform(post("/api/commandes/C-1001/annulation"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.detail").value(containsString("deja expediee")));
}
```

- Un test par code HTTP attendu.
- Verifier le corps `ProblemDetail` (`$.detail`), pas seulement le statut.
