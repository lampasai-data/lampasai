import type { Question } from "./types";

// Microsoft Power BI (PL-300) certification practice bank.
export const POWERBI_QUESTIONS: Question[] = [
  {
    id: "pbi-q1",
    question: {
      fr: "Vous devez réduire la taille d'un modèle de données Power BI qui analyse les ventes de produits dans le temps, tout en conservant la possibilité d'analyser par mois et par trimestre. L'option auto date/heure du modèle est activée. Quelles sont les deux actions à effectuer ?",
      en: "You need to reduce the size of a Power BI data model that analyzes product sales over time, while retaining the ability to analyze by month and by quarter. The model's auto date/time option is enabled. Which two actions should you take?",
    },
    options: [
      { fr: "Créer une relation entre la table Date et la table Sales.", en: "Create a relationship between the Date table and the Sales table." },
      { fr: "Désactiver l'option auto date/heure.", en: "Disable the auto date/time option." },
      { fr: "Créer une table Date et sélectionner « Marquer comme table de dates ».", en: "Create a Date table and select \"Mark as date table\"." },
      { fr: "Désactiver le chargement de la table Date.", en: "Disable loading of the Date table." },
      { fr: "Supprimer la relation entre la table Product et la table Sales.", en: "Remove the relationship between the Product table and the Sales table." },
    ],
    correctIndexes: [0, 2],
    explanation: {
      fr: "L'option auto date/heure crée une table de dates cachée par produit de données, ce qui gonfle le modèle. Il faut la désactiver, créer une vraie table Date partagée, la marquer comme table de dates, puis la relier à Sales.",
      en: "The auto date/time option creates a hidden date table per data field, which bloats the model. You must disable it, create a real shared Date table, mark it as a date table, and then relate it to Sales.",
    },
  },
  {
    id: "pbi-q2",
    question: {
      fr: "Un rapport Power BI (PBIX de 550 Mo) contient un jeu de données importé avec une table de faits de 12 millions de lignes, actualisée deux fois par jour. Une seule page contient 15 visuels AppSource et 10 visuels par défaut. Les utilisateurs trouvent le rapport lent à charger. Que recommandez-vous ?",
      en: "A Power BI report (550 MB PBIX) contains an imported dataset with a fact table of 12 million rows, refreshed twice a day. A single page contains 15 AppSource visuals and 10 default visuals. Users find the report slow to load. What do you recommend?",
    },
    options: [
      { fr: "Implémenter la sécurité au niveau ligne (RLS).", en: "Implement row-level security (RLS)." },
      { fr: "Supprimer les colonnes inutilisées des tables du modèle de données.", en: "Remove unused columns from the data model's tables." },
      { fr: "Remplacer les visuels par défaut par des visuels AppSource.", en: "Replace the default visuals with AppSource visuals." },
      { fr: "Activer les interactions visuelles.", en: "Enable visual interactions." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Supprimer les colonnes inutilisées réduit la taille du modèle et accélère le chargement des visuels ; les autres options n'ont pas d'impact direct sur la performance de chargement.",
      en: "Removing unused columns reduces the model size and speeds up visual loading; the other options have no direct impact on load performance.",
    },
  },
  {
    id: "pbi-q3",
    question: {
      fr: "Un fichier CSV contient une colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser les réclamations par date et utiliser une hiérarchie de dates intégrée. Que faites-vous ?",
      en: "A CSV file contains a Logged column in the format \"2018-12-31 at 08:59\". You need to analyze claims by date and use a built-in date hierarchy. What do you do?",
    },
    options: [
      { fr: "Appliquer une transformation pour extraire les 11 premiers caractères de la colonne.", en: "Apply a transformation to extract the first 11 characters of the column." },
      { fr: "Ajouter une colonne conditionnelle qui affiche 2018 si la colonne commence par 2018, type Nombre entier.", en: "Add a conditional column that displays 2018 if the column starts with 2018, typed as Whole Number." },
      { fr: "Créer une colonne par l'exemple qui commence par 2018-12-31 et définir son type sur Date.", en: "Create a column from examples that starts with 2018-12-31 and set its type to Date." },
      { fr: "Extraire les 11 derniers caractères de la colonne et définir le type sur Date.", en: "Extract the last 11 characters of the column and set the type to Date." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "La colonne par l'exemple permet d'extraire proprement la partie date, puis de la typer en Date pour bénéficier de la hiérarchie de dates intégrée.",
      en: "Column from examples lets you cleanly extract the date portion, then type it as Date to take advantage of the built-in date hierarchy.",
    },
  },
  {
    id: "pbi-q4",
    question: {
      fr: "Dans Power Query, une colonne IoT GUID et une colonne IoT ID sont uniques par ligne. Vous devez analyser les événements IoT par heure et par jour de l'année, tout en améliorant la performance du jeu de données. Solution proposée : créer une colonne qui concatène IoT GUID et IoT ID, puis supprimer les deux colonnes d'origine. Cette solution répond-elle à l'objectif ?",
      en: "In Power Query, an IoT GUID column and an IoT ID column are unique per row. You need to analyze IoT events by hour and by day of the year, while improving dataset performance. Proposed solution: create a column that concatenates IoT GUID and IoT ID, then remove the two original columns. Does this solution meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Concaténer deux colonnes déjà uniques ne réduit pas la taille ni n'aide à l'analyse par heure/jour ; il fallait plutôt supprimer une des colonnes redondantes (GUID) et convertir la date/heure en colonnes séparées de type approprié.",
      en: "Concatenating two already-unique columns does not reduce size nor help with hour/day analysis; instead, one of the redundant columns (GUID) should have been removed and the date/time split into separate columns of the appropriate type.",
    },
  },
  {
    id: "pbi-q5",
    question: {
      fr: "Même contexte que la question précédente (colonnes IoT GUID et IoT ID uniques). Solution proposée : supprimer la colonne IoT GUID et conserver uniquement IoT ID. Cette solution répond-elle à l'objectif de réduire la taille du modèle ?",
      en: "Same context as the previous question (unique IoT GUID and IoT ID columns). Proposed solution: remove the IoT GUID column and keep only IoT ID. Does this solution meet the goal of reducing the model size?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "IoT ID (nombre entier) est bien plus compact que IoT GUID (texte) ; supprimer le GUID redondant réduit la taille du modèle sans perte d'information utile.",
      en: "IoT ID (a whole number) is far more compact than IoT GUID (text); removing the redundant GUID reduces the model size without losing useful information.",
    },
  },
  {
    id: "pbi-q6",
    question: {
      fr: "Même contexte (colonnes IoT GUID/ID). Solution proposée : changer le type de données de la colonne IoT DateTime en Date (au lieu de Date/Heure). Cette solution permet-elle d'analyser les événements par heure et par jour de l'année ?",
      en: "Same context (IoT GUID/ID columns). Proposed solution: change the data type of the IoT DateTime column to Date (instead of Date/Time). Does this solution allow analyzing events by hour and by day of the year?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Changer le type en Date fait perdre l'information d'heure, indispensable pour analyser les événements « par heure ».",
      en: "Changing the type to Date discards the time information, which is essential for analyzing events \"by hour\".",
    },
  },
  {
    id: "pbi-q7",
    question: {
      fr: "Un modèle Power BI contient une table Employee avec une colonne ParentEmployeeID représentant le manager de chaque employé, jusqu'au PDG au sommet de la hiérarchie. Vous devez créer une colonne calculée qui retourne le nombre de niveaux entre chaque employé et le PDG. Quelle expression DAX utiliser ?",
      en: "A Power BI model contains an Employee table with a ParentEmployeeID column representing each employee's manager, up to the CEO at the top of the hierarchy. You need to create a calculated column that returns the number of levels between each employee and the CEO. Which DAX expression should you use?",
    },
    options: [
      { fr: "PATHLENGTH(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]))", en: "PATHLENGTH(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]))" },
      { fr: "PATHITEM(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]), 1, INTEGER)", en: "PATHITEM(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]), 1, INTEGER)" },
      { fr: "PATHCONTAINS(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]), 1)", en: "PATHCONTAINS(PATH(Employee[EmployeeID], Employee[ParentEmployeeID]), 1)" },
      { fr: "PATH(Employee[EmployeeID], Employee[ParentEmployeeID])", en: "PATH(Employee[EmployeeID], Employee[ParentEmployeeID])" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "PATH construit la chaîne hiérarchique, et PATHLENGTH en retourne le nombre de segments, soit le niveau hiérarchique de l'employé.",
      en: "PATH builds the hierarchical chain, and PATHLENGTH returns the number of segments in it, i.e. the employee's hierarchical level.",
    },
  },
  {
    id: "pbi-q8",
    question: {
      fr: "Vous avez un rapport SQL Server Analysis Services (Excel) et deux tables Excel importées, Customer (ID, Name, Phone, Email, AddressID) et Address (AddressID, Address Line 1/2, City, State/Region, Country, Postal Code). Vous devez obtenir une ligne par client incluant City, State/Region et Country. Que faites-vous ?",
      en: "You have a SQL Server Analysis Services (Excel) report and two imported Excel tables, Customer (ID, Name, Phone, Email, AddressID) and Address (AddressID, Address Line 1/2, City, State/Region, Country, Postal Code). You need to get one row per customer that includes City, State/Region, and Country. What do you do?",
    },
    options: [
      { fr: "Fusionner (merge) les tables Customer et Address.", en: "Merge the Customer and Address tables." },
      { fr: "Grouper les tables Customer et Address par la colonne Address ID.", en: "Group the Customer and Address tables by the Address ID column." },
      { fr: "Transposer les tables Customer et Address.", en: "Transpose the Customer and Address tables." },
      { fr: "Ajouter (append) les tables Customer et Address.", en: "Append the Customer and Address tables." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "La fusion (merge) sur AddressID permet de ramener les colonnes d'adresse dans la table Customer, une ligne par client.",
      en: "Merging on AddressID brings the address columns into the Customer table, resulting in one row per customer.",
    },
  },
  {
    id: "pbi-q9",
    question: {
      fr: "Vous créez un rapport Power BI pour le service ventes qui importe des données depuis un fichier Excel dans une bibliothèque SharePoint. Le modèle contient plusieurs mesures. Vous devez créer un nouveau rapport à partir des données existantes en minimisant l'effort de développement. Quelle source de données utiliser ?",
      en: "You are creating a Power BI report for the sales department that imports data from an Excel file in a SharePoint library. The model contains several measures. You need to create a new report from the existing data while minimizing development effort. Which data source should you use?",
    },
    options: [
      { fr: "Un jeu de données (dataset) Power BI", en: "A Power BI dataset" },
      { fr: "Un dossier SharePoint", en: "A SharePoint folder" },
      { fr: "Des dataflows Power BI", en: "Power BI dataflows" },
      { fr: "Un classeur Excel", en: "An Excel workbook" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Se connecter au jeu de données Power BI existant réutilise directement le modèle et les mesures déjà créés, sans dupliquer le travail de modélisation.",
      en: "Connecting to the existing Power BI dataset directly reuses the model and measures already created, without duplicating the modeling work.",
    },
  },
  {
    id: "pbi-q10",
    question: {
      fr: "Vous avez un fichier Excel dans un dossier OneDrive qui doit être importé dans un jeu de données Power BI. Vous devez garantir que le jeu de données peut être actualisé depuis powerbi.com. Quels connecteurs pouvez-vous utiliser ?",
      en: "You have an Excel file in a OneDrive folder that needs to be imported into a Power BI dataset. You need to ensure the dataset can be refreshed from powerbi.com. Which connectors can you use?",
    },
    options: [
      { fr: "Classeur Excel", en: "Excel Workbook" },
      { fr: "Texte/CSV", en: "Text/CSV" },
      { fr: "Dossier", en: "Folder" },
      { fr: "Dossier SharePoint", en: "SharePoint Folder" },
      { fr: "Web", en: "Web" },
    ],
    correctIndexes: [3, 4],
    explanation: {
      fr: "Se connecter via un dossier SharePoint (le fichier OneDrive Entreprise est en réalité stocké dans SharePoint) ou via une URL Web permet une actualisation planifiée sans passerelle locale.",
      en: "Connecting via a SharePoint folder (a OneDrive for Business file is actually stored in SharePoint) or via a Web URL enables scheduled refresh without a local gateway.",
    },
  },
  {
    id: "pbi-q11",
    question: {
      fr: "Dans Power Query Editor, vous profilez une colonne. Column statistics indique 277 329 lignes, 365 valeurs distinctes, 20 valeurs uniques (qui n'apparaissent qu'une fois). Combien de valeurs de la colonne n'apparaissent qu'une seule fois ?",
      en: "In Power Query Editor, you profile a column. Column statistics shows 277,329 rows, 365 distinct values, 20 unique values (appearing only once). How many values in the column appear only once?",
    },
    options: [
      { fr: "4 valeurs", en: "4 values" },
      { fr: "65 valeurs", en: "65 values" },
      { fr: "69 valeurs", en: "69 values" },
      { fr: "20 valeurs", en: "20 values" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Dans Power Query, le nombre « Unique » du panneau de statistiques de colonne indique précisément le nombre de valeurs qui n'apparaissent qu'une seule fois dans la colonne.",
      en: "In Power Query, the \"Unique\" count in the column statistics pane precisely indicates the number of values that appear only once in the column.",
    },
  },
  {
    id: "pbi-q12",
    question: {
      fr: "Vous connectez Power BI Desktop à une base Azure SQL contenant des transactions de vente mises à jour fréquemment. Vous devez générer des rapports de détection de fraude où les données doivent être visibles dans les 5 minutes suivant une mise à jour. Comment configurer la connexion ?",
      en: "You connect Power BI Desktop to an Azure SQL database containing sales transactions that are updated frequently. You need to produce fraud detection reports where data must be visible within 5 minutes of an update. How do you configure the connection?",
    },
    options: [
      { fr: "Ajouter une instruction SQL.", en: "Add a SQL statement." },
      { fr: "Définir le paramètre Command timeout en minutes.", en: "Set the Command timeout in minutes parameter." },
      { fr: "Définir le mode de connectivité des données sur Import.", en: "Set the data connectivity mode to Import." },
      { fr: "Définir le mode de connectivité des données sur DirectQuery.", en: "Set the data connectivity mode to DirectQuery." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "DirectQuery interroge la base en temps réel à chaque interaction, garantissant que les données affichées reflètent l'état actuel de la base (dans les minutes), contrairement à Import qui nécessite une actualisation planifiée.",
      en: "DirectQuery queries the database in real time on every interaction, ensuring the displayed data reflects the current state of the database (within minutes), unlike Import, which requires a scheduled refresh.",
    },
  },
  {
    id: "pbi-q13",
    question: {
      fr: "Vous avez un dossier contenant 100 fichiers CSV. Vous devez rendre les métadonnées des fichiers (nom, taille, chemin) disponibles comme un jeu de données unique dans Power BI, sans stocker le contenu des fichiers CSV. Quel connecteur Get Data utiliser ?",
      en: "You have a folder containing 100 CSV files. You need to make the file metadata (name, size, path) available as a single dataset in Power BI, without storing the content of the CSV files. Which Get Data connector should you use?",
    },
    options: [
      { fr: "Dossier (Folder)", en: "Folder" },
      { fr: "Texte/CSV", en: "Text/CSV" },
      { fr: "Web", en: "Web" },
      { fr: "Liste SharePoint", en: "SharePoint List" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le connecteur Dossier retourne par défaut une table de métadonnées de fichiers (nom, chemin, taille, date de modification, contenu binaire) sans importer le contenu tant qu'on ne l'étend pas explicitement.",
      en: "The Folder connector returns, by default, a table of file metadata (name, path, size, modified date, binary content) without importing the content unless it is explicitly expanded.",
    },
  },
  {
    id: "pbi-q14",
    question: {
      fr: "Un développeur BI crée un dataflow Power BI utilisant DirectQuery pour accéder à des tables SQL Server on-premises, avec le moteur de calcul amélioré (Enhanced Dataflows Compute Engine) activé. Vous devez utiliser ce dataflow dans un rapport en minimisant les temps de calcul et de rendu, avec des données à jour jusqu'à la veille. Que faites-vous ?",
      en: "A BI developer creates a Power BI dataflow using DirectQuery to access on-premises SQL Server tables, with the Enhanced Dataflows Compute Engine enabled. You need to use this dataflow in a report while minimizing calculation and rendering times, with data current as of the previous day. What do you do?",
    },
    options: [
      { fr: "Créer une connexion dataflows en mode DirectQuery.", en: "Create a dataflows connection in DirectQuery mode." },
      { fr: "Créer une connexion dataflows en mode DirectQuery avec une passerelle réseau configurée.", en: "Create a dataflows connection in DirectQuery mode with a network gateway configured." },
      { fr: "Créer une connexion dataflows en mode Import et planifier une actualisation quotidienne.", en: "Create a dataflows connection in Import mode and schedule a daily refresh." },
      { fr: "Créer une connexion dataflows en mode Import et une solution Power Automate pour actualiser toutes les heures.", en: "Create a dataflows connection in Import mode and a Power Automate solution to refresh every hour." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le mode Import matérialise les données localement (calculs/rendus rapides) ; une actualisation quotidienne suffit puisque la fraîcheur requise est « jusqu'à la veille ».",
      en: "Import mode materializes the data locally (fast calculations/rendering); a daily refresh is sufficient since the required freshness is \"as of the previous day\".",
    },
  },
  {
    id: "pbi-q15",
    question: {
      fr: "Vous publiez un jeu de données qui contient des données d'une base SQL Server on-premises, avec une actualisation quotidienne requise. Quelle est la première chose à configurer pour permettre au service Power BI de se connecter à la base ?",
      en: "You publish a dataset that contains data from an on-premises SQL Server database, with a daily refresh required. What is the first thing you must configure to allow the Power BI service to connect to the database?",
    },
    options: [
      { fr: "Configurer une passerelle de données locale (on-premises data gateway).", en: "Configure an on-premises data gateway." },
      { fr: "Configurer une passerelle de données de réseau virtuel.", en: "Configure a virtual network data gateway." },
      { fr: "Ajouter le propriétaire du jeu de données à la source de données.", en: "Add the dataset owner to the data source." },
      { fr: "Configurer directement l'actualisation planifiée sans rien d'autre.", en: "Configure scheduled refresh directly with nothing else." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le service Power BI (cloud) ne peut atteindre une base on-premises que via une passerelle de données locale installée sur le réseau de l'entreprise ; c'est le préalable à toute actualisation planifiée.",
      en: "The Power BI service (cloud) can only reach an on-premises database through an on-premises data gateway installed on the company's network; this is the prerequisite for any scheduled refresh.",
    },
  },
  {
    id: "pbi-q16",
    question: {
      fr: "Vous tentez de connecter Power BI Desktop à une base de données Cassandra, mais il n'existe pas de connecteur dédié dans la liste Get Data. Quel type de connecteur alternatif choisir ?",
      en: "You try to connect Power BI Desktop to a Cassandra database, but there is no dedicated connector in the Get Data list. Which alternative connector type should you choose?",
    },
    options: [
      { fr: "Base de données Microsoft SQL Server", en: "Microsoft SQL Server database" },
      { fr: "ODBC", en: "ODBC" },
      { fr: "OLE DB", en: "OLE DB" },
      { fr: "OData", en: "OData" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "ODBC est le connecteur générique recommandé pour les bases de données sans connecteur natif Power BI, à condition d'installer le pilote ODBC correspondant.",
      en: "ODBC is the recommended generic connector for databases without a native Power BI connector, provided the corresponding ODBC driver is installed.",
    },
  },
  {
    id: "pbi-q17",
    question: {
      fr: "Vous importez un fichier Excel contenant deux colonnes Country et City avec des doublons de pays (ex : USA apparaît 3 fois avec des villes différentes). Vous devez créer une dimension contenant une liste de pays uniques. Quelles sont les deux actions à effectuer ?",
      en: "You import an Excel file containing two columns, Country and City, with duplicate countries (e.g. USA appears 3 times with different cities). You need to create a dimension containing a list of unique countries. Which two actions should you take?",
    },
    options: [
      { fr: "Supprimer la colonne Country.", en: "Remove the Country column." },
      { fr: "Supprimer les doublons de la table entière.", en: "Remove duplicates from the entire table." },
      { fr: "Supprimer les doublons de la colonne City.", en: "Remove duplicates from the City column." },
      { fr: "Supprimer la colonne City.", en: "Remove the City column." },
      { fr: "Supprimer les doublons de la colonne Country.", en: "Remove duplicates from the Country column." },
    ],
    correctIndexes: [3, 4],
    explanation: {
      fr: "Il faut d'abord supprimer la colonne City (qui rend chaque ligne unique), puis dédupliquer la colonne Country restante pour obtenir une liste de pays uniques.",
      en: "You must first remove the City column (which makes each row unique), then deduplicate the remaining Country column to obtain a list of unique countries.",
    },
  },
  {
    id: "pbi-q18",
    question: {
      fr: "Vous créez un rapport pour analyser la fréquence de distribution de la longueur des chaînes dans une colonne de texte libre col1, sans affecter la taille du modèle. Que faites-vous ?",
      en: "You are creating a report to analyze the frequency distribution of string lengths in a free-text column col1, without affecting the model size. What do you do?",
    },
    options: [
      { fr: "Ajouter une colonne calculée DAX qui calcule la longueur de col1.", en: "Add a DAX calculated column that computes the length of col1." },
      { fr: "Ajouter une fonction DAX qui calcule la longueur moyenne de col1.", en: "Add a DAX function that computes the average length of col1." },
      { fr: "Depuis Power Query Editor, ajouter une colonne qui calcule la longueur de col1.", en: "From Power Query Editor, add a column that computes the length of col1." },
      { fr: "Depuis Power Query Editor, changer la distribution du profil de colonne pour grouper par longueur pour col1.", en: "From Power Query Editor, change the column profile distribution to group by length for col1." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le profilage de colonne dans Power Query permet de visualiser une distribution par longueur directement, sans ajouter de colonne au modèle et donc sans en augmenter la taille.",
      en: "Column profiling in Power Query lets you visualize a distribution by length directly, without adding a column to the model and therefore without increasing its size.",
    },
  },
  {
    id: "pbi-q19",
    question: {
      fr: "Vous devez fournir à un utilisateur la capacité d'ajouter des membres à un espace de travail (workspace), en respectant le principe du moindre privilège. Quel rôle attribuer ?",
      en: "You need to give a user the ability to add members to a workspace, following the principle of least privilege. Which role should you assign?",
    },
    options: [
      { fr: "Visualiseur (Viewer)", en: "Viewer" },
      { fr: "Administrateur (Admin)", en: "Admin" },
      { fr: "Contributeur (Contributor)", en: "Contributor" },
      { fr: "Membre (Member)", en: "Member" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le rôle Membre permet d'ajouter d'autres utilisateurs à l'espace de travail sans donner les droits plus étendus d'un Administrateur.",
      en: "The Member role allows adding other users to the workspace without granting the broader rights of an Admin.",
    },
  },
  {
    id: "pbi-q20",
    question: {
      fr: "Vous avez une requête Power BI nommée Sales avec un champ Sales_Date (date+heure), Status (Finished/Canceled) et Canceled_Date. Seule la date de Sales_Date est utilisée, et seules les lignes avec Status=Finished sont utilisées dans l'analyse. Vous devez réduire les temps de chargement sans affecter l'analyse. Quelles sont les deux actions à effectuer ?",
      en: "You have a Power BI query named Sales with a Sales_Date field (date+time), Status (Finished/Canceled), and Canceled_Date. Only the date part of Sales_Date is used, and only rows with Status=Finished are used in the analysis. You need to reduce load times without affecting the analysis. Which two actions should you take?",
    },
    options: [
      { fr: "Supprimer les lignes où Sales[Status] a la valeur Canceled.", en: "Remove the rows where Sales[Status] has the value Canceled." },
      { fr: "Supprimer la colonne Sales[Sales_Date].", en: "Remove the Sales[Sales_Date] column." },
      { fr: "Changer le type de données de Sales[Delivery_Time] en Integer.", en: "Change the data type of Sales[Delivery_Time] to Integer." },
      { fr: "Séparer Sales[Sale_Date] en colonnes date et heure distinctes.", en: "Split Sales[Sale_Date] into separate date and time columns." },
      { fr: "Supprimer la colonne Sales[Canceled Date].", en: "Remove the Sales[Canceled Date] column." },
    ],
    correctIndexes: [0, 4],
    explanation: {
      fr: "Supprimer les lignes annulées (non utilisées) réduit le volume de données, et supprimer la colonne Canceled_Date (non utilisée) réduit encore la taille, sans affecter l'analyse basée uniquement sur les commandes Finished.",
      en: "Removing the canceled (unused) rows reduces the data volume, and removing the unused Canceled_Date column further reduces the size, without affecting the analysis, which is based solely on Finished orders.",
    },
  },
  {
    id: "pbi-q21",
    question: {
      fr: "Vous construisez un rapport pour analyser des transactions clients à partir d'une base contenant les tables Customer et Transaction. Chaque client peut avoir plusieurs transactions, mais chaque transaction appartient à un seul client. Quel type de relation utiliser pour lier les tables ?",
      en: "You are building a report to analyze customer transactions from a database containing the Customer and Transaction tables. Each customer can have multiple transactions, but each transaction belongs to a single customer. Which relationship type should you use to link the tables?",
    },
    options: [
      { fr: "Un-à-plusieurs de Transaction vers Customer", en: "One-to-many from Transaction to Customer" },
      { fr: "Un-à-un entre Customer et Transaction", en: "One-to-one between Customer and Transaction" },
      { fr: "Plusieurs-à-plusieurs entre Customer et Transaction", en: "Many-to-many between Customer and Transaction" },
      { fr: "Un-à-plusieurs de Customer vers Transaction", en: "One-to-many from Customer to Transaction" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Un client (1) peut avoir plusieurs transactions (plusieurs) : c'est une relation un-à-plusieurs allant de la table « un » (Customer) vers la table « plusieurs » (Transaction).",
      en: "A customer (1) can have multiple transactions (many): this is a one-to-many relationship going from the \"one\" table (Customer) to the \"many\" table (Transaction).",
    },
  },
  {
    id: "pbi-q22",
    question: {
      fr: "Un connecteur personnalisé retourne ID, From, To, Subject, Body et Has Attachments pour plus de 10 millions d'e-mails envoyés durant l'année. Vous construisez un rapport analysant les réseaux internes des employés selon les destinataires de leurs e-mails. Vous devez empêcher les destinataires du rapport de lire le contenu des e-mails analysés, en minimisant la taille du modèle. Que faites-vous ?",
      en: "A custom connector returns ID, From, To, Subject, Body, and Has Attachments for more than 10 million emails sent during the year. You are building a report that analyzes employees' internal networks based on their email recipients. You need to prevent report recipients from reading the content of the analyzed emails, while minimizing the model size. What do you do?",
    },
    options: [
      { fr: "Depuis la vue Modèle, définir les colonnes Subject et Body sur Masqué (Hidden).", en: "From the Model view, set the Subject and Body columns to Hidden." },
      { fr: "Supprimer les colonnes Subject et Body lors de l'import.", en: "Remove the Subject and Body columns during import." },
      { fr: "Implémenter la sécurité au niveau ligne (RLS) pour que chaque destinataire ne voie que les e-mails qu'il a envoyés.", en: "Implement row-level security (RLS) so each recipient only sees the emails they sent." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Ne pas importer du tout les colonnes Subject et Body à la source empêche toute lecture du contenu et réduit la taille du modèle, contrairement à un simple masquage qui laisse la donnée accessible via DAX/export.",
      en: "Not importing the Subject and Body columns at all from the source prevents any reading of the content and reduces the model size, unlike simple hiding, which still leaves the data accessible via DAX/export.",
    },
  },
  {
    id: "pbi-q23",
    question: {
      fr: "Vous êtes en train de modéliser des données par lots à partir d'une grande table SQL Server Order (plus de 100 millions d'enregistrements). Pendant le développement, vous devez importer un échantillon des données. Solution proposée : vous ajoutez un filtre au niveau du rapport basé sur la date de commande. Cette solution répond-elle à l'objectif ?",
      en: "You are modeling data in batches from a large SQL Server Order table (more than 100 million records). During development, you need to import a sample of the data. Proposed solution: you add a report-level filter based on the order date. Does this solution meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Un filtre au niveau du rapport n'affecte que l'affichage : toute la table est quand même importée en amont dans le modèle, donc l'objectif (limiter la donnée importée pendant le développement) n'est pas atteint.",
      en: "A report-level filter only affects the display: the entire table is still imported upstream into the model, so the goal (limiting the data imported during development) is not achieved.",
    },
  },
  {
    id: "pbi-q24",
    question: {
      fr: "Même contexte (table Order de 100 millions de lignes). Solution proposée : vous ajoutez une clause WHERE à l'instruction SQL de la source. Cette solution répond-elle à l'objectif d'importer un échantillon de données ?",
      en: "Same context (100-million-row Order table). Proposed solution: you add a WHERE clause to the source's SQL statement. Does this solution meet the goal of importing a sample of the data?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une clause WHERE dans l'instruction SQL source filtre les données avant même qu'elles n'arrivent dans Power Query, limitant réellement le volume importé - contrairement à un filtre appliqué après coup dans le rapport ou en DAX.",
      en: "A WHERE clause in the source SQL statement filters the data before it even reaches Power Query, genuinely limiting the volume imported - unlike a filter applied afterward in the report or in DAX.",
    },
  },
  {
    id: "pbi-q25",
    question: {
      fr: "Vous avez un rapport qui importe une table Date et une table Sales depuis une base Azure SQL. La table Sales possède trois clés étrangères de date : Due Date, Order Date et Delivery Date. Vous devez permettre l'analyse des ventes dans le temps selon les trois clés. Solution proposée : pour chaque clé étrangère, vous ajoutez des relations inactives entre Sales et Date. Cette solution répond-elle à l'objectif ?",
      en: "You have a report that imports a Date table and a Sales table from an Azure SQL database. The Sales table has three date foreign keys: Due Date, Order Date, and Delivery Date. You need to enable analyzing sales over time using all three keys. Proposed solution: for each foreign key, you add inactive relationships between Sales and Date. Does this solution meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Une seule table Date reliée trois fois (une relation active + deux inactives) nécessite ensuite des mesures DAX avec USERELATIONSHIP pour activer chaque relation à la demande - cette étape manque ici, donc l'objectif n'est pas complètement atteint tel quel.",
      en: "A single Date table related three times (one active relationship + two inactive) then requires DAX measures with USERELATIONSHIP to activate each relationship on demand - this step is missing here, so the goal is not fully achieved as described.",
    },
  },
  {
    id: "pbi-q26",
    question: {
      fr: "Même contexte (Due/Order/Delivery Date). Solution proposée : depuis Power Query Editor, vous renommez la requête Date en Due Date, puis vous la référencez deux fois pour créer les requêtes Order Date et Delivery Date (trois tables de dates distinctes). Cette solution répond-elle à l'objectif ?",
      en: "Same context (Due/Order/Delivery Date). Proposed solution: from Power Query Editor, you rename the Date query to Due Date, then reference it twice to create the Order Date and Delivery Date queries (three separate date tables). Does this solution meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Créer trois tables de dates distinctes (une par clé étrangère) permet de créer trois relations actives simples, une par table, sans avoir besoin de USERELATIONSHIP - cela répond bien à l'objectif.",
      en: "Creating three separate date tables (one per foreign key) allows creating three simple active relationships, one per table, without needing USERELATIONSHIP - this properly meets the goal.",
    },
  },
  {
    id: "pbi-q27",
    question: {
      fr: "Même contexte (Due/Order/Delivery Date). Solution proposée : vous créez des mesures DAX qui utilisent la fonction USERELATIONSHIP pour filtrer les ventes selon la relation active entre Sales et Date. Cette solution répond-elle à l'objectif ?",
      en: "Same context (Due/Order/Delivery Date). Proposed solution: you create DAX measures that use the USERELATIONSHIP function to filter sales based on the active relationship between Sales and Date. Does this solution meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "USERELATIONSHIP sert justement à activer temporairement une relation inactive dans une mesure - utiliser cette fonction pour filtrer sur la relation déjà active n'a aucun effet et ne résout pas le besoin d'analyser via les relations inactives.",
      en: "USERELATIONSHIP exists precisely to temporarily activate an inactive relationship within a measure - using it to filter on the relationship that is already active has no effect and does not address the need to analyze via the inactive relationships.",
    },
  },
  {
    id: "pbi-q28",
    question: {
      fr: "Vous devez créer un jeu de données Power BI. Les exigences imposent l'absence de pipelines de déploiement Power BI et un minimum d'effort administratif, pour interroger trois environnements différents (dev/test/prod) avec des URL de serveur différentes. Quel mode de jeu de données utiliser ?",
      en: "You need to create a Power BI dataset. The requirements rule out using Power BI deployment pipelines and call for minimal administrative effort, to query three different environments (dev/test/prod) with different server URLs. Which dataset mode should you use?",
    },
    options: [
      { fr: "Import", en: "Import" },
      { fr: "DirectQuery", en: "DirectQuery" },
      { fr: "Composite", en: "Composite" },
      { fr: "Connexion en direct (live connection)", en: "Live connection" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Un jeu de données composite permet de définir un paramètre de serveur qui change selon l'environnement, avec un seul fichier PBIX à publier dans chaque espace de travail, sans pipeline de déploiement.",
      en: "A composite dataset allows defining a server parameter that changes per environment, with a single PBIX file to publish into each workspace, without a deployment pipeline.",
    },
  },
  {
    id: "pbi-q29",
    question: {
      fr: "Vous avez cinq régions de ventes, chacune avec plusieurs managers. Un rôle RLS dynamique nommé Sales filtre les données de transactions par vendeur. Une vendeuse pense qu'elle devrait voir plus de données que ce qu'elle voit actuellement. Vous devez vérifier ce qu'elle voit réellement. Que faites-vous ?",
      en: "You have five sales regions, each with several managers. A dynamic RLS role named Sales filters transaction data by salesperson. A salesperson believes she should see more data than she currently does. You need to verify what she actually sees. What do you do?",
    },
    options: [
      { fr: "Utiliser l'option « Tester en tant que rôle » (Test as role) pour visualiser les données avec le compte utilisateur de la vendeuse.", en: "Use the \"Test as role\" option to view the data using the salesperson's user account." },
      { fr: "Utiliser « Tester en tant que rôle » pour visualiser les données avec le rôle Sales générique.", en: "Use \"Test as role\" to view the data using the generic Sales role." },
      { fr: "Demander à la vendeuse d'ouvrir le rapport dans Power BI Desktop.", en: "Ask the salesperson to open the report in Power BI Desktop." },
      { fr: "Filtrer les données du rapport pour reproduire la logique attendue du filtre RLS.", en: "Filter the report data to reproduce the expected RLS filter logic." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Tester en tant que rôle avec le compte spécifique de l'utilisatrice permet de reproduire exactement ce qu'elle voit (y compris son appartenance précise aux groupes RLS), contrairement à un test générique du rôle.",
      en: "Testing as a role with the specific user's account reproduces exactly what she sees (including her precise RLS group membership), unlike a generic test of the role.",
    },
  },
  {
    id: "pbi-q30",
    question: {
      fr: "Vous avez plusieurs tableaux de bord Power BI. Vous devez permettre aux utilisateurs, en parcourant powerbi.com, d'identifier facilement quels tableaux de bord contiennent des informations personnelles identifiables (PII), en minimisant l'effort de configuration et l'impact sur la conception. Que faites-vous ?",
      en: "You have several Power BI dashboards. You need to let users, while browsing powerbi.com, easily identify which dashboards contain personally identifiable information (PII), while minimizing configuration effort and design impact. What do you do?",
    },
    options: [
      { fr: "Utiliser des étiquettes de confidentialité Microsoft Information Protection (sensitivity labels).", en: "Use Microsoft Information Protection sensitivity labels." },
      { fr: "Utiliser des tuiles (tiles) dédiées.", en: "Use dedicated tiles." },
      { fr: "Utiliser des commentaires.", en: "Use comments." },
      { fr: "Utiliser des groupes Active Directory.", en: "Use Active Directory groups." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Les étiquettes de sensibilité s'affichent automatiquement dans la liste des tableaux de bord sans modifier leur contenu ni leur conception.",
      en: "Sensitivity labels are automatically displayed in the dashboard list without modifying their content or design.",
    },
  },
  {
    id: "pbi-q31",
    question: {
      fr: "Vous avez cinq rapports et deux tableaux de bord dans un espace de travail. Vous devez accorder à tous les utilisateurs de l'organisation un accès en lecture à un tableau de bord et trois rapports spécifiques. Solution proposée : publier une application (app) à toute l'organisation, en incluant uniquement les éléments sélectionnés. Cette solution répond-elle à l'objectif ?",
      en: "You have five reports and two dashboards in a workspace. You need to grant all users in the organization read access to one dashboard and three specific reports. Proposed solution: publish an app to the entire organization, including only the selected items. Does this solution meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une application Power BI permet de sélectionner précisément quels rapports et tableaux de bord inclure et de les distribuer à toute l'organisation en lecture seule.",
      en: "A Power BI app lets you precisely select which reports and dashboards to include and distribute them to the entire organization as read-only.",
    },
  },
  {
    id: "pbi-q32",
    question: {
      fr: "Même contexte (cinq rapports, deux tableaux de bord). Solution proposée : activer « Inclus dans l'application » (included in app) pour tous les éléments de l'espace de travail. Cette solution répond-elle à l'objectif de ne partager qu'un tableau de bord et trois rapports précis ?",
      en: "Same context (five reports, two dashboards). Proposed solution: enable \"included in app\" for all items in the workspace. Does this solution meet the goal of sharing only one dashboard and three specific reports?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Inclure tous les éléments dans l'application partagerait les cinq rapports et les deux tableaux de bord, alors que seuls un tableau de bord et trois rapports doivent être partagés.",
      en: "Including all items in the app would share all five reports and both dashboards, whereas only one dashboard and three reports should be shared.",
    },
  },
  {
    id: "pbi-q33",
    question: {
      fr: "Même contexte (cinq rapports, deux tableaux de bord). Solution proposée : attribuer à tous les utilisateurs le rôle Visualiseur (Viewer) sur l'espace de travail entier. Cette solution répond-elle à l'objectif de ne partager qu'un tableau de bord et trois rapports précis ?",
      en: "Same context (five reports, two dashboards). Proposed solution: assign all users the Viewer role on the entire workspace. Does this solution meet the goal of sharing only one dashboard and three specific reports?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le rôle Visualiseur sur l'espace de travail entier donnerait accès à tout son contenu (cinq rapports, deux tableaux de bord), pas seulement aux quatre éléments souhaités.",
      en: "The Viewer role on the entire workspace would give access to all of its content (five reports, two dashboards), not just the four desired items.",
    },
  },
  {
    id: "pbi-q34",
    question: {
      fr: "Depuis Power BI Desktop, vous publiez un nouveau jeu de données et un rapport dans un espace de travail. Le jeu de données a un rôle RLS nommé HR. Vous devez garantir que les membres de l'équipe RH ont bien la RLS appliquée lorsqu'ils consultent les rapports basés sur ce jeu de données. Que faites-vous ?",
      en: "From Power BI Desktop, you publish a new dataset and report to a workspace. The dataset has an RLS role named HR. You need to ensure that the HR team's members have RLS properly applied when they view reports based on this dataset. What do you do?",
    },
    options: [
      { fr: "Depuis powerbi.com, ajouter les utilisateurs au rôle HR du jeu de données.", en: "From powerbi.com, add the users to the dataset's HR role." },
      { fr: "Depuis powerbi.com, partager le jeu de données avec les membres de l'équipe RH.", en: "From powerbi.com, share the dataset with the HR team's members." },
      { fr: "Depuis Power BI Desktop, modifier les paramètres de sécurité au niveau ligne.", en: "From Power BI Desktop, modify the row-level security settings." },
      { fr: "Depuis Power BI Desktop, importer une table contenant les membres de l'équipe RH.", en: "From Power BI Desktop, import a table containing the HR team's members." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "L'appartenance aux rôles RLS se gère côté service (powerbi.com) après publication, en associant des utilisateurs ou groupes à chaque rôle défini dans le fichier PBIX.",
      en: "RLS role membership is managed on the service side (powerbi.com) after publishing, by associating users or groups with each role defined in the PBIX file.",
    },
  },
  {
    id: "pbi-q35",
    question: {
      fr: "Un tableau de bord Power BI surveille la qualité de fabrication, avec un graphique linéaire du nombre de produits défectueux par jour et un visuel KPI du pourcentage quotidien actuel de produits défectueux. Vous devez être averti quand ce pourcentage dépasse 3 %. Que créez-vous ?",
      en: "A Power BI dashboard monitors manufacturing quality, with a line chart of defective products per day and a KPI visual of the current daily percentage of defective products. You need to be notified when this percentage exceeds 3%. What do you create?",
    },
    options: [
      { fr: "Un abonnement (subscription)", en: "A subscription" },
      { fr: "Une alerte (data alert)", en: "A data alert" },
      { fr: "Un visuel de narration intelligente (smart narrative)", en: "A smart narrative visual" },
      { fr: "Un visuel Q&A", en: "A Q&A visual" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Une alerte de données sur un visuel KPI/carte permet de définir un seuil (ici 3 %) et de recevoir une notification dès que ce seuil est dépassé.",
      en: "A data alert on a KPI/card visual lets you define a threshold (here 3%) and receive a notification as soon as it is exceeded.",
    },
  },
  {
    id: "pbi-q36",
    question: {
      fr: "Vous créez un rapport Power BI Desktop utilisant des données d'un cube SQL Server Analysis Services (SSAS) situé sur le réseau interne de l'entreprise. Vous prévoyez de publier ce rapport sur le service Power BI. Que devez-vous implémenter pour que les utilisateurs consommant le rapport aient les données les plus à jour du cube ?",
      en: "You are creating a Power BI Desktop report using data from a SQL Server Analysis Services (SSAS) cube located on the company's internal network. You plan to publish this report to the Power BI service. What must you implement so that users consuming the report have the most up-to-date data from the cube?",
    },
    options: [
      { fr: "Un flux OData", en: "An OData feed" },
      { fr: "Une passerelle de données locale (on-premises data gateway)", en: "An on-premises data gateway" },
      { fr: "Un abonnement", en: "A subscription" },
      { fr: "Une actualisation planifiée du jeu de données", en: "A scheduled dataset refresh" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le service Power BI (cloud) ne peut atteindre un cube SSAS sur le réseau interne que via une passerelle de données locale, qui permet en plus une connexion en direct (live connection) toujours à jour.",
      en: "The Power BI service (cloud) can only reach an SSAS cube on the internal network through an on-premises data gateway, which also enables an always-current live connection.",
    },
  },
  {
    id: "pbi-q37",
    question: {
      fr: "Vous devez créer une visualisation qui compare le profit sur 10 catégories de produits pour un trimestre sélectionné. Quel type de visuel est le plus adapté ?",
      en: "You need to create a visualization that compares profit across 10 product categories for a selected quarter. Which visual type is most appropriate?",
    },
    options: [
      { fr: "Un graphique en aires", en: "An area chart" },
      { fr: "Un graphique en entonnoir", en: "A funnel chart" },
      { fr: "Un graphique à barres groupées", en: "A clustered bar chart" },
      { fr: "Un graphique linéaire", en: "A line chart" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Un graphique à barres groupées est idéal pour comparer une valeur (le profit) entre plusieurs catégories discrètes à un instant donné.",
      en: "A clustered bar chart is ideal for comparing a value (profit) across several discrete categories at a given point in time.",
    },
  },
  {
    id: "pbi-q38",
    question: {
      fr: "Vous avez un jeu de données Power BI nommé Finance hébergé dans un espace de travail. L'équipe finance n'est actuellement membre d'aucun rôle de l'espace de travail. Vous devez permettre à cette équipe d'analyser le jeu de données Finance directement depuis Microsoft Excel. Que faites-vous ?",
      en: "You have a Power BI dataset named Finance hosted in a workspace. The finance team is not currently a member of any workspace role. You need to allow this team to analyze the Finance dataset directly from Microsoft Excel. What do you do?",
    },
    options: [
      { fr: "Accorder à l'équipe finance la permission Build sur le jeu de données Finance.", en: "Grant the finance team Build permission on the Finance dataset." },
      { fr: "Fournir un classeur Excel déjà connecté au jeu de données Finance.", en: "Provide an Excel workbook already connected to the Finance dataset." },
      { fr: "Créer un rôle de sécurité au niveau ligne (RLS) et ajouter l'équipe finance comme membres.", en: "Create a row-level security (RLS) role and add the finance team as members." },
      { fr: "Accorder à l'équipe finance la permission d'écriture (write) sur le jeu de données Finance.", en: "Grant the finance team write permission on the Finance dataset." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "La permission Build est nécessaire et suffisante pour qu'un utilisateur puisse se connecter directement à un jeu de données via Analyser dans Excel, sans être membre de l'espace de travail.",
      en: "Build permission is necessary and sufficient for a user to connect directly to a dataset via Analyze in Excel, without being a member of the workspace.",
    },
  },
  {
    id: "pbi-q39",
    question: {
      fr: "Vous avez un rapport contenant un visuel avec une mesure. Vous devez garantir que toutes les valeurs affichent deux décimales, et que toutes les valeurs négatives s'affichent en rouge et entre parenthèses. Quelles sont les deux actions à effectuer ?",
      en: "You have a report containing a visual with a measure. You need to ensure that all values display two decimal places, and that all negative values are displayed in red and in parentheses. Which two actions should you take?",
    },
    options: [
      { fr: "Sur le visuel, appliquer une mise en forme conditionnelle à la couleur d'arrière-plan.", en: "On the visual, apply conditional formatting to the background color." },
      { fr: "Configurer la mesure pour utiliser un format personnalisé.", en: "Configure the measure to use a custom format." },
      { fr: "Sur le visuel, appliquer une mise en forme conditionnelle à la couleur de police.", en: "On the visual, apply conditional formatting to the font color." },
      { fr: "Sur le visuel, définir le nombre de décimales des valeurs sur 2.", en: "On the visual, set the number of decimal places for values to 2." },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "Un format personnalisé sur la mesure gère l'affichage à deux décimales et les parenthèses pour les négatifs ; la mise en forme conditionnelle de la police gère la couleur rouge pour les valeurs négatives.",
      en: "A custom format on the measure handles the two-decimal display and the parentheses for negatives; conditional formatting of the font handles the red color for negative values.",
    },
  },
  {
    id: "pbi-q40",
    question: {
      fr: "Vous avez un tenant Power BI hébergeant des rapports utilisant des jeux de données financiers, exportés en PDF. Vous devez garantir que ces rapports sont chiffrés. Que devez-vous implémenter ?",
      en: "You have a Power BI tenant hosting reports that use financial datasets, exported as PDF. You need to ensure these reports are encrypted. What must you implement?",
    },
    options: [
      { fr: "Des stratégies Microsoft Intune", en: "Microsoft Intune policies" },
      { fr: "La sécurité au niveau ligne (RLS)", en: "Row-level security (RLS)" },
      { fr: "Des étiquettes de sensibilité (sensitivity labels)", en: "Sensitivity labels" },
      { fr: "Des certifications de jeu de données", en: "Dataset certifications" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Les étiquettes de sensibilité, intégrées à Microsoft Information Protection, appliquent un chiffrement qui persiste même après export du rapport en PDF.",
      en: "Sensitivity labels, integrated with Microsoft Information Protection, apply encryption that persists even after the report is exported to PDF.",
    },
  },
  {
    id: "pbi-q41",
    question: {
      fr: "Vous avez un fichier Excel sur un serveur de fichiers. Vous créez un rapport Power BI en important une table de ce fichier, puis vous le publiez. Vous devez garantir que les données s'actualisent toutes les quatre heures. Que devez-vous faire en premier ?",
      en: "You have an Excel file on a file server. You create a Power BI report by importing a table from this file, then publish it. You need to ensure the data refreshes every four hours. What should you do first?",
    },
    options: [
      { fr: "Charger le fichier Excel dans un espace de travail Power BI.", en: "Upload the Excel file to a Power BI workspace." },
      { fr: "Créer un abonnement au rapport.", en: "Create a subscription to the report." },
      { fr: "Déployer une passerelle de données locale.", en: "Deploy an on-premises data gateway." },
      { fr: "Modifier les identifiants de la source de données.", en: "Modify the data source credentials." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Un fichier sur un serveur de fichiers d'entreprise n'est accessible depuis le service Power BI qu'au travers d'une passerelle de données locale, préalable indispensable à toute actualisation planifiée.",
      en: "A file on a corporate file server is only accessible from the Power BI service through an on-premises data gateway, an essential prerequisite for any scheduled refresh.",
    },
  },
  {
    id: "pbi-q42",
    question: {
      fr: "Vous avez un jeu de données peu utilisé, actualisé toutes les heures. Vous recevez une notification indiquant que l'actualisation a été désactivée pour cause d'inactivité. Quelles sont les deux actions qui relanceront la planification de l'actualisation ?",
      en: "You have a rarely used dataset, refreshed hourly. You receive a notification indicating that the refresh was disabled due to inactivity. Which two actions will restart the refresh schedule?",
    },
    options: [
      { fr: "Activer la mise en cache des requêtes (query caching) pour le jeu de données.", en: "Enable query caching for the dataset." },
      { fr: "Importer le jeu de données dans Microsoft Excel.", en: "Import the dataset into Microsoft Excel." },
      { fr: "Depuis le service Power BI, ouvrir un tableau de bord qui utilise le jeu de données.", en: "From the Power BI service, open a dashboard that uses the dataset." },
      { fr: "Depuis le service Power BI, ouvrir un rapport qui utilise le jeu de données.", en: "From the Power BI service, open a report that uses the dataset." },
      { fr: "Depuis PowerShell, exécuter la commande get-powerbireport.", en: "From PowerShell, run the get-powerbireport command." },
    ],
    correctIndexes: [2, 3],
    explanation: {
      fr: "L'actualisation est suspendue faute d'usage réel du jeu de données ; ouvrir un tableau de bord ou un rapport qui l'utilise redémarre le compteur d'inactivité et réactive la planification.",
      en: "The refresh is suspended due to a lack of actual usage of the dataset; opening a dashboard or report that uses it resets the inactivity counter and re-enables the schedule.",
    },
  },
  {
    id: "pbi-q43",
    question: {
      fr: "Vous avez un espace de travail contenant un jeu de données, un rapport et un tableau de bord. Des utilisateurs externes, managers et employés y accèdent avec des niveaux d'accès différents (RLS pour les employés notamment). Vous devez permettre à tous, y compris les externes, de signaler un problème sur le tableau de bord aux administrateurs de l'espace de travail, de façon visible par les autres utilisateurs. Que utilisez-vous ?",
      en: "You have a workspace containing a dataset, a report, and a dashboard. External users, managers, and employees access it with different access levels (RLS for employees, among others). You need to allow everyone, including external users, to report an issue on the dashboard to the workspace administrators, visibly to other users. What do you use?",
    },
    options: [
      { fr: "Les commentaires (comments)", en: "Comments" },
      { fr: "Le chat Microsoft Teams", en: "Microsoft Teams chat" },
      { fr: "Les alertes", en: "Alerts" },
      { fr: "Les abonnements", en: "Subscriptions" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Les commentaires sur un tableau de bord permettent de mentionner (taguer) des utilisateurs, dont les administrateurs, et sont visibles par tous les utilisateurs ayant accès au tableau de bord - y compris les invités externes.",
      en: "Comments on a dashboard let you mention (tag) users, including administrators, and are visible to all users with access to the dashboard - including external guests.",
    },
  },
  {
    id: "pbi-q44",
    question: {
      fr: "Vous avez un fichier PBIX qui importe plusieurs tables depuis une base Azure SQL. Les données vont être migrées vers une autre base Azure SQL. Vous devez modifier les connexions du fichier PBIX en minimisant l'effort d'administration. Que faites-vous ?",
      en: "You have a PBIX file that imports several tables from an Azure SQL database. The data is going to be migrated to another Azure SQL database. You need to modify the PBIX file's connections while minimizing administrative effort. What do you do?",
    },
    options: [
      { fr: "Depuis Power Query Editor, créer de nouvelles requêtes.", en: "From Power Query Editor, create new queries." },
      { fr: "Depuis Power Query Editor, modifier la source de chaque requête individuellement.", en: "From Power Query Editor, modify the source of each query individually." },
      { fr: "Créer un fichier PBIT, l'ouvrir et changer les sources de données lorsque demandé.", en: "Create a PBIT file, open it, and change the data sources when prompted." },
      { fr: "Modifier les paramètres de la source de données (Data source settings).", en: "Modify the Data source settings." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Les paramètres de source de données permettent de changer le serveur/base pour toutes les requêtes concernées en une seule opération centralisée, sans toucher à chaque requête individuellement.",
      en: "The Data source settings let you change the server/database for all affected queries in a single centralized operation, without touching each query individually.",
    },
  },
  {
    id: "pbi-q45",
    question: {
      fr: "Vous avez un espace de travail Power BI contenant plusieurs rapports. Vous devez permettre à un utilisateur de créer un tableau de bord réutilisant des visuels de ces rapports. Que faites-vous ?",
      en: "You have a Power BI workspace containing several reports. You need to allow a user to create a dashboard reusing visuals from these reports. What do you do?",
    },
    options: [
      { fr: "Créer un rôle de sécurité au niveau ligne (RLS) et y ajouter l'utilisateur.", en: "Create a row-level security (RLS) role and add the user to it." },
      { fr: "Partager les rapports avec l'utilisateur.", en: "Share the reports with the user." },
      { fr: "Accorder la permission de lecture (Read) sur les jeux de données à l'utilisateur.", en: "Grant the user Read permission on the datasets." },
      { fr: "Ajouter l'utilisateur comme membre (member) de l'espace de travail.", en: "Add the user as a member of the workspace." },
      { fr: "Ajouter l'utilisateur comme visualiseur (Viewer) de l'espace de travail.", en: "Add the user as a Viewer of the workspace." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Épingler des visuels sur un tableau de bord nécessite de pouvoir éditer du contenu dans l'espace de travail : le rôle Membre (ou supérieur) est nécessaire, un simple Visualiseur ne peut pas créer de tableau de bord.",
      en: "Pinning visuals to a dashboard requires the ability to edit content in the workspace: the Member role (or higher) is required, since a plain Viewer cannot create a dashboard.",
    },
  },
  {
    id: "pbi-q46",
    question: {
      fr: "Vous avez un jeu de données Power BI et un rapport associé. Vous devez garantir que les utilisateurs peuvent analyser les données dans Microsoft Excel uniquement en se connectant directement au jeu de données (Analyser dans Excel), sans pouvoir exporter les données depuis le rapport lui-même. Vous accordez la permission Build. Que faites-vous ensuite ?",
      en: "You have a Power BI dataset and an associated report. You need to ensure that users can analyze the data in Microsoft Excel only by connecting directly to the dataset (Analyze in Excel), without being able to export data from the report itself. You grant the Build permission. What do you do next?",
    },
    options: [
      { fr: "Certifier le jeu de données utilisé par le rapport.", en: "Certify the dataset used by the report." },
      { fr: "Changer l'interaction visuelle par défaut du rapport.", en: "Change the report's default visual interaction." },
      { fr: "Pour le rapport, changer le paramètre d'export de données sur « Aucun » (None).", en: "For the report, change the data export setting to \"None\"." },
      { fr: "Pour le rapport, changer le paramètre d'export sur « Données résumées, données avec mise en page actuelle et données sous-jacentes ».", en: "For the report, change the export setting to \"Summarized data, data with current layout, and underlying data\"." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Désactiver totalement l'export sur le rapport bloque toute extraction de données depuis les visuels, tout en laissant intacte la permission Build qui autorise l'accès direct au jeu de données via Excel.",
      en: "Completely disabling export on the report blocks any data extraction from the visuals, while leaving intact the Build permission that authorizes direct access to the dataset via Excel.",
    },
  },
  {
    id: "pbi-q47",
    question: {
      fr: "Vous devez transférer la maintenance de l'appartenance aux rôles RLS à une équipe sécurité réseau Azure, sans leur donner la capacité de gérer les rapports, jeux de données ou tableaux de bord. Que faites-vous ?",
      en: "You need to transfer the maintenance of RLS role membership to an Azure network security team, without giving them the ability to manage reports, datasets, or dashboards. What do you do?",
    },
    options: [
      { fr: "Accorder à l'équipe les permissions Read et Build sur les jeux de données Power BI.", en: "Grant the team Read and Build permissions on the Power BI datasets." },
      { fr: "Configurer des instructions personnalisées pour la fonctionnalité de demande d'accès, indiquant de contacter l'équipe sécurité réseau.", en: "Configure custom instructions for the request access feature, indicating to contact the network security team." },
      { fr: "Demander à l'équipe sécurité réseau de créer des groupes de sécurité, puis configurer la RLS pour utiliser ces groupes.", en: "Ask the network security team to create security groups, then configure RLS to use those groups." },
      { fr: "Ajouter l'équipe sécurité réseau comme membres du rôle RLS.", en: "Add the network security team as members of the RLS role." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "En confiant la gestion des groupes de sécurité Azure AD (et non des rôles Power BI directement) à l'équipe réseau, celle-ci peut ajouter/retirer des membres sans jamais accéder aux rapports, jeux de données ou tableaux de bord Power BI.",
      en: "By entrusting the management of Azure AD security groups (rather than the Power BI roles directly) to the network team, they can add/remove members without ever accessing Power BI reports, datasets, or dashboards.",
    },
  },
  {
    id: "pbi-q48",
    question: {
      fr: "Vous avez quatre régions de vente, chacune avec plusieurs managers. La RLS filtre les données de vente par région, avec un groupe de sécurité mail-enabled assigné à chaque rôle. Un manager change de région. Que faites-vous pour qu'il voie les bonnes données ?",
      en: "You have four sales regions, each with several managers. RLS filters sales data by region, with a mail-enabled security group assigned to each role. A manager changes region. What do you do so he sees the correct data?",
    },
    options: [
      { fr: "Changer le type de licence Power BI du manager.", en: "Change the manager's Power BI license type." },
      { fr: "Depuis Power BI Desktop, modifier le paramètre de sécurité au niveau ligne des rapports.", en: "From Power BI Desktop, modify the row-level security setting of the reports." },
      { fr: "Gérer les permissions du jeu de données sous-jacent.", en: "Manage the permissions of the underlying dataset." },
      { fr: "Demander l'ajout du manager au bon groupe Azure Active Directory.", en: "Request that the manager be added to the correct Azure Active Directory group." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Puisque la RLS est basée sur l'appartenance à des groupes AD mail-enabled, il suffit de déplacer le manager du groupe de son ancienne région vers celui de sa nouvelle région pour que le filtre RLS s'applique correctement.",
      en: "Since RLS is based on membership in mail-enabled AD groups, it is enough to move the manager from his previous region's group to his new region's group for the RLS filter to apply correctly.",
    },
  },
  {
    id: "pbi-q49",
    question: {
      fr: "Vous avez plus de 100 jeux de données publiés, dont 10 ont été vérifiés conformes aux standards qualité de l'entreprise. Vous devez garantir que ces 10 jeux de données apparaissent en tête de liste lors des recherches. Que faites-vous ?",
      en: "You have more than 100 published datasets, 10 of which have been verified to comply with the company's quality standards. You need to ensure these 10 datasets appear at the top of search results. What do you do?",
    },
    options: [
      { fr: "Promouvoir les jeux de données (Promote).", en: "Promote the datasets." },
      { fr: "Certifier les jeux de données (Certify).", en: "Certify the datasets." },
      { fr: "Mettre le jeu de données en avant sur la page d'accueil.", en: "Feature the dataset on the home page." },
      { fr: "Publier les jeux de données dans une application.", en: "Publish the datasets in an app." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "La certification est le plus haut niveau de qualité endossé, qui fait remonter automatiquement les jeux de données certifiés en tête des résultats de recherche dans toute l'organisation.",
      en: "Certification is the highest level of endorsed quality, and it automatically boosts certified datasets to the top of search results across the entire organization.",
    },
  },
  {
    id: "pbi-q50",
    question: {
      fr: "Vous devez créer une visualisation qui explore les données de manière ad hoc, en descendant automatiquement dans les dimensions selon l'intérêt de l'utilisateur, comme illustré par un exemple de type arborescence de décomposition. Quel type de visuel utiliser ?",
      en: "You need to create a visualization that explores data ad hoc, automatically drilling down into dimensions based on the user's interest, as illustrated by a decomposition-tree-style example. Which visual type should you use?",
    },
    options: [
      { fr: "Narration intelligente (smart narrative)", en: "Smart narrative" },
      { fr: "Arbre de décomposition (decomposition tree)", en: "Decomposition tree" },
      { fr: "Q&A", en: "Q&A" },
      { fr: "Facteurs clés (key influencers)", en: "Key influencers" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "L'arbre de décomposition permet une exploration ad hoc, où l'utilisateur choisit interactivement selon quel champ approfondir l'analyse à chaque étape.",
      en: "The decomposition tree allows ad hoc exploration, where the user interactively chooses which field to drill into further at each step.",
    },
  },
  {
    id: "pbi-q51",
    question: {
      fr: "Vous avez une table de 1 000 lignes de données de vente. Vous devez identifier des valeurs aberrantes (outliers). Quel type de visualisation utiliser ?",
      en: "You have a table of 1,000 rows of sales data. You need to identify outliers. Which visualization type should you use?",
    },
    options: [
      { fr: "Un graphique en aires", en: "An area chart" },
      { fr: "Un nuage de points (scatter plot)", en: "A scatter plot" },
      { fr: "Un graphique circulaire", en: "A pie chart" },
      { fr: "Un graphique en anneau", en: "A donut chart" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Un nuage de points permet de visualiser la distribution de deux variables numériques et de repérer facilement les points isolés du reste du nuage.",
      en: "A scatter plot lets you visualize the distribution of two numeric variables and easily spot points that are isolated from the rest of the cloud.",
    },
  },
  {
    id: "pbi-q52",
    question: {
      fr: "Vous avez un rapport de trois pages, dont l'une contient un visuel KPI. Vous devez filtrer tous les visuels du rapport sauf le visuel KPI. Quelles sont les deux actions à effectuer ?",
      en: "You have a three-page report, one page of which contains a KPI visual. You need to filter all visuals in the report except the KPI visual. Which two actions should you take?",
    },
    options: [
      { fr: "Modifier les interactions du visuel KPI.", en: "Modify the KPI visual's interactions." },
      { fr: "Ajouter le même segment (slicer) à chaque page et configurer la synchronisation des segments (sync slicers).", en: "Add the same slicer to each page and configure slicer synchronization (sync slicers)." },
      { fr: "Modifier les interactions du segment situé sur la même page que le visuel KPI.", en: "Modify the interactions of the slicer located on the same page as the KPI visual." },
      { fr: "Configurer un filtre au niveau de la page.", en: "Configure a page-level filter." },
      { fr: "Configurer un filtre au niveau du rapport.", en: "Configure a report-level filter." },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "En synchronisant un segment identique sur toutes les pages, puis en désactivant son interaction avec le visuel KPI sur la page où il se trouve, on filtre tous les autres visuels du rapport sans jamais toucher au KPI.",
      en: "By synchronizing an identical slicer across all pages, then disabling its interaction with the KPI visual on the page where it resides, all other visuals in the report are filtered without ever affecting the KPI.",
    },
  },
  {
    id: "pbi-q53",
    question: {
      fr: "Vous avez un rapport avec un visuel carte (card). Vous devez appliquer une mise en forme conditionnelle : police rouge foncé si la valeur est ≥ 100, gris foncé si < 100, en minimisant l'effort de conception. Quel type de format utiliser ?",
      en: "You have a report with a card visual. You need to apply conditional formatting: dark red font if the value is ≥ 100, dark gray if < 100, while minimizing design effort. Which format type should you use?",
    },
    options: [
      { fr: "Échelle de couleurs (color scale)", en: "Color scale" },
      { fr: "Règles (rules)", en: "Rules" },
      { fr: "Valeur de champ (field value)", en: "Field value" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Les règles permettent de définir des seuils numériques précis (≥100, <100) associés chacun à une couleur de police fixe, exactement ce que demande le besoin.",
      en: "Rules let you define precise numeric thresholds (≥100, <100), each associated with a fixed font color - exactly what the requirement calls for.",
    },
  },
  {
    id: "pbi-q54",
    question: {
      fr: "Vous êtes en train de créer un rapport Power BI et devez inclure un visuel qui affiche automatiquement des tendances et informations utiles, se mettant à jour selon les sélections faites dans d'autres visuels. Quel type de visuel utiliser ?",
      en: "You are creating a Power BI report and need to include a visual that automatically displays trends and useful insights, updating based on selections made in other visuals. Which visual type should you use?",
    },
    options: [
      { fr: "Q&A", en: "Q&A" },
      { fr: "Narration intelligente (smart narrative)", en: "Smart narrative" },
      { fr: "Facteurs clés (key influencers)", en: "Key influencers" },
      { fr: "Arbre de décomposition", en: "Decomposition tree" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le visuel de narration intelligente génère automatiquement un résumé textuel des tendances des données affichées, et se met à jour dynamiquement selon les filtres/sélections en cours.",
      en: "The smart narrative visual automatically generates a text summary of the trends in the displayed data, and updates dynamically based on the current filters/selections.",
    },
  },
  {
    id: "pbi-q55",
    question: {
      fr: "Vous avez deux rapports Power BI utilisant chacun une palette de couleurs distincte. Vous créez un tableau de bord incluant deux visuels de chaque rapport. Vous devez utiliser un thème sombre cohérent pour le tableau de bord, tout en préservant les couleurs d'origine des rapports. Quelles sont les deux actions à effectuer ?",
      en: "You have two Power BI reports, each using a distinct color palette. You create a dashboard that includes two visuals from each report. You need to use a consistent dark theme for the dashboard, while preserving the reports' original colors. Which two actions should you take?",
    },
    options: [
      { fr: "Charger une capture d'écran (snapshot).", en: "Upload a screenshot (snapshot)." },
      { fr: "Définir la préférence de couleur du navigateur sur le mode sombre.", en: "Set the browser's color preference to dark mode." },
      { fr: "Lors de l'épinglage des visuels au tableau de bord, sélectionner « Utiliser le thème de destination » (Use destination theme).", en: "When pinning the visuals to the dashboard, select \"Use destination theme\"." },
      { fr: "Sélectionner le thème de tableau de bord sombre (dark dashboard theme).", en: "Select the dark dashboard theme." },
      { fr: "Activer le flux de tuiles (tile flow).", en: "Enable tile flow." },
    ],
    correctIndexes: [2, 3],
    explanation: {
      fr: "Choisir « Utiliser le thème de destination » lors de l'épinglage préserve les couleurs propres à chaque visuel plutôt que d'adopter le thème du tableau de bord, tandis que sélectionner le thème sombre du tableau de bord assure une base visuelle cohérente pour l'ensemble.",
      en: "Choosing \"Use destination theme\" when pinning preserves each visual's own colors rather than adopting the dashboard's theme, while selecting the dark dashboard theme ensures a consistent visual base overall.",
    },
  },
  {
    id: "pbi-q56",
    question: {
      fr: "Votre entreprise compte des employés répartis dans 10 états, récemment regroupés en trois régions : Est, Ouest, Nord. Votre modèle de données contient les employés par état, mais pas l'information de région. Vous avez un rapport montrant les employés par état. Vous devez visualiser les employés par région le plus rapidement possible. Que faites-vous ?",
      en: "Your company has employees spread across 10 states, recently grouped into three regions: East, West, North. Your data model contains employees by state, but not the region information. You have a report showing employees by state. You need to visualize employees by region as quickly as possible. What do you do?",
    },
    options: [
      { fr: "Créer une nouvelle agrégation qui résume par état.", en: "Create a new aggregation that summarizes by state." },
      { fr: "Créer une nouvelle agrégation qui résume par employé.", en: "Create a new aggregation that summarizes by employee." },
      { fr: "Créer un nouveau groupe sur la colonne état et définir le type de groupe sur Liste (List).", en: "Create a new group on the state column and set the group type to List." },
      { fr: "Créer un nouveau groupe sur la colonne état et définir le type de groupe sur Bin.", en: "Create a new group on the state column and set the group type to Bin." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Un groupe de type Liste permet d'assigner manuellement chaque valeur d'état à une catégorie personnalisée (ici une région), le moyen le plus rapide sans modifier le modèle de données sous-jacent.",
      en: "A List-type group lets you manually assign each state value to a custom category (here, a region) - the fastest way without modifying the underlying data model.",
    },
  },
  {
    id: "pbi-q57",
    question: {
      fr: "Vous avez une collection de rapports pour le service RH de votre entreprise. Vous devez créer une visualisation montrant l'historique du nombre d'employés et prédisant les tendances des six prochains mois. Quel type de visualisation utiliser ?",
      en: "You have a collection of reports for your company's HR department. You need to create a visualization showing the historical employee count and predicting trends for the next six months. Which visualization type should you use?",
    },
    options: [
      { fr: "Graphique en ruban (ribbon chart)", en: "Ribbon chart" },
      { fr: "Nuage de points (scatter chart)", en: "Scatter chart" },
      { fr: "Graphique linéaire (line chart)", en: "Line chart" },
      { fr: "Facteurs clés (key influencers)", en: "Key influencers" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le graphique linéaire est le seul de cette liste à proposer nativement une fonctionnalité de prévision (forecast) sur une série temporelle continue.",
      en: "The line chart is the only one on this list that natively offers a forecasting feature on a continuous time series.",
    },
  },
  {
    id: "pbi-q58",
    question: {
      fr: "Vous avez un rapport contenant quatre pages, toutes avec un segment (slicer) sur un champ Country. Vous devez garantir que la sélection d'un pays sur la page 1 est conservée sur les pages 2 et 3, sans affecter la page 4. Que faites-vous ?",
      en: "You have a report containing four pages, all with a slicer on a Country field. You need to ensure that selecting a country on page 1 is retained on pages 2 and 3, without affecting page 4. What do you do?",
    },
    options: [
      { fr: "Supprimer le segment Country des pages 1, 2 et 3, et ajouter le champ Country aux filtres de niveau page.", en: "Remove the Country slicer from pages 1, 2, and 3, and add the Country field to the page-level filters." },
      { fr: "Supprimer le segment Country des pages 1, 2 et 3, et ajouter le champ Country aux filtres de niveau rapport.", en: "Remove the Country slicer from pages 1, 2, and 3, and add the Country field to the report-level filters." },
      { fr: "Déplacer le segment Country des pages 2 et 3 vers la page 1.", en: "Move the Country slicer from pages 2 and 3 to page 1." },
      { fr: "Synchroniser le segment Country sur les pages 1, 2 et 3 uniquement.", en: "Synchronize the Country slicer on pages 1, 2, and 3 only." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "La synchronisation de segments permet de choisir précisément quelles pages partagent la même sélection (ici 1, 2 et 3), tout en laissant la page 4 indépendante - sans passer par des filtres globaux qui toucheraient toutes les pages.",
      en: "Slicer synchronization lets you precisely choose which pages share the same selection (here, 1, 2, and 3), while leaving page 4 independent - without resorting to global filters that would affect every page.",
    },
  },
  {
    id: "pbi-q59",
    question: {
      fr: "Vous planifiez de créer un jeu de données Power BI qui analyse l'attrition des employés selon des dimensions comme l'âge, le salaire ou la satisfaction, avec une visualisation permettant d'identifier automatiquement quels facteurs influencent le plus une valeur cible. Quel type de visuel utiliser ?",
      en: "You are planning to create a Power BI dataset that analyzes employee attrition across dimensions such as age, salary, or satisfaction, with a visualization that automatically identifies which factors most influence a target value. Which visual type should you use?",
    },
    options: [
      { fr: "Facteurs clés (key influencers)", en: "Key influencers" },
      { fr: "Graphique en ruban", en: "Ribbon chart" },
      { fr: "Q&A", en: "Q&A" },
      { fr: "Graphique en entonnoir", en: "Funnel chart" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le visuel « Facteurs clés » analyse statistiquement quelles valeurs de quelles colonnes ont le plus d'impact sur l'augmentation ou la diminution d'une métrique cible (ici l'attrition).",
      en: "The \"Key influencers\" visual statistically analyzes which values in which columns have the most impact on increasing or decreasing a target metric (here, attrition).",
    },
  },
  {
    id: "pbi-q60",
    question: {
      fr: "Vous avez un rapport Power BI hébergé sur powerbi.com affichant les dépenses par département pour les responsables de département, avec un graphique linéaire montrant les dépenses par mois. Vous devez permettre aux utilisateurs de choisir entre une visualisation en graphique linéaire ou en graphique à colonnes, en minimisant l'effort de développement et de maintenance. Que faites-vous ?",
      en: "You have a Power BI report hosted on powerbi.com showing expenses by department for department managers, with a line chart showing expenses by month. You need to let users choose between a line chart or a column chart visualization, while minimizing development and maintenance effort. What do you do?",
    },
    options: [
      { fr: "Permettre aux lecteurs du rapport de personnaliser les visuels (personalize visuals).", en: "Allow report readers to personalize visuals." },
      { fr: "Créer une page de rapport séparée pour le graphique à colonnes.", en: "Create a separate report page for the column chart." },
      { fr: "Ajouter un graphique à colonnes, un signet (bookmark) et un bouton pour que l'utilisateur choisisse un visuel.", en: "Add a column chart, a bookmark, and a button so the user can choose a visual." },
      { fr: "Créer un rapport mobile contenant un graphique à colonnes.", en: "Create a mobile report containing a column chart." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "La personnalisation des visuels permet à chaque lecteur de changer lui-même le type de visualisation directement dans le rapport publié, sans aucun développement supplémentaire ni maintenance de signets.",
      en: "Personalizing visuals lets each reader change the visualization type themselves directly in the published report, with no additional development or bookmark maintenance.",
    },
  },
  {
    id: "pbi-q61",
    question: {
      fr: "Vous avez un dataset Sales avec les colonnes Order Line ID, Product ID, Unit Price, Order ID et Quantity. Les commandes sont identifiées de façon unique par Order ID et peuvent contenir plusieurs lignes (une par produit). Vous devez écrire une mesure DAX qui compte le nombre de commandes. Quelle formule utiliser ?",
      en: "You have a Sales dataset with the columns Order Line ID, Product ID, Unit Price, Order ID, and Quantity. Orders are uniquely identified by Order ID and can contain multiple lines (one per product). You need to write a DAX measure that counts the number of orders. Which formula should you use?",
    },
    options: [
      { fr: "Count('Sales'[Order ID])", en: "Count('Sales'[Order ID])" },
      { fr: "CountA('Sales'[Order ID])", en: "CountA('Sales'[Order ID])" },
      { fr: "CountRows('Sales')", en: "CountRows('Sales')" },
      { fr: "DistinctCount('Sales'[Order ID])", en: "DistinctCount('Sales'[Order ID])" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Comme un même Order ID peut apparaître sur plusieurs lignes (une par produit commandé), il faut compter les valeurs distinctes d'Order ID pour obtenir le nombre réel de commandes, et non le nombre de lignes.",
      en: "Since the same Order ID can appear on multiple lines (one per ordered product), you must count the distinct values of Order ID to get the actual number of orders, not the number of rows.",
    },
  },
  {
    id: "pbi-q62",
    question: {
      fr: "Vous devez créer une table calculée nommée Numbers contenant tous les entiers de -100 à 100. Quelle expression DAX utiliser ?",
      en: "You need to create a calculated table named Numbers containing all integers from -100 to 100. Which DAX expression should you use?",
    },
    options: [
      { fr: "Numbers = GENERATE(100, 1, 200)", en: "Numbers = GENERATE(100, 1, 200)" },
      { fr: "Numbers = GENERATESERIES(-100, 100, 1)", en: "Numbers = GENERATESERIES(-100, 100, 1)" },
      { fr: "Numbers = GENERATEALL(-1, -100, 100)", en: "Numbers = GENERATEALL(-1, -100, 100)" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "GENERATESERIES(début, fin, pas) génère une table calculée d'une seule colonne contenant tous les entiers de -100 à 100 par pas de 1.",
      en: "GENERATESERIES(start, end, step) generates a single-column calculated table containing all integers from -100 to 100 in steps of 1.",
    },
  },
  {
    id: "pbi-q63",
    question: {
      fr: "Vous créez un rapport de sécurité au niveau ligne. Un utilisateur voit les données de son propre enregistrement employé uniquement, la solution devant fonctionner à la fois dans Power BI Desktop et le service Power BI. Quelle expression utiliser pour le filtre de la table Employees (colonnes Employee Name et Email Address) ?",
      en: "You are creating a row-level security report. A user should see only the data of their own employee record, and the solution must work both in Power BI Desktop and the Power BI service. Which expression should you use for the filter on the Employees table (Employee Name and Email Address columns)?",
    },
    options: [
      { fr: "[Employee Name] = USERPRINCIPALNAME()", en: "[Employee Name] = USERPRINCIPALNAME()" },
      { fr: "[Email Address] = USERNAME()", en: "[Email Address] = USERNAME()" },
      { fr: "[Employee Name] = USERNAME()", en: "[Employee Name] = USERNAME()" },
      { fr: "[Email Address] = USERPRINCIPALNAME()", en: "[Email Address] = USERPRINCIPALNAME()" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "USERPRINCIPALNAME() retourne l'adresse e-mail/UPN de l'utilisateur connecté et fonctionne aussi bien dans Power BI Desktop que dans le service, contrairement à USERNAME() qui n'est pas fiable dans le service Power BI cloud.",
      en: "USERPRINCIPALNAME() returns the signed-in user's email/UPN and works equally well in Power BI Desktop and in the service, unlike USERNAME(), which is not reliable in the Power BI cloud service.",
    },
  },
  {
    id: "pbi-q64",
    question: {
      fr: "Vous avez un tableau de bord dont les tuiles proviennent d'un seul rapport. Vous devez modifier le tableau de bord pour qu'il utilise un thème sombre cohérent, correspondant à un exemple visuel fourni, sans changer le contenu des visuels eux-mêmes. Que faites-vous ?",
      en: "You have a dashboard whose tiles come from a single report. You need to modify the dashboard so it uses a consistent dark theme, matching a provided visual example, without changing the content of the visuals themselves. What do you do?",
    },
    options: [
      { fr: "Changer le thème du rapport.", en: "Change the report's theme." },
      { fr: "Changer le thème du tableau de bord.", en: "Change the dashboard's theme." },
      { fr: "Modifier les détails de chaque tuile individuellement.", en: "Modify the details of each tile individually." },
      { fr: "Créer un fichier CSS personnalisé.", en: "Create a custom CSS file." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le thème du tableau de bord (accessible dans les paramètres du tableau de bord) s'applique globalement à toutes les tuiles épinglées, sans qu'il soit nécessaire de retoucher le rapport source ou chaque tuile.",
      en: "The dashboard theme (accessible in the dashboard settings) applies globally to all pinned tiles, without needing to touch the source report or each individual tile.",
    },
  },
  {
    id: "pbi-q65",
    question: {
      fr: "Vous devez créer un thème Power BI qui sera utilisé dans plusieurs rapports, incluant une charte graphique d'entreprise (taille de police, couleurs, mise en forme des graphiques à barres). Que faites-vous ?",
      en: "You need to create a Power BI theme that will be used across multiple reports, incorporating a corporate style guide (font size, colors, bar chart formatting). What do you do?",
    },
    options: [
      { fr: "Depuis Power BI Desktop, personnaliser le thème courant.", en: "From Power BI Desktop, customize the current theme." },
      { fr: "Depuis Power BI Desktop, utiliser un thème de rapport intégré.", en: "From Power BI Desktop, use a built-in report theme." },
      { fr: "Créer un thème sous forme de fichier PBIVIZ et l'importer dans Power BI Desktop.", en: "Create a theme as a PBIVIZ file and import it into Power BI Desktop." },
      { fr: "Créer un thème sous forme de fichier JSON et l'importer dans Power BI Desktop.", en: "Create a theme as a JSON file and import it into Power BI Desktop." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Les thèmes Power BI réutilisables entre plusieurs rapports se définissent dans un fichier JSON structuré (couleurs, polices, styles de visuels), importable dans n'importe quel fichier PBIX.",
      en: "Power BI themes reusable across multiple reports are defined in a structured JSON file (colors, fonts, visual styles), importable into any PBIX file.",
    },
  },
  {
    id: "pbi-q66",
    type: "order",
    question: {
      fr: "Remets dans l'ordre les étapes du flux Power BI, de la source de données à la publication du rapport.",
      en: "Put the Power BI workflow steps in order, from data source to publishing the report.",
    },
    options: [
      { fr: "Se connecter à la source de données", en: "Connect to the data source" },
      { fr: "Transformer les données avec Power Query", en: "Transform the data with Power Query" },
      { fr: "Modéliser les relations et créer des mesures DAX", en: "Model relationships and create DAX measures" },
      { fr: "Concevoir les visuels du rapport", en: "Design the report visuals" },
      { fr: "Publier le rapport sur le service Power BI", en: "Publish the report to the Power BI service" },
    ],
    correctIndexes: [],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: {
      fr: "Le flux classique Power BI : connexion aux données, transformation (Power Query), modélisation (relations, DAX), visualisation, puis publication sur le service.",
      en: "The typical Power BI flow: connect to data, transform it (Power Query), model it (relationships, DAX), visualize it, then publish to the service.",
    },
  },
  {
    id: "pbi-q67",
    type: "order",
    question: {
      fr: "Classe ces éléments d'un schéma en étoile du plus \"central\" au plus \"périphérique\".",
      en: "Rank these star-schema elements from most \"central\" to most \"peripheral\".",
    },
    options: [
      { fr: "Table de faits", en: "Fact table" },
      { fr: "Table de dimension", en: "Dimension table" },
      { fr: "Colonne calculée sur une dimension", en: "Calculated column on a dimension" },
      { fr: "Mesure DAX affichée dans un visuel", en: "DAX measure displayed in a visual" },
    ],
    correctIndexes: [],
    correctOrder: [0, 1, 2, 3],
    explanation: {
      fr: "La table de faits est au centre du modèle, reliée aux tables de dimension ; les colonnes calculées enrichissent les dimensions, et les mesures DAX sont l'élément final consommé par les visuels.",
      en: "The fact table sits at the center of the model, linked to dimension tables; calculated columns enrich dimensions, and DAX measures are the final layer consumed by visuals.",
    },
  },
];
