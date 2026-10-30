package com.example.boutique;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BoutiqueController.class)
@Import(BoutiqueService.class)
class BoutiqueControllerTest {

	@Autowired
	private MockMvc mvc;

	@Test
	void commande_inconnue_renvoie_404() throws Exception {
		mvc.perform(get("/api/commandes/C-9999"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.detail").value("Commande inconnue : C-9999"));
	}

	@Test
	void annulation_d_une_commande_expediee_renvoie_409() throws Exception {
		mvc.perform(post("/api/commandes/C-1001/annulation"))
				.andExpect(status().isConflict());
	}
}
