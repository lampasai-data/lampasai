import type { Question } from "./types";

// Microsoft Power BI (PL-300) certification practice bank.
export const POWERBI_QUESTIONS: Question[] = [
  {
    id: "pbi-q1",
    question:
      "Vous devez réduire la taille d'un modèle de données Power BI qui analyse les ventes de produits dans le temps, tout en conservant la possibilité d'analyser par mois et par trimestre. L'option auto date/heure du modèle est activée. Quelles sont les deux actions à effectuer ?",
    options: [
      "Créer une relation entre la table Date et la table Sales.",
      "Désactiver l'option auto date/heure.",
      "Créer une table Date et sélectionner « Marquer comme table de dates ».",
      "Désactiver le chargement de la table Date.",
      "Supprimer la relation entre la table Product et la table Sales.",
    ],
    correctIndexes: [0, 2],
    explanation:
      "L'option auto date/heure crée une table de dates cachée par produit de données, ce qui gonfle le modèle. Il faut la désactiver, créer une vraie table Date partagée, la marquer comme table de dates, puis la relier à Sales.",
  },
  {
    id: "pbi-q2",
    question:
      "Un rapport Power BI (PBIX de 550 Mo) contient un jeu de données importé avec une table de faits de 12 millions de lignes, actualisée deux fois par jour. Une seule page contient 15 visuels AppSource et 10 visuels par défaut. Les utilisateurs trouvent le rapport lent à charger. Que recommandez-vous ?",
    options: [
      "Implémenter la sécurité au niveau ligne (RLS).",
      "Supprimer les colonnes inutilisées des tables du modèle de données.",
      "Remplacer les visuels par défaut par des visuels AppSource.",
      "Activer les interactions visuelles.",
    ],
    correctIndexes: [1],
    explanation:
      "Supprimer les colonnes inutilisées réduit la taille du modèle et accélère le chargement des visuels ; les autres options n'ont pas d'impact direct sur la performance de chargement.",
  },
  {
    id: "pbi-q3",
    question:
      "Un fichier CSV contient une colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser les réclamations par date et utiliser une hiérarchie de dates intégrée. Que faites-vous ?",
    options: [
      "Appliquer une transformation pour extraire les 11 premiers caractères de la colonne.",
      "Ajouter une colonne conditionnelle qui affiche 2018 si la colonne commence par 2018, type Nombre entier.",
      "Créer une colonne par l'exemple qui commence par 2018-12-31 et définir son type sur Date.",
      "Extraire les 11 derniers caractères de la colonne et définir le type sur Date.",
    ],
    correctIndexes: [2],
    explanation:
      "La colonne par l'exemple permet d'extraire proprement la partie date, puis de la typer en Date pour bénéficier de la hiérarchie de dates intégrée.",
  },
  {
    id: "pbi-q4",
    question:
      "Dans Power Query, une colonne IoT GUID et une colonne IoT ID sont uniques par ligne. Vous devez analyser les événements IoT par heure et par jour de l'année, tout en améliorant la performance du jeu de données. Solution proposée : créer une colonne qui concatène IoT GUID et IoT ID, puis supprimer les deux colonnes d'origine. Cette solution répond-elle à l'objectif ?",
    options: ["Oui", "Non"],
    correctIndexes: [1],
    explanation:
      "Concaténer deux colonnes déjà uniques ne réduit pas la taille ni n'aide à l'analyse par heure/jour ; il fallait plutôt supprimer une des colonnes redondantes (GUID) et convertir la date/heure en colonnes séparées de type approprié.",
  },
  {
    id: "pbi-q5",
    question:
      "Même contexte que la question précédente (colonnes IoT GUID et IoT ID uniques). Solution proposée : supprimer la colonne IoT GUID et conserver uniquement IoT ID. Cette solution répond-elle à l'objectif de réduire la taille du modèle ?",
    options: ["Oui", "Non"],
    correctIndexes: [0],
    explanation:
      "IoT ID (nombre entier) est bien plus compact que IoT GUID (texte) ; supprimer le GUID redondant réduit la taille du modèle sans perte d'information utile.",
  },
  {
    id: "pbi-q6",
    question:
      "Même contexte (colonnes IoT GUID/ID). Solution proposée : changer le type de données de la colonne IoT DateTime en Date (au lieu de Date/Heure). Cette solution permet-elle d'analyser les événements par heure et par jour de l'année ?",
    options: ["Oui", "Non"],
    correctIndexes: [1],
    explanation:
      "Changer le type en Date fait perdre l'information d'heure, indispensable pour analyser les événements « par heure ».",
  },
  {
    id: "pbi-q7",
    question:
      "Un modèle Power BI contient une table Employee avec une colonne ParentEmployeeID représentant le manager de chaque employé, jusqu'au PDG au sommet de la hiérarchie. Vous devez créer une colonne calculée qui retourne le nombre de niveaux entre chaque employé et le PDG. Quelle expression DAX utiliser ?",
    options: [
      "PATHLENGTH(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]))",
      "PATHITEM(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]), 1, INTEGER)",
      "PATHCONTAINS(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]), 1)",
      "PATH(Employee[EmployeeID], Employee[ParentEmployeeID])",
    ],
    correctIndexes: [0],
    explanation:
      "PATH construit la chaîne hiérarchique, et PATHLENGTH en retourne le nombre de segments, soit le niveau hiérarchique de l'employé.",
  },
  {
    id: "pbi-q8",
    question:
      "Vous avez un rapport SQL Server Analysis Services (Excel) et deux tables Excel importées, Customer (ID, Name, Phone, Email, AddressID) et Address (AddressID, Address Line 1/2, City, State/Region, Country, Postal Code). Vous devez obtenir une ligne par client incluant City, State/Region et Country. Que faites-vous ?",
    options: [
      "Fusionner (merge) les tables Customer et Address.",
      "Grouper les tables Customer et Address par la colonne Address ID.",
      "Transposer les tables Customer et Address.",
      "Ajouter (append) les tables Customer et Address.",
    ],
    correctIndexes: [0],
    explanation:
      "La fusion (merge) sur AddressID permet de ramener les colonnes d'adresse dans la table Customer, une ligne par client.",
  },
  {
    id: "pbi-q9",
    question:
      "Vous créez un rapport Power BI pour le service ventes qui importe des données depuis un fichier Excel dans une bibliothèque SharePoint. Le modèle contient plusieurs mesures. Vous devez créer un nouveau rapport à partir des données existantes en minimisant l'effort de développement. Quelle source de données utiliser ?",
    options: [
      "Un jeu de données (dataset) Power BI",
      "Un dossier SharePoint",
      "Des dataflows Power BI",
      "Un classeur Excel",
    ],
    correctIndexes: [0],
    explanation:
      "Se connecter au jeu de données Power BI existant réutilise directement le modèle et les mesures déjà créés, sans dupliquer le travail de modélisation.",
  },
  {
    id: "pbi-q10",
    question:
      "Vous avez un fichier Excel dans un dossier OneDrive qui doit être importé dans un jeu de données Power BI. Vous devez garantir que le jeu de données peut être actualisé depuis powerbi.com. Quels connecteurs pouvez-vous utiliser ?",
    options: [
      "Classeur Excel",
      "Texte/CSV",
      "Dossier",
      "Dossier SharePoint",
      "Web",
    ],
    correctIndexes: [3, 4],
    explanation:
      "Se connecter via un dossier SharePoint (le fichier OneDrive Entreprise est en réalité stocké dans SharePoint) ou via une URL Web permet une actualisation planifiée sans passerelle locale.",
  },
  {
    id: "pbi-q11",
    question:
      "Dans Power Query Editor, vous profilez une colonne. Column statistics indique 277 329 lignes, 365 valeurs distinctes, 20 valeurs uniques (qui n'apparaissent qu'une fois). Combien de valeurs de la colonne n'apparaissent qu'une seule fois ?",
    options: [
      "4 valeurs",
      "65 valeurs",
      "69 valeurs",
      "20 valeurs",
    ],
    correctIndexes: [3],
    explanation:
      "Dans Power Query, le nombre « Unique » du panneau de statistiques de colonne indique précisément le nombre de valeurs qui n'apparaissent qu'une seule fois dans la colonne.",
  },
  {
    id: "pbi-q12",
    question:
      "Vous connectez Power BI Desktop à une base Azure SQL contenant des transactions de vente mises à jour fréquemment. Vous devez générer des rapports de détection de fraude où les données doivent être visibles dans les 5 minutes suivant une mise à jour. Comment configurer la connexion ?",
    options: [
      "Ajouter une instruction SQL.",
      "Définir le paramètre Command timeout en minutes.",
      "Définir le mode de connectivité des données sur Import.",
      "Définir le mode de connectivité des données sur DirectQuery.",
    ],
    correctIndexes: [3],
    explanation:
      "DirectQuery interroge la base en temps réel à chaque interaction, garantissant que les données affichées reflètent l'état actuel de la base (dans les minutes), contrairement à Import qui nécessite une actualisation planifiée.",
  },
  {
    id: "pbi-q13",
    question:
      "Vous avez un dossier contenant 100 fichiers CSV. Vous devez rendre les métadonnées des fichiers (nom, taille, chemin) disponibles comme un jeu de données unique dans Power BI, sans stocker le contenu des fichiers CSV. Quel connecteur Get Data utiliser ?",
    options: ["Dossier (Folder)", "Texte/CSV", "Web", "Liste SharePoint"],
    correctIndexes: [0],
    explanation:
      "Le connecteur Dossier retourne par défaut une table de métadonnées de fichiers (nom, chemin, taille, date de modification, contenu binaire) sans importer le contenu tant qu'on ne l'étend pas explicitement.",
  },
  {
    id: "pbi-q14",
    question:
      "Un développeur BI crée un dataflow Power BI utilisant DirectQuery pour accéder à des tables SQL Server on-premises, avec le moteur de calcul amélioré (Enhanced Dataflows Compute Engine) activé. Vous devez utiliser ce dataflow dans un rapport en minimisant les temps de calcul et de rendu, avec des données à jour jusqu'à la veille. Que faites-vous ?",
    options: [
      "Créer une connexion dataflows en mode DirectQuery.",
      "Créer une connexion dataflows en mode DirectQuery avec une passerelle réseau configurée.",
      "Créer une connexion dataflows en mode Import et planifier une actualisation quotidienne.",
      "Créer une connexion dataflows en mode Import et une solution Power Automate pour actualiser toutes les heures.",
    ],
    correctIndexes: [2],
    explanation:
      "Le mode Import matérialise les données localement (calculs/rendus rapides) ; une actualisation quotidienne suffit puisque la fraîcheur requise est « jusqu'à la veille ».",
  },
  {
    id: "pbi-q15",
    question:
      "Vous publiez un jeu de données qui contient des données d'une base SQL Server on-premises, avec une actualisation quotidienne requise. Quelle est la première chose à configurer pour permettre au service Power BI de se connecter à la base ?",
    options: [
      "Configurer une passerelle de données locale (on-premises data gateway).",
      "Configurer une passerelle de données de réseau virtuel.",
      "Ajouter le propriétaire du jeu de données à la source de données.",
      "Configurer directement l'actualisation planifiée sans rien d'autre.",
    ],
    correctIndexes: [0],
    explanation:
      "Le service Power BI (cloud) ne peut atteindre une base on-premises que via une passerelle de données locale installée sur le réseau de l'entreprise ; c'est le préalable à toute actualisation planifiée.",
  },
  {
    id: "pbi-q16",
    question:
      "Vous tentez de connecter Power BI Desktop à une base de données Cassandra, mais il n'existe pas de connecteur dédié dans la liste Get Data. Quel type de connecteur alternatif choisir ?",
    options: [
      "Base de données Microsoft SQL Server",
      "ODBC",
      "OLE DB",
      "OData",
    ],
    correctIndexes: [1],
    explanation:
      "ODBC est le connecteur générique recommandé pour les bases de données sans connecteur natif Power BI, à condition d'installer le pilote ODBC correspondant.",
  },
  {
    id: "pbi-q17",
    question:
      "Vous importez un fichier Excel contenant deux colonnes Country et City avec des doublons de pays (ex : USA apparaît 3 fois avec des villes différentes). Vous devez créer une dimension contenant une liste de pays uniques. Quelles sont les deux actions à effectuer ?",
    options: [
      "Supprimer la colonne Country.",
      "Supprimer les doublons de la table entière.",
      "Supprimer les doublons de la colonne City.",
      "Supprimer la colonne City.",
      "Supprimer les doublons de la colonne Country.",
    ],
    correctIndexes: [3, 4],
    explanation:
      "Il faut d'abord supprimer la colonne City (qui rend chaque ligne unique), puis dédupliquer la colonne Country restante pour obtenir une liste de pays uniques.",
  },
  {
    id: "pbi-q18",
    question:
      "Vous créez un rapport pour analyser la fréquence de distribution de la longueur des chaînes dans une colonne de texte libre col1, sans affecter la taille du modèle. Que faites-vous ?",
    options: [
      "Ajouter une colonne calculée DAX qui calcule la longueur de col1.",
      "Ajouter une fonction DAX qui calcule la longueur moyenne de col1.",
      "Depuis Power Query Editor, ajouter une colonne qui calcule la longueur de col1.",
      "Depuis Power Query Editor, changer la distribution du profil de colonne pour grouper par longueur pour col1.",
    ],
    correctIndexes: [3],
    explanation:
      "Le profilage de colonne dans Power Query permet de visualiser une distribution par longueur directement, sans ajouter de colonne au modèle et donc sans en augmenter la taille.",
  },
  {
    id: "pbi-q19",
    question:
      "Vous devez fournir à un utilisateur la capacité d'ajouter des membres à un espace de travail (workspace), en respectant le principe du moindre privilège. Quel rôle attribuer ?",
    options: ["Visualiseur (Viewer)", "Administrateur (Admin)", "Contributeur (Contributor)", "Membre (Member)"],
    correctIndexes: [3],
    explanation:
      "Le rôle Membre permet d'ajouter d'autres utilisateurs à l'espace de travail sans donner les droits plus étendus d'un Administrateur.",
  },
  {
    id: "pbi-q20",
    question:
      "Vous avez une requête Power BI nommée Sales avec un champ Sales_Date (date+heure), Status (Finished/Canceled) et Canceled_Date. Seule la date de Sales_Date est utilisée, et seules les lignes avec Status=Finished sont utilisées dans l'analyse. Vous devez réduire les temps de chargement sans affecter l'analyse. Quelles sont les deux actions à effectuer ?",
    options: [
      "Supprimer les lignes où Sales[Status] a la valeur Canceled.",
      "Supprimer la colonne Sales[Sales_Date].",
      "Changer le type de données de Sales[Delivery_Time] en Integer.",
      "Séparer Sales[Sale_Date] en colonnes date et heure distinctes.",
      "Supprimer la colonne Sales[Canceled Date].",
    ],
    correctIndexes: [0, 4],
    explanation:
      "Supprimer les lignes annulées (non utilisées) réduit le volume de données, et supprimer la colonne Canceled_Date (non utilisée) réduit encore la taille, sans affecter l'analyse basée uniquement sur les commandes Finished.",
  },
  {
    id: "pbi-q21",
    question:
      "Vous construisez un rapport pour analyser des transactions clients à partir d'une base contenant les tables Customer et Transaction. Chaque client peut avoir plusieurs transactions, mais chaque transaction appartient à un seul client. Quel type de relation utiliser pour lier les tables ?",
    options: [
      "Un-à-plusieurs de Transaction vers Customer",
      "Un-à-un entre Customer et Transaction",
      "Plusieurs-à-plusieurs entre Customer et Transaction",
      "Un-à-plusieurs de Customer vers Transaction",
    ],
    correctIndexes: [3],
    explanation:
      "Un client (1) peut avoir plusieurs transactions (plusieurs) : c'est une relation un-à-plusieurs allant de la table « un » (Customer) vers la table « plusieurs » (Transaction).",
  },
  {
    id: "pbi-q22",
    question:
      "Un connecteur personnalisé retourne ID, From, To, Subject, Body et Has Attachments pour plus de 10 millions d'e-mails envoyés durant l'année. Vous construisez un rapport analysant les réseaux internes des employés selon les destinataires de leurs e-mails. Vous devez empêcher les destinataires du rapport de lire le contenu des e-mails analysés, en minimisant la taille du modèle. Que faites-vous ?",
    options: [
      "Depuis la vue Modèle, définir les colonnes Subject et Body sur Masqué (Hidden).",
      "Supprimer les colonnes Subject et Body lors de l'import.",
      "Implémenter la sécurité au niveau ligne (RLS) pour que chaque destinataire ne voie que les e-mails qu'il a envoyés.",
    ],
    correctIndexes: [1],
    explanation:
      "Ne pas importer du tout les colonnes Subject et Body à la source empêche toute lecture du contenu et réduit la taille du modèle, contrairement à un simple masquage qui laisse la donnée accessible via DAX/export.",
  },
  {
    id: "pbi-q23",
    question:
      "Vous êtes en train de modéliser des données par lots à partir d'une grande table SQL Server Order (plus de 100 millions d'enregistrements). Pendant le développement, vous devez importer un échantillon des données. Solution proposée : vous ajoutez un filtre au niveau du rapport basé sur la date de commande. Cette solution répond-elle à l'objectif ?",
    options: ["Oui", "Non"],
    correctIndexes: [1],
    explanation:
      "Un filtre au niveau du rapport n'affecte que l'affichage : toute la table est quand même importée en amont dans le modèle, donc l'objectif (limiter la donnée importée pendant le développement) n'est pas atteint.",
  },
  {
    id: "pbi-q24",
    question:
      "Même contexte (table Order de 100 millions de lignes). Solution proposée : vous ajoutez une clause WHERE à l'instruction SQL de la source. Cette solution répond-elle à l'objectif d'importer un échantillon de données ?",
    options: ["Oui", "Non"],
    correctIndexes: [0],
    explanation:
      "Une clause WHERE dans l'instruction SQL source filtre les données avant même qu'elles n'arrivent dans Power Query, limitant réellement le volume importé — contrairement à un filtre appliqué après coup dans le rapport ou en DAX.",
  },
  {
    id: "pbi-q25",
    question:
      "Vous avez un rapport qui importe une table Date et une table Sales depuis une base Azure SQL. La table Sales possède trois clés étrangères de date : Due Date, Order Date et Delivery Date. Vous devez permettre l'analyse des ventes dans le temps selon les trois clés. Solution proposée : pour chaque clé étrangère, vous ajoutez des relations inactives entre Sales et Date. Cette solution répond-elle à l'objectif ?",
    options: ["Oui", "Non"],
    correctIndexes: [1],
    explanation:
      "Une seule table Date reliée trois fois (une relation active + deux inactives) nécessite ensuite des mesures DAX avec USERELATIONSHIP pour activer chaque relation à la demande — cette étape manque ici, donc l'objectif n'est pas complètement atteint tel quel.",
  },
  {
    id: "pbi-q26",
    question:
      "Même contexte (Due/Order/Delivery Date). Solution proposée : depuis Power Query Editor, vous renommez la requête Date en Due Date, puis vous la référencez deux fois pour créer les requêtes Order Date et Delivery Date (trois tables de dates distinctes). Cette solution répond-elle à l'objectif ?",
    options: ["Oui", "Non"],
    correctIndexes: [0],
    explanation:
      "Créer trois tables de dates distinctes (une par clé étrangère) permet de créer trois relations actives simples, une par table, sans avoir besoin de USERELATIONSHIP — cela répond bien à l'objectif.",
  },
  {
    id: "pbi-q27",
    question:
      "Même contexte (Due/Order/Delivery Date). Solution proposée : vous créez des mesures DAX qui utilisent la fonction USERELATIONSHIP pour filtrer les ventes selon la relation active entre Sales et Date. Cette solution répond-elle à l'objectif ?",
    options: ["Oui", "Non"],
    correctIndexes: [1],
    explanation:
      "USERELATIONSHIP sert justement à activer temporairement une relation inactive dans une mesure — utiliser cette fonction pour filtrer sur la relation déjà active n'a aucun effet et ne résout pas le besoin d'analyser via les relations inactives.",
  },
  {
    id: "pbi-q28",
    question:
      "Vous devez créer un jeu de données Power BI. Les exigences imposent l'absence de pipelines de déploiement Power BI et un minimum d'effort administratif, pour interroger trois environnements différents (dev/test/prod) avec des URL de serveur différentes. Quel mode de jeu de données utiliser ?",
    options: ["Import", "DirectQuery", "Composite", "Connexion en direct (live connection)"],
    correctIndexes: [2],
    explanation:
      "Un jeu de données composite permet de définir un paramètre de serveur qui change selon l'environnement, avec un seul fichier PBIX à publier dans chaque espace de travail, sans pipeline de déploiement.",
  },
  {
    id: "pbi-q29",
    question:
      "Vous avez cinq régions de ventes, chacune avec plusieurs managers. Un rôle RLS dynamique nommé Sales filtre les données de transactions par vendeur. Une vendeuse pense qu'elle devrait voir plus de données que ce qu'elle voit actuellement. Vous devez vérifier ce qu'elle voit réellement. Que faites-vous ?",
    options: [
      "Utiliser l'option « Tester en tant que rôle » (Test as role) pour visualiser les données avec le compte utilisateur de la vendeuse.",
      "Utiliser « Tester en tant que rôle » pour visualiser les données avec le rôle Sales générique.",
      "Demander à la vendeuse d'ouvrir le rapport dans Power BI Desktop.",
      "Filtrer les données du rapport pour reproduire la logique attendue du filtre RLS.",
    ],
    correctIndexes: [0],
    explanation:
      "Tester en tant que rôle avec le compte spécifique de l'utilisatrice permet de reproduire exactement ce qu'elle voit (y compris son appartenance précise aux groupes RLS), contrairement à un test générique du rôle.",
  },
  {
    id: "pbi-q30",
    question:
      "Vous avez plusieurs tableaux de bord Power BI. Vous devez permettre aux utilisateurs, en parcourant powerbi.com, d'identifier facilement quels tableaux de bord contiennent des informations personnelles identifiables (PII), en minimisant l'effort de configuration et l'impact sur la conception. Que faites-vous ?",
    options: [
      "Utiliser des étiquettes de confidentialité Microsoft Information Protection (sensitivity labels).",
      "Utiliser des tuiles (tiles) dédiées.",
      "Utiliser des commentaires.",
      "Utiliser des groupes Active Directory.",
    ],
    correctIndexes: [0],
    explanation:
      "Les étiquettes de sensibilité s'affichent automatiquement dans la liste des tableaux de bord sans modifier leur contenu ni leur conception.",
  },
  {
    id: "pbi-q31",
    question:
      "Vous avez cinq rapports et deux tableaux de bord dans un espace de travail. Vous devez accorder à tous les utilisateurs de l'organisation un accès en lecture à un tableau de bord et trois rapports spécifiques. Solution proposée : publier une application (app) à toute l'organisation, en incluant uniquement les éléments sélectionnés. Cette solution répond-elle à l'objectif ?",
    options: ["Oui", "Non"],
    correctIndexes: [0],
    explanation:
      "Une application Power BI permet de sélectionner précisément quels rapports et tableaux de bord inclure et de les distribuer à toute l'organisation en lecture seule.",
  },
  {
    id: "pbi-q32",
    question:
      "Même contexte (cinq rapports, deux tableaux de bord). Solution proposée : activer « Inclus dans l'application » (included in app) pour tous les éléments de l'espace de travail. Cette solution répond-elle à l'objectif de ne partager qu'un tableau de bord et trois rapports précis ?",
    options: ["Oui", "Non"],
    correctIndexes: [1],
    explanation:
      "Inclure tous les éléments dans l'application partagerait les cinq rapports et les deux tableaux de bord, alors que seuls un tableau de bord et trois rapports doivent être partagés.",
  },
  {
    id: "pbi-q33",
    question:
      "Même contexte (cinq rapports, deux tableaux de bord). Solution proposée : attribuer à tous les utilisateurs le rôle Visualiseur (Viewer) sur l'espace de travail entier. Cette solution répond-elle à l'objectif de ne partager qu'un tableau de bord et trois rapports précis ?",
    options: ["Oui", "Non"],
    correctIndexes: [1],
    explanation:
      "Le rôle Visualiseur sur l'espace de travail entier donnerait accès à tout son contenu (cinq rapports, deux tableaux de bord), pas seulement aux quatre éléments souhaités.",
  },
  {
    id: "pbi-q34",
    question:
      "Depuis Power BI Desktop, vous publiez un nouveau jeu de données et un rapport dans un espace de travail. Le jeu de données a un rôle RLS nommé HR. Vous devez garantir que les membres de l'équipe RH ont bien la RLS appliquée lorsqu'ils consultent les rapports basés sur ce jeu de données. Que faites-vous ?",
    options: [
      "Depuis powerbi.com, ajouter les utilisateurs au rôle HR du jeu de données.",
      "Depuis powerbi.com, partager le jeu de données avec les membres de l'équipe RH.",
      "Depuis Power BI Desktop, modifier les paramètres de sécurité au niveau ligne.",
      "Depuis Power BI Desktop, importer une table contenant les membres de l'équipe RH.",
    ],
    correctIndexes: [0],
    explanation:
      "L'appartenance aux rôles RLS se gère côté service (powerbi.com) après publication, en associant des utilisateurs ou groupes à chaque rôle défini dans le fichier PBIX.",
  },
  {
    id: "pbi-q35",
    question:
      "Un tableau de bord Power BI surveille la qualité de fabrication, avec un graphique linéaire du nombre de produits défectueux par jour et un visuel KPI du pourcentage quotidien actuel de produits défectueux. Vous devez être averti quand ce pourcentage dépasse 3 %. Que créez-vous ?",
    options: [
      "Un abonnement (subscription)",
      "Une alerte (data alert)",
      "Un visuel de narration intelligente (smart narrative)",
      "Un visuel Q&A",
    ],
    correctIndexes: [1],
    explanation:
      "Une alerte de données sur un visuel KPI/carte permet de définir un seuil (ici 3 %) et de recevoir une notification dès que ce seuil est dépassé.",
  },
  {
    id: "pbi-q36",
    question:
      "Vous créez un rapport Power BI Desktop utilisant des données d'un cube SQL Server Analysis Services (SSAS) situé sur le réseau interne de l'entreprise. Vous prévoyez de publier ce rapport sur le service Power BI. Que devez-vous implémenter pour que les utilisateurs consommant le rapport aient les données les plus à jour du cube ?",
    options: [
      "Un flux OData",
      "Une passerelle de données locale (on-premises data gateway)",
      "Un abonnement",
      "Une actualisation planifiée du jeu de données",
    ],
    correctIndexes: [1],
    explanation:
      "Le service Power BI (cloud) ne peut atteindre un cube SSAS sur le réseau interne que via une passerelle de données locale, qui permet en plus une connexion en direct (live connection) toujours à jour.",
  },
  {
    id: "pbi-q37",
    question:
      "Vous devez créer une visualisation qui compare le profit sur 10 catégories de produits pour un trimestre sélectionné. Quel type de visuel est le plus adapté ?",
    options: ["Un graphique en aires", "Un graphique en entonnoir", "Un graphique à barres groupées", "Un graphique linéaire"],
    correctIndexes: [2],
    explanation:
      "Un graphique à barres groupées est idéal pour comparer une valeur (le profit) entre plusieurs catégories discrètes à un instant donné.",
  },
  {
    id: "pbi-q38",
    question:
      "Vous avez un jeu de données Power BI nommé Finance hébergé dans un espace de travail. L'équipe finance n'est actuellement membre d'aucun rôle de l'espace de travail. Vous devez permettre à cette équipe d'analyser le jeu de données Finance directement depuis Microsoft Excel. Que faites-vous ?",
    options: [
      "Accorder à l'équipe finance la permission Build sur le jeu de données Finance.",
      "Fournir un classeur Excel déjà connecté au jeu de données Finance.",
      "Créer un rôle de sécurité au niveau ligne (RLS) et ajouter l'équipe finance comme membres.",
      "Accorder à l'équipe finance la permission d'écriture (write) sur le jeu de données Finance.",
    ],
    correctIndexes: [0],
    explanation:
      "La permission Build est nécessaire et suffisante pour qu'un utilisateur puisse se connecter directement à un jeu de données via Analyser dans Excel, sans être membre de l'espace de travail.",
  },
  {
    id: "pbi-q39",
    question:
      "Vous avez un rapport contenant un visuel avec une mesure. Vous devez garantir que toutes les valeurs affichent deux décimales, et que toutes les valeurs négatives s'affichent en rouge et entre parenthèses. Quelles sont les deux actions à effectuer ?",
    options: [
      "Sur le visuel, appliquer une mise en forme conditionnelle à la couleur d'arrière-plan.",
      "Configurer la mesure pour utiliser un format personnalisé.",
      "Sur le visuel, appliquer une mise en forme conditionnelle à la couleur de police.",
      "Sur le visuel, définir le nombre de décimales des valeurs sur 2.",
    ],
    correctIndexes: [1, 2],
    explanation:
      "Un format personnalisé sur la mesure gère l'affichage à deux décimales et les parenthèses pour les négatifs ; la mise en forme conditionnelle de la police gère la couleur rouge pour les valeurs négatives.",
  },
  {
    id: "pbi-q40",
    question:
      "Vous avez un tenant Power BI hébergeant des rapports utilisant des jeux de données financiers, exportés en PDF. Vous devez garantir que ces rapports sont chiffrés. Que devez-vous implémenter ?",
    options: [
      "Des stratégies Microsoft Intune",
      "La sécurité au niveau ligne (RLS)",
      "Des étiquettes de sensibilité (sensitivity labels)",
      "Des certifications de jeu de données",
    ],
    correctIndexes: [2],
    explanation:
      "Les étiquettes de sensibilité, intégrées à Microsoft Information Protection, appliquent un chiffrement qui persiste même après export du rapport en PDF.",
  },
  {
    id: "pbi-q41",
    question:
      "Vous avez un fichier Excel sur un serveur de fichiers. Vous créez un rapport Power BI en important une table de ce fichier, puis vous le publiez. Vous devez garantir que les données s'actualisent toutes les quatre heures. Que devez-vous faire en premier ?",
    options: [
      "Charger le fichier Excel dans un espace de travail Power BI.",
      "Créer un abonnement au rapport.",
      "Déployer une passerelle de données locale.",
      "Modifier les identifiants de la source de données.",
    ],
    correctIndexes: [2],
    explanation:
      "Un fichier sur un serveur de fichiers d'entreprise n'est accessible depuis le service Power BI qu'au travers d'une passerelle de données locale, préalable indispensable à toute actualisation planifiée.",
  },
  {
    id: "pbi-q42",
    question:
      "Vous avez un jeu de données peu utilisé, actualisé toutes les heures. Vous recevez une notification indiquant que l'actualisation a été désactivée pour cause d'inactivité. Quelles sont les deux actions qui relanceront la planification de l'actualisation ?",
    options: [
      "Activer la mise en cache des requêtes (query caching) pour le jeu de données.",
      "Importer le jeu de données dans Microsoft Excel.",
      "Depuis le service Power BI, ouvrir un tableau de bord qui utilise le jeu de données.",
      "Depuis le service Power BI, ouvrir un rapport qui utilise le jeu de données.",
      "Depuis PowerShell, exécuter la commande get-powerbireport.",
    ],
    correctIndexes: [2, 3],
    explanation:
      "L'actualisation est suspendue faute d'usage réel du jeu de données ; ouvrir un tableau de bord ou un rapport qui l'utilise redémarre le compteur d'inactivité et réactive la planification.",
  },
  {
    id: "pbi-q43",
    question:
      "Vous avez un espace de travail contenant un jeu de données, un rapport et un tableau de bord. Des utilisateurs externes, managers et employés y accèdent avec des niveaux d'accès différents (RLS pour les employés notamment). Vous devez permettre à tous, y compris les externes, de signaler un problème sur le tableau de bord aux administrateurs de l'espace de travail, de façon visible par les autres utilisateurs. Que utilisez-vous ?",
    options: [
      "Les commentaires (comments)",
      "Le chat Microsoft Teams",
      "Les alertes",
      "Les abonnements",
    ],
    correctIndexes: [0],
    explanation:
      "Les commentaires sur un tableau de bord permettent de mentionner (taguer) des utilisateurs, dont les administrateurs, et sont visibles par tous les utilisateurs ayant accès au tableau de bord — y compris les invités externes.",
  },
  {
    id: "pbi-q44",
    question:
      "Vous avez un fichier PBIX qui importe plusieurs tables depuis une base Azure SQL. Les données vont être migrées vers une autre base Azure SQL. Vous devez modifier les connexions du fichier PBIX en minimisant l'effort d'administration. Que faites-vous ?",
    options: [
      "Depuis Power Query Editor, créer de nouvelles requêtes.",
      "Depuis Power Query Editor, modifier la source de chaque requête individuellement.",
      "Créer un fichier PBIT, l'ouvrir et changer les sources de données lorsque demandé.",
      "Modifier les paramètres de la source de données (Data source settings).",
    ],
    correctIndexes: [3],
    explanation:
      "Les paramètres de source de données permettent de changer le serveur/base pour toutes les requêtes concernées en une seule opération centralisée, sans toucher à chaque requête individuellement.",
  },
  {
    id: "pbi-q45",
    question:
      "Vous avez un espace de travail Power BI contenant plusieurs rapports. Vous devez permettre à un utilisateur de créer un tableau de bord réutilisant des visuels de ces rapports. Que faites-vous ?",
    options: [
      "Créer un rôle de sécurité au niveau ligne (RLS) et y ajouter l'utilisateur.",
      "Partager les rapports avec l'utilisateur.",
      "Accorder la permission de lecture (Read) sur les jeux de données à l'utilisateur.",
      "Ajouter l'utilisateur comme membre (member) de l'espace de travail.",
      "Ajouter l'utilisateur comme visualiseur (Viewer) de l'espace de travail.",
    ],
    correctIndexes: [3],
    explanation:
      "Épingler des visuels sur un tableau de bord nécessite de pouvoir éditer du contenu dans l'espace de travail : le rôle Membre (ou supérieur) est nécessaire, un simple Visualiseur ne peut pas créer de tableau de bord.",
  },
  {
    id: "pbi-q46",
    question:
      "Vous avez un jeu de données Power BI et un rapport associé. Vous devez garantir que les utilisateurs peuvent analyser les données dans Microsoft Excel uniquement en se connectant directement au jeu de données (Analyser dans Excel), sans pouvoir exporter les données depuis le rapport lui-même. Vous accordez la permission Build. Que faites-vous ensuite ?",
    options: [
      "Certifier le jeu de données utilisé par le rapport.",
      "Changer l'interaction visuelle par défaut du rapport.",
      "Pour le rapport, changer le paramètre d'export de données sur « Aucun » (None).",
      "Pour le rapport, changer le paramètre d'export sur « Données résumées, données avec mise en page actuelle et données sous-jacentes ».",
    ],
    correctIndexes: [2],
    explanation:
      "Désactiver totalement l'export sur le rapport bloque toute extraction de données depuis les visuels, tout en laissant intacte la permission Build qui autorise l'accès direct au jeu de données via Excel.",
  },
  {
    id: "pbi-q47",
    question:
      "Vous devez transférer la maintenance de l'appartenance aux rôles RLS à une équipe sécurité réseau Azure, sans leur donner la capacité de gérer les rapports, jeux de données ou tableaux de bord. Que faites-vous ?",
    options: [
      "Accorder à l'équipe les permissions Read et Build sur les jeux de données Power BI.",
      "Configurer des instructions personnalisées pour la fonctionnalité de demande d'accès, indiquant de contacter l'équipe sécurité réseau.",
      "Demander à l'équipe sécurité réseau de créer des groupes de sécurité, puis configurer la RLS pour utiliser ces groupes.",
      "Ajouter l'équipe sécurité réseau comme membres du rôle RLS.",
    ],
    correctIndexes: [2],
    explanation:
      "En confiant la gestion des groupes de sécurité Azure AD (et non des rôles Power BI directement) à l'équipe réseau, celle-ci peut ajouter/retirer des membres sans jamais accéder aux rapports, jeux de données ou tableaux de bord Power BI.",
  },
  {
    id: "pbi-q48",
    question:
      "Vous avez quatre régions de vente, chacune avec plusieurs managers. La RLS filtre les données de vente par région, avec un groupe de sécurité mail-enabled assigné à chaque rôle. Un manager change de région. Que faites-vous pour qu'il voie les bonnes données ?",
    options: [
      "Changer le type de licence Power BI du manager.",
      "Depuis Power BI Desktop, modifier le paramètre de sécurité au niveau ligne des rapports.",
      "Gérer les permissions du jeu de données sous-jacent.",
      "Demander l'ajout du manager au bon groupe Azure Active Directory.",
    ],
    correctIndexes: [3],
    explanation:
      "Puisque la RLS est basée sur l'appartenance à des groupes AD mail-enabled, il suffit de déplacer le manager du groupe de son ancienne région vers celui de sa nouvelle région pour que le filtre RLS s'applique correctement.",
  },
  {
    id: "pbi-q49",
    question:
      "Vous avez plus de 100 jeux de données publiés, dont 10 ont été vérifiés conformes aux standards qualité de l'entreprise. Vous devez garantir que ces 10 jeux de données apparaissent en tête de liste lors des recherches. Que faites-vous ?",
    options: [
      "Promouvoir les jeux de données (Promote).",
      "Certifier les jeux de données (Certify).",
      "Mettre le jeu de données en avant sur la page d'accueil.",
      "Publier les jeux de données dans une application.",
    ],
    correctIndexes: [1],
    explanation:
      "La certification est le plus haut niveau de qualité endossé, qui fait remonter automatiquement les jeux de données certifiés en tête des résultats de recherche dans toute l'organisation.",
  },
  {
    id: "pbi-q50",
    question:
      "Vous devez créer une visualisation qui explore les données de manière ad hoc, en descendant automatiquement dans les dimensions selon l'intérêt de l'utilisateur, comme illustré par un exemple de type arborescence de décomposition. Quel type de visuel utiliser ?",
    options: [
      "Narration intelligente (smart narrative)",
      "Arbre de décomposition (decomposition tree)",
      "Q&A",
      "Facteurs clés (key influencers)",
    ],
    correctIndexes: [1],
    explanation:
      "L'arbre de décomposition permet une exploration ad hoc, où l'utilisateur choisit interactivement selon quel champ approfondir l'analyse à chaque étape.",
  },
  {
    id: "pbi-q51",
    question:
      "Vous avez une table de 1 000 lignes de données de vente. Vous devez identifier des valeurs aberrantes (outliers). Quel type de visualisation utiliser ?",
    options: ["Un graphique en aires", "Un nuage de points (scatter plot)", "Un graphique circulaire", "Un graphique en anneau"],
    correctIndexes: [1],
    explanation:
      "Un nuage de points permet de visualiser la distribution de deux variables numériques et de repérer facilement les points isolés du reste du nuage.",
  },
  {
    id: "pbi-q52",
    question:
      "Vous avez un rapport de trois pages, dont l'une contient un visuel KPI. Vous devez filtrer tous les visuels du rapport sauf le visuel KPI. Quelles sont les deux actions à effectuer ?",
    options: [
      "Modifier les interactions du visuel KPI.",
      "Ajouter le même segment (slicer) à chaque page et configurer la synchronisation des segments (sync slicers).",
      "Modifier les interactions du segment situé sur la même page que le visuel KPI.",
      "Configurer un filtre au niveau de la page.",
      "Configurer un filtre au niveau du rapport.",
    ],
    correctIndexes: [1, 2],
    explanation:
      "En synchronisant un segment identique sur toutes les pages, puis en désactivant son interaction avec le visuel KPI sur la page où il se trouve, on filtre tous les autres visuels du rapport sans jamais toucher au KPI.",
  },
  {
    id: "pbi-q53",
    question:
      "Vous avez un rapport avec un visuel carte (card). Vous devez appliquer une mise en forme conditionnelle : police rouge foncé si la valeur est ≥ 100, gris foncé si < 100, en minimisant l'effort de conception. Quel type de format utiliser ?",
    options: ["Échelle de couleurs (color scale)", "Règles (rules)", "Valeur de champ (field value)"],
    correctIndexes: [1],
    explanation:
      "Les règles permettent de définir des seuils numériques précis (≥100, <100) associés chacun à une couleur de police fixe, exactement ce que demande le besoin.",
  },
  {
    id: "pbi-q54",
    question:
      "Vous êtes en train de créer un rapport Power BI et devez inclure un visuel qui affiche automatiquement des tendances et informations utiles, se mettant à jour selon les sélections faites dans d'autres visuels. Quel type de visuel utiliser ?",
    options: ["Q&A", "Narration intelligente (smart narrative)", "Facteurs clés (key influencers)", "Arbre de décomposition"],
    correctIndexes: [1],
    explanation:
      "Le visuel de narration intelligente génère automatiquement un résumé textuel des tendances des données affichées, et se met à jour dynamiquement selon les filtres/sélections en cours.",
  },
  {
    id: "pbi-q55",
    question:
      "Vous avez deux rapports Power BI utilisant chacun une palette de couleurs distincte. Vous créez un tableau de bord incluant deux visuels de chaque rapport. Vous devez utiliser un thème sombre cohérent pour le tableau de bord, tout en préservant les couleurs d'origine des rapports. Quelles sont les deux actions à effectuer ?",
    options: [
      "Charger une capture d'écran (snapshot).",
      "Définir la préférence de couleur du navigateur sur le mode sombre.",
      "Lors de l'épinglage des visuels au tableau de bord, sélectionner « Utiliser le thème de destination » (Use destination theme).",
      "Sélectionner le thème de tableau de bord sombre (dark dashboard theme).",
      "Activer le flux de tuiles (tile flow).",
    ],
    correctIndexes: [2, 3],
    explanation:
      "Choisir « Utiliser le thème de destination » lors de l'épinglage préserve les couleurs propres à chaque visuel plutôt que d'adopter le thème du tableau de bord, tandis que sélectionner le thème sombre du tableau de bord assure une base visuelle cohérente pour l'ensemble.",
  },
  {
    id: "pbi-q56",
    question:
      "Votre entreprise compte des employés répartis dans 10 états, récemment regroupés en trois régions : Est, Ouest, Nord. Votre modèle de données contient les employés par état, mais pas l'information de région. Vous avez un rapport montrant les employés par état. Vous devez visualiser les employés par région le plus rapidement possible. Que faites-vous ?",
    options: [
      "Créer une nouvelle agrégation qui résume par état.",
      "Créer une nouvelle agrégation qui résume par employé.",
      "Créer un nouveau groupe sur la colonne état et définir le type de groupe sur Liste (List).",
      "Créer un nouveau groupe sur la colonne état et définir le type de groupe sur Bin.",
    ],
    correctIndexes: [2],
    explanation:
      "Un groupe de type Liste permet d'assigner manuellement chaque valeur d'état à une catégorie personnalisée (ici une région), le moyen le plus rapide sans modifier le modèle de données sous-jacent.",
  },
  {
    id: "pbi-q57",
    question:
      "Vous avez une collection de rapports pour le service RH de votre entreprise. Vous devez créer une visualisation montrant l'historique du nombre d'employés et prédisant les tendances des six prochains mois. Quel type de visualisation utiliser ?",
    options: ["Graphique en ruban (ribbon chart)", "Nuage de points (scatter chart)", "Graphique linéaire (line chart)", "Facteurs clés (key influencers)"],
    correctIndexes: [2],
    explanation:
      "Le graphique linéaire est le seul de cette liste à proposer nativement une fonctionnalité de prévision (forecast) sur une série temporelle continue.",
  },
  {
    id: "pbi-q58",
    question:
      "Vous avez un rapport contenant quatre pages, toutes avec un segment (slicer) sur un champ Country. Vous devez garantir que la sélection d'un pays sur la page 1 est conservée sur les pages 2 et 3, sans affecter la page 4. Que faites-vous ?",
    options: [
      "Supprimer le segment Country des pages 1, 2 et 3, et ajouter le champ Country aux filtres de niveau page.",
      "Supprimer le segment Country des pages 1, 2 et 3, et ajouter le champ Country aux filtres de niveau rapport.",
      "Déplacer le segment Country des pages 2 et 3 vers la page 1.",
      "Synchroniser le segment Country sur les pages 1, 2 et 3 uniquement.",
    ],
    correctIndexes: [3],
    explanation:
      "La synchronisation de segments permet de choisir précisément quelles pages partagent la même sélection (ici 1, 2 et 3), tout en laissant la page 4 indépendante — sans passer par des filtres globaux qui toucheraient toutes les pages.",
  },
  {
    id: "pbi-q59",
    question:
      "Vous planifiez de créer un jeu de données Power BI qui analyse l'attrition des employés selon des dimensions comme l'âge, le salaire ou la satisfaction, avec une visualisation permettant d'identifier automatiquement quels facteurs influencent le plus une valeur cible. Quel type de visuel utiliser ?",
    options: ["Facteurs clés (key influencers)", "Graphique en ruban", "Q&A", "Graphique en entonnoir"],
    correctIndexes: [0],
    explanation:
      "Le visuel « Facteurs clés » analyse statistiquement quelles valeurs de quelles colonnes ont le plus d'impact sur l'augmentation ou la diminution d'une métrique cible (ici l'attrition).",
  },
  {
    id: "pbi-q60",
    question:
      "Vous avez un rapport Power BI hébergé sur powerbi.com affichant les dépenses par département pour les responsables de département, avec un graphique linéaire montrant les dépenses par mois. Vous devez permettre aux utilisateurs de choisir entre une visualisation en graphique linéaire ou en graphique à colonnes, en minimisant l'effort de développement et de maintenance. Que faites-vous ?",
    options: [
      "Permettre aux lecteurs du rapport de personnaliser les visuels (personalize visuals).",
      "Créer une page de rapport séparée pour le graphique à colonnes.",
      "Ajouter un graphique à colonnes, un signet (bookmark) et un bouton pour que l'utilisateur choisisse un visuel.",
      "Créer un rapport mobile contenant un graphique à colonnes.",
    ],
    correctIndexes: [0],
    explanation:
      "La personnalisation des visuels permet à chaque lecteur de changer lui-même le type de visualisation directement dans le rapport publié, sans aucun développement supplémentaire ni maintenance de signets.",
  },
  {
    id: "pbi-q61",
    question:
      "Vous avez un dataset Sales avec les colonnes Order Line ID, Product ID, Unit Price, Order ID et Quantity. Les commandes sont identifiées de façon unique par Order ID et peuvent contenir plusieurs lignes (une par produit). Vous devez écrire une mesure DAX qui compte le nombre de commandes. Quelle formule utiliser ?",
    options: [
      "Count('Sales'[Order ID])",
      "CountA('Sales'[Order ID])",
      "CountRows('Sales')",
      "DistinctCount('Sales'[Order ID])",
    ],
    correctIndexes: [3],
    explanation:
      "Comme un même Order ID peut apparaître sur plusieurs lignes (une par produit commandé), il faut compter les valeurs distinctes d'Order ID pour obtenir le nombre réel de commandes, et non le nombre de lignes.",
  },
  {
    id: "pbi-q62",
    question:
      "Vous devez créer une table calculée nommée Numbers contenant tous les entiers de -100 à 100. Quelle expression DAX utiliser ?",
    options: [
      "Numbers = GENERATE(100, 1, 200)",
      "Numbers = GENERATESERIES(-100, 100, 1)",
      "Numbers = GENERATEALL(-1, -100, 100)",
    ],
    correctIndexes: [1],
    explanation:
      "GENERATESERIES(début, fin, pas) génère une table calculée d'une seule colonne contenant tous les entiers de -100 à 100 par pas de 1.",
  },
  {
    id: "pbi-q63",
    question:
      "Vous créez un rapport de sécurité au niveau ligne. Un utilisateur voit les données de son propre enregistrement employé uniquement, la solution devant fonctionner à la fois dans Power BI Desktop et le service Power BI. Quelle expression utiliser pour le filtre de la table Employees (colonnes Employee Name et Email Address) ?",
    options: [
      "[Employee Name] = USERPRINCIPALNAME()",
      "[Email Address] = USERNAME()",
      "[Employee Name] = USERNAME()",
      "[Email Address] = USERPRINCIPALNAME()",
    ],
    correctIndexes: [3],
    explanation:
      "USERPRINCIPALNAME() retourne l'adresse e-mail/UPN de l'utilisateur connecté et fonctionne aussi bien dans Power BI Desktop que dans le service, contrairement à USERNAME() qui n'est pas fiable dans le service Power BI cloud.",
  },
  {
    id: "pbi-q64",
    question:
      "Vous avez un tableau de bord dont les tuiles proviennent d'un seul rapport. Vous devez modifier le tableau de bord pour qu'il utilise un thème sombre cohérent, correspondant à un exemple visuel fourni, sans changer le contenu des visuels eux-mêmes. Que faites-vous ?",
    options: [
      "Changer le thème du rapport.",
      "Changer le thème du tableau de bord.",
      "Modifier les détails de chaque tuile individuellement.",
      "Créer un fichier CSS personnalisé.",
    ],
    correctIndexes: [1],
    explanation:
      "Le thème du tableau de bord (accessible dans les paramètres du tableau de bord) s'applique globalement à toutes les tuiles épinglées, sans qu'il soit nécessaire de retoucher le rapport source ou chaque tuile.",
  },
  {
    id: "pbi-q65",
    question:
      "Vous devez créer un thème Power BI qui sera utilisé dans plusieurs rapports, incluant une charte graphique d'entreprise (taille de police, couleurs, mise en forme des graphiques à barres). Que faites-vous ?",
    options: [
      "Depuis Power BI Desktop, personnaliser le thème courant.",
      "Depuis Power BI Desktop, utiliser un thème de rapport intégré.",
      "Créer un thème sous forme de fichier PBIVIZ et l'importer dans Power BI Desktop.",
      "Créer un thème sous forme de fichier JSON et l'importer dans Power BI Desktop.",
    ],
    correctIndexes: [3],
    explanation:
      "Les thèmes Power BI réutilisables entre plusieurs rapports se définissent dans un fichier JSON structuré (couleurs, polices, styles de visuels), importable dans n'importe quel fichier PBIX.",
  },
];
