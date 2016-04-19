Devoir 2: Mini-serveur HTTP, courriel, pour le partage de messages
Par: 
- Abdoul Rahim Diallo,
- Mohamed Nassim Hamour, 
- Yacouba Garba Ouddou, 
- Aimé Sean Shaq' BOUSSOUGOU BOUSSOUGOU, 
- Stéphanie England.


Documentation :
Ce programme est un simple serveur de partage qui permet deux personnes de se connecter de manière peer-to-peer et de se partager des messages encryptés.

Afin de se connecter avec quelqu'un d'autre, il doit entrer l'adresse IP de son locuteur dans le fichier Index.js du dossier principal. Il doit aussi envoyer son IP à son locuteur.

-	L'utilisateur est invité à se choisir un nom d'utilisateur et un mot de passe. Ensuite, le programme lui attribut une clé encrypté automatiquement.
-	L'utilisateur peut voir les messages qu'il a reçu et rafraîchir la page afin d'obtenir les messages les plus récents.
-	Il peut envoyer des messages à tous les membres de sa liste de contact. Un message de confirmation apparait lorsque le message est envoyé correctement.
-	Il peut accéder à sa liste de contact et obtenir leur clé encryptée. Sson propre nom est afficher dans la lsite de contacts afin qu'il puisse envoyer sa clé à d'autres personnes qui veulent l'ajouter.
-	Lorsqu'il se connecte avec quelqu'un, le nom d'utilisateur de la personne est sa clé sont ajoutés automatiquement dans la liste de contact.
- Pour ajouter des contacts supplémentaires, la personne peut cliquer le bouton "Nouveau contact". Il est invité à donner un nom au nouveau contact et a entrer la clé du contact qu'il désire ajouter. Lorsqu'aucune clé n'est entrée, une clé est attribuée automatiquement. Cependant, cette clé est liée à un utilisateur inconnu(Donc inutile)
- L'utilisateur peut voir tous les messages qu'il a envoyer. Cependant, cette fonction à rencontré certains problèmes et n'affiche pas le contenu des messages.

Les modules utilisés par le courriel sont dans package.json

La base de données est située dans etat.json. Elle contient tous les contacts, messages et clés

Courriel.js contient les fonctions telles que composer et envoyer des messages, créer un nouveau contact, la fonction pour créer notre clé, ajouter la clé publique dans l’yp et décrypter les messages.

Peers.js permet de gérer la connexion de deux utilisateurs en temps réel
