# Organiser un projet avec Claude Code — exemple complet (Spring Boot)

Le depot de la video **ItSkillsMaker** sur l'organisation d'un projet Claude Code :
une petite API Spring Boot (une boutique) et **toute** la configuration Claude Code d'un vrai projet d'equipe.

Tout ce qui est ici a ete execute avec Claude Code 2.1.314, Spring Boot 4.1.1 et Java 21.

## La structure

```text
claude-code-projet/
├── CLAUDE.md                     # Memoire du projet, partagee (git) : commandes, architecture, conventions
├── CLAUDE.local.md.exemple       # A copier en CLAUDE.local.md : tes preferences perso (ignore par git)
├── .gitignore                    # Ignore CLAUDE.local.md, .claude/settings.local.json et .env
├── .env.exemple                  # Les secrets vont dans .env, jamais dans git
└── .claude/
    ├── settings.json             # Permissions (allow / ask / deny) + hooks, partages avec l'equipe
    ├── rules/
    │   ├── tests.md              # Charge seulement quand Claude touche src/test/**/*.java
    │   └── api-rest.md           # Charge seulement quand Claude touche un *Controller.java
    ├── skills/
    │   ├── nouvel-endpoint/      # /nouvel-endpoint : procedure service -> test -> route -> test
    │   │   ├── SKILL.md
    │   │   └── modele-test.md    # Fichier d'appui, lu seulement si besoin
    │   └── preparer-commit/      # /preparer-commit : lit le diff et propose un message
    │       └── SKILL.md
    ├── agents/
    │   └── relecteur.md          # Sous-agent en lecture seule (Read, Grep, Glob)
    └── hooks/
        ├── garde-secrets.mjs         # PreToolUse : refuse d'ecrire un secret en clair
        ├── commandes-interdites.mjs  # PreToolUse : refuse git push --force, mvn deploy...
        └── tests-avant-fin.mjs       # Stop : Claude ne peut pas finir si les tests echouent
```

## Qui sert a quoi

| Besoin | Fichier | Charge quand | Garanti ? |
|---|---|---|---|
| Ce que Claude doit toujours savoir | `CLAUDE.md` | a chaque session | non, c'est une consigne |
| Tes preferences perso sur ce projet | `CLAUDE.local.md` | a chaque session | non |
| Une regle pour un type de fichier | `.claude/rules/*.md` avec `paths` | quand Claude lit un fichier qui correspond | non |
| Une procedure a la demande | `.claude/skills/<nom>/SKILL.md` | description au demarrage, contenu a l'appel | non |
| Une tache isolee (relecture, recherche) | `.claude/agents/*.md` | quand l'agent est lance, dans son propre contexte | outils limites : oui |
| Ce que Claude a le droit de faire | `permissions` dans `.claude/settings.json` | toujours | **oui** |
| Ce qui doit arriver a chaque fois | `hooks` dans `.claude/settings.json` | a l'evenement | **oui** |

**La regle a retenir :** `CLAUDE.md`, les regles et les skills sont des consignes, Claude les suit presque toujours.
Les permissions et les hooks sont executes par Claude Code lui-meme : c'est la qu'on met ce qui ne doit **jamais** arriver.

## Ce qu'on a mesure en construisant ce depot

- Une regle `deny` sur `Read(./.env.*)` bloque aussi l'**ecriture** : Claude Code refuse le `Write` avant meme que le hook soit appele.
- Avec la consigne dans `CLAUDE.md`, Claude refuse de lui-meme d'ecrire une cle en clair ou de faire `git push --force`.
  Le hook n'intervient que s'il insiste ou se trompe : c'est le filet, pas la premiere ligne.
- Le hook `garde-secrets` ne surveille que `Edit|Write`. Une commande shell (`echo ... >> fichier`) passe a cote :
  c'est pour ca qu'on garde aussi les permissions.
- Le hook `Stop` relance Claude quand un test casse. Le champ `stop_hook_active` evite la boucle infinie.

## Utiliser ce depot

```bash
git clone https://github.com/SkillMakers/claude-code-projet.git
cd claude-code-projet
cp CLAUDE.local.md.exemple CLAUDE.local.md   # optionnel
./mvnw test                                  # 5 tests
claude                                        # accepte la confiance du dossier, puis essaie /nouvel-endpoint
```

Les hooks sont en JavaScript (Node 18+) pour tourner pareil sous Windows, macOS et Linux, sans `jq`.

## Sources

- Memoire, CLAUDE.md, CLAUDE.local.md, rules : https://code.claude.com/docs/en/memory
- Le dossier .claude fichier par fichier : https://code.claude.com/docs/en/claude-directory
- Skills : https://code.claude.com/docs/en/skills
- Hooks (guide) : https://code.claude.com/docs/en/hooks-guide
- Settings et permissions : https://code.claude.com/docs/en/settings
- Sous-agents : https://code.claude.com/docs/en/sub-agents
- Quand utiliser quoi : https://code.claude.com/docs/en/features-overview
