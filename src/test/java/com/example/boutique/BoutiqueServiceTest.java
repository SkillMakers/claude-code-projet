package com.example.boutique;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class BoutiqueServiceTest {

	private final BoutiqueService boutique = new BoutiqueService();

	@Test
	void rechercher_ignore_la_casse() {
		assertThat(boutique.rechercher("CLAVIER")).extracting(Produit::reference).containsExactly("CLV-01");
	}

	@Test
	void annuler_une_commande_payee() {
		assertThat(boutique.annuler("C-1002").statut()).isEqualTo(StatutCommande.ANNULEE);
	}

	@Test
	void refuser_une_deuxieme_annulation() {
		boutique.annuler("C-1002");
		assertThatThrownBy(() -> boutique.annuler("C-1002"))
				.isInstanceOf(AnnulationImpossibleException.class)
				.hasMessageContaining("deja annulee");
	}

	@Test
	void refuser_l_annulation_d_une_commande_expediee() {
		assertThatThrownBy(() -> boutique.annuler("C-1001"))
				.isInstanceOf(AnnulationImpossibleException.class)
				.hasMessageContaining("deja expediee");
	}
}
