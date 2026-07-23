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
  {
    id: "pl300-61",
    question: {
      fr: "Un fichier CSV de réclamations contient une colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser les réclamations par date et utiliser une hiérarchie de date intégrée. Que faites-vous ?",
      en: "A CSV file of complaints contains a Logged column in the format \"2018-12-31 at 08:59\". You must analyze complaints by date and use a built-in date hierarchy. What should you do?",
    },
    options: [
      { fr: "Extraire les 11 premiers caractères de la colonne Logged.", en: "Extract the first 11 characters of the Logged column." },
      { fr: "Ajouter une colonne conditionnelle qui renvoie 2018 si Logged commence par 2018, en type Nombre entier.", en: "Add a conditional column that outputs 2018 if Logged starts with 2018, typed as Whole Number." },
      { fr: "Créer une colonne à partir des exemples commençant par 2018-12-31 et définir son type sur Date.", en: "Create a column by example that starts with 2018-12-31 and set its data type to Date." },
      { fr: "Extraire les 11 derniers caractères de Logged et définir le type sur Date.", en: "Extract the last 11 characters of Logged and set the data type to Date." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "La « colonne par exemple » extrait la partie date (2018-12-31) de façon fiable ; en la typant Date, Power BI génère automatiquement la hiérarchie de date intégrée.",
      en: "A column by example reliably extracts the date part (2018-12-31); typing it as Date lets Power BI generate the built-in date hierarchy automatically.",
    },
  },
  {
    id: "pl300-62",
    question: {
      fr: "Même fichier CSV avec la colonne Logged au format « 2018-12-31 at 08:59 ». Vous devez analyser par date avec une hiérarchie de date intégrée. Que faites-vous ?",
      en: "Same CSV file with the Logged column in the format \"2018-12-31 at 08:59\". You must analyze by date with a built-in date hierarchy. What should you do?",
    },
    options: [
      { fr: "Changer le type de la colonne Logged en Date.", en: "Change the data type of the Logged column to Date." },
      { fr: "Fractionner la colonne Logged en utilisant « at » comme délimiteur.", en: "Split the Logged column using \"at\" as the delimiter." },
      { fr: "Ajouter une colonne conditionnelle renvoyant 2018 si Logged commence par 2018, en Nombre entier.", en: "Add a conditional column returning 2018 if Logged starts with 2018, as Whole Number." },
      { fr: "Appliquer la fonction Analyser des transformations de date à la colonne Logged.", en: "Apply the Parse function from the Date transformations to the Logged column." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le format contient « at » entre la date et l'heure. Fractionner sur ce délimiteur isole une colonne date propre, convertible en Date pour obtenir la hiérarchie.",
      en: "The format contains \"at\" between date and time. Splitting on that delimiter isolates a clean date column that can be typed as Date to get the hierarchy.",
    },
  },
  {
    id: "pl300-63",
    question: {
      fr: "Vous construisez un rapport à partir d'une base Azure SQL erp1 avec plusieurs tables. Vous devez analyser les commandes dans le temps (valeur totale) et par attributs des produits, tout en minimisant le temps de mise à jour des visuels. Que faites-vous en premier ?",
      en: "You build a report from an Azure SQL database erp1 with several tables. You must analyze orders over time (total value) and by product attributes while minimizing visual update times. What should you do first?",
    },
    options: [
      { fr: "Dans Power Query, fusionner la requête Order Line Items avec la requête Products.", en: "In Power Query, merge the Order Line Items query with the Products query." },
      { fr: "Créer une colonne calculée qui ajoute les catégories de produits à Orders via DAX.", en: "Create a calculated column adding product categories to Orders using DAX." },
      { fr: "Calculer le nombre de commandes par produit via une fonction DAX.", en: "Calculate the count of orders per product using a DAX function." },
      { fr: "Dans Power Query, fusionner la requête Orders avec la requête Order Line Items.", en: "In Power Query, merge the Orders query with the Order Line Items query." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "La fusion dans Power Query (côté source) matérialise les jointures en amont, ce qui allège le modèle et accélère le rendu par rapport à des colonnes calculées DAX. On relie d'abord Orders aux lignes de commande.",
      en: "Merging in Power Query (at the source) materializes joins upstream, keeping the model lean and rendering faster than DAX calculated columns. Orders is joined to its line items first.",
    },
  },
  {
    id: "pl300-64",
    question: {
      fr: "Un site SharePoint Online contient une bibliothèque de rapports de fabrication enregistrés en fichiers Excel, tous de même structure. Vous devez charger uniquement ces rapports dans une table via Power BI Desktop. Que faites-vous ?",
      en: "A SharePoint Online site has a document library of manufacturing reports saved as Excel files, all with the same structure. You must load only those reports into a table using Power BI Desktop. What should you do?",
    },
    options: [
      { fr: "Obtenir les données depuis un dossier SharePoint, saisir l'URL du site, sélectionner Transformer puis filtrer par le chemin du dossier des rapports.", en: "Get data from a SharePoint folder, enter the site URL, select Transform, then filter by the folder path of the reports." },
      { fr: "Obtenir les données depuis une liste SharePoint, puis Combiner et transformer avec un filtre de dossier.", en: "Get data from a SharePoint list, then Combine & Transform with a folder filter." },
      { fr: "Obtenir les données depuis un dossier SharePoint puis Combiner et charger.", en: "Get data from a SharePoint folder, then Combine & Load." },
      { fr: "Obtenir les données depuis une liste SharePoint puis Combiner et charger.", en: "Get data from a SharePoint list, then Combine & Load." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le connecteur « Dossier SharePoint » liste tous les fichiers ; en choisissant Transformer, on filtre d'abord sur le chemin du dossier voulu avant de combiner, ce qui exclut les autres bibliothèques.",
      en: "The SharePoint folder connector lists all files; choosing Transform lets you filter to the target folder path before combining, excluding the other libraries.",
    },
  },
  {
    id: "pl300-65",
    question: {
      fr: "Un développeur crée un dataflow Power BI en DirectQuery vers un SQL Server local, avec le moteur de calcul amélioré activé. Vous devez l'utiliser dans un rapport en minimisant le traitement en ligne, les temps de calcul et de rendu, avec les données de l'année en cours jusqu'à la veille. Que faites-vous ?",
      en: "A developer creates a Power BI dataflow using DirectQuery to an on-premises SQL Server, with the Enhanced Compute Engine on. You must use it in a report minimizing online processing, calculation and render times, with current-year data up to the previous day. What should you do?",
    },
    options: [
      { fr: "Créer une connexion au dataflow en mode DirectQuery.", en: "Create a dataflow connection in DirectQuery mode." },
      { fr: "Créer une connexion DirectQuery et configurer une passerelle pour le dataset.", en: "Create a DirectQuery connection and configure a gateway for the dataset." },
      { fr: "Créer une connexion en mode Import et planifier une actualisation quotidienne.", en: "Create a connection in Import mode and schedule a daily refresh." },
      { fr: "Créer une connexion en mode Import et actualiser toutes les heures via Power Automate.", en: "Create a connection in Import mode and refresh hourly via Power Automate." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le mode Import stocke les données dans le modèle : calculs et rendus sont rapides et le traitement en ligne est minimal. Une actualisation quotidienne suffit puisqu'on tolère les données jusqu'à la veille.",
      en: "Import mode stores data in the model: calculations and rendering are fast with minimal online processing. A daily refresh suffices since data up to the previous day is acceptable.",
    },
  },
  {
    id: "pl300-66",
    question: {
      fr: "Vous créez une dimension Pays pour un schéma en étoile. Vous devez obtenir la liste des pays uniques. Quelles deux actions effectuez-vous ?",
      en: "You create a Country dimension for a star schema. You must obtain the list of unique countries. Which two actions should you perform?",
    },
    options: [
      { fr: "Supprimer la colonne Country.", en: "Delete the Country column." },
      { fr: "Supprimer les doublons de la table.", en: "Remove duplicates from the table." },
      { fr: "Supprimer les doublons de la colonne City.", en: "Remove duplicates from the City column." },
      { fr: "Supprimer la colonne City.", en: "Delete the City column." },
      { fr: "Supprimer les doublons de la colonne Country.", en: "Remove duplicates from the Country column." },
    ],
    correctIndexes: [3, 4],
    explanation: {
      fr: "Il faut d'abord retirer City (qui rendait chaque ligne unique), puis supprimer les doublons sur Country pour obtenir une liste de pays distincts.",
      en: "You first remove City (which made each row unique), then remove duplicates on Country to get a distinct list of countries.",
    },
  },
  {
    id: "pl300-67",
    question: {
      fr: "Un rapport charge un champ texte libre col1. Vous devez analyser la distribution des longueurs de chaîne de col1 sans augmenter la taille du modèle. Que faites-vous ?",
      en: "A report loads a free-text field col1. You must analyze the frequency distribution of string lengths in col1 without increasing the model size. What should you do?",
    },
    options: [
      { fr: "Ajouter une colonne calculée DAX qui calcule la longueur de col1.", en: "Add a DAX calculated column that computes the length of col1." },
      { fr: "Ajouter une fonction DAX qui calcule la longueur moyenne de col1.", en: "Add a DAX function that computes the average length of col1." },
      { fr: "Dans Power Query, ajouter une colonne calculant la longueur de col1.", en: "In Power Query, add a column computing the length of col1." },
      { fr: "Dans l'éditeur Power Query, régler la distribution du profil de colonne pour grouper par longueur sur col1.", en: "In Power Query Editor, set the Column profile distribution to group by length for col1." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le profilage de colonne (« Distribution des valeurs » groupé par longueur) analyse les longueurs directement dans l'éditeur, sans ajouter de colonne au modèle chargé.",
      en: "Column profiling (value distribution grouped by length) analyzes lengths directly in the editor without adding any column to the loaded model.",
    },
  },
  {
    id: "pl300-68",
    question: {
      fr: "Des rapports RH utilisent la sécurité au niveau des lignes (RLS). Chaque région a un manager RH qui ne doit voir que les données de sa région, sans pouvoir modifier la mise en page. Comment donner accès aux managers RH ?",
      en: "HR reports use row-level security (RLS). Each region has an HR manager who must see only their region's data and must not change the report layout. How do you provision access?",
    },
    options: [
      { fr: "Publier les rapports dans une application et accorder l'accès aux managers RH.", en: "Publish the reports in an app and grant the HR managers access." },
      { fr: "Créer un nouvel espace de travail, copier datasets et rapports, et ajouter les managers comme membres.", en: "Create a new workspace, copy datasets and reports, add the managers as members." },
      { fr: "Publier les rapports dans un espace de travail différent de celui des datasets.", en: "Publish the reports to a workspace different from the datasets'." },
      { fr: "Ajouter les managers RH comme membres de l'espace de travail existant.", en: "Add the HR managers as members of the existing workspace." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Distribuer via une application donne un accès en lecture seule : la RLS s'applique et les consommateurs ne peuvent pas modifier la mise en page. Les rôles Membre/Contributeur donneraient trop de droits.",
      en: "Distributing via an app gives read-only access: RLS applies and consumers cannot change the layout. Member/Contributor roles would grant too many rights.",
    },
  },
  {
    id: "pl300-69",
    question: {
      fr: "Une requête Sales importe plusieurs colonnes. Les utilisateurs n'utilisent que la partie date de Sales_Date, et seules les lignes au statut Finished servent à l'analyse. Vous devez réduire le temps de chargement sans nuire à l'analyse. Quelles deux actions (chacune est une solution complète) ?",
      en: "A Sales query imports several columns. Users only use the date part of Sales_Date, and only rows with Status Finished are used. You must reduce load time without affecting analysis. Which two actions (each a complete solution)?",
    },
    options: [
      { fr: "Supprimer les lignes où Sales[Status] vaut Canceled.", en: "Remove rows where Sales[Status] is Canceled." },
      { fr: "Supprimer Sales[Sales_Date].", en: "Remove Sales[Sales_Date]." },
      { fr: "Changer le type de Sales[Delivery_Time] en Entier.", en: "Change the type of Sales[Delivery_Time] to Integer." },
      { fr: "Fractionner Sales[Sales_Date] en colonnes date et heure séparées.", en: "Split Sales[Sales_Date] into separate date and time columns." },
      { fr: "Supprimer Sales[Canceled Date].", en: "Remove Sales[Canceled Date]." },
    ],
    correctIndexes: [0, 4],
    explanation: {
      fr: "Filtrer les lignes Canceled réduit le volume, et supprimer la colonne Canceled Date (inutile puisque seules les lignes Finished comptent) allège le modèle. Chacune est une solution complète et valable.",
      en: "Filtering out Canceled rows reduces volume, and removing the Canceled Date column (irrelevant since only Finished rows matter) trims the model. Each is a valid complete solution.",
    },
  },
  {
    id: "pl300-70",
    question: {
      fr: "Un connecteur personnalisé renvoie plus de 10 millions d'e-mails (ID, From, To, Subject, Body, Has Attachments). Vous analysez les réseaux internes selon les destinataires. Vous devez empêcher les lecteurs de lire les e-mails analysés, en minimisant la taille du modèle. Que faites-vous ?",
      en: "A custom connector returns over 10 million emails (ID, From, To, Subject, Body, Has Attachments). You analyze internal networks by recipient. You must prevent readers from reading the analyzed emails while minimizing model size. What should you do?",
    },
    options: [
      { fr: "Dans la vue Modèle, masquer les colonnes Subject et Body.", en: "In Model view, hide the Subject and Body columns." },
      { fr: "Supprimer les colonnes Subject et Body pendant l'import.", en: "Remove the Subject and Body columns during import." },
      { fr: "Mettre en place une RLS pour que chacun ne voie que ses e-mails.", en: "Implement RLS so each user only sees their own emails." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Supprimer Subject et Body à l'import empêche définitivement leur lecture ET réduit fortement la taille du modèle. Masquer les colonnes ne les retire pas des données.",
      en: "Removing Subject and Body during import permanently prevents reading them and greatly reduces model size. Hiding columns does not remove the data.",
    },
  },
  {
    id: "pl300-71",
    question: {
      fr: "Un modèle contient une table Country où un manager représente un seul pays. Vous devez appliquer la RLS pour que chaque manager ne voie que son pays, en minimisant le nombre de rôles. Quelles deux actions (chacune est une solution complète) ?",
      en: "A model has a Country table where a manager represents a single country. You must apply RLS so each manager sees only their country, minimizing the number of roles. Which two actions (each a complete solution)?",
    },
    options: [
      { fr: "Créer un rôle unique qui filtre Country[Manager_Email] avec la fonction USERNAME().", en: "Create a single role filtering Country[Manager_Email] using USERNAME()." },
      { fr: "Créer un rôle unique qui filtre Country[Manager_Email] avec USEROBJECTID().", en: "Create a single role filtering Country[Manager_Email] using USEROBJECTID()." },
      { fr: "Pour la relation Purchase Detail / Purchase, activer le filtre de sécurité bidirectionnel.", en: "For the Purchase Detail / Purchase relationship, enable bidirectional security filter." },
      { fr: "Créer un rôle par pays.", en: "Create one role per country." },
      { fr: "Passer la relation Purchase / Purchase Detail en direction de filtre croisé Simple.", en: "Set the Purchase / Purchase Detail cross-filter direction to Single." },
    ],
    correctIndexes: [0, 1],
    explanation: {
      fr: "Un rôle dynamique unique utilisant USERNAME() (ou USEROBJECTID()) compare l'utilisateur connecté à Manager_Email : un seul rôle couvre tous les pays. Un rôle par pays multiplierait inutilement les rôles.",
      en: "A single dynamic role using USERNAME() (or USEROBJECTID()) compares the signed-in user to Manager_Email: one role covers every country. One role per country would needlessly multiply roles.",
    },
  },
  {
    id: "pl300-72",
    question: {
      fr: "Un modèle a des relations un-à-plusieurs entre Date et Orders et entre City et Orders. Role1 filtre City[State Province] = \"Kentucky\", Role2 filtre Date[Calendar Year] = 2020. Si un utilisateur appartient aux deux rôles, que voit-il ?",
      en: "A model has one-to-many relationships between Date and Orders and between City and Orders. Role1 filters City[State Province] = \"Kentucky\", Role2 filters Date[Calendar Year] = 2020. If a user belongs to both roles, what do they see?",
    },
    options: [
      { fr: "Les données où State Province est Kentucky OU l'année est 2020.", en: "Data where State Province is Kentucky OR the year is 2020." },
      { fr: "Une erreur, sans pouvoir voir les données.", en: "An error, unable to see the data." },
      { fr: "Uniquement les données où State Province est Kentucky.", en: "Only data where State Province is Kentucky." },
      { fr: "Uniquement les données Kentucky ET année 2020.", en: "Only data where Kentucky AND year 2020." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "L'appartenance à plusieurs rôles RLS est cumulative (union) : l'utilisateur voit les lignes autorisées par Role1 OU par Role2, donc Kentucky ou 2020.",
      en: "Membership in multiple RLS roles is additive (union): the user sees rows allowed by Role1 OR Role2, i.e. Kentucky or 2020.",
    },
  },
  {
    id: "pl300-73",
    question: {
      fr: "Une table Departments contient quatre départements. Vous devez garantir que chaque utilisateur ne voit que les données de son département. Que faites-vous ?",
      en: "A Departments table has four departments. You must ensure each user sees only their department's data. What should you do?",
    },
    options: [
      { fr: "Créer un segment filtrant Departments sur DepartmentID.", en: "Create a slicer filtering Departments on DepartmentID." },
      { fr: "Créer un rôle RLS par département et définir l'appartenance des membres.", en: "Create an RLS role per department and define role membership." },
      { fr: "Créer un paramètre DepartmentID pour filtrer la table.", en: "Create a DepartmentID parameter to filter the table." },
      { fr: "Ajouter une mesure calculée utilisant CURRENTGROUP().", en: "Add a calculated measure using CURRENTGROUP()." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "La sécurité par département s'obtient avec des rôles RLS filtrant chaque département, auxquels on affecte les bons utilisateurs. Un segment ou un paramètre ne sécurise pas les données.",
      en: "Per-department security is achieved with RLS roles filtering each department, assigning the right users to each. A slicer or parameter does not secure data.",
    },
  },
  {
    id: "pl300-74",
    question: {
      fr: "Deux tables ont une RLS configurée. Vous devez créer une relation entre elles de sorte que le filtrage croisé bidirectionnel respecte la RLS. Que faites-vous ?",
      en: "Two tables have RLS configured. You must create a relationship between them so bidirectional cross-filtering honors RLS. What should you do?",
    },
    options: [
      { fr: "Créer une relation inactive et activer « Appliquer le filtre de sécurité dans les deux directions ».", en: "Create an inactive relationship and enable \"Apply security filter in both directions\"." },
      { fr: "Créer une relation active et activer « Appliquer le filtre de sécurité dans les deux directions ».", en: "Create an active relationship and enable \"Apply security filter in both directions\"." },
      { fr: "Créer une relation inactive et activer « Supposer une intégrité référentielle ».", en: "Create an inactive relationship and enable \"Assume referential integrity\"." },
      { fr: "Créer une relation active et activer « Supposer une intégrité référentielle ».", en: "Create an active relationship and enable \"Assume referential integrity\"." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le filtre croisé bidirectionnel exige une relation active ; l'option « Appliquer le filtre de sécurité dans les deux directions » propage correctement la RLS dans les deux sens.",
      en: "Bidirectional cross-filtering requires an active relationship; the \"Apply security filter in both directions\" option correctly propagates RLS both ways.",
    },
  },
  {
    id: "pl300-75",
    question: {
      fr: "Une table Impressions contient ~30 millions d'enregistrements par mois. Vous devez présenter le nombre d'impressions par jour, campagne et site_name sur la dernière année, en minimisant la taille du modèle. Quelles deux actions ?",
      en: "An Impressions table holds ~30 million records per month. You must present impression counts by day, campaign and site_name over the last year, minimizing model size. Which two actions?",
    },
    options: [
      { fr: "Créer des relations un-à-plusieurs entre les tables.", en: "Create one-to-many relationships between the tables." },
      { fr: "Grouper Impressions dans Power Query par Ad_id, Site_name et Impression_date, en agrégeant avec CountRows.", en: "Group Impressions in Power Query by Ad_id, Site_name and Impression_date, aggregating with CountRows." },
      { fr: "Créer une table calculée contenant Ad_id, Site_name et Impression_date.", en: "Create a calculated table with Ad_id, Site_name and Impression_date." },
      { fr: "Créer une mesure calculée agrégeant avec COUNTROWS.", en: "Create a calculated measure aggregating with COUNTROWS." },
    ],
    correctIndexes: [0, 1],
    explanation: {
      fr: "Pré-agréger dans Power Query (regroupement + CountRows) réduit fortement le volume avant le chargement, et des relations un-à-plusieurs relient proprement la table agrégée aux dimensions.",
      en: "Pre-aggregating in Power Query (group + CountRows) greatly reduces volume before load, and one-to-many relationships cleanly link the aggregated table to the dimensions.",
    },
  },
  {
    id: "pl300-76",
    question: {
      fr: "La table Product Inventory contient 25 millions de lignes, reliée à Date par DateKey et à Product par ProductKey. Vous devez réduire la taille du modèle sans perdre d'information. Que faites-vous ?",
      en: "The Product Inventory table has 25 million rows, related to Date via DateKey and to Product via ProductKey. You must reduce model size without losing information. What should you do?",
    },
    options: [
      { fr: "Régler Synthèse (Summarization) de DateKey sur Ne pas synthétiser.", en: "Set Summarization for DateKey to Don't Summarize." },
      { fr: "Supprimer la relation entre Date et Product Inventory.", en: "Remove the relationship between Date and Product Inventory." },
      { fr: "Changer le type de UnitCost en Entier.", en: "Change the type of UnitCost to Integer." },
      { fr: "Supprimer MovementDate.", en: "Remove MovementDate." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Régler la synthèse d'une clé numérique sur « Ne pas synthétiser » empêche l'agrégation implicite et n'entraîne aucune perte de données, tout en évitant des structures inutiles. Les autres options suppriment de l'information.",
      en: "Setting a numeric key's summarization to \"Don't Summarize\" prevents implicit aggregation with no data loss, avoiding unnecessary structures. The other options remove information.",
    },
  },
  {
    id: "pl300-77",
    question: {
      fr: "Un rapport de ventes lit une vue SQL Server. Il doit fournir : nombre de commandes et somme des ventes par date de commande, nombre de clients ayant commandé, quantité moyenne par commande. Vous devez réduire les temps d'actualisation et de requête. Quelles deux actions ?",
      en: "A sales report reads a SQL Server view. It must provide: count of orders and sum of sales by order date, number of customers who ordered, average quantity per order. You must reduce refresh and query times. Which two actions?",
    },
    options: [
      { fr: "Mettre SalesOrderNumber en type Nombre décimal.", en: "Set SalesOrderNumber to Decimal Number type." },
      { fr: "Supprimer les colonnes CustomerKey et ProductKey.", en: "Remove the CustomerKey and ProductKey columns." },
      { fr: "Supprimer les colonnes TaxAmt et Freight.", en: "Remove the TaxAmt and Freight columns." },
      { fr: "Filtrer les données sur le seul territoire NorthWest.", en: "Filter the data to only the NorthWest territory." },
    ],
    correctIndexes: [2, 3],
    explanation: {
      fr: "Supprimer les colonnes inutiles (TaxAmt, Freight) et filtrer aux seules lignes nécessaires (territoire NorthWest) réduisent le volume chargé, accélérant actualisation et requêtes sans nuire aux analyses demandées.",
      en: "Removing unused columns (TaxAmt, Freight) and filtering to only needed rows (NorthWest territory) cut the loaded volume, speeding up refresh and queries without harming the required analyses.",
    },
  },
  {
    id: "pl300-78",
    question: {
      fr: "Une table Store contient des champs de localisation. Vous prévoyez un visuel carte avec exploration Country → State/Province → City. Que faites-vous pour que les emplacements soient correctement cartographiés ?",
      en: "A Store table contains location fields. You plan a map visual with drill-down Country → State/Province → City. What should you do to ensure locations map correctly?",
    },
    options: [
      { fr: "Changer le type de données de City, State/Province et Country.", en: "Change the data type of City, State/Province and Country." },
      { fr: "Régler la synthèse de City, State/Province et Country sur Ne pas synthétiser.", en: "Set Summarization of City, State/Province and Country to Don't summarize." },
      { fr: "Définir la catégorie de données de City, State/Province et Country.", en: "Set the data category of City, State/Province and Country." },
      { fr: "Créer une colonne calculée concaténant City, State/Province et Country.", en: "Create a calculated column concatenating City, State/Province and Country." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Attribuer la bonne catégorie de données géographiques (Ville, État/Province, Pays) permet à Bing Maps de géocoder précisément les emplacements et d'établir la hiérarchie de carte.",
      en: "Assigning the correct geographic data category (City, State/Province, Country) lets Bing Maps geocode locations accurately and build the map hierarchy.",
    },
  },
  {
    id: "pl300-79",
    question: {
      fr: "Vos données ont une colonne « Machine-User » combinée. Vous devez créer un histogramme groupé séparant machine et utilisateur. Que faites-vous ?",
      en: "Your data has a combined \"Machine-User\" column. You must create a clustered bar chart separating machine and user. What should you do?",
    },
    options: [
      { fr: "Dans l'éditeur Power Query, fractionner la colonne Machine-User par délimiteur.", en: "In Power Query Editor, split the Machine-User column by delimiter." },
      { fr: "Dans Power Query, créer une colonne des trois derniers chiffres de Machine-User.", en: "In Power Query, create a column of the last three digits of Machine-User." },
      { fr: "Créer deux colonnes calculées DAX Machine et User via SUBSTITUTE.", en: "Create two DAX calculated columns Machine and User using SUBSTITUTE." },
      { fr: "Créer deux mesures DAX Machine et User via SUBSTITUTE.", en: "Create two DAX measures Machine and User using SUBSTITUTE." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Fractionner la colonne par le délimiteur dans Power Query crée proprement deux colonnes (Machine, User) réutilisables comme axe et légende, sans alourdir le modèle avec du DAX.",
      en: "Splitting the column by delimiter in Power Query cleanly creates two columns (Machine, User) usable as axis and legend, without bloating the model with DAX.",
    },
  },
  {
    id: "pl300-80",
    question: {
      fr: "Une relation un-à-plusieurs va de Suppliers vers LineItems (ID / Supplier ID). Vous devez minimiser la taille du dataset sans affecter les visuels. Que faites-vous ?",
      en: "A one-to-many relationship goes from Suppliers to LineItems (ID / Supplier ID). You must minimize dataset size without affecting the visuals. What should you do?",
    },
    options: [
      { fr: "Fusionner Suppliers et LineItems.", en: "Merge Suppliers and LineItems." },
      { fr: "Supprimer la colonne LineItems[Description].", en: "Remove the LineItems[Description] column." },
      { fr: "Supprimer les lignes de LineItems antérieures au début du mois dernier.", en: "Remove rows of LineItems before the start of last month." },
      { fr: "Grouper LineItems par Invoice ID et Invoice Date avec la somme de Price.", en: "Group LineItems by Invoice ID and Invoice Date with sum of Price." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "La colonne Description (texte libre, haute cardinalité) n'est utilisée par aucun visuel : la supprimer réduit fortement la taille sans impacter l'affichage.",
      en: "The Description column (free text, high cardinality) is used by no visual: removing it greatly reduces size without affecting any display.",
    },
  },
  {
    id: "pl300-81",
    question: {
      fr: "Une relation un-à-plusieurs va de Posts vers Traffic (URL / URL Visited). Le dataset est lent à actualiser. Quelles deux actions réduisent les temps de chargement (chacune étant une partie de la solution) ?",
      en: "A one-to-many relationship goes from Posts to Traffic (URL / URL Visited). The dataset refreshes slowly. Which two actions reduce load times (each part of the solution)?",
    },
    options: [
      { fr: "Supprimer les lignes de Posts publiées dans les 7 derniers jours.", en: "Remove rows in Posts published in the last 7 days." },
      { fr: "Supprimer les lignes de Traffic dont URL Visited ne contient pas « blog ».", en: "Remove rows in Traffic where URL Visited does not contain \"blog\"." },
      { fr: "Supprimer Traffic[IP Address], Traffic[Browser Agent] et Traffic[Referring URL].", en: "Remove Traffic[IP Address], Traffic[Browser Agent] and Traffic[Referring URL]." },
      { fr: "Supprimer Posts[Full Text] et Posts[Summary].", en: "Remove Posts[Full Text] and Posts[Summary]." },
      { fr: "Supprimer les lignes de Traffic dont Referring URL ne commence pas par « / ».", en: "Remove rows in Traffic where Referring URL does not start with \"/\"." },
    ],
    correctIndexes: [1, 3],
    explanation: {
      fr: "Filtrer Traffic aux seules visites du blog réduit le nombre de lignes, et supprimer les gros champs texte de Posts (Full Text, Summary) réduit la taille des colonnes : les deux allègent le chargement sans casser les visuels.",
      en: "Filtering Traffic to blog visits only reduces rows, and removing large text fields from Posts (Full Text, Summary) reduces column size: both lighten the load without breaking the visuals.",
    },
  },
  {
    id: "pl300-82",
    question: {
      fr: "La table Sales contient les ventes par jour sur cinq ans. Vous devez créer une mesure renvoyant le total des ventes de mars 2021 lorsque mars 2022 est sélectionné. Quelle expression DAX ?",
      en: "The Sales table has daily sales over five years. You must create a measure returning total sales of March 2021 when March 2022 is selected. Which DAX expression?",
    },
    options: [
      { fr: "CALCULATE(SUM(Sales[Sales]), PREVIOUSYEAR(dimDate[Date]))", en: "CALCULATE(SUM(Sales[Sales]), PREVIOUSYEAR(dimDate[Date]))" },
      { fr: "TOTALYTD(SUM(Sales[Sales]), dimDate[Date])", en: "TOTALYTD(SUM(Sales[Sales]), dimDate[Date])" },
      { fr: "CALCULATE(SUM(Sales[Sales]), SAMEPERIODLASTYEAR(dimDate[Date]))", en: "CALCULATE(SUM(Sales[Sales]), SAMEPERIODLASTYEAR(dimDate[Date]))" },
      { fr: "SUM(Sales[Sales])", en: "SUM(Sales[Sales])" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "SAMEPERIODLASTYEAR décale le contexte de date d'exactement un an : pour mars 2022 sélectionné, il renvoie mars 2021. PREVIOUSYEAR renverrait toute l'année précédente, pas le même mois.",
      en: "SAMEPERIODLASTYEAR shifts the date context back exactly one year: for March 2022 selected it returns March 2021. PREVIOUSYEAR would return the whole prior year, not the same month.",
    },
  },
  {
    id: "pl300-83",
    question: {
      fr: "En chargeant des données SQL Server, vous recevez une erreur de délai/mémoire pendant le chargement. Vous devez résoudre l'erreur. Quelles deux méthodes (chacune est une solution complète) ?",
      en: "While loading SQL Server data you get a timeout/memory error during the load. You must resolve it. Which two ways (each a complete solution)?",
    },
    options: [
      { fr: "Réduire le nombre de lignes et de colonnes renvoyées par chaque requête.", en: "Reduce the number of rows and columns returned by each query." },
      { fr: "Scinder les requêtes longues en sous-ensembles de colonnes puis les fusionner via Power Query.", en: "Split long-running queries into subsets of columns and merge them via Power Query." },
      { fr: "Combiner les requêtes longues en une seule requête.", en: "Combine the long-running queries into one query." },
      { fr: "Désactiver le query folding sur les requêtes longues.", en: "Disable query folding on long-running queries." },
    ],
    correctIndexes: [0, 1],
    explanation: {
      fr: "Réduire le volume par requête et scinder une grosse requête en sous-ensembles de colonnes (puis fusion) diminuent la mémoire nécessaire à chaque étape, chacune résolvant l'erreur.",
      en: "Reducing per-query volume and splitting a large query into column subsets (then merging) both lower the memory needed at each step, each resolving the error.",
    },
  },
  {
    id: "pl300-84",
    question: {
      fr: "Un rapport ReportA utilise un thème personnalisé. Vous créez un tableau de bord DashboardA qui doit utiliser ce thème avec un minimum d'effort. Quelles deux actions ?",
      en: "A report ReportA uses a custom theme. You create a dashboard DashboardA that must use that theme with minimal effort. Which two actions?",
    },
    options: [
      { fr: "Publier ReportA dans Power BI.", en: "Publish ReportA to Power BI." },
      { fr: "Depuis ReportA, enregistrer le thème actuel.", en: "From ReportA, save the current theme." },
      { fr: "Publier ReportA dans la galerie de thèmes de la communauté Power BI.", en: "Publish ReportA to the Power BI Community theme gallery." },
      { fr: "Depuis DashboardA, créer un thème personnalisé.", en: "From DashboardA, create a custom theme." },
      { fr: "Depuis DashboardA, importer un thème JSON.", en: "From DashboardA, upload a JSON theme." },
    ],
    correctIndexes: [1, 4],
    explanation: {
      fr: "On enregistre le thème du rapport en JSON, puis on l'importe dans le tableau de bord : le thème est réutilisé sans le recréer manuellement.",
      en: "You save the report's theme as JSON, then upload it to the dashboard: the theme is reused without recreating it by hand.",
    },
  },
  {
    id: "pl300-85",
    question: {
      fr: "Avec le visuel « facteurs d'influence clés » (key influencers), vous ajoutez plusieurs champs dans « Expliquer par ». Le visuel indique qu'en Autriche les clients commandent en moyenne 18,8 unités de plus. Que peut-on déduire du visuel ?",
      en: "With the key influencers visual, you add several fields to \"Explain by\". The visual shows that customers in Austria order on average 18.8 more units. What can you conclude from the visual?",
    },
    options: [
      { fr: "Les clients en Autriche commandent 18,8 unités de plus que la quantité moyenne.", en: "Customers in Austria order 18.8 more units than the average order quantity." },
      { fr: "Les clients de Boise commandent 20,37 % de plus que la moyenne.", en: "Customers in Boise order 20.37% more than average." },
      { fr: "La catégorie de produit influence positivement la quantité par commande.", en: "Product Category positively influences quantity per order." },
      { fr: "Les clients de Cork commandent des quantités inférieures à la moyenne.", en: "Customers in Cork order lower quantities than average." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le visuel des facteurs d'influence clés quantifie l'effet d'une valeur : ici, être en Autriche augmente la quantité commandée de 18,8 unités par rapport à la moyenne.",
      en: "The key influencers visual quantifies the effect of a value: here, being in Austria increases order quantity by 18.8 units versus average.",
    },
  },
  {
    id: "pl300-86",
    question: {
      fr: "Vous créez un tableau de bord dans le service Power BI à partir d'une page de rapport contenant trois graphiques. Vous devez ajouter ces graphiques au tableau de bord en conservant l'interactivité entre eux. Que faites-vous ?",
      en: "You create a dashboard in the Power BI service from a report page containing three charts. You must add the charts to the dashboard while keeping the interactivity between them. What should you do?",
    },
    options: [
      { fr: "Modifier les interactions du rapport et régler toutes les interactions sur Filtrer.", en: "Edit the report interactions and set all to Filter." },
      { fr: "Épingler chaque graphique comme une tuile.", en: "Pin each chart as a tile." },
      { fr: "Modifier le thème du tableau de bord et épingler chaque graphique.", en: "Edit the dashboard theme and pin each chart as a tile." },
      { fr: "Épingler la page de rapport comme tuile dynamique (live).", en: "Pin the report page as a live tile." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Épingler la page entière en tuile dynamique (live) conserve l'interactivité entre les visuels ; épingler chaque graphique séparément fige des images non interactives.",
      en: "Pinning the whole page as a live tile preserves interactivity between visuals; pinning each chart separately yields static, non-interactive snapshots.",
    },
  },
  {
    id: "pl300-87",
    question: {
      fr: "Vous devez tracer une ligne horizontale en pointillés représentant le 40e centile des ventes quotidiennes sur la période affichée. Comment la créer ?",
      en: "You must draw a dashed horizontal line representing the 40th percentile of daily sales over the shown period. How do you create it?",
    },
    options: [
      { fr: "Ajouter une mesure Measure1 = PERCENTILEX.INC(Sales, Sales[Total Sales], 0.40).", en: "Add a measure Measure1 = PERCENTILEX.INC(Sales, Sales[Total Sales], 0.40)." },
      { fr: "Ajouter une mesure Measure1 = PERCENTILEX.EXC(Sales, Sales[Total Sales], 0.40).", en: "Add a measure Measure1 = PERCENTILEX.EXC(Sales, Sales[Total Sales], 0.40)." },
      { fr: "Ajouter une ligne de centile utilisant Total Sales comme mesure et 40 % comme centile.", en: "Add a percentile line using Total Sales as the measure and 40% as the percentile." },
      { fr: "Créer une ligne horizontale avec une valeur fixe de 24 000.", en: "Create a horizontal line with a fixed value of 24,000." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le volet Analyses propose une « ligne de centile » : on choisit la mesure Total Sales et le centile 40 %. La ligne se recalcule dynamiquement selon la période, contrairement à une valeur fixe.",
      en: "The Analytics pane offers a \"percentile line\": pick the Total Sales measure and 40% percentile. It recalculates dynamically with the period, unlike a fixed value.",
    },
  },
  {
    id: "pl300-88",
    question: {
      fr: "Les utilisateurs consulteront un rapport sur mobile et il doit afficher les données selon leur emplacement. Quelles deux actions ?",
      en: "Users will view a report on mobile and it must display data based on their location. Which two actions?",
    },
    options: [
      { fr: "Dans Power Query, détecter les types des colonnes concernées.", en: "In Power Query, detect the data types of the relevant columns." },
      { fr: "Dans Catégorie de données, définir la catégorie géographique des colonnes concernées.", en: "In Data Category, set the geographic category for the relevant columns." },
      { fr: "Créer une hiérarchie pour les colonnes de type géographie.", en: "Create a hierarchy for the geography-type columns." },
      { fr: "Utiliser les colonnes de type géographie dans tous les visuels.", en: "Use the geography-type columns in all visuals." },
      { fr: "Définir des synonymes correspondant aux termes géographiques courants.", en: "Set synonyms matching common geographic terms." },
    ],
    correctIndexes: [1, 3],
    explanation: {
      fr: "Définir la catégorie géographique des colonnes active la géolocalisation, et utiliser ces colonnes dans les visuels permet à l'app mobile de filtrer selon la position de l'utilisateur.",
      en: "Setting the columns' geographic category enables geolocation, and using those columns in the visuals lets the mobile app filter by the user's position.",
    },
  },
  {
    id: "pl300-89",
    question: {
      fr: "Un rapport contient un graphique en anneau et un histogramme groupé (interactions par défaut). Vous devez faire en sorte que sélectionner une colonne de l'histogramme redessine l'anneau avec les données sélectionnées. Que faites-vous ?",
      en: "A report has a donut chart and a clustered column chart (default interactions). You must make selecting a column in the column chart redraw the donut with the selected data. What should you do?",
    },
    options: [
      { fr: "Sélectionner l'anneau et régler l'interaction de l'histogramme sur Filtrer.", en: "Select the donut and set the column chart's interaction to Filter." },
      { fr: "Sélectionner l'histogramme et régler l'interaction de l'anneau sur Filtrer.", en: "Select the column chart and set the donut's interaction to Filter." },
      { fr: "Sélectionner l'anneau et régler l'interaction de l'histogramme sur Aucune.", en: "Select the donut and set the column chart's interaction to None." },
      { fr: "Sélectionner l'histogramme et régler l'interaction de l'anneau sur Aucune.", en: "Select the column chart and set the donut's interaction to None." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "On sélectionne le visuel source (l'histogramme) puis on règle l'interaction du visuel cible (l'anneau) sur Filtrer : cliquer une colonne filtre alors l'anneau.",
      en: "You select the source visual (column chart) then set the target visual's (donut) interaction to Filter: clicking a column then filters the donut.",
    },
  },
  {
    id: "pl300-90",
    question: {
      fr: "Un visuel de type table affiche une colonne Plant Image contenant des URL. Vous devez afficher l'image référencée au lieu de l'URL. Que faites-vous ?",
      en: "A table visual shows a Plant Image column containing URLs. You must display the referenced image instead of the URL. What should you do?",
    },
    options: [
      { fr: "Dans l'onglet Mise en forme, activer les icônes d'URL pour la table.", en: "In Formatting, turn on URL icons for the table." },
      { fr: "Régler la catégorie de données du champ Plant Image sur URL Web.", en: "Set the Plant Image field's data category to Web URL." },
      { fr: "Régler le type du champ Plant Image sur Binaire.", en: "Set the Plant Image field's data type to Binary." },
      { fr: "Régler la catégorie de données du champ Plant Image sur URL d'image (Image URL).", en: "Set the Plant Image field's data category to Image URL." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "La catégorie de données « URL d'image » indique à Power BI de récupérer et d'afficher l'image pointée par l'URL, au lieu du texte de l'URL.",
      en: "The \"Image URL\" data category tells Power BI to fetch and render the image at the URL, instead of showing the URL text.",
    },
  },
  {
    id: "pl300-91",
    question: {
      fr: "Un rapport publié affiche les dépenses par mois en courbe. Vous devez permettre aux utilisateurs de choisir entre courbe et histogramme, avec un minimum d'effort de développement et de maintenance. Que faites-vous ?",
      en: "A published report shows expenses by month as a line chart. You must let users switch between line and column chart with minimal development and maintenance effort. What should you do?",
    },
    options: [
      { fr: "Activer la personnalisation des visuels par les lecteurs.", en: "Enable report readers to personalize visuals." },
      { fr: "Créer une page distincte pour l'histogramme.", en: "Create a separate page for the column chart." },
      { fr: "Ajouter un histogramme, un signet et un bouton pour choisir le visuel.", en: "Add a column chart, a bookmark and a button to choose the visual." },
      { fr: "Créer un rapport mobile contenant un histogramme.", en: "Create a mobile report with a column chart." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Activer « Personnaliser les visuels » laisse chaque lecteur changer le type de visualisation sans maintenance : pas de signets ni de pages en double à entretenir.",
      en: "Enabling \"Personalize visuals\" lets each reader change the visualization type with no maintenance: no bookmarks or duplicate pages to maintain.",
    },
  },
  {
    id: "pl300-92",
    question: {
      fr: "Deux rapports (ReportA, ReportB) utilisent des palettes distinctes. Vous créez un tableau de bord avec deux visuels de chaque, avec un thème sombre cohérent tout en préservant les couleurs d'origine des rapports. Quelles deux actions ?",
      en: "Two reports (ReportA, ReportB) use distinct palettes. You build a dashboard with two visuals from each, needing a consistent dark theme while preserving the reports' original colors. Which two actions?",
    },
    options: [
      { fr: "Charger une capture d'écran.", en: "Upload a snapshot." },
      { fr: "Régler le navigateur en mode sombre.", en: "Set the browser to dark mode." },
      { fr: "En épinglant les visuels, choisir « Utiliser le thème de destination ».", en: "When pinning visuals, select \"Use destination theme\"." },
      { fr: "Sélectionner le thème sombre du tableau de bord.", en: "Select the dark dashboard theme." },
      { fr: "Activer l'agencement des tuiles (tile flow).", en: "Turn on tile flow." },
    ],
    correctIndexes: [2, 3],
    explanation: {
      fr: "On applique le thème sombre au tableau de bord ; en épinglant, choisir « Utiliser le thème de destination » harmonise le fond tout en conservant les couleurs propres à chaque visuel.",
      en: "Apply the dark dashboard theme; when pinning, choosing \"Use destination theme\" harmonizes the background while keeping each visual's own colors.",
    },
  },
  {
    id: "pl300-93",
    question: {
      fr: "Un tableau de bord se base sur un rapport avec un dataset importé depuis SQL Server. Le journal indique un événement à 12:03:06. Que s'est-il passé à ce moment ?",
      en: "A dashboard is based on a report with a dataset imported from SQL Server. The log shows an event at 12:03:06. What happened at that time?",
    },
    options: [
      { fr: "Une nouvelle transaction a été ajoutée à la source de données.", en: "A new transaction was added to the data source." },
      { fr: "Le cache des tuiles du tableau de bord s'est actualisé.", en: "The dashboard tile cache refreshed." },
      { fr: "Un utilisateur a ajouté un commentaire à une tuile.", en: "A user added a comment to a tile." },
      { fr: "Un utilisateur a appuyé sur F5.", en: "A user pressed F5." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Les tuiles d'un tableau de bord sont mises en cache et rafraîchies après l'actualisation planifiée du dataset : l'horodatage correspond à l'actualisation du cache des tuiles.",
      en: "Dashboard tiles are cached and refreshed after the dataset's scheduled refresh: the timestamp corresponds to the tile cache refresh.",
    },
  },
  {
    id: "pl300-94",
    question: {
      fr: "Vous devez montrer la relation entre Total Cost et Total Sales au fil du temps sur un visuel. Que faites-vous ?",
      en: "You must show the relationship between Total Cost and Total Sales over time on a visual. What should you do?",
    },
    options: [
      { fr: "Ajouter un axe de lecture (play axis).", en: "Add a play axis." },
      { fr: "Depuis le volet Analyses, ajouter une ligne moyenne.", en: "From the Analytics pane, add an average line." },
      { fr: "Ajouter un segment pour l'année.", en: "Add a slicer for the year." },
      { fr: "Créer une mesure DAX de croissance d'une année sur l'autre.", en: "Create a DAX year-over-year growth measure." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Sur un nuage de points, l'axe de lecture (play axis) anime les points dans le temps, révélant l'évolution de la relation entre coût et ventes.",
      en: "On a scatter chart, the play axis animates the points over time, revealing how the cost/sales relationship evolves.",
    },
  },
  {
    id: "pl300-95",
    question: {
      fr: "Un rapport de trois pages contient une visualisation KPI sur une page. Vous devez filtrer toutes les visualisations du rapport sauf le KPI. Quelles deux actions ?",
      en: "A three-page report has a KPI visualization on one page. You must filter all report visualizations except the KPI. Which two actions?",
    },
    options: [
      { fr: "Modifier les interactions de la visualisation KPI.", en: "Edit the interactions of the KPI visualization." },
      { fr: "Ajouter le même segment à chaque page et configurer la synchronisation des segments.", en: "Add the same slicer to each page and configure Sync slicers." },
      { fr: "Modifier les interactions du segment situé sur la même page que le KPI.", en: "Edit the interactions of the slicer on the same page as the KPI." },
      { fr: "Configurer un filtre au niveau de la page.", en: "Configure a page-level filter." },
      { fr: "Configurer un filtre au niveau du rapport.", en: "Configure a report-level filter." },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "Un segment synchronisé sur toutes les pages filtre l'ensemble ; en réglant son interaction sur Aucune vis-à-vis du KPI, on exclut ce seul visuel du filtrage.",
      en: "A slicer synced across pages filters everything; setting its interaction to None against the KPI excludes just that visual from filtering.",
    },
  },
  {
    id: "pl300-96",
    question: {
      fr: "Un rapport contient une visualisation avec détection d'anomalies activée, mais aucune anomalie n'est détectée. Vous devez augmenter la probabilité d'en détecter. Que faites-vous ?",
      en: "A report has a visualization with anomaly detection enabled, but no anomalies are detected. You must increase the likelihood of detecting some. What should you do?",
    },
    options: [
      { fr: "Augmenter la transparence de la plage attendue.", en: "Increase the expected range transparency." },
      { fr: "Ajouter un champ dans la zone Légende.", en: "Add a field to the Legend well." },
      { fr: "Augmenter le réglage de Sensibilité.", en: "Increase the Sensitivity setting." },
      { fr: "Ajouter un champ dans la zone Valeurs secondaires.", en: "Add a field to the Secondary values well." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "La détection d'anomalies compare les valeurs à une plage attendue ; augmenter la sensibilité resserre cette plage, de sorte que davantage d'écarts sont signalés comme anomalies.",
      en: "Anomaly detection compares values to an expected range; increasing sensitivity narrows that range so more deviations are flagged as anomalies.",
    },
  },
  {
    id: "pl300-97",
    question: {
      fr: "Une mise en page mobile de tableau de bord contient 10 cartes, 2 cartes géographiques et 5 histogrammes. Vous devez n'afficher que les visuels à valeur unique en minimisant le défilement. Que faites-vous ?",
      en: "A dashboard mobile layout has 10 cards, 2 maps and 5 bar charts. You must show only single-value visuals while minimizing scrolling. What should you do?",
    },
    options: [
      { fr: "Réduire la taille des cartes et retirer les cartes géographiques et histogrammes.", en: "Decrease the card sizes and remove the maps and bar charts." },
      { fr: "Réduire la taille des cartes géo et histogrammes et remonter toutes les cartes.", en: "Decrease the maps and bar charts and move all cards to the top." },
      { fr: "Retirer les cartes et agrandir les cartes géo et histogrammes.", en: "Remove the cards and enlarge the maps and bar charts." },
      { fr: "Remonter les histogrammes, retirer les cartes géo et réduire les cartes.", en: "Move bar charts up, remove maps and shrink cards." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Les visuels à valeur unique sont les cartes : on retire cartes géographiques et histogrammes, et on réduit la taille des cartes pour tout afficher sans défilement.",
      en: "The single-value visuals are the cards: remove the maps and bar charts, and shrink the cards so everything fits without scrolling.",
    },
  },
  {
    id: "pl300-98",
    question: {
      fr: "Une table Data1 de 10 millions de lignes alimente une carte, un histogramme et un nuage de points (montant, profit, couleur par territoire). Vous devez rendre le nuage de points plus lisible sans affecter la précision des autres visuels. Que faites-vous ?",
      en: "A 10-million-row Data1 table feeds a card, a bar chart and a scatter plot (amount, profit, colored by territory). You must make the scatter plot easier to read without affecting the other visuals' accuracy. What should you do?",
    },
    options: [
      { fr: "Ajouter un champ de comptage du montant dans la taille du nuage de points.", en: "Add a count field of the amount to the scatter's size bucket." },
      { fr: "Ajouter une ligne de tendance au nuage de points.", en: "Add a trend line to the scatter plot." },
      { fr: "Activer l'échantillonnage haute densité sur le nuage de points.", en: "Enable high-density sampling on the scatter plot." },
      { fr: "Appliquer un filtre de lignes sur Data1 dans Power Query.", en: "Apply a row filter to Data1 in Power Query." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "L'échantillonnage haute densité sélectionne intelligemment les points représentatifs du nuage, améliorant la lisibilité sans toucher aux données ni aux autres visuels (contrairement à un filtre Power Query).",
      en: "High-density sampling intelligently selects representative points for the scatter, improving readability without altering the data or other visuals (unlike a Power Query filter).",
    },
  },
  {
    id: "pl300-99",
    question: {
      fr: "Un espace de travail Inventory contient un dataset, un rapport et un tableau de bord. Vous devez ajouter au tableau de bord une tuile montrant l'inventaire par emplacement, information absente du rapport, en minimisant l'impact sur le rapport. Quelles deux actions ?",
      en: "An Inventory workspace has a dataset, a report and a dashboard. You must add a tile showing inventory by location, which is not in the report, while minimizing impact on the report. Which two actions?",
    },
    options: [
      { fr: "Poser une question via Q&R (Q&A).", en: "Ask a question using Q&A." },
      { fr: "Masquer la page du rapport.", en: "Hide the report page." },
      { fr: "Épingler le visuel au tableau de bord.", en: "Pin the visual to the dashboard." },
      { fr: "Utiliser les insights rapides sur le tableau de bord.", en: "Use quick insights on the dashboard." },
      { fr: "Ajouter le visuel au rapport.", en: "Add the visual to the report." },
    ],
    correctIndexes: [0, 2],
    explanation: {
      fr: "Poser la question dans Q&R génère le visuel inventaire par emplacement à partir du dataset, puis on l'épingle au tableau de bord : le rapport n'est pas modifié.",
      en: "Asking in Q&A generates the inventory-by-location visual from the dataset, then you pin it to the dashboard: the report is left untouched.",
    },
  },
  {
    id: "pl300-100",
    question: {
      fr: "Un rapport a trois pages (Page1, Page2, Page3) avec les mêmes segments. Vous devez faire en sorte que les filtres appliqués à Page1 s'appliquent uniquement à Page1 et Page3. Que faites-vous ?",
      en: "A report has three pages (Page1, Page2, Page3) with the same slicers. You must ensure filters applied on Page1 apply only to Page1 and Page3. What should you do?",
    },
    options: [
      { fr: "Modifier les interactions du segment sur chaque page.", en: "Modify the slicer interactions on each page." },
      { fr: "Activer la visibilité des segments sur Page1 et Page3, la désactiver sur Page2.", en: "Enable slicer visibility on Page1 and Page3, disable on Page2." },
      { fr: "Synchroniser les segments sur Page1 et Page3.", en: "Sync the slicers on Page1 and Page3." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "La synchronisation des segments propage la sélection uniquement aux pages cochées : en synchronisant Page1 et Page3 (sans Page2), les filtres ne touchent que ces deux pages.",
      en: "Slicer sync propagates the selection only to the checked pages: syncing Page1 and Page3 (excluding Page2) confines filters to those two pages.",
    },
  },
  {
    id: "pl300-101",
    question: {
      fr: "Un rapport a quatre pages contenant chacune un segment Country. Vous devez conserver la sélection de la page 1 sur les pages 2 et 3, tout en empêchant la page 4 d'être affectée. Que faites-vous ?",
      en: "A report has four pages each with a Country slicer. You must retain the page-1 selection on pages 2 and 3 while preventing page 4 from being affected. What should you do?",
    },
    options: [
      { fr: "Retirer le segment des pages 1-3 et ajouter Country aux filtres de page.", en: "Remove the slicer from pages 1-3 and add Country to page-level filters." },
      { fr: "Retirer le segment des pages 1-3 et ajouter Country aux filtres de rapport.", en: "Remove the slicer from pages 1-3 and add Country to report-level filters." },
      { fr: "Déplacer les segments des pages 2 et 3 vers la page 1.", en: "Move the slicers from pages 2 and 3 to page 1." },
      { fr: "Synchroniser le segment Country sur les pages 1, 2 et 3.", en: "Sync the Country slicer across pages 1, 2 and 3." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "En synchronisant le segment sur les pages 1, 2 et 3 uniquement, la sélection se propage à ces pages ; la page 4, non synchronisée, reste indépendante.",
      en: "Syncing the slicer only across pages 1, 2 and 3 propagates the selection to them; page 4, not synced, stays independent.",
    },
  },
  {
    id: "pl300-102",
    question: {
      fr: "Vous devez produire des factures clients au format PDF montrant clairement toutes les colonnes et lignes. Que créez-vous ?",
      en: "You must produce customer invoices as PDF showing all columns and rows clearly. What should you create?",
    },
    options: [
      { fr: "Un rapport paginé contenant un tablix.", en: "A paginated report containing a tablix." },
      { fr: "Un tableau de bord contenant une table.", en: "A dashboard containing a table." },
      { fr: "Un rapport interactif contenant une table.", en: "An interactive report containing a table." },
      { fr: "Un rapport interactif contenant une matrice.", en: "An interactive report containing a matrix." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Les rapports paginés (avec un tablix) sont conçus pour l'export PDF pixel-perfect couvrant toutes les lignes et colonnes, idéal pour des factures. Les rapports interactifs ne paginent pas proprement pour l'impression.",
      en: "Paginated reports (with a tablix) are built for pixel-perfect PDF export covering all rows and columns, ideal for invoices. Interactive reports don't paginate cleanly for print.",
    },
  },
  {
    id: "pl300-103",
    question: {
      fr: "Une page contient une forme Shape1, une carte Sales Summary et un histogramme. Vous devez faire en sorte que Sales Summary s'affiche au-dessus de Shape1. Que modifiez-vous ?",
      en: "A page has a shape Shape1, a card Sales Summary and a bar chart. You must make Sales Summary render on top of Shape1. What should you modify?",
    },
    options: [
      { fr: "L'ordre de tabulation dans le volet Sélection.", en: "Tab order in the Selection pane." },
      { fr: "L'ordre des calques dans le volet Sélection.", en: "Layer order in the Selection pane." },
      { fr: "L'option Conserver l'ordre des calques des paramètres du visuel.", en: "Maintain layer order in the visual's General settings." },
      { fr: "L'alignement vertical dans les paramètres du canevas.", en: "Vertical alignment in the Canvas settings." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "L'ordre des calques (Layer order) dans le volet Sélection détermine quel visuel est au-dessus : on remonte Sales Summary au-dessus de Shape1. L'ordre de tabulation ne concerne que la navigation clavier.",
      en: "Layer order in the Selection pane determines which visual is on top: move Sales Summary above Shape1. Tab order only affects keyboard navigation.",
    },
  },
  {
    id: "pl300-104",
    question: {
      fr: "Report1 contient une courbe « Sales by month » épinglée à Dashboard1. Vous changez ce visuel en histogramme dans Report1. Vous devez que l'histogramme s'affiche sur Dashboard1. Que faites-vous ?",
      en: "Report1 has a \"Sales by month\" line chart pinned to Dashboard1. You change that visual to a bar chart in Report1. You must have the bar chart appear on Dashboard1. What should you do?",
    },
    options: [
      { fr: "Actualiser le dataset utilisé par Report1 et Dashboard1.", en: "Refresh the dataset used by Report1 and Dashboard1." },
      { fr: "Épingler l'histogramme Sales by month à Dashboard1.", en: "Pin the Sales by month bar chart to Dashboard1." },
      { fr: "Sélectionner Actualiser les visuels pour Dashboard1.", en: "Select Refresh visuals for Dashboard1." },
      { fr: "Modifier les détails de la tuile de Dashboard1.", en: "Edit the details of the Dashboard1 tile." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Une tuile épinglée est un instantané figé : changer le visuel dans le rapport ne met pas à jour la tuile. Il faut ré-épingler l'histogramme au tableau de bord.",
      en: "A pinned tile is a frozen snapshot: changing the visual in the report does not update the tile. You must re-pin the bar chart to the dashboard.",
    },
  },
  {
    id: "pl300-105",
    question: {
      fr: "Vous créez une page d'info-bulle personnalisée et devez la préparer. Quelles trois actions ?",
      en: "You create a custom tooltip page and must prepare it. Which three actions?",
    },
    options: [
      { fr: "Pour la page d'info-bulle, activer « Autoriser l'utilisation comme info-bulle ».", en: "For the tooltip page, set \"Allow use as tooltip\" to On." },
      { fr: "Pour la page cible, activer « Autoriser l'utilisation comme info-bulle ».", en: "For the target page, set \"Allow use as tooltip\" to On." },
      { fr: "Configurer des filtres sur le visuel cible.", en: "Configure filters on the target visual." },
      { fr: "Pour la page d'info-bulle, configurer des filtres.", en: "For the tooltip page, configure filters." },
      { fr: "Ajouter et configurer des visuels sur la page d'info-bulle.", en: "Add and configure visuals on the tooltip page." },
    ],
    correctIndexes: [0, 3, 4],
    explanation: {
      fr: "Sur la page d'info-bulle : activer « Autoriser l'utilisation comme info-bulle », y ajouter/configurer des visuels, et définir les filtres appropriés. C'est cette page (pas la page cible) qu'on prépare.",
      en: "On the tooltip page: enable \"Allow use as tooltip\", add/configure visuals, and set the appropriate filters. It's this page (not the target) you prepare.",
    },
  },
  {
    id: "pl300-106",
    question: {
      fr: "Votre locataire Power BI autorise l'export de données. Vous devez empêcher les consommateurs de ReportA d'exporter des données depuis les visuels. Quelles deux actions (chacune est une solution complète) ?",
      en: "Your Power BI tenant allows exporting data. You must prevent ReportA consumers from exporting any data from visuals. Which two actions (each a complete solution)?",
    },
    options: [
      { fr: "Dans Power BI Desktop, modifier les paramètres du rapport (Report settings).", en: "In Power BI Desktop, modify the Report settings." },
      { fr: "Dans Power BI Desktop, modifier les paramètres de chargement des données.", en: "In Power BI Desktop, modify the Data Load settings." },
      { fr: "Dans le service Power BI, modifier les autorisations du dataset.", en: "In the Power BI service, modify the dataset permissions." },
      { fr: "Dans le service Power BI, modifier les paramètres du rapport.", en: "In the Power BI service, modify the Report settings." },
    ],
    correctIndexes: [0, 3],
    explanation: {
      fr: "Le paramètre d'export se règle dans les paramètres du rapport, que ce soit depuis Power BI Desktop ou depuis le service : chacune désactive l'export des données des visuels.",
      en: "The export setting lives in the Report settings, reachable from either Power BI Desktop or the service: each disables data export from the visuals.",
    },
  },
  {
    id: "pl300-107",
    question: {
      fr: "Un rapport sera affiché sur un écran vertical. Vous devez maximiser la surface d'écran utilisée par le rapport. Que faites-vous ?",
      en: "A report will be shown on a vertical display. You must maximize the screen area used by the report. What should you do?",
    },
    options: [
      { fr: "Dans le fond du canevas, configurer l'ajustement de l'image.", en: "In the Canvas background, configure Image fit." },
      { fr: "Dans les paramètres du canevas, définir une largeur et une hauteur personnalisées.", en: "In Canvas settings, set a custom width and height." },
      { fr: "Sélectionner Personnaliser les visuels.", en: "Select Personalize visuals." },
      { fr: "Dans le service, activer le volet Pages.", en: "In the service, enable the Pages pane." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Définir des dimensions de canevas personnalisées (par ex. plus hautes que larges) adapte la page au format vertical de l'écran et exploite toute la surface disponible.",
      en: "Setting custom canvas dimensions (e.g. taller than wide) fits the page to the vertical display and uses the whole available area.",
    },
  },
  {
    id: "pl300-108",
    question: {
      fr: "Le dataset Finance est hébergé dans un espace de travail ; l'équipe finance n'a aucun rôle d'espace de travail. Vous devez lui permettre d'analyser Finance dans Excel. Que faites-vous ?",
      en: "The Finance dataset is hosted in a workspace; the finance team has no workspace role. You must let them analyze Finance in Excel. What should you do?",
    },
    options: [
      { fr: "Accorder à l'équipe finance l'autorisation Build sur le dataset Finance.", en: "Grant the finance team Build permission on the Finance dataset." },
      { fr: "Fournir un classeur Excel connecté au dataset Finance.", en: "Provide an Excel workbook connected to the Finance dataset." },
      { fr: "Créer un rôle RLS et y ajouter l'équipe finance.", en: "Create an RLS role and add the finance team to it." },
      { fr: "Accorder l'autorisation Write sur le dataset Finance.", en: "Grant Write permission on the Finance dataset." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "L'autorisation Build (Générer) sur le dataset est requise pour se connecter et analyser les données dans Excel (Analyser dans Excel), sans donner de droits d'édition.",
      en: "The Build permission on the dataset is what's required to connect and analyze data in Excel (Analyze in Excel), without granting edit rights.",
    },
  },
  {
    id: "pl300-109",
    question: {
      fr: "Une mesure d'un visuel doit afficher toutes les valeurs à deux décimales et les valeurs négatives en rouge entre parenthèses. Quelles deux actions ?",
      en: "A visual's measure must display all values to two decimals and negative values in red within parentheses. Which two actions?",
    },
    options: [
      { fr: "Appliquer une mise en forme conditionnelle sur la couleur d'arrière-plan.", en: "Apply conditional formatting to the background color." },
      { fr: "Configurer la mesure avec un format personnalisé.", en: "Configure the measure with a custom format." },
      { fr: "Appliquer une mise en forme conditionnelle sur la couleur de police.", en: "Apply conditional formatting to the font color." },
      { fr: "Régler le nombre de décimales de la valeur sur 2.", en: "Set the value's decimal places to 2." },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "Un format personnalisé sur la mesure gère les deux décimales et les parenthèses pour les négatifs ; la mise en forme conditionnelle sur la couleur de police colore en rouge les valeurs négatives.",
      en: "A custom format on the measure handles the two decimals and parentheses for negatives; conditional formatting on the font color turns negative values red.",
    },
  },
  {
    id: "pl300-110",
    question: {
      fr: "Un dataset peu utilisé s'actualise toutes les heures. Vous recevez une notification indiquant que l'actualisation a été désactivée pour inactivité. Quelles deux actions relancent l'actualisation planifiée (chacune est une solution complète) ?",
      en: "A rarely-used dataset refreshes hourly. You get a notification that refresh was disabled due to inactivity. Which two actions resume the scheduled refresh (each a complete solution)?",
    },
    options: [
      { fr: "Activer la mise en cache des requêtes pour le dataset.", en: "Enable query caching for the dataset." },
      { fr: "Importer le dataset dans Excel.", en: "Import the dataset into Excel." },
      { fr: "Dans le service, ouvrir un tableau de bord qui utilise le dataset.", en: "In the service, open a dashboard that uses the dataset." },
      { fr: "Dans le service, ouvrir un rapport qui utilise le dataset.", en: "In the service, open a report that uses the dataset." },
      { fr: "Exécuter get-powerbireport en PowerShell.", en: "Run get-powerbireport in PowerShell." },
    ],
    correctIndexes: [2, 3],
    explanation: {
      fr: "L'actualisation est suspendue faute d'interaction. Ouvrir un rapport ou un tableau de bord qui consomme le dataset compte comme activité et réactive l'actualisation planifiée.",
      en: "Refresh is paused for lack of interaction. Opening a report or dashboard that consumes the dataset counts as activity and re-enables the scheduled refresh.",
    },
  },
  {
    id: "pl300-111",
    question: {
      fr: "Un fichier PBIX importe des tables depuis une base Azure SQL. Les données migrent vers une autre base Azure SQL. Vous devez changer les connexions du PBIX avec un minimum d'effort. Que faites-vous ?",
      en: "A PBIX file imports tables from an Azure SQL database. The data is migrating to another Azure SQL database. You must change the PBIX connections with minimal effort. What should you do?",
    },
    options: [
      { fr: "Dans Power Query, créer de nouvelles requêtes.", en: "In Power Query, create new queries." },
      { fr: "Dans Power Query, modifier la source de chaque requête.", en: "In Power Query, modify the source of each query." },
      { fr: "Créer un PBIT, l'ouvrir et changer les sources à l'invite.", en: "Create a PBIT, open it and change the sources when prompted." },
      { fr: "Modifier les paramètres de la source de données (Data source settings).", en: "Modify the Data source settings." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Les paramètres de source de données permettent de remplacer le serveur/base en une seule opération pour toutes les requêtes qui l'utilisent, contrairement à l'édition requête par requête.",
      en: "Data source settings let you change the server/database once for every query using it, unlike editing query by query.",
    },
  },
  {
    id: "pl300-112",
    question: {
      fr: "Un rapport report1 est basé sur un dataset partagé. Vous devez minimiser le risque d'exfiltration de données pour report1 sans affecter les autres rapports. Que faites-vous ?",
      en: "A report report1 is based on a shared dataset. You must minimize data exfiltration risk for report1 without affecting other reports. What should you do?",
    },
    options: [
      { fr: "Désactiver le partage du tableau de bord et la création de contenu sur le dataset.", en: "Clear dashboard sharing and building new content on the dataset." },
      { fr: "Appliquer la RLS au dataset partagé.", en: "Apply RLS to the shared dataset." },
      { fr: "Autoriser l'export des données résumées et sous-jacentes pour le rapport.", en: "Allow exporting summarized and underlying data for the report." },
      { fr: "Sélectionner « Ne pas autoriser l'export de données » dans les paramètres du rapport.", en: "Select \"Don't allow end users to export any data\" in the report settings." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Interdire tout export dans les paramètres du seul rapport report1 réduit le risque d'exfiltration sans toucher au dataset partagé ni aux autres rapports.",
      en: "Disallowing any export in report1's own settings reduces exfiltration risk without touching the shared dataset or other reports.",
    },
  },
  {
    id: "pl300-113",
    question: {
      fr: "Vous créez des visualisations basées sur un dataset importé. Vous devez autoriser l'export des données résumées mais interdire l'export des données sous-jacentes. Que faites-vous ?",
      en: "You create visualizations based on an imported dataset. You must allow export of summarized data but prevent export of underlying data. What should you do?",
    },
    options: [
      { fr: "Dans le service, configurer les autorisations du dataset.", en: "In the service, configure the dataset permissions." },
      { fr: "Dans Power BI Desktop, configurer le chargement des données du fichier.", en: "In Power BI Desktop, configure the file's Data Load settings." },
      { fr: "Dans Power BI Desktop, modifier les autorisations de la source de données.", en: "In Power BI Desktop, modify the data source permissions." },
      { fr: "Dans Power BI Desktop, configurer les paramètres du rapport du fichier courant.", en: "In Power BI Desktop, configure the current file's Report settings." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le contrôle du niveau d'export (résumé seulement vs sous-jacent) se règle dans les paramètres du rapport (Report settings) du fichier dans Power BI Desktop.",
      en: "The export-level control (summarized only vs underlying) is set in the file's Report settings in Power BI Desktop.",
    },
  },
  {
    id: "pl300-114",
    question: {
      fr: "Un rapport utilise la RLS. Vous devez confier la maintenance des membres RLS à une équipe sécurité réseau Azure, sans lui donner la capacité de gérer rapports, datasets ou tableaux de bord. Que faites-vous ?",
      en: "A report uses RLS. You must hand RLS membership maintenance to an Azure network security team without giving them the ability to manage reports, datasets or dashboards. What should you do?",
    },
    options: [
      { fr: "Accorder à l'équipe les autorisations Read et Build sur les datasets.", en: "Grant the team Read and Build permissions on the datasets." },
      { fr: "Configurer des instructions personnalisées pour la demande d'accès renvoyant vers l'équipe.", en: "Configure custom Request access instructions pointing to the team." },
      { fr: "Demander à l'équipe de créer des groupes de sécurité et configurer la RLS pour utiliser ces groupes.", en: "Have the team create security groups and configure RLS to use those groups." },
      { fr: "Ajouter l'équipe comme membres du rôle RLS.", en: "Add the team as members of the RLS role." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "En liant les rôles RLS à des groupes de sécurité Azure AD gérés par l'équipe réseau, celle-ci contrôle l'appartenance via les groupes sans obtenir aucun droit sur le contenu Power BI.",
      en: "Binding RLS roles to Azure AD security groups managed by the network team lets them control membership via the groups without any rights over Power BI content.",
    },
  },
  {
    id: "pl300-115",
    question: {
      fr: "Vous avez quatre régions de vente, chacune avec plusieurs managers, et une RLS liée à des groupes de sécurité mail. Un manager change de région. Vous devez qu'il voie les bonnes données. Que faites-vous ?",
      en: "You have four sales regions, each with multiple managers, and RLS tied to mail-enabled security groups. A manager moves to a different region. You must ensure they see the correct data. What should you do?",
    },
    options: [
      { fr: "Changer le type de licence Power BI du manager.", en: "Change the manager's Power BI license type." },
      { fr: "Dans Power BI Desktop, modifier le paramètre RLS des rapports.", en: "In Power BI Desktop, edit the RLS setting of the reports." },
      { fr: "Gérer les autorisations du dataset sous-jacent.", en: "Manage the underlying dataset permissions." },
      { fr: "Demander l'ajout du manager au bon groupe Azure Active Directory.", en: "Request that the manager be added to the correct Azure AD group." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Puisque les rôles RLS sont mappés à des groupes de sécurité, il suffit de déplacer le manager vers le groupe Azure AD de sa nouvelle région : la RLS suit automatiquement.",
      en: "Since RLS roles map to security groups, simply moving the manager to the new region's Azure AD group updates their access automatically.",
    },
  },
  {
    id: "pl300-116",
    question: {
      fr: "Un tableau de bord contient une carte affichant le total des ventes de l'année. Les utilisateurs ont le rôle Lecteur (Viewer) sur l'espace de travail. Un utilisateur veut recevoir chaque jour une notification du nombre affiché. Comment l'automatiser ?",
      en: "A dashboard has a card showing the year's total sales. Users have the Viewer role on the workspace. A user wants a daily notification of the number shown. How do you automate it?",
    },
    options: [
      { fr: "Créer un abonnement.", en: "Create a subscription." },
      { fr: "Créer une alerte de données.", en: "Create a data alert." },
      { fr: "Partager le tableau de bord avec l'utilisateur.", en: "Share the dashboard with the user." },
      { fr: "Mentionner l'utilisateur dans un commentaire.", en: "Tag the user in a comment." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Un abonnement envoie une capture programmée (quotidienne) par e-mail. Une alerte de données ne se déclenche qu'au franchissement d'un seuil, pas chaque jour de façon systématique.",
      en: "A subscription emails a scheduled (daily) snapshot. A data alert only fires when a threshold is crossed, not systematically every day.",
    },
  },
  {
    id: "pl300-117",
    question: {
      fr: "Workspace1 contient un dataset DS1 et un rapport RPT1. Un utilisateur veut créer un rapport à partir de DS1 et le publier dans un autre espace de travail. Vous devez lui donner l'accès minimal nécessaire. Que faites-vous ?",
      en: "Workspace1 contains a dataset DS1 and a report RPT1. A user wants to create a report from DS1 and publish it to another workspace. You must grant the minimal access needed. What should you do?",
    },
    options: [
      { fr: "Ajouter l'utilisateur comme Lecteur de Workspace1.", en: "Add the user as a Viewer of Workspace1." },
      { fr: "Accorder l'autorisation Build sur DS1 à l'utilisateur.", en: "Grant the Build permission on DS1 to the user." },
      { fr: "Partager RPT1 avec l'utilisateur.", en: "Share RPT1 with the user." },
      { fr: "Ajouter l'utilisateur comme membre de Workspace1.", en: "Add the user as a member of Workspace1." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "L'autorisation Build sur le dataset suffit pour créer un nouveau rapport basé sur DS1 et le publier ailleurs, sans donner d'accès complet à l'espace de travail.",
      en: "The Build permission on the dataset is enough to create a new report from DS1 and publish it elsewhere, without granting full workspace access.",
    },
  },
  {
    id: "pl300-118",
    question: {
      fr: "Vous publiez un dataset avec un rôle RLS nommé HR. Vous devez garantir que la RLS s'applique aux membres de l'équipe HR quand ils consultent les rapports. Que faites-vous ?",
      en: "You publish a dataset with an RLS role named HR. You must ensure RLS applies to the HR team members when they view reports. What should you do?",
    },
    options: [
      { fr: "Depuis powerbi.com, ajouter les utilisateurs au rôle HR du dataset.", en: "From powerbi.com, add the users to the dataset's HR role." },
      { fr: "Depuis powerbi.com, partager le dataset avec l'équipe HR.", en: "From powerbi.com, share the dataset with the HR team." },
      { fr: "Depuis Power BI Desktop, modifier les paramètres RLS.", en: "From Power BI Desktop, change the RLS settings." },
      { fr: "Depuis Power BI Desktop, importer une table des membres HR.", en: "From Power BI Desktop, import a table of HR members." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "On définit le rôle et son filtre dans Desktop, mais l'affectation des utilisateurs au rôle RLS se fait dans le service (powerbi.com), sous la sécurité du dataset.",
      en: "You define the role and filter in Desktop, but assigning users to the RLS role is done in the service (powerbi.com), under the dataset's security.",
    },
  },
  {
    id: "pl300-119",
    question: {
      fr: "Un dataset importé a un rôle RLS dynamique Sales filtrant par vendeur ; chaque vendeur ne doit voir que sa région. Une vendeuse pense devoir voir davantage de données. Vous devez vérifier ce qu'elle voit réellement. Que faites-vous ?",
      en: "An imported dataset has a dynamic RLS role Sales filtering by salesperson; each sees only their region. A saleswoman believes she should see more data. You must verify what she actually sees. What should you do?",
    },
    options: [
      { fr: "Utiliser « Tester en tant que rôle » pour voir les données avec le compte de la vendeuse.", en: "Use \"Test as role\" to view data as the saleswoman's user account." },
      { fr: "Utiliser « Tester en tant que rôle » pour voir les données en tant que rôle Sales.", en: "Use \"Test as role\" to view data as the Sales role." },
      { fr: "Lui demander d'ouvrir le rapport dans Power BI Desktop.", en: "Have her open the report in Power BI Desktop." },
      { fr: "Filtrer les données pour reproduire la logique du filtre.", en: "Filter the data to match the filter logic." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Avec une RLS dynamique (basée sur USERNAME), il faut tester « en tant que rôle » ET en usurpant le compte précis de l'utilisatrice pour reproduire exactement ce qu'elle voit.",
      en: "With dynamic RLS (based on USERNAME), you must test \"as role\" AND impersonate her specific account to reproduce exactly what she sees.",
    },
  },
  {
    id: "pl300-120",
    question: {
      fr: "Vous avez plusieurs tableaux de bord. Vous devez faire en sorte que, en parcourant powerbi.com, les utilisateurs voient quels tableaux de bord contiennent des données personnelles (PII), avec un minimum de configuration et d'impact sur le design. Qu'utilisez-vous ?",
      en: "You have several dashboards. You must let users, when browsing powerbi.com, see which dashboards contain Personally Identifiable Information (PII), with minimal configuration and design impact. What do you use?",
    },
    options: [
      { fr: "Les étiquettes de confidentialité Microsoft Information Protection.", en: "Microsoft Information Protection sensitivity labels." },
      { fr: "Des tuiles.", en: "Tiles." },
      { fr: "Des commentaires.", en: "Comments." },
      { fr: "Des groupes Active Directory.", en: "Active Directory groups." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Les étiquettes de confidentialité (sensitivity labels) s'affichent directement dans la liste des contenus, signalant les PII sans modifier le design des tableaux de bord.",
      en: "Sensitivity labels appear directly in the content list, flagging PII without altering the dashboards' design.",
    },
  },
  {
    id: "pl300-121",
    question: {
      fr: "Vous avez un dataset et un rapport connecté. Vous devez permettre aux utilisateurs d'analyser les données dans Excel uniquement en se connectant directement au dataset. Vous leur accordez l'autorisation Build. Que faites-vous ensuite ?",
      en: "You have a dataset and a connected report. You must let users analyze data in Excel only by connecting directly to the dataset. You grant them the Build permission. What next?",
    },
    options: [
      { fr: "Certifier le dataset utilisé par le rapport.", en: "Certify the dataset used by the report." },
      { fr: "Changer l'interaction visuelle par défaut du rapport.", en: "Change the report's default visual interaction." },
      { fr: "Pour le rapport, régler l'export des données sur Aucun.", en: "For the report, set Export data to None." },
      { fr: "Pour le rapport, régler l'export sur données résumées, avec disposition et données sous-jacentes.", en: "For the report, set Export to summarized, with layout and underlying data." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Régler l'export du rapport sur Aucun empêche d'exporter depuis le rapport : les utilisateurs, dotés de l'autorisation Build, ne peuvent analyser que via la connexion directe au dataset dans Excel.",
      en: "Setting the report's Export to None blocks exporting from the report: users, holding Build, can only analyze via a direct dataset connection in Excel.",
    },
  },
  {
    id: "pl300-122",
    question: {
      fr: "Vous devez donner à un utilisateur la capacité de créer un tableau de bord réutilisant les visuels des rapports d'un espace de travail. Que faites-vous ?",
      en: "You must give a user the ability to create a dashboard reusing the visuals from a workspace's reports. What should you do?",
    },
    options: [
      { fr: "Créer un rôle RLS et y ajouter l'utilisateur.", en: "Create an RLS role and add the user to it." },
      { fr: "Partager les rapports avec l'utilisateur.", en: "Share the reports with the user." },
      { fr: "Accorder l'autorisation Read sur les datasets.", en: "Grant Read permission on the datasets." },
      { fr: "Ajouter l'utilisateur comme membre de l'espace de travail.", en: "Add the user as a member of the workspace." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Créer un tableau de bord en épinglant des visuels de rapports existants nécessite des droits d'édition dans l'espace de travail : le rôle Membre les fournit, contrairement au rôle Lecteur.",
      en: "Creating a dashboard by pinning visuals from existing reports requires edit rights in the workspace: the Member role grants them, unlike Viewer.",
    },
  },
  {
    id: "pl300-123",
    question: {
      fr: "Vous devez créer une colonne calculée affichant le mois (par ex. « Jan 2021 ») selon les exigences de reporting. Quelle expression DAX ?",
      en: "You must create a calculated column showing the month (e.g. \"Jan 2021\") per reporting requirements. Which DAX expression?",
    },
    options: [
      { fr: "FORMAT('Date'[date], \"MMM YYYY\")", en: "FORMAT('Date'[date], \"MMM YYYY\")" },
      { fr: "FORMAT('Date'[date_id], \"MMM \") & \" \" & FORMAT('Date'[year], \"#\")", en: "FORMAT('Date'[date_id], \"MMM \") & \" \" & FORMAT('Date'[year], \"#\")" },
      { fr: "FORMAT('Date'[date_id], \"MMM YYYY\")", en: "FORMAT('Date'[date_id], \"MMM YYYY\")" },
      { fr: "FORMAT('Date'[date], \"M YY\")", en: "FORMAT('Date'[date], \"M YY\")" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "FORMAT sur la vraie colonne de date avec le motif \"MMM YYYY\" produit « Jan 2021 ». Les autres utilisent une clé (date_id) ou un format incorrect.",
      en: "FORMAT on the actual date column with the \"MMM YYYY\" pattern yields \"Jan 2021\". The others use a key (date_id) or the wrong format.",
    },
  },
  {
    id: "pl300-124",
    question: {
      fr: "Vous devez minimiser la taille du dataset tout en respectant les exigences du rapport. Que faites-vous ?",
      en: "You must minimize the dataset size while meeting the report requirements. What should you do?",
    },
    options: [
      { fr: "Grouper la table Categories par la colonne CategoryID.", en: "Group the Categories table by the CategoryID column." },
      { fr: "Supprimer la colonne QuantityPerUnit de la table Products.", en: "Remove the QuantityPerUnit column from the Products table." },
      { fr: "Filtrer les produits abandonnés à l'import de la table Products.", en: "Filter out discontinued products while importing Products." },
      { fr: "Changer OrderID de la table Orders en type Texte.", en: "Change OrderID in the Orders table to Text type." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Supprimer une colonne inutilisée (QuantityPerUnit) réduit la taille sans perdre d'information nécessaire aux rapports. Filtrer des produits perdrait des données ; changer un type numérique en texte alourdirait le modèle.",
      en: "Removing an unused column (QuantityPerUnit) shrinks size without losing data the reports need. Filtering products would lose data; changing a numeric key to text would bloat the model.",
    },
  },
  {
    id: "pl300-125",
    question: {
      fr: "Vous devez concevoir le modèle pour analyser les commandes par date de commande et par date d'expédition. Que faites-vous dans Power BI Desktop ?",
      en: "You must design the model to analyze orders by order date and by shipped date. What should you do in Power BI Desktop?",
    },
    options: [
      { fr: "Ajouter une table de dates ; relation active vers OrderDate et relation inactive vers ShippedDate.", en: "Add a date table; active relationship to OrderDate and inactive relationship to ShippedDate." },
      { fr: "Ajouter dans Orders des colonnes de trimestre et mois calendaires de OrderDate.", en: "Add columns to Orders for the calendar quarter and month of OrderDate." },
      { fr: "Utiliser l'option Date/heure automatique lors de la création des rapports.", en: "Use the Auto date/time option when creating reports." },
      { fr: "Ajouter par DAX des colonnes de trimestre/mois pour OrderDate et ShippedDate.", en: "Add DAX columns for quarter/month of both OrderDate and ShippedDate." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une table de dates unique avec une relation active (OrderDate) et une relation inactive (ShippedDate, activable via USERELATIONSHIP) est le modèle de « role-playing dimension » recommandé.",
      en: "A single date table with an active relationship (OrderDate) and an inactive one (ShippedDate, activated via USERELATIONSHIP) is the recommended role-playing dimension pattern.",
    },
  },
  {
    id: "pl300-126",
    question: {
      fr: "Vous devez permettre aux analystes de créer rapidement des explorations descendantes (drill-down) de l'unité opérationnelle vers le produit dans un visuel. Que créez-vous ?",
      en: "You must let analysts quickly build drill-downs from business unit to product in a visual. What should you create?",
    },
    options: [
      { fr: "Un groupe.", en: "A group." },
      { fr: "Une table calculée.", en: "A calculated table." },
      { fr: "Une hiérarchie.", en: "A hierarchy." },
      { fr: "Une colonne calculée.", en: "A calculated column." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Une hiérarchie (unité opérationnelle → produit) permet l'exploration descendante directe dans les visuels, sans configuration supplémentaire.",
      en: "A hierarchy (business unit → product) enables direct drill-down in visuals, with no extra configuration.",
    },
  },
  {
    id: "pl300-127",
    question: {
      fr: "Vous devez créer un rapport « Livraison à temps » incluant un visuel montrant le pourcentage de commandes en retard. Quel type de visualisation créez-vous ?",
      en: "You must create an \"On-Time Shipping\" report with a visual showing the percentage of late orders. Which visualization type should you create?",
    },
    options: [
      { fr: "Un graphique en secteurs (camembert).", en: "A pie chart." },
      { fr: "Un nuage de points.", en: "A scatterplot." },
      { fr: "Un histogramme (bar chart).", en: "A bar chart." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Un histogramme compare clairement le pourcentage de commandes en retard entre catégories/périodes ; un camembert est moins lisible pour comparer plusieurs valeurs et un nuage de points sert aux corrélations.",
      en: "A bar chart clearly compares the percentage of late orders across categories/periods; a pie is poor for comparing many values and a scatterplot is for correlations.",
    },
  },
  {
    id: "pl300-128",
    question: {
      fr: "Vous devez garantir que les données sont mises à jour selon les exigences du rapport, avec un minimum de configuration. La source est un service cloud. Que faites-vous ?",
      en: "You must ensure data is updated per the report requirements with minimal configuration. The source is a cloud service. What should you do?",
    },
    options: [
      { fr: "Depuis chaque rapport, sélectionner Actualiser les visuels.", en: "From each report, select Refresh visuals." },
      { fr: "Depuis Power BI Desktop, télécharger le PBIX et actualiser.", en: "From Power BI Desktop, download the PBIX and refresh." },
      { fr: "Configurer une actualisation planifiée sans passerelle de données locale.", en: "Configure a scheduled refresh without an on-premises data gateway." },
      { fr: "Configurer une actualisation planifiée avec une passerelle de données locale.", en: "Configure a scheduled refresh with an on-premises data gateway." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Pour une source cloud, une actualisation planifiée sans passerelle suffit ; la passerelle locale n'est nécessaire que pour des sources sur site.",
      en: "For a cloud source, a scheduled refresh without a gateway suffices; the on-premises gateway is only needed for on-premises sources.",
    },
  },
  {
    id: "pl300-129",
    question: {
      fr: "Vous devez déterminer le nombre minimal de datasets Power BI nécessaires pour prendre en charge des rapports ayant des besoins de rafraîchissement/latence différents (par ex. temps réel et importé). Combien ?",
      en: "You must determine the minimum number of Power BI datasets needed to support reports with different refresh/latency needs (e.g. real-time and imported). How many?",
    },
    options: [
      { fr: "Un seul dataset importé.", en: "A single imported dataset." },
      { fr: "Deux datasets importés.", en: "Two imported datasets." },
      { fr: "Deux datasets DirectQuery.", en: "Two DirectQuery datasets." },
      { fr: "Un seul dataset DirectQuery.", en: "A single DirectQuery dataset." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Des exigences de fraîcheur différentes imposent des modes/planifications distincts : deux datasets importés séparés permettent d'appliquer à chacun sa propre fréquence d'actualisation.",
      en: "Different freshness requirements demand distinct modes/schedules: two separate imported datasets let each have its own refresh cadence.",
    },
  },
  {
    id: "pl300-130",
    question: {
      fr: "Vous devez ajouter à un visuel un élément qui projette la tendance future de la série. Que faites-vous ?",
      en: "You must add to a visual an element that projects the future trend of the series. What should you add?",
    },
    options: [
      { fr: "Une mesure.", en: "A measure." },
      { fr: "Une ligne moyenne.", en: "An average line." },
      { fr: "Une ligne de tendance.", en: "A trendline." },
      { fr: "Une prévision (forecast).", en: "A forecast." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "La prévision (forecast) du volet Analyses projette les valeurs futures avec un intervalle de confiance, contrairement à la ligne de tendance qui ne fait qu'ajuster les données existantes.",
      en: "The Analytics pane's forecast projects future values with a confidence interval, unlike a trendline which only fits existing data.",
    },
  },
  {
    id: "pl300-131",
    question: {
      fr: "Un tableau de bord comporte des tuiles épinglées depuis un seul rapport. Vous devez modifier son apparence (couleurs/fond) sans changer le rapport. Que faites-vous ?",
      en: "A dashboard has tiles pinned from a single report. You must change its appearance (colors/background) without changing the report. What should you do?",
    },
    options: [
      { fr: "Changer le thème du rapport.", en: "Change the report theme." },
      { fr: "Changer le thème du tableau de bord.", en: "Change the dashboard theme." },
      { fr: "Modifier les détails de chaque tuile.", en: "Edit each tile's details." },
      { fr: "Créer un fichier CSS personnalisé.", en: "Create a custom CSS file." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le thème du tableau de bord modifie l'apparence globale (fond, couleurs des tuiles) au niveau du tableau de bord, indépendamment du rapport source.",
      en: "The dashboard theme changes the overall look (background, tile colors) at the dashboard level, independently of the source report.",
    },
  },
  {
    id: "pl300-132",
    question: {
      fr: "Vous devez modifier l'apparence d'un tableau de bord pour obtenir un rendu personnalisé précis (couleurs de marque). Que faites-vous ?",
      en: "You must change a dashboard's appearance to a precise custom look (brand colors). What should you do?",
    },
    options: [
      { fr: "Créer et appliquer un thème de tableau de bord personnalisé.", en: "Create and apply a custom dashboard theme." },
      { fr: "Changer les couleurs des visuels dans le rapport.", en: "Change the visuals' colors in the report." },
      { fr: "Appliquer le thème sombre.", en: "Apply the Dark theme." },
      { fr: "Charger une image capturée du tableau de bord.", en: "Upload a snapshot image of the dashboard." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Un thème de tableau de bord personnalisé permet de définir précisément les couleurs (marque) appliquées à l'ensemble du tableau de bord.",
      en: "A custom dashboard theme lets you precisely define the (brand) colors applied across the whole dashboard.",
    },
  },
  {
    id: "pl300-133",
    question: {
      fr: "Vous devez créer un thème Power BI réutilisable dans plusieurs rapports, incluant la charte (taille de police, couleurs, mise en forme des histogrammes). Que faites-vous ?",
      en: "You must create a Power BI theme reusable across multiple reports, including branding (font size, colors, bar chart formatting). What should you do?",
    },
    options: [
      { fr: "Dans Power BI Desktop, personnaliser le thème actuel.", en: "In Power BI Desktop, customize the current theme." },
      { fr: "Dans Power BI Desktop, utiliser un thème de rapport intégré.", en: "In Power BI Desktop, use a built-in report theme." },
      { fr: "Créer un thème en fichier PBIVIZ et l'importer.", en: "Create a theme as a PBIVIZ file and import it." },
      { fr: "Créer un thème en fichier JSON et l'importer dans Power BI Desktop.", en: "Create a theme as a JSON file and import it into Power BI Desktop." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Un thème JSON encapsule polices, couleurs et mise en forme, et s'importe dans n'importe quel rapport : c'est le format réutilisable standard. Le PBIVIZ sert aux visuels personnalisés, pas aux thèmes.",
      en: "A JSON theme captures fonts, colors and formatting and imports into any report: the standard reusable format. PBIVIZ is for custom visuals, not themes.",
    },
  },
  {
    id: "pl300-134",
    question: {
      fr: "Une page contient deux courbes et un histogramme. Vous devez permettre aux utilisateurs, sur les trois visuels, de changer les mesures, le type de visualisation et d'ajouter une légende, avec un minimum d'effort. Que faites-vous ?",
      en: "A page has two line charts and a bar chart. You must let users, on all three visuals, switch measures, change visualization type and add a legend, with minimal effort. What should you do?",
    },
    options: [
      { fr: "Créer un signet pour chaque combinaison acceptable dans l'histogramme.", en: "Create a bookmark for each acceptable combination in the bar chart." },
      { fr: "Modifier les interactions entre les trois visuels.", en: "Edit the interactions between the three visuals." },
      { fr: "Activer la personnalisation pour le rapport.", en: "Enable personalization for the report." },
      { fr: "Activer la personnalisation pour chaque visuel.", en: "Enable personalization for each visual." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Activer la personnalisation au niveau du rapport (Personnaliser les visuels) laisse les utilisateurs changer mesures, type et légende sur tous les visuels concernés, sans créer de signets ni configurer chaque visuel un à un.",
      en: "Enabling personalization at the report level (Personalize visuals) lets users change measures, type and legend on all applicable visuals, without bookmarks or configuring each visual individually.",
    },
  },
  {
    id: "pl300-135",
    question: {
      fr: "Vous devez créer une mesure DAX renvoyant les soldes de fin de période dans des rapports de bilan (balance sheet). Quelle expression utiliser ?",
      en: "You must create a DAX measure returning end-of-period balances in balance sheet reports. Which expression should you use?",
    },
    options: [
      { fr: "CALCULATE(SUM(BalanceSheet[BalanceAmount]), LASTDATE('Date'[Date]))", en: "CALCULATE(SUM(BalanceSheet[BalanceAmount]), LASTDATE('Date'[Date]))" },
      { fr: "CALCULATE(SUM(BalanceSheet[BalanceAmount]), DATESQTD('Date'[Date]))", en: "CALCULATE(SUM(BalanceSheet[BalanceAmount]), DATESQTD('Date'[Date]))" },
      { fr: "FIRSTNONBLANK('Date'[Date], SUM(BalanceSheet[BalanceAmount]))", en: "FIRSTNONBLANK('Date'[Date], SUM(BalanceSheet[BalanceAmount]))" },
      { fr: "CALCULATE(MAX(BalanceSheet[BalanceAmount]), LASTDATE('Date'[Date]))", en: "CALCULATE(MAX(BalanceSheet[BalanceAmount]), LASTDATE('Date'[Date]))" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Un solde est une mesure semi-additive : on somme les montants à la dernière date de la période avec CALCULATE(SUM(...), LASTDATE(...)). MAX renverrait la plus grande valeur, pas le solde de clôture correct.",
      en: "A balance is a semi-additive measure: sum the amounts at the period's last date using CALCULATE(SUM(...), LASTDATE(...)). MAX would return the largest value, not the correct closing balance.",
    },
  },
];
