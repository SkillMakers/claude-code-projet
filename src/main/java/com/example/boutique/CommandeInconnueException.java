package com.example.boutique;

public class CommandeInconnueException extends RuntimeException {

	public CommandeInconnueException(String numero) {
		super("Commande inconnue : " + numero);
	}
}
