import type { Question } from "./types";

// SnowPro Core certification practice bank (59 questions).
export const SNOWFLAKE_QUESTIONS: Question[] = [
  {
    id: "sf-q1",
    question: {
      fr: "Un praticien Snowflake travaillant sur un projet Gen AI doit partager de manière sécurisée des fichiers spécifiques d'un stage interne avec des partenaires externes, sans leur donner de privilèges directs sur le stage.",
      en: "A Snowflake practitioner working on a Gen AI project needs to securely share specific files from an internal stage with external partners, without granting them direct privileges on the stage.",
    },
    options: [
      {
        fr: "Générer une file URL pour chaque fichier et la partager avec les partenaires externes.",
        en: "Generate a file URL for each file and share it with the external partners.",
      },
      {
        fr: "Générer une scoped URL pour chaque fichier et la partager avec les partenaires externes.",
        en: "Generate a scoped URL for each file and share it with the external partners.",
      },
      {
        fr: "Accorder aux partenaires externes un accès en lecture au stage et leur fournir les chemins des fichiers.",
        en: "Grant the external partners read access to the stage and provide them with the file paths.",
      },
      {
        fr: "Générer une pre-signed URL pour chaque fichier et la partager avec les partenaires externes.",
        en: "Generate a pre-signed URL for each file and share it with the external partners.",
      },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Les scoped URLs sont conçues exactement pour ce scénario : accès sécurisé et temporaire à des fichiers d'un stage interne, sans privilèges directs sur le stage. Les file URLs nécessitent des privilèges sur le stage, et les pre-signed URLs concernent les stages externes (S3, etc.).",
      en: "Scoped URLs are designed exactly for this scenario: secure, temporary access to files in an internal stage, without direct privileges on the stage. File URLs require privileges on the stage, and pre-signed URLs apply to external stages (S3, etc.).",
    },
  },
  {
    id: "sf-q2",
    question: {
      fr: "Une grande entreprise internationale veut maximiser la disponibilité de son système en cas de panne d'un fournisseur cloud affectant Snowflake.",
      en: "A large international company wants to maximize the availability of its system in the event of a cloud provider outage affecting Snowflake.",
    },
    options: [
      {
        fr: "Des téléchargements planifiés de la base vers un stockage cloud.",
        en: "Scheduled downloads of the database to cloud storage.",
      },
      {
        fr: "Un failover group vers une autre région et un autre fournisseur cloud.",
        en: "A failover group to another region and another cloud provider.",
      },
      {
        fr: "Une réplication de compte dans la même région et le même fournisseur cloud.",
        en: "Account replication within the same region and the same cloud provider.",
      },
      {
        fr: "Un clonage planifié de la base conservé dans le compte Snowflake.",
        en: "A scheduled clone of the database kept within the Snowflake account.",
      },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Un failover group répliqué vers un autre fournisseur cloud/région protège contre une panne totale d'un fournisseur cloud. Les autres options restent dépendantes du même fournisseur ou ne couvrent qu'une sauvegarde, pas la haute disponibilité.",
      en: "A failover group replicated to another cloud provider/region protects against a total outage of a cloud provider. The other options remain dependent on the same provider or only cover a backup, not high availability.",
    },
  },
  {
    id: "sf-q3",
    question: {
      fr: "Quels outils permettent d'écrire du code avec l'API Snowpark ? (choisir deux réponses)",
      en: "Which tools allow you to write code with the Snowpark API? (choose two)",
    },
    options: [
      { fr: "Snowpark Container Services", en: "Snowpark Container Services" },
      { fr: "Snowpark for Scala", en: "Snowpark for Scala" },
      { fr: "Snowpark for Python", en: "Snowpark for Python" },
      { fr: "Streamlit in Snowflake", en: "Streamlit in Snowflake" },
      { fr: "SQL Scripting", en: "SQL Scripting" },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "Snowpark est un framework de développement permettant d'écrire du code en Python, Scala (et Java) plutôt qu'en SQL. Snowpark Container Services est une plateforme de calcul conteneurisé, pas une API de langage.",
      en: "Snowpark is a development framework that lets you write code in Python, Scala (and Java) rather than SQL. Snowpark Container Services is a containerized compute platform, not a language API.",
    },
  },
  {
    id: "sf-q4",
    question: {
      fr: "Quelle fonctionnalité permet d'auditer dans le temps la façon dont des données sensibles sont consultées ?",
      en: "Which feature allows auditing over time how sensitive data is accessed?",
    },
    options: [
      { fr: "La sécurité au niveau colonne", en: "Column-level security" },
      { fr: "La sécurité au niveau ligne", en: "Row-level security" },
      { fr: "Une masking policy basée sur des tags", en: "A tag-based masking policy" },
      { fr: "Le tagging d'objets", en: "Object tagging" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le tagging d'objets permet d'associer des tags aux tables/colonnes, puis d'utiliser ACCESS_HISTORY combiné aux références de tags pour tracer l'accès aux données sensibles dans le temps.",
      en: "Object tagging lets you associate tags with tables/columns, then use ACCESS_HISTORY combined with tag references to trace access to sensitive data over time.",
    },
  },
  {
    id: "sf-q5",
    question: {
      fr: "Comment un utilisateur peut-il travailler avec plusieurs rôles assignés sans devoir fréquemment changer de rôle ?",
      en: "How can a user work with multiple assigned roles without frequently switching roles?",
    },
    options: [
      { fr: "Utiliser des rôles secondaires et un rôle primaire.", en: "Use secondary roles alongside a primary role." },
      { fr: "Accorder à l'utilisateur le rôle ACCOUNTADMIN.", en: "Grant the user the ACCOUNTADMIN role." },
      { fr: "Accorder à l'utilisateur le rôle parent des rôles déjà assignés.", en: "Grant the user the parent role of the roles already assigned." },
      { fr: "Créer un nouveau rôle et lui accorder les rôles existants.", en: "Create a new role and grant it the existing roles." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Les rôles secondaires permettent d'activer plusieurs rôles simultanément dans une session (USE SECONDARY ROLES ALL), en cumulant leurs privilèges, pendant que le rôle primaire reste actif pour la création/possession d'objets.",
      en: "Secondary roles let you activate multiple roles simultaneously in a session (USE SECONDARY ROLES ALL), combining their privileges, while the primary role remains active for object creation/ownership.",
    },
  },
  {
    id: "sf-q6",
    question: {
      fr: "Quel est l'usage recommandé de COPY INTO <location> avec SINGLE = TRUE ?",
      en: "What is the recommended use of COPY INTO <location> with SINGLE = TRUE?",
    },
    options: [
      { fr: "Charger des données sans duplication.", en: "Load data without duplication." },
      { fr: "Charger un fichier individuel.", en: "Load a single file." },
      { fr: "Copier des données et parser les résultats en single stages.", en: "Copy data and parse the results into single stages." },
      { fr: "Décharger (unload) un seul fichier d'une table vers un stage.", en: "Unload a single file from a table to a stage." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "COPY INTO <location> est la commande d'unload. SINGLE = TRUE force Snowflake à écrire un seul fichier de sortie au lieu de plusieurs, recommandé uniquement pour de petits volumes car cela limite le parallélisme.",
      en: "COPY INTO <location> is the unload command. SINGLE = TRUE forces Snowflake to write a single output file instead of several, recommended only for small volumes since it limits parallelism.",
    },
  },
  {
    id: "sf-q7",
    question: {
      fr: "Le nombre d'utilisateurs d'un virtual warehouse et le nombre de rapports consultés augmentent. Quelle action permet de savoir si le warehouse est surchargé ?",
      en: "The number of users on a virtual warehouse and the number of reports being viewed is increasing. Which action helps determine whether the warehouse is overloaded?",
    },
    options: [
      { fr: "Surveiller la durée des requêtes en cours.", en: "Monitor the duration of currently running queries." },
      { fr: "Déterminer si des requêtes sont mises en file d'attente (queuing).", en: "Determine whether queries are being queued." },
      { fr: "Vérifier le nombre de requêtes en cours dans Query History.", en: "Check the number of running queries in Query History." },
      { fr: "Déterminer si des requêtes bénéficieraient du query acceleration service.", en: "Determine whether queries would benefit from the query acceleration service." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le queuing est le signe classique d'un warehouse surchargé, visible dans WAREHOUSE_LOAD_HISTORY qui montre les requêtes en attente vs en cours d'exécution.",
      en: "Queuing is the classic sign of an overloaded warehouse, visible in WAREHOUSE_LOAD_HISTORY, which shows queued vs. executing queries.",
    },
  },
  {
    id: "sf-q8",
    question: {
      fr: "Quel type de table est supporté par Open Catalog pour fournir un accès centralisé en lecture/écriture ?",
      en: "Which table type does Open Catalog support to provide centralized read/write access?",
    },
    options: [
      { fr: "Hybrid", en: "Hybrid" },
      { fr: "Iceberg", en: "Iceberg" },
      { fr: "Dynamic", en: "Dynamic" },
      { fr: "Event", en: "Event" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Snowflake Open Catalog est l'implémentation managée d'Apache Polaris, un catalogue open-source pour les tables Apache Iceberg, avec gestion centralisée et accès lecture/écriture multi-moteurs.",
      en: "Snowflake Open Catalog is the managed implementation of Apache Polaris, an open-source catalog for Apache Iceberg tables, offering centralized management and multi-engine read/write access.",
    },
  },
  {
    id: "sf-q9",
    question: {
      fr: "Quelle fonction permet d'accéder aux valeurs d'un objet ?",
      en: "Which function allows access to the values within an object?",
    },
    options: [
      { fr: "OBJECT_KEYS", en: "OBJECT_KEYS" },
      { fr: "OBJECT_PICK", en: "OBJECT_PICK" },
      { fr: "GET_PATH", en: "GET_PATH" },
      { fr: "XMLGET", en: "XMLGET" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "GET_PATH extrait une valeur d'un objet/VARIANT via un chemin donné (ex: GET_PATH(mon_objet, 'address.city')). OBJECT_KEYS ne retourne que les clés, OBJECT_PICK construit un nouvel objet, XMLGET concerne le XML.",
      en: "GET_PATH extracts a value from an object/VARIANT via a given path (e.g. GET_PATH(my_object, 'address.city')). OBJECT_KEYS only returns the keys, OBJECT_PICK builds a new object, and XMLGET applies to XML.",
    },
  },
  {
    id: "sf-q10",
    question: {
      fr: "Quelle vue montre le lignage des colonnes (column lineage) au sein d'un compte ?",
      en: "Which view shows column lineage within an account?",
    },
    options: [
      { fr: "ACCESS_HISTORY", en: "ACCESS_HISTORY" },
      { fr: "OBJECT_DEPENDENCIES", en: "OBJECT_DEPENDENCIES" },
      { fr: "QUERY_HISTORY", en: "QUERY_HISTORY" },
      { fr: "COPY_HISTORY", en: "COPY_HISTORY" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "ACCESS_HISTORY (dans SNOWFLAKE.ACCOUNT_USAGE) trace les opérations de lecture/écriture, avec les champs DIRECT_SOURCES_ACCESSED et OBJECTS_MODIFIED, capturant le lignage au niveau colonne. C'est aussi la source du graphe de Lineage dans Snowsight.",
      en: "ACCESS_HISTORY (in SNOWFLAKE.ACCOUNT_USAGE) tracks read/write operations, with the DIRECT_SOURCES_ACCESSED and OBJECTS_MODIFIED fields, capturing column-level lineage. It is also the source of the Lineage graph in Snowsight.",
    },
  },
  {
    id: "sf-q11",
    question: {
      fr: "Un praticien doit exécuter plusieurs requêtes référençant plusieurs fois la même valeur d'année fiscale, sans la coder en dur à chaque fois.",
      en: "A practitioner needs to run several queries that reference the same fiscal year value multiple times, without hard-coding it each time.",
    },
    options: [
      { fr: "Utiliser une table temporaire.", en: "Use a temporary table." },
      { fr: "Utiliser une variable de session.", en: "Use a session variable." },
      { fr: "Utiliser une valeur par défaut de colonne.", en: "Use a column default value." },
      { fr: "Utiliser une bind variable.", en: "Use a bind variable." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Les variables de session (SET fiscal_year = 2026;) permettent de définir une valeur une fois et de la référencer ($fiscal_year) dans plusieurs requêtes de la même session.",
      en: "Session variables (SET fiscal_year = 2026;) let you define a value once and reference it ($fiscal_year) across multiple queries in the same session.",
    },
  },
  {
    id: "sf-q12",
    question: {
      fr: "Une colonne JSON LOG_DATA contient un tableau imbriqué de transactions pour chaque entrée de log. Quelle table function permet de convertir ce tableau JSON en plusieurs lignes et de faire un lateral join ?",
      en: "A JSON column LOG_DATA contains a nested array of transactions for each log entry. Which table function converts this JSON array into multiple rows and enables a lateral join?",
    },
    options: [
      { fr: "JSON_EXTRACT_PATH_TEXT", en: "JSON_EXTRACT_PATH_TEXT" },
      { fr: "OBJECT_CONSTRUCT", en: "OBJECT_CONSTRUCT" },
      { fr: "FLATTEN", en: "FLATTEN" },
      { fr: "PARSE_JSON", en: "PARSE_JSON" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "FLATTEN explose les éléments imbriqués d'un tableau/objet en plusieurs lignes, typiquement utilisé avec LATERAL FLATTEN(input => colonne).",
      en: "FLATTEN explodes the nested elements of an array/object into multiple rows, typically used with LATERAL FLATTEN(input => column).",
    },
  },
  {
    id: "sf-q13",
    question: {
      fr: "Les départements A et B doivent tous deux accéder aux mêmes données, mais des informations sensibles doivent être cachées au département B.",
      en: "Departments A and B both need access to the same data, but sensitive information must be hidden from department B.",
    },
    options: [
      { fr: "Créer et partager un rapport avec le département B sans les données sensibles.", en: "Create and share a report with department B that excludes the sensitive data." },
      { fr: "Mettre en place une masking policy sur les données sensibles.", en: "Implement a masking policy on the sensitive data." },
      { fr: "Construire des data marts et rapports séparés pour chaque département.", en: "Build separate data marts and reports for each department." },
      { fr: "Restreindre l'accès du département B aux colonnes sensibles.", en: "Restrict department B's access to the sensitive columns." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Une masking policy dynamique permet aux deux départements d'interroger la même table/vue, en masquant les valeurs sensibles selon le rôle de l'utilisateur, sans duplication ni maintenance manuelle.",
      en: "A dynamic masking policy lets both departments query the same table/view, masking sensitive values based on the user's role, without duplication or manual maintenance.",
    },
  },
  {
    id: "sf-q14",
    question: {
      fr: "Quel est l'impact en stockage du clonage d'une table de 1 To puis de la mise à jour de 10% des lignes ?",
      en: "What is the storage impact of cloning a 1 TB table and then updating 10% of its rows?",
    },
    options: [
      { fr: "Seules les métadonnées sont stockées.", en: "Only metadata is stored." },
      { fr: "Le stockage complet est dupliqué.", en: "The full storage is duplicated." },
      { fr: "Aucun stockage additionnel n'est utilisé.", en: "No additional storage is used." },
      { fr: "Seules les données modifiées consomment du stockage additionnel.", en: "Only the modified data consumes additional storage." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Le clonage zero-copy partage initialement les mêmes micro-partitions. Une fois 10% des lignes mises à jour, Snowflake écrit de nouvelles micro-partitions uniquement pour les données modifiées (architecture de stockage immuable).",
      en: "Zero-copy cloning initially shares the same micro-partitions. Once 10% of the rows are updated, Snowflake writes new micro-partitions only for the modified data (immutable storage architecture).",
    },
  },
  {
    id: "sf-q15",
    question: {
      fr: "Quelle est la différence clé entre Snowflake CLI et SnowSQL ?",
      en: "What is the key difference between Snowflake CLI and SnowSQL?",
    },
    options: [
      {
        fr: "Snowflake CLI sert principalement à gérer workloads et applications, tandis que SnowSQL sert à exécuter des opérations (requêtes).",
        en: "Snowflake CLI is mainly used to manage workloads and applications, while SnowSQL is used to run operations (queries).",
      },
      {
        fr: "SnowSQL sert à gérer workloads et applications, tandis que Snowflake CLI sert à exécuter des requêtes.",
        en: "SnowSQL is used to manage workloads and applications, while Snowflake CLI is used to run queries.",
      },
      { fr: "Les deux outils servent exclusivement à exécuter des requêtes SQL.", en: "Both tools are used exclusively to run SQL queries." },
      { fr: "Snowflake CLI remplace entièrement SnowSQL, qui ne fonctionne plus.", en: "Snowflake CLI entirely replaces SnowSQL, which no longer works." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Snowflake CLI est un outil plus récent pour gérer des objets Snowflake et déployer/gérer des workloads (apps Snowpark, Streamlit, native apps, SPCS). SnowSQL est le client CLI traditionnel pour exécuter des requêtes SQL et du DDL/DML.",
      en: "Snowflake CLI is a newer tool for managing Snowflake objects and deploying/managing workloads (Snowpark apps, Streamlit, native apps, SPCS). SnowSQL is the traditional CLI client for running SQL queries and DDL/DML.",
    },
  },
  {
    id: "sf-q16",
    question: {
      fr: "Quelle affirmation sur les streams de table est correcte ?",
      en: "Which statement about table streams is correct?",
    },
    options: [
      {
        fr: "Des streams peuvent être créés pour suivre les changements sur des vues, des tables externes et des stages externes.",
        en: "Streams can be created to track changes on views, external tables, and external stages.",
      },
      { fr: "Un seul stream peut être créé par table à la fois.", en: "Only one stream can be created per table at a time." },
      { fr: "Renommer une table rend son stream obsolète (stale).", en: "Renaming a table makes its stream stale." },
      { fr: "Les streams ne peuvent pas suivre les changements sur des vues.", en: "Streams cannot track changes on views." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Plusieurs streams PEUVENT être créés sur la même table. Renommer une table ne rend PAS le stream obsolète - il suit la table renommée. Les streams supportent le suivi des changements sur les tables standards, vues, tables externes et directory tables de stages externes.",
      en: "Multiple streams CAN be created on the same table. Renaming a table does NOT make the stream stale - it continues to track the renamed table. Streams support tracking changes on standard tables, views, external tables, and directory tables of external stages.",
    },
  },
  {
    id: "sf-q17",
    question: {
      fr: "Quel est le meilleur choix pour un retour quasi temps réel sur l'ingestion de données ?",
      en: "What is the best choice for near-real-time feedback on data ingestion?",
    },
    options: [
      { fr: "Snowpipe", en: "Snowpipe" },
      { fr: "La commande COPY INTO <table> planifiée via une Task", en: "The COPY INTO <table> command scheduled via a Task" },
      { fr: "Streams", en: "Streams" },
      { fr: "Snowpipe Streaming", en: "Snowpipe Streaming" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Snowpipe Streaming est conçu pour une ingestion ligne par ligne à faible latence via API - les données deviennent interrogeables en quelques secondes, plus rapide que le Snowpipe classique basé sur des fichiers.",
      en: "Snowpipe Streaming is designed for low-latency, row-by-row ingestion via API - data becomes queryable within seconds, faster than classic file-based Snowpipe.",
    },
  },
  {
    id: "sf-q18",
    question: {
      fr: "Quelle fonctionnalité permet une montée en charge temporaire pour des requêtes complexes et coûteuses en calcul ?",
      en: "Which feature allows temporary scale-up for complex, compute-intensive queries?",
    },
    options: [
      { fr: "Search optimization service", en: "Search optimization service" },
      { fr: "Une scaling policy de virtual warehouse", en: "A virtual warehouse scaling policy" },
      { fr: "Query acceleration service", en: "Query acceleration service" },
      { fr: "Un virtual warehouse multi-cluster", en: "A multi-cluster virtual warehouse" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Le query acceleration service décharge temporairement des portions d'une requête individuelle vers des ressources de calcul serverless additionnelles, sans redimensionner le warehouse lui-même.",
      en: "The query acceleration service temporarily offloads portions of an individual query to additional serverless compute resources, without resizing the warehouse itself.",
    },
  },
  {
    id: "sf-q19",
    question: {
      fr: "Quelle copy option inclut les en-têtes de colonnes lors d'un unload vers Parquet ?",
      en: "Which copy option includes column headers when unloading to Parquet?",
    },
    options: [
      { fr: "PARSE_HEADER = TRUE", en: "PARSE_HEADER = TRUE" },
      { fr: "SKIP_HEADER = <entier>", en: "SKIP_HEADER = <integer>" },
      { fr: "HEADER = TRUE", en: "HEADER = TRUE" },
      { fr: "HEADER = ('<en-tête_1>' = '<valeur_1>')", en: "HEADER = ('<header_1>' = '<value_1>')" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "HEADER = TRUE indique à Snowflake d'inclure les noms de colonnes lors de l'unload. PARSE_HEADER et SKIP_HEADER sont des options côté chargement pour les fichiers CSV.",
      en: "HEADER = TRUE tells Snowflake to include column names during the unload. PARSE_HEADER and SKIP_HEADER are load-side options for CSV files.",
    },
  },
  {
    id: "sf-q20",
    question: {
      fr: "Quand les requêtes bénéficient-elles du clustering ? (choisir deux réponses)",
      en: "When do queries benefit from clustering? (choose two)",
    },
    options: [
      { fr: "Quand les requêtes filtrent ou trient sur la clustering key.", en: "When queries filter or sort on the clustering key." },
      { fr: "Quand les requêtes utilisent SELECT DISTINCT.", en: "When queries use SELECT DISTINCT." },
      { fr: "Quand les requêtes utilisent un échantillonnage aléatoire.", en: "When queries use random sampling." },
      { fr: "Quand les requêtes utilisent ORDER BY ou GROUP BY sur la clustering key.", en: "When queries use ORDER BY or GROUP BY on the clustering key." },
      {
        fr: "Quand les clustering keys sont appliquées à des colonnes non utilisées dans les filtres ou jointures.",
        en: "When clustering keys are applied to columns not used in filters or joins.",
      },
    ],
    correctIndexes: [0, 3],
    explanation: {
      fr: "Le clustering améliore le partition pruning ; les requêtes filtrant/triant/groupant sur les colonnes clusterisées en bénéficient. La dernière option est l'inverse d'un cas bénéfique.",
      en: "Clustering improves partition pruning; queries that filter/sort/group on clustered columns benefit from it. The last option is the opposite of a beneficial case.",
    },
  },
  {
    id: "sf-q21",
    question: {
      fr: "Un secret API_INTEGRATION_SECRET, créé par SECRET_ROLE, génère une erreur \"does not exist or operation not authorized\" quand une fonction (exécutée en tant que API_ROLE) tente de l'utiliser, même après un GRANT USAGE à API_ROLE.",
      en: "A secret API_INTEGRATION_SECRET, created by SECRET_ROLE, produces a \"does not exist or operation not authorized\" error when a function (running as API_ROLE) tries to use it, even after a GRANT USAGE to API_ROLE.",
    },
    options: [
      { fr: "Spécifier l'option de paramètre COPY GRANTS.", en: "Specify the COPY GRANTS parameter option." },
      { fr: "Recréer le secret en utilisant API_ROLE.", en: "Recreate the secret using API_ROLE." },
      { fr: "Changer le propriétaire du secret pour SECRET_ROLE.", en: "Change the secret's owner to SECRET_ROLE." },
      { fr: "Accorder READ sur le secret.", en: "Grant READ on the secret." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Le rôle propriétaire du secret doit correspondre au rôle exécutant la fonction pour une autorisation non ambiguë.",
      en: "The role that owns the secret must match the role executing the function for unambiguous authorization.",
    },
  },
  {
    id: "sf-q22",
    question: {
      fr: "Une équipe a besoin d'un warehouse à la demande, optimisé en coût, pendant les heures de pointe en fin de mois. Quels paramètres complètent la configuration ?",
      en: "A team needs an on-demand, cost-optimized warehouse during peak hours at month-end. Which settings complete the configuration?",
    },
    options: [
      { fr: "AUTO_SUSPEND=600, MAX_CLUSTER_COUNT=5, SCALING_POLICY='STANDARD'", en: "AUTO_SUSPEND=600, MAX_CLUSTER_COUNT=5, SCALING_POLICY='STANDARD'" },
      { fr: "AUTO_SUSPEND=NULL, MAX_CLUSTER_COUNT=5, SCALING_POLICY='STANDARD'", en: "AUTO_SUSPEND=NULL, MAX_CLUSTER_COUNT=5, SCALING_POLICY='STANDARD'" },
      { fr: "AUTO_SUSPEND=600, MIN_CLUSTER_COUNT=5, SCALING_POLICY='ECONOMY'", en: "AUTO_SUSPEND=600, MIN_CLUSTER_COUNT=5, SCALING_POLICY='ECONOMY'" },
      { fr: "AUTO_SUSPEND=10, MAX_CLUSTER_COUNT=5, SCALING_POLICY='ECONOMY'", en: "AUTO_SUSPEND=10, MAX_CLUSTER_COUNT=5, SCALING_POLICY='ECONOMY'" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Une suspension rapide (10s) minimise les coûts en période d'inactivité ; MAX_CLUSTER_COUNT permet le scale-out ; ECONOMY privilégie le contrôle des coûts sur la pure performance.",
      en: "A fast suspend (10s) minimizes costs during idle periods; MAX_CLUSTER_COUNT allows scale-out; ECONOMY favors cost control over pure performance.",
    },
  },
  {
    id: "sf-q23",
    question: {
      fr: "Quelle est l'édition minimale pour bénéficier de 90 jours de Time Travel ?",
      en: "What is the minimum edition required for 90 days of Time Travel?",
    },
    options: [
      { fr: "Standard", en: "Standard" },
      { fr: "Enterprise", en: "Enterprise" },
      { fr: "Business Critical", en: "Business Critical" },
      { fr: "Virtual Private Snowflake (VPS)", en: "Virtual Private Snowflake (VPS)" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "L'édition Standard est plafonnée à 1 jour. Enterprise (et au-delà) permet jusqu'à 90 jours de rétention Time Travel - c'est l'édition minimale requise.",
      en: "The Standard edition is capped at 1 day. Enterprise (and above) allows up to 90 days of Time Travel retention - it is the minimum edition required.",
    },
  },
  {
    id: "sf-q24",
    question: {
      fr: "Comment valider l'efficacité du pruning des micro-partitions pour une requête donnée ?",
      en: "How can you validate the effectiveness of micro-partition pruning for a given query?",
    },
    options: [
      { fr: "En inspectant le panneau de statistiques du Query Profile.", en: "By inspecting the statistics panel of the Query Profile." },
      { fr: "En exécutant la commande SHOW PARTITIONS.", en: "By running the SHOW PARTITIONS command." },
      { fr: "En consultant la vue WAREHOUSE_LOAD_HISTORY.", en: "By checking the WAREHOUSE_LOAD_HISTORY view." },
      { fr: "En consultant la vue ACCESS_HISTORY.", en: "By checking the ACCESS_HISTORY view." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Le Query Profile affiche \"Partitions scanned\" vs \"Partitions total\", révélant directement l'efficacité du pruning pour une requête donnée.",
      en: "The Query Profile displays \"Partitions scanned\" vs \"Partitions total\", directly revealing the pruning effectiveness for a given query.",
    },
  },
  {
    id: "sf-q25",
    question: {
      fr: "Quel est le statut initial d'une task clonée ?",
      en: "What is the initial status of a cloned task?",
    },
    options: [
      { fr: "Suspended", en: "Suspended" },
      { fr: "Running", en: "Running" },
      { fr: "Started", en: "Started" },
      { fr: "Resumed", en: "Resumed" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une task clonée démarre toujours à l'état SUSPENDED, quel que soit l'état de la task source, par mesure de sécurité (nécessite un RESUME manuel).",
      en: "A cloned task always starts in the SUSPENDED state, regardless of the source task's state, as a safety measure (it requires a manual RESUME).",
    },
  },
  {
    id: "sf-q26",
    question: {
      fr: "Quelles actions réduisent le memory spilling ? (choisir deux réponses)",
      en: "Which actions reduce memory spilling? (choose two)",
    },
    options: [
      { fr: "Augmenter la taille du virtual warehouse.", en: "Increase the size of the virtual warehouse." },
      { fr: "Modifier les requêtes pour traiter les données par plus petits lots.", en: "Modify the queries to process data in smaller batches." },
      { fr: "Augmenter le nombre de clusters du virtual warehouse.", en: "Increase the number of clusters in the virtual warehouse." },
      { fr: "Suspendre puis reprendre le virtual warehouse.", en: "Suspend and then resume the virtual warehouse." },
      { fr: "Définir une clustering key sur les tables utilisées par les requêtes.", en: "Define a clustering key on the tables used by the queries." },
    ],
    correctIndexes: [0, 1],
    explanation: {
      fr: "Un warehouse plus grand fournit plus de mémoire/cache local par nœud. Réduire le volume de données traité par requête réduit l'espace de travail nécessaire en une fois.",
      en: "A larger warehouse provides more memory/local cache per node. Reducing the amount of data processed per query reduces the working space needed at once.",
    },
  },
  {
    id: "sf-q27",
    question: {
      fr: "Où spécifier les copy options pour décharger régulièrement des données au format similaire ?",
      en: "Where should you specify copy options to regularly unload data in a similar format?",
    },
    options: [
      { fr: "Dans la définition d'un named stage.", en: "In the definition of a named stage." },
      { fr: "Dans la configuration du warehouse.", en: "In the warehouse configuration." },
      { fr: "Dans les paramètres par défaut de la base de données.", en: "In the database's default parameters." },
      { fr: "Dans une variable de session.", en: "In a session variable." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Pour des unloads répétés régulièrement avec le même format, il est recommandé de spécifier les options directement dans le named stage, évitant de les répéter dans chaque commande COPY.",
      en: "For unloads repeated regularly with the same format, it is recommended to specify the options directly in the named stage, avoiding the need to repeat them in every COPY command.",
    },
  },
  {
    id: "sf-q28",
    question: {
      fr: "Quelle fonctionnalité de scaling ne démarre un nouveau cluster que lorsqu'il y a suffisamment de charge estimée ?",
      en: "Which scaling feature only starts a new cluster when there is enough estimated load?",
    },
    options: [
      { fr: "La scaling policy Standard", en: "The Standard scaling policy" },
      { fr: "La scaling policy Economy", en: "The Economy scaling policy" },
      { fr: "La politique d'auto-suspend", en: "The auto-suspend policy" },
      { fr: "Le mode maximized multi-cluster", en: "Maximized multi-cluster mode" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "La politique Economy est conservatrice - elle ne démarre un nouveau cluster que si le système estime qu'il y a assez de charge de requêtes pour occuper ce cluster pendant au moins 6 minutes, minimisant la consommation de crédits.",
      en: "The Economy policy is conservative - it only starts a new cluster if the system estimates there is enough query load to keep that cluster busy for at least 6 minutes, minimizing credit consumption.",
    },
  },
  {
    id: "sf-q29",
    question: {
      fr: "Quel objet fournit la liste des fichiers stockés dans un stage ?",
      en: "Which object provides the list of files stored in a stage?",
    },
    options: [
      { fr: "Directory table", en: "Directory table" },
      { fr: "External table", en: "External table" },
      { fr: "Materialized view", en: "Materialized view" },
      { fr: "Information schema view", en: "Information schema view" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une directory table catalogue les fichiers (noms, chemins, tailles, métadonnées) présents dans un stage.",
      en: "A directory table catalogs the files (names, paths, sizes, metadata) present in a stage.",
    },
  },
  {
    id: "sf-q30",
    question: {
      fr: "Quelles valeurs entraînent des requêtes plus lentes et une consommation de stockage accrue dans une colonne VARIANT ? (choisir deux réponses)",
      en: "Which values lead to slower queries and increased storage consumption in a VARIANT column? (choose two)",
    },
    options: [
      { fr: "Les valeurs JSON null", en: "JSON null values" },
      { fr: "Les nombres à virgule flottante", en: "Floating-point numbers" },
      { fr: "Les tableaux (arrays)", en: "Arrays" },
      { fr: "Les vecteurs", en: "Vectors" },
      { fr: "Les timestamps sous forme de chaînes", en: "Timestamps stored as strings" },
    ],
    correctIndexes: [1, 4],
    explanation: {
      fr: "Les nombres à virgule flottante stockés en VARIANT perdent en précision et en efficacité de stockage. Les timestamps intégrés comme chaînes en VARIANT empêchent les optimisations colonnaires natives.",
      en: "Floating-point numbers stored in VARIANT lose precision and storage efficiency. Timestamps embedded as strings in VARIANT prevent native columnar optimizations.",
    },
  },
  {
    id: "sf-q31",
    question: {
      fr: "À quoi sert principalement SnowSQL ?",
      en: "What is SnowSQL primarily used for?",
    },
    options: [
      { fr: "Charger et décharger des données.", en: "Loading and unloading data." },
      { fr: "Gérer des applications Snowpark.", en: "Managing Snowpark applications." },
      { fr: "Configurer des network policies.", en: "Configuring network policies." },
      { fr: "Construire des applications Streamlit.", en: "Building Streamlit applications." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "SnowSQL est le client CLI couramment utilisé pour le chargement/déchargement en masse via PUT et COPY INTO.",
      en: "SnowSQL is the CLI client commonly used for bulk loading/unloading via PUT and COPY INTO.",
    },
  },
  {
    id: "sf-q32",
    question: {
      fr: "Quelle action SYSADMIN peut-il réaliser sans privilèges élevés ?",
      en: "Which action can SYSADMIN perform without elevated privileges?",
    },
    options: [
      { fr: "Gérer les virtual warehouses.", en: "Manage virtual warehouses." },
      { fr: "Gérer la facturation au niveau du compte.", en: "Manage account-level billing." },
      { fr: "Accorder le rôle ACCOUNTADMIN.", en: "Grant the ACCOUNTADMIN role." },
      { fr: "Modifier les paramètres de l'organisation.", en: "Modify organization-level settings." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "SYSADMIN a des privilèges inhérents pour créer/gérer des warehouses, bases de données et autres objets, sans élévation requise.",
      en: "SYSADMIN has inherent privileges to create/manage warehouses, databases, and other objects, without requiring elevation.",
    },
  },
  {
    id: "sf-q33",
    question: {
      fr: "Une table est mise à jour tout au long de la journée. Un utilisateur veut automatiser la capture des seules lignes modifiées toutes les 20 minutes, sans intervention manuelle.",
      en: "A table is updated throughout the day. A user wants to automate capturing only the modified rows every 20 minutes, with no manual intervention.",
    },
    options: [
      { fr: "Créer un stream et exécuter une task uniquement s'il y a des changements.", en: "Create a stream and run a task only if there are changes." },
      { fr: "Créer une task qui se déclenche toutes les 20 minutes.", en: "Create a task that triggers every 20 minutes." },
      { fr: "Créer un stream et planifier une task toutes les 20 minutes.", en: "Create a stream and schedule a task every 20 minutes." },
      { fr: "Utiliser une dynamic table pour matérialiser les changements et exécuter une task toutes les 20 minutes.", en: "Use a dynamic table to materialize the changes and run a task every 20 minutes." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Un stream capture les lignes modifiées ; une task planifiée toutes les 20 minutes consomme automatiquement le stream, sans intervention manuelle.",
      en: "A stream captures the modified rows; a task scheduled every 20 minutes automatically consumes the stream, with no manual intervention.",
    },
  },
  {
    id: "sf-q34",
    question: {
      fr: "Quelle est la méthode la plus efficace pour partager un sous-ensemble de données avec un compte consommateur ?",
      en: "What is the most efficient way to share a subset of data with a consumer account?",
    },
    options: [
      { fr: "Créer une User-Defined Function (UDF) sécurisée.", en: "Create a secure User-Defined Function (UDF)." },
      { fr: "Utiliser une dynamic table.", en: "Use a dynamic table." },
      { fr: "Créer une table externe.", en: "Create an external table." },
      { fr: "Créer une vue sécurisée (secure view).", en: "Create a secure view." },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Les secure views sont le mécanisme standard pour partager des données filtrées via Secure Data Sharing tout en masquant la définition de la vue sous-jacente.",
      en: "Secure views are the standard mechanism for sharing filtered data via Secure Data Sharing while hiding the underlying view definition.",
    },
  },
  {
    id: "sf-q35",
    question: {
      fr: "Quelle intégration est requise pour cloner un dépôt Git dans Snowflake ?",
      en: "Which integration is required to clone a Git repository into Snowflake?",
    },
    options: [
      { fr: "Storage integration", en: "Storage integration" },
      { fr: "Security integration", en: "Security integration" },
      { fr: "External Access integration", en: "External Access integration" },
      { fr: "API integration", en: "API integration" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "CREATE GIT REPOSITORY requiert un paramètre API_INTEGRATION, en utilisant une intégration créée avec API_PROVIDER = git_https_api.",
      en: "CREATE GIT REPOSITORY requires an API_INTEGRATION parameter, using an integration created with API_PROVIDER = git_https_api.",
    },
  },
  {
    id: "sf-q36",
    question: {
      fr: "Comment les directory tables sont-elles utilisées dans les pipelines de données ? (choisir deux réponses)",
      en: "How are directory tables used in data pipelines? (choose two)",
    },
    options: [
      { fr: "Pour interroger des données structurées résidant dans un stage externe.", en: "To query structured data residing in an external stage." },
      { fr: "Pour décharger les résultats d'un traitement de fichiers non structurés.", en: "To unload the results of processing unstructured files." },
      { fr: "Pour interroger une liste de fichiers stagés résidant dans un stockage interne ou externe.", en: "To query a list of staged files residing in internal or external storage." },
      { fr: "Pour stocker les informations de contrôle d'accès basé sur les rôles pour des données non structurées.", en: "To store role-based access control information for unstructured data." },
      { fr: "Pour joindre des données avec une table Snowflake contenant des métadonnées de fichiers non structurés.", en: "To join data with a Snowflake table containing metadata of unstructured files." },
    ],
    correctIndexes: [2, 4],
    explanation: {
      fr: "Les directory tables cataloguent les fichiers d'un stage (interne ou externe) et peuvent être jointes à d'autres tables Snowflake via leurs métadonnées.",
      en: "Directory tables catalog the files of a stage (internal or external) and can be joined to other Snowflake tables via their metadata.",
    },
  },
  {
    id: "sf-q37",
    question: {
      fr: "Quel objet peut être référencé depuis une User-Defined Function (UDF) ?",
      en: "Which object can be referenced from a User-Defined Function (UDF)?",
    },
    options: [
      { fr: "Vue", en: "View" },
      { fr: "Stream", en: "Stream" },
      { fr: "Table externe", en: "External table" },
      { fr: "Vue matérialisée", en: "Materialized view" },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Une UDF SQL peut référencer des tables et des vues dans sa logique SELECT. Les streams et tables externes ne sont pas des objets référençables typiques pour les UDF.",
      en: "A SQL UDF can reference tables and views in its SELECT logic. Streams and external tables are not typical referenceable objects for UDFs.",
    },
  },
  {
    id: "sf-q38",
    question: {
      fr: "Quelle fonctionnalité utilise une clé Snowflake combinée à une clé gérée par le client pour protéger les données ?",
      en: "Which feature uses a Snowflake key combined with a customer-managed key to protect data?",
    },
    options: [
      { fr: "Trust Center", en: "Trust Center" },
      { fr: "Tri-Secret Secure", en: "Tri-Secret Secure" },
      { fr: "Key-pair authentication", en: "Key-pair authentication" },
      { fr: "Multi-Factor Authentication (MFA)", en: "Multi-Factor Authentication (MFA)" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Tri-Secret Secure combine une clé maintenue par Snowflake avec une clé gérée par le client (KMS externe) pour créer une clé maître composite chiffrant les données.",
      en: "Tri-Secret Secure combines a key maintained by Snowflake with a customer-managed key (external KMS) to create a composite master key that encrypts the data.",
    },
  },
  {
    id: "sf-q39",
    question: {
      fr: "Quelles métadonnées Snowflake stocke-t-il à propos des lignes d'une micro-partition ? (choisir deux réponses)",
      en: "Which metadata does Snowflake store about the rows of a micro-partition? (choose two)",
    },
    options: [
      { fr: "La plage de valeurs de chaque colonne", en: "The range of values for each column" },
      { fr: "La valeur moyenne de chaque colonne", en: "The average value of each column" },
      { fr: "Le nombre de valeurs distinctes", en: "The number of distinct values" },
      { fr: "Le nombre total de valeurs", en: "The total number of values" },
      { fr: "Le nombre de fois où chaque colonne a été interrogée", en: "The number of times each column has been queried" },
    ],
    correctIndexes: [0, 3],
    explanation: {
      fr: "Snowflake stocke le min/max par colonne (pour le pruning) et le nombre de lignes par micro-partition.",
      en: "Snowflake stores the min/max per column (for pruning) and the number of rows per micro-partition.",
    },
  },
  {
    id: "sf-q40",
    question: {
      fr: "Quelle étape permet d'optimiser les coûts pour un warehouse mixte (chargement continu + reporting) ?",
      en: "Which step helps optimize costs for a mixed workload warehouse (continuous loading + reporting)?",
    },
    options: [
      { fr: "Créer des warehouses séparés pour chaque workload.", en: "Create separate warehouses for each workload." },
      { fr: "Activer le query acceleration service.", en: "Enable the query acceleration service." },
      { fr: "Passer à un warehouse multi-cluster.", en: "Switch to a multi-cluster warehouse." },
      { fr: "Redimensionner le warehouse en taille Small.", en: "Resize the warehouse to Small." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Séparer les workloads (chargement continu vs requêtes de reporting) permet un dimensionnement/scaling indépendant, évitant le gaspillage de crédits.",
      en: "Separating the workloads (continuous loading vs. reporting queries) allows independent sizing/scaling, avoiding wasted credits.",
    },
  },
  {
    id: "sf-q41",
    question: {
      fr: "Quelle requête permet d'exploser un tableau JSON en lignes séparées pour analyse ?",
      en: "Which query explodes a JSON array into separate rows for analysis?",
    },
    options: [
      { fr: "SELECT details FROM events, LATERAL FLATTEN(INPUT => details);", en: "SELECT details FROM events, LATERAL FLATTEN(INPUT => details);" },
      { fr: "SELECT details[0] FROM events;", en: "SELECT details[0] FROM events;" },
      { fr: "SELECT value FROM events, LATERAL FLATTEN(INPUT => details);", en: "SELECT value FROM events, LATERAL FLATTEN(INPUT => details);" },
      { fr: "SELECT ARRAY_AGG(value) FROM events, LATERAL FLATTEN(INPUT => details);", en: "SELECT ARRAY_AGG(value) FROM events, LATERAL FLATTEN(INPUT => details);" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "value est la colonne de sortie standard de LATERAL FLATTEN représentant chaque élément exploité du tableau.",
      en: "value is the standard output column of LATERAL FLATTEN representing each exploded element of the array.",
    },
  },
  {
    id: "sf-q42",
    question: {
      fr: "Quelle fonctionnalité de sécurité permet le remplacement de clés actives (authentification par paire de clés) ?",
      en: "Which security feature allows replacement of active keys (key-pair authentication)?",
    },
    options: [
      { fr: "Authentication", en: "Authentication" },
      { fr: "Passkeys", en: "Passkeys" },
      { fr: "Rotation", en: "Rotation" },
      { fr: "Codes temporaires (TOTP)", en: "Time-based one-time codes (TOTP)" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "La rotation de clés permet d'avoir deux paires de clés actives simultanément afin de remplacer une ancienne clé sans interruption d'authentification.",
      en: "Key rotation allows two key pairs to be active simultaneously so an old key can be replaced without any authentication interruption.",
    },
  },
  {
    id: "sf-q43",
    question: {
      fr: "Comment Snowflake gère-t-il le stockage pour les tables externes ?",
      en: "How does Snowflake handle storage for external tables?",
    },
    options: [
      { fr: "Snowflake réplique et stocke automatiquement toutes les données des tables externes.", en: "Snowflake automatically replicates and stores all the data of external tables." },
      { fr: "Snowflake stocke les métadonnées des tables externes.", en: "Snowflake stores the metadata of external tables." },
      { fr: "Snowflake référence les tables externes via des directory tables internes.", en: "Snowflake references external tables via internal directory tables." },
      { fr: "Snowflake référence les tables externes via des tables transientes internes.", en: "Snowflake references external tables via internal transient tables." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Les données restent physiquement dans le stockage cloud externe ; Snowflake ne stocke que les métadonnées (chemins de fichiers, mapping de schéma, etc.).",
      en: "The data physically remains in external cloud storage; Snowflake only stores the metadata (file paths, schema mapping, etc.).",
    },
  },
  {
    id: "sf-q44",
    question: {
      fr: "Quelle fonction retourne une estimation de cardinalité (ville/état/code postal) ?",
      en: "Which function returns a cardinality estimate (city/state/postal code)?",
    },
    options: [
      { fr: "COVAR_POP", en: "COVAR_POP" },
      { fr: "OBJECT_AGG", en: "OBJECT_AGG" },
      { fr: "APPROX_COUNT_DISTINCT", en: "APPROX_COUNT_DISTINCT" },
      { fr: "REGR_COUNT", en: "REGR_COUNT" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Utilise l'algorithme HyperLogLog pour une estimation de cardinalité rapide et économe en mémoire.",
      en: "Uses the HyperLogLog algorithm for a fast, memory-efficient cardinality estimate.",
    },
  },
  {
    id: "sf-q45",
    question: {
      fr: "Pourquoi la première requête sur un warehouse est-elle plus longue que la même requête relancée une heure plus tard ?",
      en: "Why does the first query on a warehouse take longer than the same query run again an hour later?",
    },
    options: [
      { fr: "La connexion réseau est plus lente à cause d'un trafic élevé.", en: "The network connection is slower due to high traffic." },
      { fr: "Le warehouse copie toutes les données du stockage avant d'exécuter la première requête.", en: "The warehouse copies all the data from storage before running the first query." },
      { fr: "La première requête a été compilée par la base, la seconde utilise une version précompilée.", en: "The first query was compiled by the database, the second uses a precompiled version." },
      { fr: "Le warehouse était suspendu initialement, la seconde requête utilise des données en cache.", en: "The warehouse was initially suspended; the second query benefits from cached data." },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "Un warehouse démarre avec un cache SSD local vide. La première exécution peuple ce cache depuis le stockage distant ; les requêtes suivantes bénéficient du cache local plus rapide.",
      en: "A warehouse starts with an empty local SSD cache. The first run populates that cache from remote storage; subsequent queries benefit from the faster local cache.",
    },
  },
  {
    id: "sf-q46",
    question: {
      fr: "Quelle action est autorisée sur une masking policy basée sur des tags ?",
      en: "Which action is allowed on a tag-based masking policy?",
    },
    options: [
      { fr: "Plusieurs masking policies par type de données peuvent être créées.", en: "Multiple masking policies per data type can be created." },
      { fr: "Une vue matérialisée peut être créée si la table sous-jacente est protégée par une masking policy basée sur des tags.", en: "A materialized view can be created if the underlying table is protected by a tag-based masking policy." },
      { fr: "La masking policy peut être supprimée si elle n'est assignée à aucun tag.", en: "The masking policy can be dropped if it is not assigned to any tag." },
      { fr: "Une colonne masquée peut être utilisée comme colonne conditionnelle dans une masking policy.", en: "A masked column can be used as a conditional column in a masking policy." },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Une masking policy doit d'abord être désassignée de tout tag avant de pouvoir être supprimée.",
      en: "A masking policy must first be unassigned from any tag before it can be dropped.",
    },
  },
  {
    id: "sf-q47",
    question: {
      fr: "Quelles requêtes peuvent être exécutées en parallèle via le Query Acceleration Service ? (choisir deux réponses)",
      en: "Which queries can be run in parallel via the Query Acceleration Service? (choose two)",
    },
    options: [
      { fr: "De larges scans qui suppriment de nombreuses lignes et colonnes", en: "Large scans that delete many rows and columns" },
      { fr: "De larges scans utilisant une agrégation ou un filtre sélectif", en: "Large scans using an aggregation or a selective filter" },
      { fr: "Des requêtes avec des jointures complexes sur de petites tables", en: "Queries with complex joins on small tables" },
      { fr: "De petits scans qui lisent et écrivent des lignes très lentement", en: "Small scans that read and write rows very slowly" },
      { fr: "De larges scans qui insèrent de nombreuses nouvelles lignes", en: "Large scans that insert many new rows" },
    ],
    correctIndexes: [1, 4],
    explanation: {
      fr: "Le QAS accélère 2 profils de requêtes : (1) larges scans avec agrégation ou filtre sélectif, (2) larges scans qui insèrent ou copient de nombreuses nouvelles lignes.",
      en: "QAS accelerates 2 query profiles: (1) large scans with aggregation or a selective filter, (2) large scans that insert or copy many new rows.",
    },
  },
  {
    id: "sf-q48",
    question: {
      fr: "Quel type de table doit être utilisé avec un stream insert-only ?",
      en: "Which table type should be used with an insert-only stream?",
    },
    options: [
      { fr: "Temporary", en: "Temporary" },
      { fr: "Hybrid", en: "Hybrid" },
      { fr: "External", en: "External" },
      { fr: "Transient", en: "Transient" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Les streams insert-only (INSERT_ONLY = TRUE) sont spécifiquement documentés comme supportés pour les tables externes.",
      en: "Insert-only streams (INSERT_ONLY = TRUE) are specifically documented as supported for external tables.",
    },
  },
  {
    id: "sf-q49",
    question: {
      fr: "Comment permettre à ETL_ROLE d'accéder à une table dès sa création ?",
      en: "How do you allow ETL_ROLE to access a table as soon as it is created?",
    },
    options: [
      { fr: "GRANT SELECT ON TABLE MYTABLE TO ROLE ETL_ROLE;", en: "GRANT SELECT ON TABLE MYTABLE TO ROLE ETL_ROLE;" },
      { fr: "GRANT SELECT ON TABLE MYTABLE TO ROLE DEVELOPER_ROLE;", en: "GRANT SELECT ON TABLE MYTABLE TO ROLE DEVELOPER_ROLE;" },
      { fr: "GRANT SELECT ON FUTURE TABLES IN SCHEMA MYSCH TO ROLE ETL_ROLE;", en: "GRANT SELECT ON FUTURE TABLES IN SCHEMA MYSCH TO ROLE ETL_ROLE;" },
      { fr: "GRANT SELECT ON FUTURE TABLES IN SCHEMA MYSCH TO ROLE DEVELOPER_ROLE;", en: "GRANT SELECT ON FUTURE TABLES IN SCHEMA MYSCH TO ROLE DEVELOPER_ROLE;" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Les future grants s'appliquent automatiquement dès qu'un nouvel objet est créé dans le schéma, sans intervention manuelle répétée.",
      en: "Future grants apply automatically as soon as a new object is created in the schema, with no repeated manual intervention.",
    },
  },
  {
    id: "sf-q50",
    question: {
      fr: "Quelle fonction permet de récupérer toutes les erreurs de la dernière exécution d'un COPY INTO <table> ?",
      en: "Which function retrieves all errors from the last execution of a COPY INTO <table>?",
    },
    options: [
      { fr: "LIST", en: "LIST" },
      { fr: "VALIDATE", en: "VALIDATE" },
      { fr: "RESULT_SCAN", en: "RESULT_SCAN" },
      { fr: "COPY_HISTORY", en: "COPY_HISTORY" },
    ],
    correctIndexes: [3],
    explanation: {
      fr: "Table function retournant des métadonnées détaillées sur les exécutions passées de COPY INTO, y compris les erreurs.",
      en: "A table function that returns detailed metadata about past COPY INTO executions, including errors.",
    },
  },
  {
    id: "sf-q51",
    question: {
      fr: "Quel paramètre de COPY permet de charger des données non structurées ?",
      en: "Which COPY parameter allows loading unstructured data?",
    },
    options: [
      { fr: "FORCE", en: "FORCE" },
      { fr: "LOAD_UNCERTAIN_FILES", en: "LOAD_UNCERTAIN_FILES" },
      { fr: "FILE_PROCESSOR", en: "FILE_PROCESSOR" },
      { fr: "LOAD_MODE", en: "LOAD_MODE" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "Permet de spécifier une UDTF qui traite/extrait le contenu structuré de fichiers non structurés (images, PDF, etc.).",
      en: "Allows specifying a UDTF that processes/extracts structured content from unstructured files (images, PDFs, etc.).",
    },
  },
  {
    id: "sf-q52",
    question: {
      fr: "Quelles méthodes d'authentification sont possibles pour connecter VS Code à Snowflake ? (choisir deux réponses)",
      en: "Which authentication methods can be used to connect VS Code to Snowflake? (choose two)",
    },
    options: [
      { fr: "Nom d'utilisateur/mot de passe", en: "Username/password" },
      { fr: "Multi-Factor Authentication (MFA)", en: "Multi-Factor Authentication (MFA)" },
      { fr: "Single Sign-On (SSO)", en: "Single Sign-On (SSO)" },
      { fr: "Clé API", en: "API key" },
      { fr: "Pilote JDBC/ODBC", en: "JDBC/ODBC driver" },
    ],
    correctIndexes: [0, 2],
    explanation: {
      fr: "L'extension VS Code documente 3 méthodes : nom d'utilisateur/mot de passe, paire de clés, et SSO. MFA n'est pas une méthode d'authentification primaire distincte, la clé API n'est pas listée, et JDBC/ODBC est un type de pilote, pas une méthode d'authentification.",
      en: "The VS Code extension documents 3 methods: username/password, key pair, and SSO. MFA is not a distinct primary authentication method, API key is not listed, and JDBC/ODBC is a driver type, not an authentication method.",
    },
  },
  {
    id: "sf-q53",
    question: {
      fr: "Quel type de données Snowsight affiche-t-il pour une colonne définie en CHARACTER(25) ?",
      en: "Which data type does Snowsight display for a column defined as CHARACTER(25)?",
    },
    options: [
      { fr: "STRING(25)", en: "STRING(25)" },
      { fr: "TEXT(25)", en: "TEXT(25)" },
      { fr: "VARCHAR(25)", en: "VARCHAR(25)" },
      { fr: "CHARACTER(25)", en: "CHARACTER(25)" },
    ],
    correctIndexes: [2],
    explanation: {
      fr: "CHAR, CHARACTER, STRING, TEXT sont tous des synonymes de VARCHAR ; Snowflake normalise et affiche toujours VARCHAR.",
      en: "CHAR, CHARACTER, STRING, and TEXT are all synonyms for VARCHAR; Snowflake always normalizes and displays VARCHAR.",
    },
  },
  {
    id: "sf-q54",
    question: {
      fr: "Quelles fonctionnalités de sécurité contrôlent l'accès entrant à Snowflake et aux stages internes ? (choisir deux réponses)",
      en: "Which security features control inbound access to Snowflake and to internal stages? (choose two)",
    },
    options: [
      { fr: "Network rules", en: "Network rules" },
      { fr: "Feature policies", en: "Feature policies" },
      { fr: "Network policies", en: "Network policies" },
      { fr: "Packages policies", en: "Packages policies" },
      { fr: "Authentication policies", en: "Authentication policies" },
    ],
    correctIndexes: [0, 2],
    explanation: {
      fr: "Les network rules définissent les IP/hôtes autorisés/bloqués ; les network policies les utilisent pour restreindre l'accès entrant.",
      en: "Network rules define the allowed/blocked IPs/hosts; network policies use them to restrict inbound access.",
    },
  },
  {
    id: "sf-q55",
    question: {
      fr: "Quels paramètres configurent le mode Maximized par rapport au mode Auto-scale ? (choisir deux réponses)",
      en: "Which parameters configure Maximized mode versus Auto-scale mode? (choose two)",
    },
    options: [
      { fr: "SET WAREHOUSE_SIZE", en: "SET WAREHOUSE_SIZE" },
      { fr: "SET MIN_CLUSTER_COUNT", en: "SET MIN_CLUSTER_COUNT" },
      { fr: "SET MAX_CONCURRENCY_LEVEL", en: "SET MAX_CONCURRENCY_LEVEL" },
      { fr: "SET WAREHOUSE_TYPE", en: "SET WAREHOUSE_TYPE" },
      { fr: "SET MAX_CLUSTER_COUNT", en: "SET MAX_CLUSTER_COUNT" },
    ],
    correctIndexes: [1, 4],
    explanation: {
      fr: "Le mode Maximized = MIN=MAX (nombre fixe de clusters) ; l'Auto-scale = MIN < MAX (scaling dynamique).",
      en: "Maximized mode = MIN=MAX (fixed number of clusters); Auto-scale = MIN < MAX (dynamic scaling).",
    },
  },
  {
    id: "sf-q56",
    question: {
      fr: "Quel type de listing du Marketplace restreint le partage aux seuls comptes invités ?",
      en: "Which Marketplace listing type restricts sharing to invited accounts only?",
    },
    options: [
      { fr: "Public listing", en: "Public listing" },
      { fr: "Private listing", en: "Private listing" },
      { fr: "Personalized Data Exchange", en: "Personalized Data Exchange" },
      { fr: "Provider profile listing", en: "Provider profile listing" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "N'apparaît pas dans les résultats de recherche publics ; seuls les comptes invités peuvent voir/s'abonner.",
      en: "It does not appear in public search results; only invited accounts can view/subscribe.",
    },
  },
  {
    id: "sf-q57",
    question: {
      fr: "Quelle est la méthode recommandée pour partager un jeu de données avec n'importe quel compte Snowflake (même région cloud) ?",
      en: "What is the recommended way to share a dataset with any Snowflake account (same cloud region)?",
    },
    options: [
      { fr: "Utiliser un public listing.", en: "Use a public listing." },
      { fr: "Utiliser un direct share.", en: "Use a direct share." },
      { fr: "Utiliser un Data Exchange.", en: "Use a Data Exchange." },
      { fr: "Utiliser un stage externe.", en: "Use an external stage." },
    ],
    correctIndexes: [0],
    explanation: {
      fr: "Rend le jeu de données découvrable par n'importe quel compte Snowflake sans restriction, contrairement au direct share (manuel) ou au Data Exchange (groupe restreint).",
      en: "It makes the dataset discoverable by any Snowflake account without restriction, unlike a direct share (manual) or a Data Exchange (restricted group).",
    },
  },
  {
    id: "sf-q58",
    question: {
      fr: "Quel mot-clé de Query History correspond à un COPY INTO <stage> déchargeant 1 To ?",
      en: "Which Query History keyword corresponds to a COPY INTO <stage> unloading 1 TB?",
    },
    options: [
      { fr: "INSERT", en: "INSERT" },
      { fr: "UNLOAD", en: "UNLOAD" },
      { fr: "COPY", en: "COPY" },
      { fr: "UPDATE", en: "UPDATE" },
    ],
    correctIndexes: [1],
    explanation: {
      fr: "QUERY_TYPE distingue UNLOAD (déchargement vers un stage) de COPY (chargement dans une table).",
      en: "QUERY_TYPE distinguishes UNLOAD (unloading to a stage) from COPY (loading into a table).",
    },
  },
  {
    id: "sf-q59",
    question: {
      fr: "Quels objets permettent une récupération rapide des résultats pour des requêtes avec des fonctions d'agrégation ? (choisir deux réponses)",
      en: "Which objects allow fast result retrieval for queries with aggregation functions? (choose two)",
    },
    options: [
      { fr: "Hybrid table", en: "Hybrid table" },
      { fr: "Materialized view", en: "Materialized view" },
      { fr: "Dynamic table", en: "Dynamic table" },
      { fr: "External table", en: "External table" },
      { fr: "Secure view", en: "Secure view" },
    ],
    correctIndexes: [1, 2],
    explanation: {
      fr: "Les deux pré-calculent et stockent les résultats agrégés. Les secure views n'apportent aucun bénéfice de performance - elles exécutent toujours la requête sous-jacente à chaque fois.",
      en: "Both pre-compute and store aggregated results. Secure views provide no performance benefit - they always execute the underlying query each time.",
    },
  },
  {
    id: "sf-q60",
    type: "order",
    question: {
      fr: "Remets dans l'ordre les étapes classiques d'un pipeline de chargement de données dans Snowflake.",
      en: "Put the typical steps of a Snowflake data loading pipeline in order.",
    },
    options: [
      { fr: "Déposer les fichiers sur un stage", en: "Land the files on a stage" },
      { fr: "Créer un file format adapté", en: "Create a matching file format" },
      { fr: "Charger les données avec COPY INTO", en: "Load the data with COPY INTO" },
      { fr: "Transformer les données avec des vues ou des tâches", en: "Transform the data with views or tasks" },
      { fr: "Exposer les données via une vue sécurisée", en: "Expose the data through a secure view" },
    ],
    correctIndexes: [],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: {
      fr: "Ordre classique : dépôt sur un stage, définition du file format, chargement via COPY INTO, transformation, puis exposition contrôlée via une vue sécurisée.",
      en: "Typical order: land files on a stage, define the file format, load with COPY INTO, transform, then expose the data through a controlled secure view.",
    },
  },
  {
    id: "sf-q61",
    type: "order",
    question: {
      fr: "Classe ces objets Snowflake du plus large (compte) au plus précis (ligne).",
      en: "Rank these Snowflake objects from broadest (account) to most granular (row).",
    },
    options: [
      { fr: "Compte Snowflake", en: "Snowflake account" },
      { fr: "Base de données", en: "Database" },
      { fr: "Schéma", en: "Schema" },
      { fr: "Table", en: "Table" },
      { fr: "Row access policy", en: "Row access policy" },
    ],
    correctIndexes: [],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: {
      fr: "La hiérarchie Snowflake va du compte à la base de données, puis au schéma, à la table, jusqu'à la row access policy qui filtre les lignes individuelles.",
      en: "The Snowflake hierarchy goes from the account down to the database, then schema, table, and finally the row access policy filtering individual rows.",
    },
  },
];
