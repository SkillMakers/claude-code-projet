package com.example.boutique;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BoutiqueController {

	private final BoutiqueService boutique;

	public BoutiqueController(BoutiqueService boutique) {
		this.boutique = boutique;
	}

	@GetMapping("/produits")
	public List<Produit> rechercher(@RequestParam String q) {
		return boutique.rechercher(q);
	}

	@GetMapping("/commandes/{numero}")
	public Commande commande(@PathVariable String numero) {
		return boutique.commande(numero);
	}

	@PostMapping("/commandes/{numero}/annulation")
	public Commande annuler(@PathVariable String numero) {
		return boutique.annuler(numero);
	}

	@ExceptionHandler(CommandeInconnueException.class)
	public ProblemDetail introuvable(CommandeInconnueException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
	}

	@ExceptionHandler(AnnulationImpossibleException.class)
	public ProblemDetail conflit(AnnulationImpossibleException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
	}
}
