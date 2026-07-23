import type { Question } from "./types";

/**
 * PL-300 questions rebuilt from the exam's image-based items (drag-and-drop and
 * hotspot). The original PDF renders these as pictures, so we reconstruct them as
 * interactive questions:
 *  - "match": drag DAX expressions / options from a shared pool onto labeled targets.
 *  - "hotspot": pick the correct option in each dropdown of an answer area.
 * Explanations are authored to reflect the officially correct Power BI behavior.
 */
export const PL300_IMAGE_QUESTIONS: Question[] = [
  {
    id: "pl300-img-1",
    type: "match",
    question: {
      fr: "Un modèle Power BI contient les tables Products et Sales (relation un-à-plusieurs). Un rapport possède un filtre de niveau rapport sur Products. Vous devez créer une mesure renvoyant le pourcentage des ventes totales pour chaque produit, en respectant le filtre de niveau rapport lors du calcul du total. Complétez la mesure DAX :\n\nPercent of Product Sales =\nVAR ProductSales = SUM('Sales'[Sales])\nVAR AllSales = ① ( SUM('Sales'[Sales]), ② ('Products'[Product]) )\nRETURN DIVIDE(ProductSales, AllSales)",
      en: "A Power BI model contains the Products and Sales tables (one-to-many relationship). A report has a report-level filter on Products. You must create a measure returning the percent of total sales for each product, honoring the report-level filter when computing the total. Complete the DAX measure:\n\nPercent of Product Sales =\nVAR ProductSales = SUM('Sales'[Sales])\nVAR AllSales = ① ( SUM('Sales'[Sales]), ② ('Products'[Product]) )\nRETURN DIVIDE(ProductSales, AllSales)",
    },
    pool: [
      { fr: "ALL", en: "ALL" },
      { fr: "ALLSELECTED", en: "ALLSELECTED" },
      { fr: "CALCULATE", en: "CALCULATE" },
      { fr: "FILTER", en: "FILTER" },
      { fr: "SELECTEDVALUE", en: "SELECTEDVALUE" },
    ],
    targets: [
      { label: { fr: "① (calcule AllSales)", en: "① (computes AllSales)" }, correctPoolIndex: 2 },
      { label: { fr: "② (avant 'Products'[Product])", en: "② (before 'Products'[Product])" }, correctPoolIndex: 3 },
    ],
    explanation: {
      fr: "CALCULATE recalcule la somme dans un contexte de filtre modifié ; FILTER('Products'[Product]) recouvre le total sur tous les produits tout en conservant le filtre de niveau rapport (contrairement à ALL, qui l'ignorerait).",
      en: "CALCULATE recomputes the sum under a modified filter context; FILTER('Products'[Product]) re-expands the total across products while preserving the report-level filter (unlike ALL, which would ignore it).",
    },
  },
  {
    id: "pl300-img-2",
    type: "match",
    question: {
      fr: "Un modèle contient les tables Country, Sales et Human Resources. La table Country a les colonnes Country, Manager et Email (ex. USA / CFO / cfo@msn.com). Vous créez des rôles RLS. Exigences : chaque manager ne voit que les données de son pays (rôle Manager) ; le CFO ne doit voir aucune donnée RH (rôle CFO). Faites glisser l'expression de filtre de table correcte vers chaque cible.",
      en: "A model contains the Country, Sales and Human Resources tables. The Country table has columns Country, Manager and Email (e.g. USA / CFO / cfo@msn.com). You create RLS roles. Requirements: each manager sees only their own country's data (Manager role); the CFO must see no HR data (CFO role). Drag the correct table-filter expression onto each target.",
    },
    pool: [
      { fr: "[Country] = \"USA\"", en: "[Country] = \"USA\"" },
      { fr: "[Email] = userprincipalname()", en: "[Email] = userprincipalname()" },
      { fr: "[Manager] = \"CFO\"", en: "[Manager] = \"CFO\"" },
      { fr: "False()", en: "False()" },
      { fr: "True()", en: "True()" },
    ],
    targets: [
      { label: { fr: "Country (rôle Manager) :", en: "Country (Manager role):" }, correctPoolIndex: 1 },
      { label: { fr: "Human Resources (rôle CFO) :", en: "Human Resources (CFO role):" }, correctPoolIndex: 3 },
    ],
    explanation: {
      fr: "Sur Country, [Email] = userprincipalname() est un filtre dynamique : chaque manager connecté ne voit que la ligne de son pays, qui se propage à Sales et Human Resources. Pour le rôle CFO, False() sur Human Resources bloque toutes les lignes RH.",
      en: "On Country, [Email] = userprincipalname() is a dynamic filter: each signed-in manager sees only their country's row, which propagates to Sales and Human Resources. For the CFO role, False() on Human Resources blocks every HR row.",
    },
  },
  {
    id: "pl300-img-3",
    type: "match",
    question: {
      fr: "Dans l'éditeur Power Query, vous avez trois requêtes : ProductCategory, ProductSubCategory et Product. Chaque Product a une ProductSubCategory, mais toutes les ProductSubCategory n'ont pas de ProductCategory parente. Vous devez fusionner les trois en une seule requête avec les meilleures performances. Choisissez le type de jointure pour chaque fusion.",
      en: "In Power Query Editor you have three queries: ProductCategory, ProductSubCategory and Product. Every Product has a ProductSubCategory, but not every ProductSubCategory has a parent ProductCategory. You must merge the three into a single query with the best performance. Choose the join kind for each merge.",
    },
    pool: [
      { fr: "Full outer", en: "Full outer" },
      { fr: "Inner", en: "Inner" },
      { fr: "Left anti", en: "Left anti" },
      { fr: "Left outer", en: "Left outer" },
      { fr: "Right anti", en: "Right anti" },
      { fr: "Right outer", en: "Right outer" },
    ],
    targets: [
      { label: { fr: "Product → ProductSubCategory :", en: "Product → ProductSubCategory:" }, correctPoolIndex: 1 },
      { label: { fr: "ProductSubCategory → ProductCategory :", en: "ProductSubCategory → ProductCategory:" }, correctPoolIndex: 3 },
    ],
    explanation: {
      fr: "Chaque Product ayant toujours une ProductSubCategory, une jointure Inner suffit (aucune ligne perdue). Comme toutes les sous-catégories n'ont pas de catégorie parente, une jointure Left outer conserve toutes les sous-catégories, y compris celles sans ProductCategory.",
      en: "Since every Product always has a ProductSubCategory, an Inner join suffices (no rows lost). Because not every subcategory has a parent category, a Left outer join keeps all subcategories, including those without a ProductCategory.",
    },
  },
  {
    id: "pl300-img-4",
    type: "hotspot",
    question: {
      fr: "Un modèle Power BI contient une table Stores avec les colonnes Store Name, Open Date, Status, State et City. Vous devez créer une colonne calculée Active Store Name : si Status = \"A\", renvoyer Store Name ; sinon, renvoyer Store Name préfixé de \"Inactive - \". Complétez l'expression DAX.",
      en: "A Power BI model has a Stores table with columns Store Name, Open Date, Status, State and City. You must create a calculated column Active Store Name: if Status = \"A\", return Store Name; otherwise return Store Name prefixed with \"Inactive - \". Complete the DAX expression.",
    },
    blanks: [
      {
        label: { fr: "Active Store Name =", en: "Active Store Name =" },
        options: [
          { fr: "IF", en: "IF" },
          { fr: "SWITCH", en: "SWITCH" },
          { fr: "TRUE", en: "TRUE" },
        ],
        correctIndex: 0,
      },
      {
        label: { fr: "([Status] = \"A\", [Store Name], \"Inactive - \"  ⬚  [Store Name])", en: "([Status] = \"A\", [Store Name], \"Inactive - \"  ⬚  [Store Name])" },
        options: [
          { fr: "&", en: "&" },
          { fr: "&&", en: "&&" },
          { fr: "+", en: "+" },
        ],
        correctIndex: 0,
      },
    ],
    explanation: {
      fr: "IF évalue la condition [Status]=\"A\" et renvoie l'une ou l'autre valeur. L'opérateur & concatène des chaînes en DAX : \"Inactive - \" & [Store Name]. (&& est un ET logique, + une addition numérique.)",
      en: "IF evaluates [Status]=\"A\" and returns one value or the other. The & operator concatenates strings in DAX: \"Inactive - \" & [Store Name]. (&& is logical AND, + is numeric addition.)",
    },
  },
  {
    id: "pl300-img-5",
    type: "hotspot",
    question: {
      fr: "Un modèle contient les tables Product (ProductCategory, ProductID, ProductName), Sales (InvoiceNumber, ProductID, SaleDate, SalesAmount, SalesQuantity) et Date, avec Product 1-* Sales et Date 1-* Sales. Vous devez créer une mesure comptant le nombre de catégories de produits ayant eu des ventes sur une période sélectionnée. Complétez l'expression DAX.",
      en: "A model contains Product (ProductCategory, ProductID, ProductName), Sales (InvoiceNumber, ProductID, SaleDate, SalesAmount, SalesQuantity) and Date, with Product 1-* Sales and Date 1-* Sales. You must create a measure counting the number of product categories that had sales in a selected period. Complete the DAX expression.",
    },
    blanks: [
      {
        label: { fr: "Product Categories Sold = CALCULATE(  ⬚ ,", en: "Product Categories Sold = CALCULATE(  ⬚ ," },
        options: [
          { fr: "DISTINCTCOUNT('Product'[ProductCategory])", en: "DISTINCTCOUNT('Product'[ProductCategory])" },
          { fr: "COUNT('Product'[ProductCategory])", en: "COUNT('Product'[ProductCategory])" },
          { fr: "DISTINCTCOUNT('Sales'[ProductID])", en: "DISTINCTCOUNT('Sales'[ProductID])" },
          { fr: "SUM('Sales'[SalesQuantity])", en: "SUM('Sales'[SalesQuantity])" },
        ],
        correctIndex: 0,
      },
      {
        label: { fr: "⬚  )", en: "⬚  )" },
        options: [
          { fr: "'Sales'", en: "'Sales'" },
          { fr: "'Product'", en: "'Product'" },
          { fr: "'Product'[ProductCategory]", en: "'Product'[ProductCategory]" },
          { fr: "'Date'", en: "'Date'" },
        ],
        correctIndex: 3,
      },
    ],
    explanation: {
      fr: "DISTINCTCOUNT('Product'[ProductCategory]) compte les catégories distinctes. Le second argument 'Date' propage le contexte de la table Sales (via la relation) pour ne compter que les catégories vendues sur la période sélectionnée.",
      en: "DISTINCTCOUNT('Product'[ProductCategory]) counts distinct categories. The second argument 'Date' carries the filter context through Sales (via the relationship) so only categories sold in the selected period are counted.",
    },
  },
  {
    id: "pl300-img-6",
    type: "hotspot",
    question: {
      fr: "La table Sales contient : ProductID, InvoiceNumber, OrderDate, ShipDate, SalesAmount, SalesQuantity, LastUpdated (date/heure), AuditID. Le modèle doit permettre : total des ventes par produit par mois de commande ; quantités par produit par jour de commande ; nombre de transactions par trimestre de commande. Pour chaque affirmation, indiquez si elle est vraie (Oui) ou fausse (Non).",
      en: "The Sales table contains: ProductID, InvoiceNumber, OrderDate, ShipDate, SalesAmount, SalesQuantity, LastUpdated (date/time), AuditID. The model must support: total sales by product by order month; quantities by product by order day; count of transactions by order quarter. For each statement, indicate whether it is true (Yes) or false (No).",
    },
    blanks: [
      {
        label: { fr: "Supprimer LastUpdated réduit la taille tout en gardant l'analyse possible.", en: "Removing LastUpdated reduces size while still supporting the analysis." },
        options: [
          { fr: "Oui", en: "Yes" },
          { fr: "Non", en: "No" },
        ],
        correctIndex: 0,
      },
      {
        label: { fr: "Supprimer ProductID réduit la taille tout en gardant l'analyse possible.", en: "Removing ProductID reduces size while still supporting the analysis." },
        options: [
          { fr: "Oui", en: "Yes" },
          { fr: "Non", en: "No" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "Supprimer ShipDate réduit la taille tout en gardant l'analyse possible.", en: "Removing ShipDate reduces size while still supporting the analysis." },
        options: [
          { fr: "Oui", en: "Yes" },
          { fr: "Non", en: "No" },
        ],
        correctIndex: 0,
      },
    ],
    explanation: {
      fr: "LastUpdated et ShipDate ne servent à aucune des analyses demandées (toutes basées sur OrderDate) : on peut les supprimer. ProductID est indispensable pour analyser « par produit » via la relation avec Product : le retirer casserait l'analyse.",
      en: "LastUpdated and ShipDate are used by none of the required analyses (all based on OrderDate), so they can be removed. ProductID is essential for the \"by product\" analysis through the relationship to Product: removing it would break the analysis.",
    },
  },
  {
    id: "pl300-img-7",
    type: "hotspot",
    question: {
      fr: "Vous planifiez un modèle avec les tables Sales, Date, Customer et SalesAggregate. Exigences d'actualisation : Customer quotidienne, Date tous les trois ans, Sales en quasi temps réel, SalesAggregate hebdomadaire. La solution doit minimiser les temps de chargement des visuels et charger les données selon ces exigences. Choisissez le mode de stockage de chaque table.",
      en: "You plan a model with the Sales, Date, Customer and SalesAggregate tables. Refresh requirements: Customer daily, Date every three years, Sales in near real time, SalesAggregate weekly. The solution must minimize visual load times and load data per those requirements. Choose the storage mode for each table.",
    },
    blanks: [
      {
        label: { fr: "Customer :", en: "Customer:" },
        options: [
          { fr: "DirectQuery", en: "DirectQuery" },
          { fr: "Dual", en: "Dual" },
          { fr: "Import", en: "Import" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "Date :", en: "Date:" },
        options: [
          { fr: "DirectQuery", en: "DirectQuery" },
          { fr: "Dual", en: "Dual" },
          { fr: "Import", en: "Import" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "Sales :", en: "Sales:" },
        options: [
          { fr: "DirectQuery", en: "DirectQuery" },
          { fr: "Dual", en: "Dual" },
          { fr: "Import", en: "Import" },
        ],
        correctIndex: 0,
      },
      {
        label: { fr: "SalesAggregate :", en: "SalesAggregate:" },
        options: [
          { fr: "DirectQuery", en: "DirectQuery" },
          { fr: "Dual", en: "Dual" },
          { fr: "Import", en: "Import" },
        ],
        correctIndex: 2,
      },
    ],
    explanation: {
      fr: "Sales exige le quasi temps réel → DirectQuery. SalesAggregate (hebdomadaire) → Import pour des visuels rapides. Customer et Date sont des dimensions partagées reliées à la fois à une table DirectQuery (Sales) et à une table Import (SalesAggregate) : le mode Dual leur permet de servir les deux efficacement.",
      en: "Sales needs near real time → DirectQuery. SalesAggregate (weekly) → Import for fast visuals. Customer and Date are shared dimensions related to both a DirectQuery table (Sales) and an Import table (SalesAggregate): Dual mode lets them serve both efficiently.",
    },
  },
  {
    id: "pl300-img-8",
    type: "hotspot",
    question: {
      fr: "Vous avez deux bases Azure SQL identiques. Pour chacune, vous créez une requête qui récupère la table Customer. Vous devez combiner les deux tables Customer en une seule, en minimisant la taille du modèle et en prenant en charge l'actualisation planifiée sur powerbi.com. Choisissez la bonne option pour chaque étape.",
      en: "You have two identical Azure SQL databases. For each, you create a query retrieving the Customer table. You must combine the two Customer tables into one, minimizing model size and supporting scheduled refresh on powerbi.com. Choose the correct option for each step.",
    },
    blanks: [
      {
        label: { fr: "Option pour combiner les tables Customer :", en: "Option to combine the Customer tables:" },
        options: [
          { fr: "Append Queries (Ajouter des requêtes)", en: "Append Queries" },
          { fr: "Append Queries as New (Ajouter comme nouvelles)", en: "Append Queries as New" },
          { fr: "Merge Queries (Fusionner des requêtes)", en: "Merge Queries" },
          { fr: "Merge Queries as New (Fusionner comme nouvelles)", en: "Merge Queries as New" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "Action sur les deux requêtes SQL d'origine :", en: "Action on the two original SQL queries:" },
        options: [
          { fr: "Supprimer les requêtes", en: "Delete the queries" },
          { fr: "Désactiver l'inclusion dans l'actualisation du rapport", en: "Disable including the query in report refresh" },
          { fr: "Désactiver le chargement de la requête dans le modèle", en: "Disable loading the query to the data model" },
          { fr: "Dupliquer les requêtes", en: "Duplicate the queries" },
        ],
        correctIndex: 2,
      },
    ],
    explanation: {
      fr: "« Append Queries as New » empile les lignes des deux tables Customer dans une nouvelle requête (les colonnes sont identiques). On garde les deux requêtes sources (nécessaires à l'actualisation planifiée) mais on désactive leur chargement dans le modèle pour minimiser sa taille.",
      en: "\"Append Queries as New\" stacks the rows of both Customer tables into a new query (columns are identical). The two source queries are kept (needed for scheduled refresh) but their loading to the model is disabled to minimize its size.",
    },
  },
  {
    id: "pl300-img-9",
    type: "match",
    question: {
      fr: "Vous avez une table Product avec les champs ID, Name, Color, Category et Total Sales. Vous devez créer une table calculée montrant uniquement les 8 produits ayant la plus grande valeur de Total Sales. Complétez l'expression DAX :\n\nTop 8 Products = ① ( 8, 'Product', 'Product'[Total Sales], ② )",
      en: "You have a Product table with fields ID, Name, Color, Category and Total Sales. You must create a calculated table showing only the 8 products with the highest Total Sales. Complete the DAX expression:\n\nTop 8 Products = ① ( 8, 'Product', 'Product'[Total Sales], ② )",
    },
    pool: [
      { fr: "ASC", en: "ASC" },
      { fr: "DESC", en: "DESC" },
      { fr: "RELATEDTABLE", en: "RELATEDTABLE" },
      { fr: "CALCULATETABLE", en: "CALCULATETABLE" },
      { fr: "MAXX", en: "MAXX" },
      { fr: "TOPN", en: "TOPN" },
    ],
    targets: [
      { label: { fr: "① (fonction)", en: "① (function)" }, correctPoolIndex: 5 },
      { label: { fr: "② (ordre de tri)", en: "② (sort order)" }, correctPoolIndex: 1 },
    ],
    explanation: {
      fr: "TOPN(8, 'Product', 'Product'[Total Sales], DESC) renvoie les 8 lignes ayant les plus grandes ventes. DESC trie du plus grand au plus petit pour obtenir le « top ».",
      en: "TOPN(8, 'Product', 'Product'[Total Sales], DESC) returns the 8 rows with the highest sales. DESC sorts from largest to smallest to get the \"top\".",
    },
  },
  {
    id: "pl300-img-10",
    type: "match",
    question: {
      fr: "Vous devez créer une table de dates en Power BI contenant 10 années civiles complètes, année en cours incluse. Complétez l'expression DAX :\n\nDate =\nVAR var1 = ① ( ② () )\nRETURN\n③ ( DATE(var1 - 9, 01, 01), DATE(var1, 12, 31) )",
      en: "You must create a date table in Power BI containing 10 full calendar years, including the current year. Complete the DAX expression:\n\nDate =\nVAR var1 = ① ( ② () )\nRETURN\n③ ( DATE(var1 - 9, 01, 01), DATE(var1, 12, 31) )",
    },
    pool: [
      { fr: "CALENDAR", en: "CALENDAR" },
      { fr: "CALENDARAUTO", en: "CALENDARAUTO" },
      { fr: "DATE", en: "DATE" },
      { fr: "EOMONTH", en: "EOMONTH" },
      { fr: "TODAY", en: "TODAY" },
      { fr: "YEAR", en: "YEAR" },
    ],
    targets: [
      { label: { fr: "① (var1 = …)", en: "① (var1 = …)" }, correctPoolIndex: 5 },
      { label: { fr: "② (dans var1)", en: "② (inside var1)" }, correctPoolIndex: 4 },
      { label: { fr: "③ (RETURN)", en: "③ (RETURN)" }, correctPoolIndex: 0 },
    ],
    explanation: {
      fr: "YEAR(TODAY()) donne l'année en cours. CALENDAR génère une plage de dates continue entre le 1er janvier d'il y a 9 ans et le 31 décembre de l'année en cours, soit 10 années complètes.",
      en: "YEAR(TODAY()) gives the current year. CALENDAR generates a continuous date range from January 1 nine years ago to December 31 of the current year, i.e. 10 full years.",
    },
  },
  {
    id: "pl300-img-11",
    type: "match",
    question: {
      fr: "Une table Sales contient Sales Amount. Une table Transaction Size définit des tranches (Small 0-10 000, Medium 10 001-100 000, Large 100 001+) via des colonnes Min et Max. Vous devez créer une colonne calculée classant chaque transaction. Complétez le code :\n\nTransaction Size =\nVAR SalesTotal = 'Sales'[Sales]\nVAR FilterSegment = ① ( 'Transaction Size', ② ( 'Transaction Size'[Min] <= SalesTotal, 'Transaction Size'[Max] >= SalesTotal ) )\nVAR Result = ③ ( DISTINCT('Transaction Size'[Transaction Size]), FilterSegment )\nRETURN Result",
      en: "A Sales table contains Sales Amount. A Transaction Size table defines bands (Small 0-10,000, Medium 10,001-100,000, Large 100,001+) via Min and Max columns. You must create a calculated column classifying each transaction. Complete the code:\n\nTransaction Size =\nVAR SalesTotal = 'Sales'[Sales]\nVAR FilterSegment = ① ( 'Transaction Size', ② ( 'Transaction Size'[Min] <= SalesTotal, 'Transaction Size'[Max] >= SalesTotal ) )\nVAR Result = ③ ( DISTINCT('Transaction Size'[Transaction Size]), FilterSegment )\nRETURN Result",
    },
    pool: [
      { fr: "ALL", en: "ALL" },
      { fr: "AND", en: "AND" },
      { fr: "CALCULATE", en: "CALCULATE" },
      { fr: "FILTER", en: "FILTER" },
      { fr: "OR", en: "OR" },
      { fr: "SUM", en: "SUM" },
    ],
    targets: [
      { label: { fr: "① (FilterSegment)", en: "① (FilterSegment)" }, correctPoolIndex: 2 },
      { label: { fr: "② (deux conditions)", en: "② (two conditions)" }, correctPoolIndex: 1 },
      { label: { fr: "③ (Result)", en: "③ (Result)" }, correctPoolIndex: 3 },
    ],
    explanation: {
      fr: "CALCULATE applique un contexte de filtre où AND combine les deux bornes (Min <= montant ET Max >= montant). FILTER renvoie alors la tranche (Small/Medium/Large) correspondant au montant de la transaction.",
      en: "CALCULATE applies a filter context where AND combines the two bounds (Min <= amount AND Max >= amount). FILTER then returns the band (Small/Medium/Large) matching the transaction amount.",
    },
  },
  {
    id: "pl300-img-12",
    type: "match",
    question: {
      fr: "Vous utilisez AI Insights (Text Analytics) pour enrichir une colonne à partir des retours clients. Associez le service AI Insights à chaque besoin.",
      en: "You use AI Insights (Text Analytics) to enrich a column from customer feedback. Match the AI Insights service to each need.",
    },
    pool: [
      { fr: "Image Tagging (étiquetage d'images)", en: "Image Tagging" },
      { fr: "Key Phrase Extraction (extraction de phrases clés)", en: "Key Phrase Extraction" },
      { fr: "Language Detection (détection de la langue)", en: "Language Detection" },
      { fr: "Sentiment Analysis (analyse de sentiment)", en: "Sentiment Analysis" },
    ],
    targets: [
      { label: { fr: "Ce dont les clients parlent le plus :", en: "What customers most often mention:" }, correctPoolIndex: 1 },
      { label: { fr: "S'ils apprécient votre produit :", en: "Whether they like your product:" }, correctPoolIndex: 3 },
      { label: { fr: "La langue du retour :", en: "The language of the feedback:" }, correctPoolIndex: 2 },
    ],
    explanation: {
      fr: "Key Phrase Extraction isole les sujets récurrents, Sentiment Analysis évalue si l'avis est positif ou négatif, et Language Detection identifie la langue. Image Tagging concerne les images, hors sujet ici.",
      en: "Key Phrase Extraction surfaces recurring topics, Sentiment Analysis rates whether feedback is positive or negative, and Language Detection identifies the language. Image Tagging is for images, not relevant here.",
    },
  },
  {
    id: "pl300-img-13",
    type: "match",
    question: {
      fr: "Dans un espace de travail Power BI, vous devez accorder à chaque utilisateur les capacités voulues selon le principe du moindre privilège : User1 doit créer et publier des applications ; User2 doit publier des rapports dans l'espace de travail et supprimer des tableaux de bord. Attribuez le rôle à chaque utilisateur.",
      en: "In a Power BI workspace, you must grant each user the needed capabilities following least privilege: User1 must create and publish apps; User2 must publish reports to the workspace and delete dashboards. Assign the role to each user.",
    },
    pool: [
      { fr: "Admin", en: "Admin" },
      { fr: "Contributor (Contributeur)", en: "Contributor" },
      { fr: "Member (Membre)", en: "Member" },
      { fr: "Viewer (Lecteur)", en: "Viewer" },
    ],
    targets: [
      { label: { fr: "User1 (créer et publier des apps) :", en: "User1 (create and publish apps):" }, correctPoolIndex: 2 },
      { label: { fr: "User2 (publier des rapports, supprimer des tableaux de bord) :", en: "User2 (publish reports, delete dashboards):" }, correctPoolIndex: 1 },
    ],
    explanation: {
      fr: "Publier une application requiert au minimum le rôle Membre (User1). Publier des rapports et supprimer du contenu se fait dès le rôle Contributeur (User2), qui est le moindre privilège suffisant.",
      en: "Publishing an app requires at least the Member role (User1). Publishing reports and deleting content is possible from the Contributor role (User2), which is the least privilege that suffices.",
    },
  },
  {
    id: "pl300-img-14",
    type: "match",
    question: {
      fr: "Une table Customer contient un champ Email Address, avec des doublons. Vous devez créer une colonne calculée qui compte les occurrences de chaque e-mail (pour repérer les doublons). Complétez l'expression DAX :\n\nCount Email =\nVAR Email = [Email Address]\nRETURN\n① ( ② (Customer), ③ (Customer), Customer[Email Address] = Email )",
      en: "A Customer table contains an Email Address field, with duplicates. You must create a calculated column counting occurrences of each email (to spot duplicates). Complete the DAX expression:\n\nCount Email =\nVAR Email = [Email Address]\nRETURN\n① ( ② (Customer), ③ (Customer), Customer[Email Address] = Email )",
    },
    pool: [
      { fr: "ALL", en: "ALL" },
      { fr: "CALCULATE", en: "CALCULATE" },
      { fr: "COUNTROWS", en: "COUNTROWS" },
      { fr: "EVALUATE", en: "EVALUATE" },
      { fr: "SUM", en: "SUM" },
      { fr: "SUMX", en: "SUMX" },
    ],
    targets: [
      { label: { fr: "① (fonction externe)", en: "① (outer function)" }, correctPoolIndex: 1 },
      { label: { fr: "② (à compter)", en: "② (to count)" }, correctPoolIndex: 2 },
      { label: { fr: "③ (retire le contexte de ligne)", en: "③ (removes row context)" }, correctPoolIndex: 0 },
    ],
    explanation: {
      fr: "CALCULATE(COUNTROWS(Customer), ALL(Customer), Customer[Email Address] = Email) compte toutes les lignes partageant l'e-mail courant. ALL supprime le contexte de ligne pour balayer toute la table ; une valeur > 1 signale un doublon.",
      en: "CALCULATE(COUNTROWS(Customer), ALL(Customer), Customer[Email Address] = Email) counts all rows sharing the current email. ALL removes the row context to scan the whole table; a value > 1 flags a duplicate.",
    },
  },
  {
    id: "pl300-img-15",
    type: "hotspot",
    question: {
      fr: "Vous avez un rapport Power BI contenant une mesure Total Sales. Vous devez créer une mesure renvoyant la somme de Total Sales depuis le début de l'année jusqu'à une date sélectionnée (cumul annuel). Complétez l'expression DAX.",
      en: "You have a Power BI report with a measure Total Sales. You must create a measure returning the sum of Total Sales from the start of the year up to a selected date (year-to-date). Complete the DAX expression.",
    },
    blanks: [
      {
        label: { fr: "Measure = ⬚ (", en: "Measure = ⬚ (" },
        options: [
          { fr: "TOTALYTD", en: "TOTALYTD" },
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "SUM", en: "SUM" },
          { fr: "EVALUATE", en: "EVALUATE" },
        ],
        correctIndex: 0,
      },
      {
        label: { fr: "[Total Sales], ⬚ )", en: "[Total Sales], ⬚ )" },
        options: [
          { fr: "'Date'[Date]", en: "'Date'[Date]" },
          { fr: "TODAY()", en: "TODAY()" },
          { fr: "EOMONTH('Date'[Date])", en: "EOMONTH('Date'[Date])" },
          { fr: "LASTDATE('Date'[Date])", en: "LASTDATE('Date'[Date])" },
        ],
        correctIndex: 0,
      },
    ],
    explanation: {
      fr: "TOTALYTD([Total Sales], 'Date'[Date]) calcule le cumul depuis le 1er janvier jusqu'à la date du contexte. Le second argument doit être la colonne de dates de la table de dates.",
      en: "TOTALYTD([Total Sales], 'Date'[Date]) computes the running total from January 1 to the date in context. The second argument must be the date table's date column.",
    },
  },
  {
    id: "pl300-img-16",
    type: "hotspot",
    question: {
      fr: "Vous créez un modèle Power BI. Vous devez créer une table calculée nommée Numbers contenant tous les entiers de -100 à 100. Complétez l'expression DAX.",
      en: "You are creating a Power BI model. You must create a calculated table named Numbers containing all integers from -100 to 100. Complete the DAX expression.",
    },
    blanks: [
      {
        label: { fr: "Numbers = ⬚", en: "Numbers = ⬚" },
        options: [
          { fr: "GENERATE", en: "GENERATE" },
          { fr: "GENERATEALL", en: "GENERATEALL" },
          { fr: "GENERATESERIES", en: "GENERATESERIES" },
        ],
        correctIndex: 2,
      },
      {
        label: { fr: "⬚ (arguments)", en: "⬚ (arguments)" },
        options: [
          { fr: "( 100, 1, 200 )", en: "( 100, 1, 200 )" },
          { fr: "( -100, 100, 1 )", en: "( -100, 100, 1 )" },
          { fr: "( -1, -100, 100 )", en: "( -1, -100, 100 )" },
        ],
        correctIndex: 1,
      },
    ],
    explanation: {
      fr: "GENERATESERIES(-100, 100, 1) crée une table à une colonne contenant tous les entiers de -100 à 100 par pas de 1 (début, fin, incrément).",
      en: "GENERATESERIES(-100, 100, 1) creates a single-column table with every integer from -100 to 100 in steps of 1 (start, end, increment).",
    },
  },
  {
    id: "pl300-img-17",
    type: "hotspot",
    question: {
      fr: "Une table Balances contient les soldes de clôture quotidiens de chaque compte bancaire actif (une ligne par jour où le compte est actif, dernier jour inclus). Une table Date a une ligne par jour (2000-2025) avec une hiérarchie année/trimestre/mois/jour. La mesure est : Accounts := CALCULATE( DISTINCTCOUNT(Balances[AccountID]), LASTDATE('Date'[Date]) ). Pour chaque affirmation, indiquez Oui si elle est vraie, sinon Non.",
      en: "A Balances table holds daily closing balances for each active bank account (one row per day the account is live, including the last day). A Date table has one row per day (2000-2025) with a year/quarter/month/day hierarchy. The measure is: Accounts := CALCULATE( DISTINCTCOUNT(Balances[AccountID]), LASTDATE('Date'[Date]) ). For each statement, select Yes if true, otherwise No.",
    },
    blanks: [
      {
        label: { fr: "Au niveau année, [Accounts] montre le nombre de comptes actifs tout au long de l'année.", en: "At year level, [Accounts] shows the number of accounts live throughout the year." },
        options: [
          { fr: "Oui", en: "Yes" },
          { fr: "Non", en: "No" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "Au niveau mois, [Accounts] montre le nombre de comptes actifs tout au long du mois.", en: "At month level, [Accounts] shows the number of accounts live throughout the month." },
        options: [
          { fr: "Oui", en: "Yes" },
          { fr: "Non", en: "No" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "Au niveau jour, [Accounts] montre le nombre de comptes actifs ce jour-là.", en: "At day level, [Accounts] shows the number of accounts live that day." },
        options: [
          { fr: "Oui", en: "Yes" },
          { fr: "Non", en: "No" },
        ],
        correctIndex: 0,
      },
    ],
    explanation: {
      fr: "LASTDATE ne conserve que la dernière date du contexte. Au niveau année (le 31 déc.) ou mois (dernier jour), la mesure compte les comptes actifs ce dernier jour uniquement, pas « tout au long » de la période → Non. Au niveau jour, la dernière date est ce jour même → le compte des comptes actifs ce jour est correct → Oui.",
      en: "LASTDATE keeps only the last date in context. At year level (Dec 31) or month level (last day), the measure counts accounts live on that final day only, not \"throughout\" the period → No. At day level, the last date is that very day → the count of accounts live that day is correct → Yes.",
    },
  },
  {
    id: "pl300-img-18",
    type: "hotspot",
    question: {
      fr: "Vous devez créer une mesure renvoyant le pourcentage de revenu par catégorie de produit. Complétez la mesure DAX :\n\nCategory Revenue Contribution =\nVAR AllCategoryRev = ① ( SUM([Revenue]), ② (ProductList[ProductCategory]) )\nRETURN\n③ ( SUM([Revenue]), AllCategoryRev )",
      en: "You must create a measure returning the percent of revenue by product category. Complete the DAX measure:\n\nCategory Revenue Contribution =\nVAR AllCategoryRev = ① ( SUM([Revenue]), ② (ProductList[ProductCategory]) )\nRETURN\n③ ( SUM([Revenue]), AllCategoryRev )",
    },
    blanks: [
      {
        label: { fr: "①", en: "①" },
        options: [
          { fr: "ALL", en: "ALL" },
          { fr: "ALLEXCEPT", en: "ALLEXCEPT" },
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "DIVIDE", en: "DIVIDE" },
          { fr: "FILTER", en: "FILTER" },
        ],
        correctIndex: 2,
      },
      {
        label: { fr: "②", en: "②" },
        options: [
          { fr: "ALL", en: "ALL" },
          { fr: "ALLEXCEPT", en: "ALLEXCEPT" },
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "DIVIDE", en: "DIVIDE" },
          { fr: "FILTER", en: "FILTER" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "③", en: "③" },
        options: [
          { fr: "ALL", en: "ALL" },
          { fr: "ALLEXCEPT", en: "ALLEXCEPT" },
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "DIVIDE", en: "DIVIDE" },
          { fr: "FILTER", en: "FILTER" },
        ],
        correctIndex: 3,
      },
    ],
    explanation: {
      fr: "CALCULATE recalcule la somme du revenu, et ALLEXCEPT(ProductList[ProductCategory]) conserve uniquement le filtre de catégorie en retirant les autres filtres, pour obtenir le revenu de référence par catégorie. DIVIDE calcule ensuite le ratio revenu / revenu de la catégorie.",
      en: "CALCULATE recomputes the revenue sum, and ALLEXCEPT(ProductList[ProductCategory]) keeps only the category filter while removing others, giving the category-level reference revenue. DIVIDE then computes the revenue / category-revenue ratio.",
    },
  },
  {
    id: "pl300-img-19",
    type: "hotspot",
    question: {
      fr: "Une table Orders contient OrderDate, RequiredDate et ShippedDate. Vous devez créer une mesure renvoyant le pourcentage de commandes en retard. Complétez l'expression DAX :\n\nLate Orders Percent =\nVAR OrderCount = COUNTROWS('Orders')\nVAR LateOrders = ① ( COUNTROWS('Orders'), ② (Orders, ③ ) )\nRETURN DIVIDE(LateOrders, OrderCount)",
      en: "An Orders table contains OrderDate, RequiredDate and ShippedDate. You must create a measure returning the percentage of late orders. Complete the DAX expression:\n\nLate Orders Percent =\nVAR OrderCount = COUNTROWS('Orders')\nVAR LateOrders = ① ( COUNTROWS('Orders'), ② (Orders, ③ ) )\nRETURN DIVIDE(LateOrders, OrderCount)",
    },
    blanks: [
      {
        label: { fr: "①", en: "①" },
        options: [
          { fr: "SUM", en: "SUM" },
          { fr: "COUNTX", en: "COUNTX" },
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "CALCULATETABLE", en: "CALCULATETABLE" },
        ],
        correctIndex: 2,
      },
      {
        label: { fr: "②", en: "②" },
        options: [
          { fr: "FILTER", en: "FILTER" },
          { fr: "ALLEXCEPT", en: "ALLEXCEPT" },
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "DATESBETWEEN", en: "DATESBETWEEN" },
        ],
        correctIndex: 0,
      },
      {
        label: { fr: "③ (condition « en retard »)", en: "③ (\"late\" condition)" },
        options: [
          { fr: "Orders[OrderDate] > Orders[RequiredDate]", en: "Orders[OrderDate] > Orders[RequiredDate]" },
          { fr: "Orders[ShippedDate] >= Orders[OrderDate]", en: "Orders[ShippedDate] >= Orders[OrderDate]" },
          { fr: "Orders[ShippedDate] < Orders[RequiredDate]", en: "Orders[ShippedDate] < Orders[RequiredDate]" },
          { fr: "Orders[ShippedDate] > Orders[RequiredDate]", en: "Orders[ShippedDate] > Orders[RequiredDate]" },
        ],
        correctIndex: 3,
      },
    ],
    explanation: {
      fr: "Une commande est en retard quand elle est expédiée après la date requise : ShippedDate > RequiredDate. CALCULATE + FILTER comptent ces commandes, puis DIVIDE les rapporte au total.",
      en: "An order is late when it ships after the required date: ShippedDate > RequiredDate. CALCULATE + FILTER count those orders, then DIVIDE ratios them against the total.",
    },
  },
  {
    id: "pl300-img-20",
    type: "hotspot",
    question: {
      fr: "Une table financials contient les colonnes Date et Sales. Vous devez créer une mesure calculant la variation relative des ventes par rapport au trimestre précédent. Complétez la mesure :\n\nSales QoQ% = IF(\n  ISFILTERED('financials'[Date]), ERROR(\"Uh oh.\"),\n  VAR PREV_QUARTER = ① ( SUM('financials'[Sales]), ② ('financials'[Date].[Date], -1, QUARTER) )\n  RETURN ③ ( SUM('financials'[Sales]) - PREV_QUARTER, PREV_QUARTER )\n)",
      en: "A financials table contains Date and Sales columns. You must create a measure computing the relative change in sales versus the previous quarter. Complete the measure:\n\nSales QoQ% = IF(\n  ISFILTERED('financials'[Date]), ERROR(\"Uh oh.\"),\n  VAR PREV_QUARTER = ① ( SUM('financials'[Sales]), ② ('financials'[Date].[Date], -1, QUARTER) )\n  RETURN ③ ( SUM('financials'[Sales]) - PREV_QUARTER, PREV_QUARTER )\n)",
    },
    blanks: [
      {
        label: { fr: "①", en: "①" },
        options: [
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "CALCULATETABLE", en: "CALCULATETABLE" },
          { fr: "DATEADD", en: "DATEADD" },
          { fr: "DIVIDE", en: "DIVIDE" },
          { fr: "FILTER", en: "FILTER" },
          { fr: "FIND", en: "FIND" },
        ],
        correctIndex: 0,
      },
      {
        label: { fr: "②", en: "②" },
        options: [
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "CALCULATETABLE", en: "CALCULATETABLE" },
          { fr: "DATEADD", en: "DATEADD" },
          { fr: "DIVIDE", en: "DIVIDE" },
          { fr: "FILTER", en: "FILTER" },
          { fr: "FIND", en: "FIND" },
        ],
        correctIndex: 2,
      },
      {
        label: { fr: "③", en: "③" },
        options: [
          { fr: "CALCULATE", en: "CALCULATE" },
          { fr: "CALCULATETABLE", en: "CALCULATETABLE" },
          { fr: "DATEADD", en: "DATEADD" },
          { fr: "DIVIDE", en: "DIVIDE" },
          { fr: "FILTER", en: "FILTER" },
          { fr: "FIND", en: "FIND" },
        ],
        correctIndex: 3,
      },
    ],
    explanation: {
      fr: "CALCULATE recalcule les ventes dans le contexte décalé par DATEADD(..., -1, QUARTER) (trimestre précédent). DIVIDE calcule la variation relative : (ventes actuelles - trimestre précédent) / trimestre précédent.",
      en: "CALCULATE recomputes sales in the context shifted by DATEADD(..., -1, QUARTER) (previous quarter). DIVIDE computes the relative change: (current sales - previous quarter) / previous quarter.",
    },
  },
  {
    id: "pl300-img-21",
    type: "hotspot",
    question: {
      fr: "Vous importez deux fichiers CSV : Products (ProductID, ProductName, SupplierID, CategoryID) et Categories (CategoryID, CategoryName, CategoryDescription). Vous devez obtenir une seule table Product contenant aussi CategoryName et CategoryDescription. Choisissez comment combiner et quoi faire de la requête Categories.",
      en: "You import two CSV files: Products (ProductID, ProductName, SupplierID, CategoryID) and Categories (CategoryID, CategoryName, CategoryDescription). You must produce a single Product table also containing CategoryName and CategoryDescription. Choose how to combine and what to do with the Categories query.",
    },
    blanks: [
      {
        label: { fr: "Combiner les requêtes en effectuant :", en: "Combine the queries by performing a:" },
        options: [
          { fr: "Append (Ajouter)", en: "Append" },
          { fr: "Merge (Fusionner)", en: "Merge" },
          { fr: "Transpose (Transposer)", en: "Transpose" },
        ],
        correctIndex: 1,
      },
      {
        label: { fr: "Sur la requête Categories :", en: "On the Categories query:" },
        options: [
          { fr: "Supprimer la requête", en: "Delete the query" },
          { fr: "Désactiver le chargement de la requête", en: "Disable the query load" },
          { fr: "Exclure la requête de l'actualisation du rapport", en: "Exclude the query from report refresh" },
        ],
        correctIndex: 1,
      },
    ],
    explanation: {
      fr: "Merge (jointure sur CategoryID) ajoute CategoryName et CategoryDescription à Products dans une seule table. Categories reste nécessaire comme source de la fusion, mais on désactive son chargement pour ne pas créer une table séparée dans le modèle.",
      en: "Merge (join on CategoryID) adds CategoryName and CategoryDescription to Products in a single table. Categories is still needed as the merge source, but its load is disabled so it does not become a separate table in the model.",
    },
  },
  {
    id: "pl300-img-22",
    type: "hotspot",
    question: {
      fr: "Un jeu de données Pens contient Item, Unit Price et Quantity Ordered. Vous devez créer une visualisation montrant la relation entre Unit Price et Quantity Ordered, en mettant en évidence les commandes de prix et quantité similaires. Choisissez le type de visualisation et la fonctionnalité.",
      en: "A Pens dataset contains Item, Unit Price and Quantity Ordered. You must create a visualization showing the relationship between Unit Price and Quantity Ordered, highlighting orders with similar price and quantity. Choose the visualization type and the feature.",
    },
    blanks: [
      {
        label: { fr: "Visualisation :", en: "Visualization:" },
        options: [
          { fr: "Un histogramme de Quantity Ordered et Unit Price par année", en: "A column chart of Quantity Ordered and Unit Price by year" },
          { fr: "Une courbe de Quantity Ordered et Unit Price par article", en: "A line chart of Quantity Ordered and Unit Price by item" },
          { fr: "Un nuage de points de Quantity Ordered et Unit Price par article", en: "A scatter plot of Quantity Ordered and Unit Price by item" },
        ],
        correctIndex: 2,
      },
      {
        label: { fr: "Fonctionnalité :", en: "Feature:" },
        options: [
          { fr: "Rechercher automatiquement les clusters", en: "Automatically find clusters" },
          { fr: "Expliquer la baisse", en: "Explain the decrease" },
          { fr: "Trouver où la distribution diffère", en: "Find where the distribution is different" },
        ],
        correctIndex: 0,
      },
    ],
    explanation: {
      fr: "Un nuage de points montre la relation entre deux mesures numériques (prix vs quantité) par article. La fonctionnalité « Rechercher automatiquement les clusters » regroupe les points similaires, mettant en évidence les commandes de prix/quantité comparables.",
      en: "A scatter plot shows the relationship between two numeric measures (price vs quantity) per item. The \"Automatically find clusters\" feature groups similar points, highlighting orders with comparable price/quantity.",
    },
  },
  {
    id: "pl300-img-23",
    type: "hotspot",
    question: {
      fr: "La colonne UnitsInStock a le type Nombre entier, « Résumer par » (Summarize by) = Aucun, et contient 75 valeurs non vides dont 51 uniques. Complétez les affirmations.",
      en: "The UnitsInStock column is typed Whole Number, has Summarize by = None, and contains 75 non-null values of which 51 are unique. Complete the statements.",
    },
    blanks: [
      {
        label: { fr: "Ajoutée aux valeurs d'un visuel table, il y aura ⬚ dans la table.", en: "Added to a table visual's values, there will be ⬚ in the table." },
        options: [
          { fr: "0 ligne", en: "0 rows" },
          { fr: "1 ligne", en: "1 row" },
          { fr: "51 lignes", en: "51 rows" },
          { fr: "75 lignes", en: "75 rows" },
        ],
        correctIndex: 3,
      },
      {
        label: { fr: "Changer « Résumer par » puis l'ajouter à un visuel table va ⬚ le nombre de lignes.", en: "Changing Summarize by then adding it to a table visual will ⬚ the number of rows." },
        options: [
          { fr: "maintenir", en: "maintain" },
          { fr: "réduire", en: "reduce" },
          { fr: "augmenter", en: "increase" },
        ],
        correctIndex: 1,
      },
    ],
    explanation: {
      fr: "Avec « Résumer par » = Aucun, la colonne n'est pas agrégée : le visuel table affiche chaque ligne, soit les 75 valeurs non vides. En passant « Résumer par » à une agrégation (ex. Somme), les valeurs sont regroupées, ce qui réduit le nombre de lignes affichées.",
      en: "With Summarize by = None, the column is not aggregated: the table visual shows every row, i.e. the 75 non-null values. Changing Summarize by to an aggregation (e.g. Sum) groups the values, which reduces the number of displayed rows.",
    },
  },
];
