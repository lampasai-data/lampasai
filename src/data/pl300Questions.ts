import type { Question } from "./types";

// Microsoft Power BI (PL-300) - banque additionnelle issue d'annales d'examen.
// Questions à choix simple / multiple (les questions de type drag-and-drop et
// hotspot, dont les réponses sont dans des images, seront traitées séparément).
export const PL300_QUESTIONS: Question[] = [
  {
    id: "pl300-1",
    question: {
      fr: "Un rapport Power BI (fichier PBIX de 550 Mo) est publié dans un App workspace en capacité partagée. Le dataset importé contient une table de faits de 12 millions de lignes, actualisée deux fois par jour. La page unique contient 15 visuels AppSource et 10 visuels par défaut. Les utilisateurs trouvent le rapport lent à charger. Que recommandez-vous pour améliorer les performances ?",
      en: "A Power BI report (550 MB PBIX file) is published to an App workspace in shared capacity. The imported dataset contains one 12-million-row fact table, refreshed twice a day. The single page contains 15 AppSource visuals and 10 default visuals. Users say the report is slow to load. What should you recommend to improve performance?",
    },
    options: [
      { fr: "Implémenter la sécurité au niveau des lignes (RLS).", en: "Implement row-level security (RLS)." },
      { fr: "Supprimer les colonnes inutilisées des tables du modèle.", en: "Remove unused columns from tables in the data model." },
      { fr: "Remplacer les visuels par défaut par des visuels AppSource.", en: "Replace the default visuals with AppSource visuals." },
      { fr: "Activer les interactions entre visuels.", en: "Enable visual interactions." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Réduire la taille du modèle en supprimant les colonnes inutilisées diminue la mémoire et accélère le rendu. La RLS et les interactions n'améliorent pas la vitesse de chargement.",
      en: "Removing unused columns shrinks the model, lowering memory use and speeding up rendering. RLS and visual interactions don't improve load speed.",
    },
  },
  {
    id: "pl300-2",
    question: {
      fr: "Un fichier CSV de réclamations contient une colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser les réclamations par date et utiliser une hiérarchie de dates intégrée. Que faites-vous ?",
      en: "A CSV of complaints contains a Logged column in the format \"2018-12-31 at 08:59\". You need to analyze complaints by date and use a built-in date hierarchy. What should you do?",
    },
    options: [
      { fr: "Extraire les 11 premiers caractères de la colonne Logged.", en: "Extract the first 11 characters of the Logged column." },
      { fr: "Ajouter une colonne conditionnelle qui renvoie 2018 et la typer en nombre entier.", en: "Add a conditional column that outputs 2018 and set its type to Whole Number." },
      { fr: "Créer une colonne par l'exemple commençant par 2018-12-31 et la typer en Date.", en: "Create a column by example that starts with 2018-12-31 and set its type to Date." },
      { fr: "Extraire les 11 derniers caractères de la colonne Logged et la typer en Date.", en: "Extract the last 11 characters of the Logged column and set its type to Date." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "« Column by example » isole la partie date et, une fois typée en Date, active la hiérarchie de dates intégrée. La date est au début (11 premiers caractères), pas à la fin.",
      en: "\"Column by example\" isolates the date part; typed as Date, it enables the built-in date hierarchy. The date is at the start (first 11 chars), not the end.",
    },
  },
  {
    id: "pl300-3",
    question: {
      fr: "Un rapport Power BI (PBIX de 550 Mo) en capacité partagée utilise un dataset importé (table de faits de 12 millions de lignes). Les utilisateurs trouvent le rapport lent. Parmi ces options, que recommandez-vous pour améliorer les performances ?",
      en: "A Power BI report (550 MB PBIX) in shared capacity uses an imported dataset (12-million-row fact table). Users find the report slow. Among these options, what should you recommend to improve performance?",
    },
    options: [
      { fr: "Remplacer les visuels par défaut par des visuels AppSource.", en: "Replace the default visuals with AppSource visuals." },
      { fr: "Supprimer les colonnes inutilisées des tables du modèle.", en: "Remove unused columns from tables in the data model." },
      { fr: "Passer le dataset importé en DirectQuery.", en: "Change the imported dataset to DirectQuery." },
      { fr: "Augmenter le nombre d'actualisations du dataset.", en: "Increase the number of dataset refreshes." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Alléger le modèle en retirant les colonnes inutiles est la mesure la plus efficace. Passer en DirectQuery ou actualiser plus souvent n'accélère pas le rendu des visuels.",
      en: "Trimming the model by removing unused columns is the most effective fix. DirectQuery or more frequent refreshes won't speed up visual rendering.",
    },
  },
  {
    id: "pl300-4",
    question: {
      fr: "Un fichier CSV contient une colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser par date avec une hiérarchie de dates intégrée. Que faites-vous ?",
      en: "A CSV contains a Logged column in the format \"2018-12-31 at 08:59\". You need to analyze by date using a built-in date hierarchy. What should you do?",
    },
    options: [
      { fr: "Changer directement le type de la colonne Logged en Date.", en: "Change the data type of the Logged column to Date." },
      { fr: "Fractionner la colonne Logged en utilisant « at » comme délimiteur.", en: "Split the Logged column using \"at\" as the delimiter." },
      { fr: "Ajouter une colonne conditionnelle renvoyant 2018, typée en nombre entier.", en: "Add a conditional column that outputs 2018, typed as Whole Number." },
      { fr: "Appliquer la fonction Parse des transformations de date à la colonne Logged.", en: "Apply the Parse function from Date transformations to the Logged column." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Fractionner sur « at » sépare la date de l'heure ; la partie date peut ensuite être typée en Date. Un changement de type direct échoue à cause du texte « at ».",
      en: "Splitting on \"at\" separates date from time; the date part can then be typed as Date. A direct type change fails because of the \"at\" text.",
    },
  },
  {
    id: "pl300-5",
    question: {
      fr: "Un rapport Power BI (PBIX de 550 Mo) en capacité partagée est lent à charger pour les utilisateurs. Parmi ces options, que recommandez-vous ?",
      en: "A Power BI report (550 MB PBIX) in shared capacity is slow for users. Among these options, what should you recommend?",
    },
    options: [
      { fr: "Activer les interactions entre visuels.", en: "Enable visual interactions." },
      { fr: "Modifier les mesures DAX pour utiliser des fonctions itératives.", en: "Change DAX measures to use iterator functions." },
      { fr: "Implémenter la sécurité au niveau des lignes (RLS).", en: "Implement row-level security (RLS)." },
      { fr: "Supprimer les colonnes inutilisées des tables du modèle.", en: "Remove unused columns from tables in the data model." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Supprimer les colonnes inutilisées réduit la taille du modèle et accélère le chargement. Les fonctions itératives DAX alourdissent plutôt les calculs.",
      en: "Removing unused columns reduces model size and speeds up loading. Iterator DAX functions tend to make calculations heavier, not faster.",
    },
  },
  {
    id: "pl300-6",
    question: {
      fr: "Un fichier CSV contient une colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser par date avec une hiérarchie de dates intégrée. Quelle option est correcte ?",
      en: "A CSV contains a Logged column in the format \"2018-12-31 at 08:59\". You need to analyze by date with a built-in date hierarchy. Which option is correct?",
    },
    options: [
      { fr: "Créer une colonne par l'exemple commençant par 2018-12-31 et la typer en Date.", en: "Create a column by example starting with 2018-12-31 and set its type to Date." },
      { fr: "Créer une colonne par l'exemple commençant par 2018-12-31 (sans changer le type).", en: "Create a column by example starting with 2018-12-31 (without changing the type)." },
      { fr: "Extraire les 11 derniers caractères de la colonne Logged.", en: "Extract the last 11 characters of the Logged column." },
      { fr: "Ajouter une colonne conditionnelle renvoyant 2018, typée en nombre entier.", en: "Add a conditional column that outputs 2018, typed as Whole Number." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Il faut à la fois isoler la date (colonne par l'exemple) ET la typer en Date pour obtenir la hiérarchie de dates intégrée. Sans le type Date, la hiérarchie n'apparaît pas.",
      en: "You must both isolate the date (column by example) AND set its type to Date to get the built-in date hierarchy. Without the Date type, no hierarchy appears.",
    },
  },
  {
    id: "pl300-7",
    question: {
      fr: "Une table Employees contient Employee Name, Email Address, Start Date et Job Title. Vous implémentez une RLS dynamique : chaque utilisateur ne doit voir que ses propres données, et l'expression DAX doit fonctionner à la fois dans Power BI Desktop et le service. Quelle expression utiliser ?",
      en: "An Employees table contains Employee Name, Email Address, Start Date and Job Title. You implement dynamic RLS: each user must see only their own data, and the DAX must work in both Power BI Desktop and the service. Which expression should you use?",
    },
    options: [
      { fr: "[Email Address] = USERNAME()", en: "[Email Address] = USERNAME()" },
      { fr: "[Employee Name] = USERPRINCIPALNAME()", en: "[Employee Name] = USERPRINCIPALNAME()" },
      { fr: "[Employee Name] = USERNAME()", en: "[Employee Name] = USERNAME()" },
      { fr: "[Email Address] = USERPRINCIPALNAME()", en: "[Email Address] = USERPRINCIPALNAME()" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "USERPRINCIPALNAME() renvoie l'UPN (l'e-mail) de façon cohérente dans Desktop et le service, à comparer à la colonne Email Address. USERNAME() renvoie un format domaine\\utilisateur dans Desktop.",
      en: "USERPRINCIPALNAME() returns the user's UPN (email) consistently in both Desktop and the service, matching the Email Address column. USERNAME() returns domain\\user in Desktop.",
    },
  },
  {
    id: "pl300-8",
    question: {
      fr: "Un modèle importe des données depuis Excel via Power Query, avec des colonnes renommées et personnalisées. Au rechargement, l'erreur « Expression.Error: The column 'Category' of the table wasn't found » apparaît. Quelles sont les deux causes possibles ? (chaque bonne réponse est une solution complète)",
      en: "A model imports Excel data via Power Query, with renamed and custom columns. On reload, the error \"Expression.Error: The column 'Category' of the table wasn't found\" appears. What are two possible causes? (each correct answer is a complete solution)",
    },
    options: [
      { fr: "La colonne a été supprimée du fichier source.", en: "The column was removed from the source file." },
      { fr: "La colonne a été renommée dans le fichier source.", en: "The column was renamed in the source file." },
      { fr: "Le fichier n'est plus à l'emplacement indiqué.", en: "The file is no longer in the specified location." },
      { fr: "Le type de données de la colonne a été modifié.", en: "The data type of the column was changed." },
    ],
    correctIndexes: [0, 1],
    explanation: {
      fr: "L'erreur « colonne introuvable » survient si la colonne référencée par une étape n'existe plus : elle a été supprimée ou renommée à la source. Un fichier manquant donnerait une autre erreur, et un changement de type n'empêche pas de trouver la colonne.",
      en: "The \"column not found\" error occurs when a step references a column that no longer exists: it was removed or renamed at the source. A missing file yields a different error, and a type change doesn't hide the column.",
    },
  },
  {
    id: "pl300-9",
    question: {
      fr: "Une application de gestion de projet est hébergée dans Microsoft Teams et développée avec Power Apps. Vous devez créer un rapport Power BI connecté à cette application. Quel connecteur choisir ?",
      en: "A project management app is hosted in Microsoft Teams and built with Power Apps. You need a Power BI report that connects to it. Which connector should you select?",
    },
    options: [
      { fr: "Microsoft Teams Personal Analytics", en: "Microsoft Teams Personal Analytics" },
      { fr: "Base de données SQL Server", en: "SQL Server database" },
      { fr: "Dataverse", en: "Dataverse" },
      { fr: "Dataflows", en: "Dataflows" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Les applications Power Apps stockent leurs données dans Dataverse ; c'est donc le connecteur adapté pour lire les données de l'application.",
      en: "Power Apps apps store their data in Dataverse, so that's the correct connector to read the app's data.",
    },
  },
  {
    id: "pl300-10",
    question: {
      fr: "Pour le service commercial, vous avez publié un rapport Power BI important des données depuis un fichier Excel sur SharePoint, avec plusieurs mesures. Vous devez créer un nouveau rapport à partir de ces données existantes en minimisant l'effort de développement. Quel type de source utiliser ?",
      en: "For the sales department, you published a Power BI report importing data from an Excel file on SharePoint, with several measures. You need to build a new report from that existing data with minimal development effort. Which data source type should you use?",
    },
    options: [
      { fr: "Un dataset Power BI", en: "A Power BI dataset" },
      { fr: "Un dossier SharePoint", en: "A SharePoint folder" },
      { fr: "Des dataflows Power BI", en: "Power BI dataflows" },
      { fr: "Un classeur Excel", en: "An Excel workbook" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Se connecter au dataset Power BI déjà publié réutilise le modèle et ses mesures sans refaire l'import ni la modélisation : effort minimal.",
      en: "Connecting to the already-published Power BI dataset reuses the model and its measures without redoing the import or modeling: minimal effort.",
    },
  },
  {
    id: "pl300-11",
    question: {
      fr: "Vous importez deux tables Excel dans Power Query : Customer (avec Address ID) et Address (avec Address ID, City, State/Region, Country...). Vous devez obtenir une requête avec une ligne par client, incluant City, State/Region et Country. Que faites-vous ?",
      en: "You import two Excel tables into Power Query: Customer (with Address ID) and Address (with Address ID, City, State/Region, Country...). You need a query with one row per customer, including City, State/Region and Country. What should you do?",
    },
    options: [
      { fr: "Fusionner (Merge) les tables Customer et Address.", en: "Merge the Customer and Address tables." },
      { fr: "Grouper les tables par la colonne Address ID.", en: "Group the tables by the Address ID column." },
      { fr: "Transposer les tables Customer et Address.", en: "Transpose the Customer and Address tables." },
      { fr: "Ajouter (Append) les tables Customer et Address.", en: "Append the Customer and Address tables." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une fusion (Merge) sur Address ID rapproche chaque client de son adresse et conserve une ligne par client. Append empile les lignes ; Group agrège ; Transpose inverse lignes/colonnes.",
      en: "A Merge on Address ID joins each customer to its address, keeping one row per customer. Append stacks rows, Group aggregates, Transpose swaps rows/columns.",
    },
  },
  {
    id: "pl300-12",
    question: {
      fr: "Un site SharePoint Online contient une bibliothèque de documents avec des rapports de fabrication au format Excel, tous de même structure. Vous devez charger uniquement ces rapports dans une table pour analyse avec Power BI Desktop. Que faites-vous ?",
      en: "A SharePoint Online site has a document library with manufacturing reports as Excel files, all with the same structure. You need to load only those reports into a table for analysis using Power BI Desktop. What should you do?",
    },
    options: [
      { fr: "Obtenir les données depuis un dossier SharePoint, saisir l'URL, Transformer, puis filtrer par le chemin du dossier des rapports.", en: "Get data from a SharePoint folder, enter the URL, Transform, then filter by the reports folder path." },
      { fr: "Obtenir les données depuis une liste SharePoint, Combine & Transform, puis filtrer par le chemin.", en: "Get data from a SharePoint list, Combine & Transform, then filter by the path." },
      { fr: "Obtenir les données depuis un dossier SharePoint, saisir l'URL, puis Combine & Load.", en: "Get data from a SharePoint folder, enter the URL, then Combine & Load." },
      { fr: "Obtenir les données depuis une liste SharePoint, saisir l'URL, puis Combine & Load.", en: "Get data from a SharePoint list, enter the URL, then Combine & Load." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le connecteur « Dossier SharePoint » liste tous les fichiers ; il faut Transformer puis filtrer sur le chemin pour ne garder que la bibliothèque des rapports avant de combiner. Combine & Load sans filtrer chargerait tous les fichiers.",
      en: "The \"SharePoint folder\" connector lists all files; you must Transform then filter by path to keep only the reports library before combining. Combine & Load without filtering would load every file.",
    },
  },
  {
    id: "pl300-13",
    question: {
      fr: "Un fichier CSV contient une colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser par date avec une hiérarchie de dates intégrée. Quelle option est correcte ?",
      en: "A CSV contains a Logged column in the format \"2018-12-31 at 08:59\". You need to analyze by date with a built-in date hierarchy. Which option is correct?",
    },
    options: [
      { fr: "Extraire les 11 derniers caractères de Logged et typer en Date.", en: "Extract the last 11 characters of Logged and set type to Date." },
      { fr: "Changer directement le type de Logged en Date.", en: "Change the Logged column type directly to Date." },
      { fr: "Fractionner la colonne Logged avec « at » comme délimiteur.", en: "Split the Logged column using \"at\" as the delimiter." },
      { fr: "Extraire les 11 premiers caractères de Logged.", en: "Extract the first 11 characters of Logged." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Fractionner sur « at » sépare proprement la date (avant) de l'heure (après), permettant de typer la partie date en Date pour la hiérarchie intégrée.",
      en: "Splitting on \"at\" cleanly separates the date (before) from the time (after), letting you type the date part as Date for the built-in hierarchy.",
    },
  },
  {
    id: "pl300-14",
    question: {
      fr: "Une base Azure SQL contient des transactions fréquemment mises à jour. Vous devez générer des rapports détectant les fraudes, les données devant être visibles dans les 5 minutes suivant une mise à jour. Comment configurer la connexion ?",
      en: "An Azure SQL database contains frequently updated transactions. You must build fraud-detection reports where data is visible within 5 minutes of an update. How should you configure the connection?",
    },
    options: [
      { fr: "Ajouter une instruction SQL.", en: "Add a SQL statement." },
      { fr: "Régler le paramètre « Command timeout in minutes ».", en: "Set the Command timeout in minutes setting." },
      { fr: "Mettre le mode de connectivité sur Import.", en: "Set Data Connectivity mode to Import." },
      { fr: "Mettre le mode de connectivité sur DirectQuery.", en: "Set Data Connectivity mode to DirectQuery." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "DirectQuery interroge la source en temps réel : les données récentes sont visibles quasi immédiatement, sans attendre une actualisation planifiée comme en mode Import.",
      en: "DirectQuery queries the source in real time, so recent data is visible almost immediately, without waiting for a scheduled refresh as in Import mode.",
    },
  },
  {
    id: "pl300-15",
    question: {
      fr: "Un dataflow Power BI utilise DirectQuery vers SQL Server on-premises, avec le moteur de calcul amélioré activé. Vous devez l'utiliser dans un rapport en minimisant le traitement en ligne et les temps de calcul/rendu, et inclure les données de l'année en cours jusqu'à la veille. Que faites-vous ?",
      en: "A Power BI dataflow uses DirectQuery to on-premises SQL Server with the Enhanced Compute Engine on. You must use it in a report minimizing online processing and calculation/render times, including current-year data up to the previous day. What should you do?",
    },
    options: [
      { fr: "Une connexion dataflow en mode DirectQuery.", en: "A dataflows connection in DirectQuery mode." },
      { fr: "Une connexion dataflow en DirectQuery avec passerelle configurée.", en: "A dataflows connection in DirectQuery with a gateway configured." },
      { fr: "Une connexion dataflow en mode Import avec actualisation quotidienne planifiée.", en: "A dataflows connection in Import mode with a scheduled daily refresh." },
      { fr: "Une connexion dataflow en mode Import avec Power Automate pour actualiser toutes les heures.", en: "A dataflows connection in Import mode with Power Automate refreshing hourly." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le mode Import minimise le traitement en ligne et accélère le rendu. Comme les données requises vont jusqu'à la veille, une actualisation quotidienne planifiée suffit.",
      en: "Import mode minimizes online processing and speeds rendering. Since the required data only needs to be current up to the previous day, a scheduled daily refresh is enough.",
    },
  },
  {
    id: "pl300-16",
    question: {
      fr: "Vous tentez de connecter Power BI Desktop à une base Cassandra, mais aucun connecteur spécifique n'existe. Quel type de connecteur alternatif choisir pour vous connecter à la base ?",
      en: "You try to connect Power BI Desktop to a Cassandra database, but no specific connector exists. Which alternative connector should you choose?",
    },
    options: [
      { fr: "Base de données Microsoft SQL Server", en: "Microsoft SQL Server database" },
      { fr: "ODBC", en: "ODBC" },
      { fr: "OLE DB", en: "OLE DB" },
      { fr: "OData", en: "OData" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "En l'absence de connecteur natif, ODBC (avec le pilote Cassandra approprié) est le moyen générique standard de se connecter à la base.",
      en: "With no native connector, ODBC (using the appropriate Cassandra driver) is the standard generic way to connect to the database.",
    },
  },
  {
    id: "pl300-17",
    question: {
      fr: "Vous chargez un extrait contenant un champ texte libre nommé col1. Vous devez analyser la distribution de fréquence des longueurs de chaînes de col1, sans augmenter la taille du modèle. Que faites-vous ?",
      en: "You load an extract with a free-text field named col1. You need to analyze the frequency distribution of string lengths in col1 without increasing the model size. What should you do?",
    },
    options: [
      { fr: "Ajouter une colonne calculée DAX qui calcule la longueur de col1.", en: "Add a DAX calculated column that computes col1 length." },
      { fr: "Ajouter une fonction DAX qui calcule la longueur moyenne de col1.", en: "Add a DAX function computing the average length of col1." },
      { fr: "Dans Power Query, ajouter une colonne calculant la longueur de col1.", en: "In Power Query, add a column computing col1 length." },
      { fr: "Dans Power Query, régler le profil de colonne pour grouper par longueur sur col1.", en: "In Power Query, set the Column profile distribution to group by length for col1." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le profil de colonne de Power Query (« group by length ») affiche la distribution des longueurs à des fins d'analyse, sans charger de colonne supplémentaire dans le modèle - donc sans en augmenter la taille.",
      en: "Power Query's column profile (\"group by length\") shows the length distribution for analysis without loading an extra column into the model - so it doesn't increase model size.",
    },
  },
  {
    id: "pl300-18",
    question: {
      fr: "Des rapports RH utilisent la RLS. Chaque région commerciale a un manager RH qui ne doit voir que les données de sa région et ne doit pas pouvoir modifier la mise en page des rapports. Comment provisionner l'accès pour ces managers ?",
      en: "HR reports use RLS. Each sales region has an HR manager who must see only their region's data and must not be able to change the report layout. How should you provision access for these managers?",
    },
    options: [
      { fr: "Publier les rapports dans une app et accorder l'accès aux managers RH.", en: "Publish the reports in an app and grant the HR managers access." },
      { fr: "Créer un nouvel espace de travail, copier datasets et rapports, et y ajouter les managers.", en: "Create a new workspace, copy datasets and reports, and add the managers." },
      { fr: "Publier les rapports dans un espace différent de celui des datasets.", en: "Publish the reports to a workspace other than the datasets'." },
      { fr: "Ajouter les managers comme membres de l'espace de travail existant.", en: "Add the managers as members of the existing workspace." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Distribuer via une app applique la RLS et donne un accès en lecture seule : les managers voient uniquement leurs données sans pouvoir modifier la mise en page. Être membre d'un workspace donnerait des droits d'édition.",
      en: "Distributing via an app enforces RLS and gives read-only access: managers see only their data and can't change the layout. Workspace membership would grant edit rights.",
    },
  },
  {
    id: "pl300-19",
    question: {
      fr: "Un connecteur personnalisé renvoie ID, From, To, Subject, Body et Has Attachments pour plus de 10 millions d'e-mails. Vous analysez les réseaux internes selon les destinataires. Vous devez empêcher les destinataires du rapport de lire le contenu des e-mails, tout en minimisant la taille du modèle. Que faites-vous ?",
      en: "A custom connector returns ID, From, To, Subject, Body and Has Attachments for over 10 million emails. You analyze internal networks by recipient. You must prevent report recipients from reading the emails while minimizing model size. What should you do?",
    },
    options: [
      { fr: "Dans la vue Modèle, masquer (Hidden) les colonnes Subject et Body.", en: "In Model view, set the Subject and Body columns to Hidden." },
      { fr: "Supprimer les colonnes Subject et Body pendant l'import.", en: "Remove the Subject and Body columns during import." },
      { fr: "Implémenter la RLS pour que chacun ne voie que ses propres e-mails.", en: "Implement RLS so recipients see only their own emails." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Supprimer Subject et Body à l'import empêche totalement leur lecture ET réduit la taille du modèle. Masquer les colonnes ne fait que les cacher (elles restent accessibles et pèsent toujours).",
      en: "Removing Subject and Body at import fully prevents reading them AND reduces model size. Hiding columns only conceals them (they remain accessible and still take space).",
    },
  },
  {
    id: "pl300-20",
    question: {
      fr: "Un rapport Power BI (PBIX de 550 Mo) avec une page unique de 25 visuels est lent à charger. Parmi ces options, que recommandez-vous pour améliorer les performances ?",
      en: "A Power BI report (550 MB PBIX) with a single page of 25 visuals is slow to load. Among these options, what should you recommend to improve performance?",
    },
    options: [
      { fr: "Modifier les mesures DAX pour utiliser des fonctions itératives.", en: "Change DAX measures to use iterator functions." },
      { fr: "Activer les interactions entre visuels.", en: "Enable visual interactions." },
      { fr: "Remplacer les visuels par défaut par des visuels AppSource.", en: "Replace the default visuals with AppSource visuals." },
      { fr: "Répartir les visuels sur plusieurs pages.", en: "Split the visuals onto multiple pages." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Trop de visuels sur une même page génèrent de nombreuses requêtes simultanées. Les répartir sur plusieurs pages réduit la charge par page et accélère le chargement.",
      en: "Too many visuals on one page generate many simultaneous queries. Spreading them across pages reduces per-page load and speeds up rendering.",
    },
  },
  {
    id: "pl300-21",
    question: {
      fr: "Un modèle contient Orders, Date et City (relations un-à-plusieurs vers Orders). Deux rôles RLS : Role1 filtre City[State Province] = « Kentucky », Role2 filtre Date[Calendar Year] = 2020. Si un utilisateur appartient aux deux rôles, que verra-t-il ?",
      en: "A model has Orders, Date and City (one-to-many to Orders). Two RLS roles: Role1 filters City[State Province] = \"Kentucky\", Role2 filters Date[Calendar Year] = 2020. If a user belongs to both roles, what will they see?",
    },
    options: [
      { fr: "Les données où State Province = Kentucky OU Calendar Year = 2020.", en: "Data where State Province is Kentucky OR Calendar Year is 2020." },
      { fr: "Une erreur ; l'utilisateur ne pourra pas voir les données.", en: "An error; the user won't be able to see the data." },
      { fr: "Uniquement les données où State Province = Kentucky.", en: "Only data where State Province is Kentucky." },
      { fr: "Uniquement les données où State Province = Kentucky ET Calendar Year = 2020.", en: "Only data where State Province is Kentucky AND Calendar Year is 2020." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "L'appartenance à plusieurs rôles RLS est cumulative (union) : l'utilisateur voit les données correspondant à Role1 OU Role2, pas leur intersection.",
      en: "Membership in multiple RLS roles is additive (union): the user sees data matching Role1 OR Role2, not their intersection.",
    },
  },
  {
    id: "pl300-22",
    question: {
      fr: "Vous modélisez avec Power BI. Une grande table SQL Server « Order » dépasse 100 millions d'enregistrements ; pendant le développement, vous devez importer un échantillon. Solution : dans Power Query Editor, vous importez la table puis ajoutez une étape de filtre. Cela répond-il à l'objectif ?",
      en: "You model data with Power BI. A large SQL Server table \"Order\" exceeds 100 million records; during development you must import a sample. Solution: in Power Query Editor, you import the table then add a filter step. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Importer d'abord toute la table puis filtrer charge quand même les 100 millions de lignes en mémoire : l'objectif d'échantillonnage à l'import n'est pas atteint. Mieux vaut filtrer côté source (WHERE).",
      en: "Importing the whole table then filtering still pulls all 100 million rows into memory: the goal of sampling at import isn't met. Filtering at the source (WHERE) is better.",
    },
  },
  {
    id: "pl300-23",
    question: {
      fr: "Même contexte (table « Order » de 100+ millions de lignes, importer un échantillon). Solution : vous écrivez une expression DAX utilisant la fonction FILTER. Cela répond-il à l'objectif ?",
      en: "Same context (\"Order\" table of 100M+ rows, import a sample). Solution: you write a DAX expression using the FILTER function. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "DAX s'exécute après l'import : la table entière est déjà chargée. FILTER ne réduit donc pas le volume importé. L'échantillonnage doit se faire à la source ou dans Power Query.",
      en: "DAX runs after import: the whole table is already loaded. FILTER doesn't reduce the imported volume. Sampling must happen at the source or in Power Query.",
    },
  },
  {
    id: "pl300-24",
    question: {
      fr: "Même contexte (table « Order » de 100+ millions de lignes, importer un échantillon). Solution : vous ajoutez une clause WHERE à l'instruction SQL. Cela répond-il à l'objectif ?",
      en: "Same context (\"Order\" table of 100M+ rows, import a sample). Solution: you add a WHERE clause to the SQL statement. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une clause WHERE filtre à la source : seul l'échantillon est transféré et importé. C'est la bonne approche pour limiter le volume dès l'import.",
      en: "A WHERE clause filters at the source: only the sample is transferred and imported. This is the correct way to limit volume at import time.",
    },
  },
  {
    id: "pl300-25",
    question: {
      fr: "Dans Power BI Desktop, un rapport de ventes a deux tables avec RLS configurée. Vous devez créer une relation entre elles en garantissant que le filtrage croisé bidirectionnel respecte la RLS. Que faites-vous ?",
      en: "In Power BI Desktop, a sales report has two tables with RLS configured. You must create a relationship between them ensuring that bidirectional cross-filtering honors RLS. What should you do?",
    },
    options: [
      { fr: "Relation inactive + « Appliquer le filtre de sécurité dans les deux sens ».", en: "Inactive relationship + \"Apply security filter in both directions\"." },
      { fr: "Relation active + « Appliquer le filtre de sécurité dans les deux sens ».", en: "Active relationship + \"Apply security filter in both directions\"." },
      { fr: "Relation inactive + « Supposer l'intégrité référentielle ».", en: "Inactive relationship + \"Assume referential integrity\"." },
      { fr: "Relation active + « Supposer l'intégrité référentielle ».", en: "Active relationship + \"Assume referential integrity\"." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Il faut une relation active (utilisée par défaut) avec l'option « Appliquer le filtre de sécurité dans les deux sens » pour que la RLS soit respectée lors du filtrage bidirectionnel.",
      en: "You need an active relationship (used by default) with \"Apply security filter in both directions\" so that RLS is honored during bidirectional filtering.",
    },
  },
  {
    id: "pl300-26",
    question: {
      fr: "Même contexte (table « Order » de 100+ millions de lignes, importer un échantillon). Solution : vous ajoutez un filtre au niveau du rapport basé sur la date de commande. Cela répond-il à l'objectif ?",
      en: "Same context (\"Order\" table of 100M+ rows, import a sample). Solution: you add a report-level filter based on order date. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Un filtre au niveau du rapport n'agit qu'à l'affichage : toutes les lignes sont déjà importées dans le modèle. Cela ne réduit pas le volume importé.",
      en: "A report-level filter only affects display: all rows are already imported into the model. It doesn't reduce the imported volume.",
    },
  },
  {
    id: "pl300-27",
    question: {
      fr: "Un rapport importe une table de dates et une table de ventes ayant trois clés de dates : Due Date, Order Date, Delivery Date. Vous devez analyser les ventes selon chacune. Solution : pour chaque clé, vous ajoutez des relations inactives entre ventes et dates. Cela répond-il à l'objectif ?",
      en: "A report imports a date table and a sales table with three date keys: Due Date, Order Date, Delivery Date. You must analyze sales by each. Solution: for each key, you add inactive relationships between sales and date. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Ajouter des relations inactives ne suffit pas seul : sans mesures utilisant USERELATIONSHIP, ces relations restent inutilisées. L'analyse selon chaque clé n'est donc pas assurée par cette seule action.",
      en: "Adding inactive relationships alone isn't enough: without measures using USERELATIONSHIP, those relationships stay unused. Analysis by each key isn't achieved by this action alone.",
    },
  },
  {
    id: "pl300-28",
    question: {
      fr: "Même contexte (table de dates + table de ventes avec Due Date, Order Date, Delivery Date). Solution : dans Power Query, vous renommez la requête de dates en « Due Date » puis la référencez deux fois pour créer Order Date et Delivery Date. Cela répond-il à l'objectif ?",
      en: "Same context (date table + sales table with Due Date, Order Date, Delivery Date). Solution: in Power Query, you rename the date query to \"Due Date\" then reference it twice to create Order Date and Delivery Date. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Créer trois tables de dates distinctes (role-playing dimensions) via des requêtes référencées permet une relation active dédiée à chaque clé, autorisant l'analyse selon Due/Order/Delivery Date.",
      en: "Creating three separate date tables (role-playing dimensions) via referenced queries gives each key its own active relationship, enabling analysis by Due/Order/Delivery Date.",
    },
  },
  {
    id: "pl300-29",
    question: {
      fr: "Même contexte (trois clés de dates). Solution : dans le volet Champs, vous renommez la table de dates en « Due Date » et créez Order Date et Delivery Date comme tables calculées via DAX. Cela répond-il à l'objectif ?",
      en: "Same context (three date keys). Solution: in the Fields pane, you rename the date table to \"Due Date\" and create Order Date and Delivery Date as DAX calculated tables. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Des tables de dates calculées séparées permettent des relations actives distinctes pour chaque clé, ce qui répond à l'objectif d'analyse selon les trois dates.",
      en: "Separate calculated date tables allow distinct active relationships for each key, meeting the goal of analyzing by all three dates.",
    },
  },
  {
    id: "pl300-30",
    question: {
      fr: "Vous créez un modèle avec une table Store. Vous prévoyez un visuel carte avec drill-down Country → State/Province → City. Que faire pour que les emplacements soient correctement cartographiés ?",
      en: "You build a model with a Store table. You plan a map visual with drill-down Country → State/Province → City. What should you do to ensure locations map correctly?",
    },
    options: [
      { fr: "Changer le type de données de City, State/Province et Country.", en: "Change the data type of City, State/Province and Country." },
      { fr: "Régler Summarization sur « Ne pas résumer » pour ces champs.", en: "Set Summarization to \"Don't summarize\" for those fields." },
      { fr: "Définir la catégorie de données (Data Category) de City, State/Province et Country.", en: "Set the Data Category of City, State/Province and Country." },
      { fr: "Créer une colonne calculée concaténant les trois valeurs.", en: "Create a calculated column concatenating the three values." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Définir la catégorie de données géographiques (City, State/Province, Country) indique à Bing Maps comment géocoder chaque niveau, garantissant un placement correct sur la carte.",
      en: "Setting the geographic Data Category (City, State/Province, Country) tells Bing Maps how to geocode each level, ensuring correct placement on the map.",
    },
  },
  {
    id: "pl300-31",
    question: {
      fr: "Même contexte (table de dates + table de ventes avec Due Date, Order Date, Delivery Date, une seule relation active). Solution : vous créez des mesures utilisant USERELATIONSHIP pour filtrer les ventes sur la relation active entre ventes et dates. Cela répond-il à l'objectif ?",
      en: "Same context (date + sales tables with Due Date, Order Date, Delivery Date, one active relationship). Solution: you create measures using USERELATIONSHIP to filter sales on the active relationship. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "USERELATIONSHIP sert à activer une relation inactive dans le contexte d'une mesure. L'appliquer à la relation déjà active n'apporte rien : on ne peut pas analyser selon les autres clés de dates.",
      en: "USERELATIONSHIP is used to activate an inactive relationship within a measure. Applying it to the already-active relationship does nothing, so you still can't analyze by the other date keys.",
    },
  },
  {
    id: "pl300-32",
    question: {
      fr: "En chargeant des données depuis SQL Server, Power BI Desktop renvoie une erreur pendant le chargement. Quelles sont deux façons de résoudre le problème ? (chaque bonne réponse est une solution complète)",
      en: "While loading data from SQL Server, Power BI Desktop returns an error during loading. What are two ways to resolve it? (each correct answer is a complete solution)",
    },
    options: [
      { fr: "Réduire le nombre de lignes et de colonnes renvoyées par chaque requête.", en: "Reduce the number of rows and columns returned by each query." },
      { fr: "Découper les requêtes longues en sous-ensembles de colonnes puis les fusionner avec Power Query.", en: "Split long-running queries into column subsets and merge them with Power Query." },
      { fr: "Combiner les requêtes longues en une seule avec Power Query.", en: "Combine long-running queries into one with Power Query." },
      { fr: "Désactiver le query folding sur les requêtes longues.", en: "Disable query folding on long-running queries." },
    ],
    correctIndexes: [0, 1],
    explanation: {
      fr: "Réduire le volume par requête et découper les requêtes trop lourdes en sous-ensembles (puis fusion) allègent chaque appel et évitent les dépassements. Désactiver le query folding aggraverait la charge.",
      en: "Reducing per-query volume and splitting heavy queries into subsets (then merging) lighten each call and avoid timeouts. Disabling query folding would worsen the load.",
    },
  },
  {
    id: "pl300-33",
    question: {
      fr: "Un rapport Power BI (PBIX de 550 Mo) est lent à charger. Parmi ces options, laquelle recommandez-vous pour améliorer les performances ?",
      en: "A Power BI report (550 MB PBIX) is slow to load. Among these options, which do you recommend to improve performance?",
    },
    options: [
      { fr: "Modifier les mesures DAX pour utiliser des fonctions itératives.", en: "Change DAX measures to use iterator functions." },
      { fr: "Supprimer les colonnes inutilisées des tables du modèle.", en: "Remove unused columns from tables in the data model." },
      { fr: "Remplacer les visuels par défaut par des visuels AppSource.", en: "Replace default visuals with AppSource visuals." },
      { fr: "Augmenter le nombre d'actualisations du dataset.", en: "Increase the number of dataset refreshes." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Supprimer les colonnes inutiles reste la mesure la plus efficace pour réduire la taille du modèle et accélérer le rendu.",
      en: "Removing unused columns remains the most effective way to shrink the model and speed up rendering.",
    },
  },
  {
    id: "pl300-34",
    question: {
      fr: "Une table Sales contient Order Line ID, Product ID, Unit Price, Order ID, Quantity. Une commande (Order ID) peut avoir plusieurs lignes. Vous devez écrire une mesure DAX qui compte le nombre de commandes. Quelle formule utiliser ?",
      en: "A Sales table has Order Line ID, Product ID, Unit Price, Order ID, Quantity. An order (Order ID) can have multiple lines. You must write a DAX measure counting the number of orders. Which formula?",
    },
    options: [
      { fr: "COUNT('Sales'[Order ID])", en: "COUNT('Sales'[Order ID])" },
      { fr: "COUNTA('Sales'[Order ID])", en: "COUNTA('Sales'[Order ID])" },
      { fr: "COUNTROWS('Sales')", en: "COUNTROWS('Sales')" },
      { fr: "DISTINCTCOUNT('Sales'[Order ID])", en: "DISTINCTCOUNT('Sales'[Order ID])" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Comme une commande a plusieurs lignes, Order ID se répète. DISTINCTCOUNT compte les valeurs distinctes, donnant le nombre réel de commandes. COUNT/COUNTROWS compteraient les lignes.",
      en: "Since an order has multiple lines, Order ID repeats. DISTINCTCOUNT counts distinct values, giving the true number of orders. COUNT/COUNTROWS would count line rows.",
    },
  },
  {
    id: "pl300-36",
    question: {
      fr: "Un rapport contient un graphique à barres (nombre de clients par segment) et un histogramme (ventes par mois). Vous voulez que, en sélectionnant un segment dans les barres, l'histogramme mette en évidence la part des ventes du mois appartenant à ce segment. Comment régler l'interaction de l'histogramme ?",
      en: "A report has a bar chart (customer count by segment) and a column chart (sales by month). When a segment is selected in the bar chart, the column chart should show which portion of each month's sales belongs to that segment. How should the column chart interaction be set?",
    },
    options: [
      { fr: "Mettre en évidence (highlight)", en: "Highlight" },
      { fr: "Filtrer (filter)", en: "Filter" },
      { fr: "Aucun impact (no impact)", en: "No impact" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "« Mettre en évidence » conserve le total du mois tout en surlignant la portion correspondant au segment. « Filtrer » masquerait le reste, empêchant de voir la part sur le total.",
      en: "\"Highlight\" keeps each month's total while emphasizing the selected segment's portion. \"Filter\" would hide the rest, preventing you from seeing the share of the total.",
    },
  },
  {
    id: "pl300-37",
    question: {
      fr: "Un rapport ReportA utilise un thème personnalisé. Vous créez un tableau de bord DashboardA qui doit utiliser ce même thème, en minimisant l'effort. Quelles deux actions effectuer ? (chaque bonne réponse fait partie de la solution)",
      en: "ReportA uses a custom theme. You create DashboardA that must use that same theme with minimal effort. Which two actions? (each correct answer is part of the solution)",
    },
    options: [
      { fr: "Publier ReportA sur Power BI.", en: "Publish ReportA to Power BI." },
      { fr: "Depuis ReportA, enregistrer le thème actuel (fichier JSON).", en: "From ReportA, save the current theme (JSON file)." },
      { fr: "Publier ReportA dans la galerie de thèmes de la communauté.", en: "Publish ReportA to the community theme gallery." },
      { fr: "Depuis DashboardA, créer un thème personnalisé.", en: "From DashboardA, create a custom theme." },
      { fr: "Depuis DashboardA, importer un thème JSON.", en: "From DashboardA, upload a JSON theme." },
    ],
    correctIndexes: [1, 4],
    explanation: {
      fr: "On exporte le thème de ReportA en JSON, puis on l'importe sur DashboardA. C'est le moyen le plus direct de réutiliser exactement le même thème.",
      en: "Export ReportA's theme as JSON, then upload it to DashboardA. That's the most direct way to reuse the exact same theme.",
    },
  },
  {
    id: "pl300-38",
    question: {
      fr: "Vous devez créer une visualisation qui compare le chiffre d'affaires et les coûts dans le temps. Quel type de visualisation utiliser ?",
      en: "You must create a visualization comparing revenue and cost over time. Which visualization type?",
    },
    options: [
      { fr: "Graphique en cascade (waterfall)", en: "Waterfall chart" },
      { fr: "Graphique en aires empilées", en: "Stacked area chart" },
      { fr: "Graphique en courbes (line)", en: "Line chart" },
      { fr: "Graphique en anneau (donut)", en: "Donut chart" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le graphique en courbes est idéal pour comparer plusieurs mesures (CA et coûts) sur un axe temporel et visualiser leurs tendances.",
      en: "A line chart is ideal for comparing multiple measures (revenue and cost) over a time axis and seeing their trends.",
    },
  },
  {
    id: "pl300-39",
    question: {
      fr: "Vous construisez un rapport pour l'équipe commerciale afin d'identifier, dans une seule visualisation, les facteurs qui influencent le succès des ventes. Quel type de visualisation utiliser ?",
      en: "You build a report for the sales team to identify, in a single visual, the factors that drive sales success. Which visualization type?",
    },
    options: [
      { fr: "Facteurs d'influence clés (Key influencers)", en: "Key influencers" },
      { fr: "Histogramme groupé avec courbe", en: "Line and clustered column chart" },
      { fr: "Q&A", en: "Q&A" },
      { fr: "Graphique en entonnoir (funnel)", en: "Funnel chart" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le visuel « Facteurs d'influence clés » analyse automatiquement quelles variables influencent le plus un résultat, dans une seule visualisation.",
      en: "The Key influencers visual automatically analyzes which variables most affect an outcome, all in a single visualization.",
    },
  },
  {
    id: "pl300-40",
    question: {
      fr: "Un rapport de quatre pages contient les mêmes quatre segments (slicers) sur chaque page. Les sélections faites sur une page ne se propagent pas aux autres. Quelles deux solutions permettent de filtrer toutes les pages avec une seule sélection ? (chaque réponse est une solution complète)",
      en: "A four-page report has the same four slicers on each page. Selections on one page don't carry to the others. Which two solutions let one selection filter all pages? (each is a complete solution)",
    },
    options: [
      { fr: "Créer un signet pour chaque valeur de segment.", en: "Create a bookmark for each slicer value." },
      { fr: "Remplacer les segments par des filtres au niveau du rapport.", en: "Replace the slicers with report-level filters." },
      { fr: "Synchroniser les segments entre les pages.", en: "Sync the slicers across pages." },
      { fr: "Remplacer les segments par des filtres au niveau de la page.", en: "Replace the slicers with page-level filters." },
      { fr: "Remplacer les segments par des filtres au niveau du visuel.", en: "Replace the slicers with visual-level filters." },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "Les filtres au niveau du rapport s'appliquent à toutes les pages ; la synchronisation des segments propage une sélection à toutes les pages. Les deux atteignent l'objectif.",
      en: "Report-level filters apply to all pages; syncing slicers propagates one selection to every page. Both meet the goal.",
    },
  },
  {
    id: "pl300-41",
    question: {
      fr: "Un visuel de type carte doit recevoir une mise en forme conditionnelle : rouge foncé si la valeur ≥ 100, gris foncé si < 100, en minimisant l'effort. Quel type de format utiliser ?",
      en: "A card visual needs conditional formatting: dark red if value ≥ 100, dark gray if < 100, minimizing effort. Which format type?",
    },
    options: [
      { fr: "Échelle de couleurs (Color scale)", en: "Color scale" },
      { fr: "Règles (Rules)", en: "Rules" },
      { fr: "Valeur de champ (Field value)", en: "Field value" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Les « Règles » permettent de définir des seuils (≥ 100 → rouge foncé, < 100 → gris foncé) sans écrire de mesure ni de colonne supplémentaire.",
      en: "\"Rules\" let you define thresholds (≥ 100 → dark red, < 100 → dark gray) without writing an extra measure or column.",
    },
  },
  {
    id: "pl300-42",
    question: {
      fr: "Vous créez un tableau de bord dans le service Power BI à partir d'une page de rapport contenant trois graphiques. Vous devez ajouter les graphiques au tableau de bord en conservant l'interactivité entre eux. Que faites-vous ?",
      en: "You create a dashboard in the Power BI service from a report page with three charts. You must add the charts to the dashboard while keeping interactivity between them. What should you do?",
    },
    options: [
      { fr: "Régler toutes les interactions du rapport sur Filtrer.", en: "Set all report interactions to Filter." },
      { fr: "Épingler chaque graphique comme une tuile.", en: "Pin each chart as a tile." },
      { fr: "Modifier le thème et épingler chaque graphique comme tuile.", en: "Edit the theme and pin each chart as a tile." },
      { fr: "Épingler la page de rapport comme tuile dynamique (live).", en: "Pin the report page as a live tile." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Épingler la page entière comme tuile dynamique conserve l'interactivité entre les visuels. Épingler chaque graphique séparément les rend statiques et indépendants.",
      en: "Pinning the whole page as a live tile preserves interactivity between visuals. Pinning each chart separately makes them static and independent.",
    },
  },
  {
    id: "pl300-43",
    question: {
      fr: "Un rapport contient un anneau et un histogramme groupé avec les interactions par défaut. Vous voulez que, en sélectionnant une colonne de l'histogramme, l'anneau se redessine avec les données de la colonne sélectionnée. Que faites-vous ?",
      en: "A report has a donut and a clustered column chart with default interactions. You want selecting a column in the column chart to redraw the donut using the selected column's data. What should you do?",
    },
    options: [
      { fr: "Sélectionner l'anneau et régler l'interaction de l'histogramme sur Filtrer.", en: "Select the donut and set the column chart interaction to Filter." },
      { fr: "Sélectionner l'histogramme et régler l'interaction de l'anneau sur Filtrer.", en: "Select the column chart and set the donut interaction to Filter." },
      { fr: "Sélectionner l'anneau et régler l'interaction de l'histogramme sur Aucune.", en: "Select the donut and set the column chart interaction to None." },
      { fr: "Sélectionner l'histogramme et régler l'interaction de l'anneau sur Aucune.", en: "Select the column chart and set the donut interaction to None." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "On sélectionne le visuel source (l'histogramme) puis on règle l'interaction du visuel cible (l'anneau) sur Filtrer, pour que l'anneau se redessine selon la colonne choisie.",
      en: "Select the source visual (column chart), then set the target visual's (donut) interaction to Filter, so the donut redraws based on the chosen column.",
    },
  },
  {
    id: "pl300-44",
    question: {
      fr: "Dans Power BI Desktop, vous voulez un visuel qui affiche automatiquement des tendances et informations utiles, et se met à jour selon les sélections dans les autres visuels. Quel visuel utiliser ?",
      en: "In Power BI Desktop, you want a visual that automatically shows trends and useful insights and updates based on selections in other visuals. Which visual?",
    },
    options: [
      { fr: "Q&A", en: "Q&A" },
      { fr: "Récit intelligent (smart narrative)", en: "Smart narrative" },
      { fr: "Facteurs d'influence clés", en: "Key influencers" },
      { fr: "Arbre de décomposition", en: "Decomposition tree" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le « récit intelligent » génère automatiquement un texte décrivant tendances et points clés, et se met à jour dynamiquement selon les filtres et sélections.",
      en: "The smart narrative automatically generates text describing trends and key points, updating dynamically with filters and selections.",
    },
  },
  {
    id: "pl300-45",
    question: {
      fr: "Un histogramme à barres a Salary en valeur et Employee en axe. Vous devez créer une ligne de référence indiquant les employés au-dessus du salaire médian. Solution : vous créez une ligne constante à la valeur 0,5. Cela répond-il à l'objectif ?",
      en: "A bar chart has Salary as value and Employee as axis. You must add a reference line showing employees above the median salary. Solution: you create a constant line set to 0.5. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Une ligne constante à 0,5 ne représente pas la médiane des salaires (des montants en dollars). Il faut une ligne de percentile réglée à 50 %.",
      en: "A constant line at 0.5 doesn't represent the median of salaries (dollar amounts). You need a percentile line set to 50%.",
    },
  },
  {
    id: "pl300-46",
    question: {
      fr: "Même contexte (barres Salary/Employee, ligne de référence pour le salaire médian). Solution : vous créez une ligne de moyenne à partir de la mesure Salary. Cela répond-il à l'objectif ?",
      en: "Same context (Salary/Employee bar chart, reference line for median salary). Solution: you create an average line using the Salary measure. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "La médiane n'est pas la moyenne : une ligne de moyenne ne montre pas correctement les employés au-dessus du salaire médian. Il faut une ligne de percentile à 50 %.",
      en: "The median is not the average: an average line won't correctly show employees above the median. You need a 50% percentile line.",
    },
  },
  {
    id: "pl300-47",
    question: {
      fr: "Même contexte (barres Salary/Employee, ligne de référence pour le salaire médian). Solution : vous créez une ligne de percentile à partir de la mesure Salary et réglez le percentile à 50 %. Cela répond-il à l'objectif ?",
      en: "Same context (Salary/Employee bar chart, reference line for median salary). Solution: you create a percentile line using the Salary measure and set the percentile to 50%. Does this meet the goal?",
    },
    options: [
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le percentile à 50 % correspond exactement à la médiane. Cette ligne de référence identifie donc bien les employés au-dessus du salaire médian.",
      en: "The 50th percentile is exactly the median. This reference line correctly identifies employees above the median salary.",
    },
  },
  {
    id: "pl300-48",
    question: {
      fr: "Un rapport sur powerbi.com montre les dépenses par département avec un graphique en courbes (dépenses par mois). Vous voulez permettre aux utilisateurs de basculer entre courbe et histogramme, en minimisant l'effort de développement et de maintenance. Que faites-vous ?",
      en: "A report on powerbi.com shows expenses by department with a line chart (expenses by month). You want users to switch between line and column chart with minimal development/maintenance effort. What should you do?",
    },
    options: [
      { fr: "Activer la personnalisation des visuels par les lecteurs.", en: "Enable report readers to personalize visuals." },
      { fr: "Créer une page séparée avec l'histogramme.", en: "Create a separate page with the column chart." },
      { fr: "Ajouter un histogramme, un signet et un bouton de choix.", en: "Add a column chart, a bookmark and a choice button." },
      { fr: "Créer un rapport mobile contenant un histogramme.", en: "Create a mobile report with a column chart." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Activer « personnaliser les visuels » laisse chaque lecteur changer le type de visualisation à la volée, sans dupliquer de pages ni gérer des signets.",
      en: "Enabling \"personalize visuals\" lets each reader change the visualization type on the fly, without duplicating pages or maintaining bookmarks.",
    },
  },
  {
    id: "pl300-49",
    question: {
      fr: "Deux rapports (ReportA, ReportB) ont chacun une palette distincte. Vous créez un tableau de bord incluant deux visuels de chaque rapport, avec un thème sombre cohérent. Quelles deux actions effectuer ? (chaque réponse fait partie de la solution)",
      en: "Two reports (ReportA, ReportB) each have a distinct palette. You build a dashboard with two visuals from each, using a consistent dark theme. Which two actions? (each is part of the solution)",
    },
    options: [
      { fr: "Importer une capture (snapshot).", en: "Upload a snapshot." },
      { fr: "Régler le navigateur en mode sombre.", en: "Set the browser to dark mode." },
      { fr: "En épinglant les visuels, choisir « Utiliser le thème de destination ».", en: "When pinning visuals, select \"Use destination theme\"." },
      { fr: "Sélectionner le thème de tableau de bord sombre.", en: "Select the dark dashboard theme." },
      { fr: "Activer le tile flow.", en: "Turn on tile flow." },
    ],
    correctIndexes: [2, 3],
    explanation: {
      fr: "Pour un rendu cohérent, on applique le thème sombre du tableau de bord et on choisit « Utiliser le thème de destination » lors de l'épinglage, afin que tous les visuels adoptent le même thème sombre.",
      en: "For a consistent look, apply the dark dashboard theme and select \"Use destination theme\" when pinning, so every visual adopts the same dark theme.",
    },
  },
  {
    id: "pl300-50",
    question: {
      fr: "Une courbe montre le nombre d'employés d'un département dans le temps. Vous voulez voir le coût salarial total en survolant un point de données. Que faites-vous ?",
      en: "A line chart shows a department's employee count over time. You want to see total salary cost when hovering a data point. What should you do?",
    },
    options: [
      { fr: "Ajouter Salary aux champs de drillthrough.", en: "Add Salary to the drillthrough fields." },
      { fr: "Ajouter Salary aux filtres du visuel.", en: "Add Salary to the visual filters." },
      { fr: "Ajouter Salary aux info-bulles (tooltips).", en: "Add Salary to the tooltips." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Ajouter Salary aux info-bulles affiche le coût salarial au survol d'un point, sans modifier l'axe ni filtrer le visuel.",
      en: "Adding Salary to the tooltips shows the salary cost when hovering a point, without changing the axis or filtering the visual.",
    },
  },
  {
    id: "pl300-51",
    question: {
      fr: "Une entreprise a des employés dans 10 états, regroupés en trois régions (East, West, North). Le modèle contient les employés par état mais pas l'information de région. Vous devez voir les employés par région le plus rapidement possible. Que faites-vous ?",
      en: "A company has employees in 10 states, grouped into three regions (East, West, North). The model has employees by state but no region info. You must view employees by region as quickly as possible. What should you do?",
    },
    options: [
      { fr: "Créer une agrégation résumant par état.", en: "Create an aggregation summarizing by state." },
      { fr: "Créer une agrégation résumant par employé.", en: "Create an aggregation summarizing by employee." },
      { fr: "Créer un groupe sur la colonne état avec le type de groupe Liste.", en: "Create a group on the state column with Group type List." },
      { fr: "Créer un groupe sur la colonne état avec le type de groupe Bin.", en: "Create a group on the state column with Group type Bin." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Un groupe de type Liste permet d'assigner manuellement chaque état à une région, créant rapidement le regroupement sans modifier la source ni écrire de DAX.",
      en: "A List-type group lets you manually assign each state to a region, quickly creating the grouping without touching the source or writing DAX.",
    },
  },
  {
    id: "pl300-52",
    question: {
      fr: "Vous devez créer, pour le service RH, une visualisation montrant l'historique des effectifs et prédisant la tendance sur les six prochains mois. Quel type de visualisation utiliser ?",
      en: "For HR, you must create a visualization showing historical headcount and forecasting the trend for the next six months. Which visualization type?",
    },
    options: [
      { fr: "Graphique en ruban (ribbon)", en: "Ribbon chart" },
      { fr: "Nuage de points (scatter)", en: "Scatter chart" },
      { fr: "Graphique en courbes (line)", en: "Line chart" },
      { fr: "Facteurs d'influence clés", en: "Key influencers" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le graphique en courbes prend en charge la fonctionnalité de prévision (forecast) analytique, idéale pour projeter la tendance des effectifs sur six mois.",
      en: "The line chart supports the analytics forecast feature, ideal for projecting the headcount trend over six months.",
    },
  },
  {
    id: "pl300-53",
    question: {
      fr: "Vous avez une table de ventes d'environ 1 000 lignes et devez identifier les valeurs aberrantes (outliers). Quel type de visualisation utiliser ?",
      en: "You have a sales table of about 1,000 rows and must identify outliers. Which visualization type?",
    },
    options: [
      { fr: "Graphique en aires", en: "Area chart" },
      { fr: "Nuage de points (scatter plot)", en: "Scatter plot" },
      { fr: "Camembert (pie)", en: "Pie chart" },
      { fr: "Anneau (donut)", en: "Donut chart" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le nuage de points révèle visuellement les valeurs aberrantes, les points éloignés du groupe principal étant faciles à repérer.",
      en: "A scatter plot visually reveals outliers, as points far from the main cluster are easy to spot.",
    },
  },
  {
    id: "pl300-54",
    question: {
      fr: "Un rapport de trois pages a une page contenant un visuel KPI. Vous devez filtrer tous les visuels du rapport sauf le KPI. Quelles deux actions effectuer ? (chaque réponse fait partie de la solution)",
      en: "A three-page report has one page with a KPI visual. You must filter all visuals except the KPI. Which two actions? (each is part of the solution)",
    },
    options: [
      { fr: "Modifier les interactions du visuel KPI.", en: "Edit the interactions of the KPI visual." },
      { fr: "Ajouter le même segment sur chaque page et activer la synchronisation.", en: "Add the same slicer to each page and enable Sync slicers." },
      { fr: "Modifier les interactions du segment situé sur la page du KPI.", en: "Edit the interactions of the slicer on the KPI's page." },
      { fr: "Configurer un filtre au niveau de la page.", en: "Configure a page-level filter." },
      { fr: "Configurer un filtre au niveau du rapport.", en: "Configure a report-level filter." },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "On ajoute un segment synchronisé sur toutes les pages, puis on modifie ses interactions sur la page du KPI pour qu'il n'affecte pas ce visuel : tous les autres visuels sont filtrés, sauf le KPI.",
      en: "Add a synced slicer across pages, then edit its interactions on the KPI page so it doesn't affect that visual: all other visuals are filtered except the KPI.",
    },
  },
  {
    id: "pl300-55",
    question: {
      fr: "Vous analysez les comportements d'achat depuis une table Transactions avec un champ numérique Spend. Vous devez inclure un visuel identifiant quels champs influencent le plus Spend. Quel visuel utiliser ?",
      en: "You analyze purchasing patterns from a Transactions table with a numeric Spend field. You must include a visual identifying which fields most affect Spend. Which visual?",
    },
    options: [
      { fr: "Q&A", en: "Q&A" },
      { fr: "Récit intelligent (smart narrative)", en: "Smart narrative" },
      { fr: "Arbre de décomposition", en: "Decomposition tree" },
      { fr: "Facteurs d'influence clés (Key influencers)", en: "Key influencers" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le visuel « Facteurs d'influence clés » identifie automatiquement les champs qui influencent le plus une métrique cible comme Spend.",
      en: "The Key influencers visual automatically identifies which fields most affect a target metric such as Spend.",
    },
  },
  {
    id: "pl300-56",
    question: {
      fr: "Un visuel montre les ventes brutes par date avec la détection d'anomalies activée, mais aucune anomalie n'est détectée. Vous voulez augmenter les chances d'en détecter. Que faites-vous ?",
      en: "A visual shows gross sales by date with anomaly detection enabled, but no anomalies are found. You want to increase the chance of detecting some. What should you do?",
    },
    options: [
      { fr: "Augmenter la transparence de la plage attendue.", en: "Increase the Expected range transparency." },
      { fr: "Ajouter un champ à la zone Légende.", en: "Add a field to the Legend well." },
      { fr: "Augmenter le paramètre de Sensibilité.", en: "Increase the Sensitivity setting." },
      { fr: "Ajouter un champ aux valeurs secondaires.", en: "Add a field to the Secondary values well." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Augmenter la sensibilité resserre la plage attendue, ce qui fait ressortir davantage de points comme anomalies.",
      en: "Increasing sensitivity narrows the expected range, so more points are flagged as anomalies.",
    },
  },
  {
    id: "pl300-57",
    question: {
      fr: "Un rapport utilise une table de 10 millions de lignes dans, entre autres, un nuage de points (montant de transaction vs profit, couleur par territoire). Vous devez faciliter l'identification de motifs dans le nuage de points, sans affecter la précision des autres visuels. Que faites-vous ?",
      en: "A report uses a 10-million-row table in, among others, a scatter plot (transaction amount vs profit, colored by territory). You must make patterns easier to spot in the scatter plot without affecting the other visuals' accuracy. What should you do?",
    },
    options: [
      { fr: "Ajouter un décompte du montant à la taille des points.", en: "Add a count of the amount to the point size." },
      { fr: "Ajouter une courbe de tendance au nuage de points.", en: "Add a trend line to the scatter plot." },
      { fr: "Activer l'échantillonnage haute densité sur le nuage de points.", en: "Enable high-density sampling on the scatter plot." },
      { fr: "Appliquer un filtre de lignes à la requête dans Power Query.", en: "Apply a row filter to the query in Power Query." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "L'échantillonnage haute densité affiche mieux les motifs d'un nuage de points volumineux, uniquement pour ce visuel, sans altérer les données des autres.",
      en: "High-density sampling better reveals patterns in a large scatter plot, only for that visual, without altering the data used by the others.",
    },
  },
  {
    id: "pl300-58",
    question: {
      fr: "Un rapport a trois pages (Page1, Page2, Page3) avec les mêmes segments. Vous devez faire en sorte que les filtres appliqués sur Page1 s'appliquent uniquement à Page1 et Page3. Que faites-vous ?",
      en: "A report has three pages (Page1, Page2, Page3) with the same slicers. You must make filters applied on Page1 apply only to Page1 and Page3. What should you do?",
    },
    options: [
      { fr: "Modifier les interactions du segment sur chaque page.", en: "Modify the slicer interactions on each page." },
      { fr: "Rendre les segments visibles sur Page1 et Page3, masqués sur Page2.", en: "Show slicers on Page1 and Page3, hide on Page2." },
      { fr: "Synchroniser les segments sur Page1 et Page3 uniquement.", en: "Sync the slicers on Page1 and Page3 only." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "La synchronisation des segments limitée à Page1 et Page3 fait que les sélections se propagent uniquement entre ces deux pages, pas sur Page2.",
      en: "Syncing the slicers only across Page1 and Page3 makes selections propagate solely between those two pages, not Page2.",
    },
  },
  {
    id: "pl300-59",
    question: {
      fr: "Un rapport a cinq pages ; les pages 1 à 4 sont visibles, la page 5 est masquée. Vous voulez permettre une navigation rapide depuis la page 1 vers toutes les autres pages visibles, en minimisant l'effort au fur et à mesure que des pages sont ajoutées. Que faites-vous en premier ?",
      en: "A report has five pages; pages 1–4 are visible, page 5 is hidden. You want quick navigation from page 1 to all other visible pages, minimizing effort as pages are added. What should you do first?",
    },
    options: [
      { fr: "Ajouter un bouton vierge à la page 1.", en: "Add a blank button to page 1." },
      { fr: "Ajouter un bouton de navigation par page à la page 1.", en: "Add a page navigation button to page 1." },
      { fr: "Créer un signet pour chaque page.", en: "Create a bookmark for each page." },
      { fr: "Ajouter un bouton de navigation par signets à la page 1.", en: "Add a bookmark navigation button to page 1." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le bouton de navigation par page génère automatiquement des liens vers toutes les pages visibles et se met à jour quand des pages sont ajoutées : effort minimal, pas de signets à maintenir.",
      en: "The page navigation button automatically generates links to all visible pages and updates as pages are added: minimal effort, no bookmarks to maintain.",
    },
  },
  {
    id: "pl300-60",
    question: {
      fr: "Un rapport affiche des données de température IoT d'un réfrigérateur, publié dans le service Power BI. Vous devez être notifié quand la température dépasse 4 °C. Que faites-vous ?",
      en: "A report shows IoT temperature data from a refrigerator, published to the Power BI service. You must be notified when the temperature exceeds 4°C. What should you do?",
    },
    options: [
      { fr: "Définir une alerte sur un visuel KPI dans le rapport.", en: "Set an alert on a KPI visual in the report." },
      { fr: "Épingler une carte au tableau de bord et créer un abonnement.", en: "Pin a card to a dashboard and create a subscription." },
      { fr: "Épingler une carte au tableau de bord et définir une alerte sur la tuile.", en: "Pin a card to a dashboard and set an alert on the tile." },
      { fr: "Épingler une page de rapport au tableau de bord et définir une alerte sur la page.", en: "Pin a report page to a dashboard and set an alert on the page." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Les alertes de données ne fonctionnent que sur les tuiles de tableau de bord (carte, KPI, jauge). On épingle donc une carte et on définit une alerte sur la tuile pour être notifié au-delà de 4 °C.",
      en: "Data alerts only work on dashboard tiles (card, KPI, gauge). So pin a card and set an alert on the tile to be notified above 4°C.",
    },
  },
];
