# AsthriModBot
A simple discord bot to do moderation stuff and few other function

# Fonction actuel:
## Admin/Mod only
+ ban (avec raison)
+ kick (avec raison)
+ Mute
+ warn
+ clear

## Everyone
+ report
+ ping
+ help
+ help-commands
+ help-game
+ Music

# utilisation:
## ban :
```a!ban [@Utilisateur] [Raison]```  
(Note: Cette commande nessecite un channel #incident sur le serveur ou elle est taper.)
## Kick
```a!kick [@Utilisateur] [Raison]```  
(Note: Cette commande nessecite un channel #incident sur le serveur ou elle est taper.)
## Report
```a!report [@Utilisateur] [Raison]```  
(Note: Cette commande supprimeras le message de l'utilisateur l'ayant taper. pour garder l'anonymat de l'utilisateur ayant envoyer le rapport, cependent les admin peuvent savoirs qui a envoyer ce raport afin de vous contacter en DM pour avoirs plus d'infos sur l'incident. (contact valable sur le serveur de KIRA.))  

(Note2: Cette commande nessecite un channel #report sur le serveur ou elle est taper.)

## Mute 
```a!mute [@Utilisateur] [Time] [Raison]```  
Le temps s'éxprime en anglais par exemple pour mute pendent 10 secondes  
"```a!mute @Everyone 10s booli!```"  
Remplacez le "s" par "h" pour mute pendent 10 heures ou par "d" pour mute pendent 10 jours.

## warn 
```a!warn [@Utilisateur] [Raison]```  
(Note: Cette commande nessecite un channel #incident sur le serveur ou elle est taper.)

## Clear 
```a!clear [1 - 100]```  
Supprimer  un nombre de message (L'API de discord ne permet que de supprimer 100 message par commande au max. Si vous avez plus de message a supprimer, retapez la commande.)

## ping
``` a!ping ```  
Heu... Pong?
Commende de test pour verifier si le bot répond mais a etait tourner en un jeu.

## help, help-commands, help-game
    
```a!help```  
affiche les catégorrie de commands disponible.  
    
```a!help-commands```  
affiche les commands disponible.  
    
```a!help-game```  
affiche les jeu disponible.  

## Commandes Musique.
Le bot musique est en beta et risque de ne pas fonctionner corectement, également il lui manque pas mal de fonctionalité important, tel que l'affichage de la playlist, le repeat mode et bien d'autres choses, ce seras ajouter dans le future.  
```a!play [Liens YouTube]```  
Sert a jouer une video youtube. Merci de preciser le liens et de verifier qu'il n'y ai rien entre /play et le liens si non le bot crash.  
```a!stop```  
Arrete la lecture en cours.  
```a!skip```  
passe a la musique suivante dans la playlist.