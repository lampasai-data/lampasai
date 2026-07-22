import type { Question } from "./types";

// SnowPro Core certification practice bank (59 questions).
export const SNOWFLAKE_QUESTIONS: Question[] = [
  {
    id: "sf-q1",
    question:
      "Un praticien Snowflake travaillant sur un projet Gen AI doit partager de manière sécurisée des fichiers spécifiques d'un stage interne avec des partenaires externes, sans leur donner de privilèges directs sur le stage.",
    options: [
      "Générer une file URL pour chaque fichier et la partager avec les partenaires externes.",
      "Générer une scoped URL pour chaque fichier et la partager avec les partenaires externes.",
      "Accorder aux partenaires externes un accès en lecture au stage et leur fournir les chemins des fichiers.",
      "Générer une pre-signed URL pour chaque fichier et la partager avec les partenaires externes.",
    ],
    correctIndexes: [1],
    explanation:
      "Les scoped URLs sont conçues exactement pour ce scénario : accès sécurisé et temporaire à des fichiers d'un stage interne, sans privilèges directs sur le stage. Les file URLs nécessitent des privilèges sur le stage, et les pre-signed URLs concernent les stages externes (S3, etc.).",
  },
  {
    id: "sf-q2",
    question:
      "Une grande entreprise internationale veut maximiser la disponibilité de son système en cas de panne d'un fournisseur cloud affectant Snowflake.",
    options: [
      "Des téléchargements planifiés de la base vers un stockage cloud.",
      "Un failover group vers une autre région et un autre fournisseur cloud.",
      "Une réplication de compte dans la même région et le même fournisseur cloud.",
      "Un clonage planifié de la base conservé dans le compte Snowflake.",
    ],
    correctIndexes: [1],
    explanation:
      "Un failover group répliqué vers un autre fournisseur cloud/région protège contre une panne totale d'un fournisseur cloud. Les autres options restent dépendantes du même fournisseur ou ne couvrent qu'une sauvegarde, pas la haute disponibilité.",
  },
  {
    id: "sf-q3",
    question: "Quels outils permettent d'écrire du code avec l'API Snowpark ? (choisir deux réponses)",
    options: [
      "Snowpark Container Services",
      "Snowpark for Scala",
      "Snowpark for Python",
      "Streamlit in Snowflake",
      "SQL Scripting",
    ],
    correctIndexes: [1, 2],
    explanation:
      "Snowpark est un framework de développement permettant d'écrire du code en Python, Scala (et Java) plutôt qu'en SQL. Snowpark Container Services est une plateforme de calcul conteneurisé, pas une API de langage.",
  },
  {
    id: "sf-q4",
    question: "Quelle fonctionnalité permet d'auditer dans le temps la façon dont des données sensibles sont consultées ?",
    options: [
      "La sécurité au niveau colonne",
      "La sécurité au niveau ligne",
      "Une masking policy basée sur des tags",
      "Le tagging d'objets",
    ],
    correctIndexes: [3],
    explanation:
      "Le tagging d'objets permet d'associer des tags aux tables/colonnes, puis d'utiliser ACCESS_HISTORY combiné aux références de tags pour tracer l'accès aux données sensibles dans le temps.",
  },
  {
    id: "sf-q5",
    question: "Comment un utilisateur peut-il travailler avec plusieurs rôles assignés sans devoir fréquemment changer de rôle ?",
    options: [
      "Utiliser des rôles secondaires et un rôle primaire.",
      "Accorder à l'utilisateur le rôle ACCOUNTADMIN.",
      "Accorder à l'utilisateur le rôle parent des rôles déjà assignés.",
      "Créer un nouveau rôle et lui accorder les rôles existants.",
    ],
    correctIndexes: [0],
    explanation:
      "Les rôles secondaires permettent d'activer plusieurs rôles simultanément dans une session (USE SECONDARY ROLES ALL), en cumulant leurs privilèges, pendant que le rôle primaire reste actif pour la création/possession d'objets.",
  },
  {
    id: "sf-q6",
    question: "Quel est l'usage recommandé de COPY INTO <location> avec SINGLE = TRUE ?",
    options: [
      "Charger des données sans duplication.",
      "Charger un fichier individuel.",
      "Copier des données et parser les résultats en single stages.",
      "Décharger (unload) un seul fichier d'une table vers un stage.",
    ],
    correctIndexes: [3],
    explanation:
      "COPY INTO <location> est la commande d'unload. SINGLE = TRUE force Snowflake à écrire un seul fichier de sortie au lieu de plusieurs, recommandé uniquement pour de petits volumes car cela limite le parallélisme.",
  },
  {
    id: "sf-q7",
    question:
      "Le nombre d'utilisateurs d'un virtual warehouse et le nombre de rapports consultés augmentent. Quelle action permet de savoir si le warehouse est surchargé ?",
    options: [
      "Surveiller la durée des requêtes en cours.",
      "Déterminer si des requêtes sont mises en file d'attente (queuing).",
      "Vérifier le nombre de requêtes en cours dans Query History.",
      "Déterminer si des requêtes bénéficieraient du query acceleration service.",
    ],
    correctIndexes: [1],
    explanation:
      "Le queuing est le signe classique d'un warehouse surchargé, visible dans WAREHOUSE_LOAD_HISTORY qui montre les requêtes en attente vs en cours d'exécution.",
  },
  {
    id: "sf-q8",
    question: "Quel type de table est supporté par Open Catalog pour fournir un accès centralisé en lecture/écriture ?",
    options: ["Hybrid", "Iceberg", "Dynamic", "Event"],
    correctIndexes: [1],
    explanation:
      "Snowflake Open Catalog est l'implémentation managée d'Apache Polaris, un catalogue open-source pour les tables Apache Iceberg, avec gestion centralisée et accès lecture/écriture multi-moteurs.",
  },
  {
    id: "sf-q9",
    question: "Quelle fonction permet d'accéder aux valeurs d'un objet ?",
    options: ["OBJECT_KEYS", "OBJECT_PICK", "GET_PATH", "XMLGET"],
    correctIndexes: [2],
    explanation:
      "GET_PATH extrait une valeur d'un objet/VARIANT via un chemin donné (ex: GET_PATH(mon_objet, 'address.city')). OBJECT_KEYS ne retourne que les clés, OBJECT_PICK construit un nouvel objet, XMLGET concerne le XML.",
  },
  {
    id: "sf-q10",
    question: "Quelle vue montre le lignage des colonnes (column lineage) au sein d'un compte ?",
    options: ["ACCESS_HISTORY", "OBJECT_DEPENDENCIES", "QUERY_HISTORY", "COPY_HISTORY"],
    correctIndexes: [0],
    explanation:
      "ACCESS_HISTORY (dans SNOWFLAKE.ACCOUNT_USAGE) trace les opérations de lecture/écriture, avec les champs DIRECT_SOURCES_ACCESSED et OBJECTS_MODIFIED, capturant le lignage au niveau colonne. C'est aussi la source du graphe de Lineage dans Snowsight.",
  },
  {
    id: "sf-q11",
    question:
      "Un praticien doit exécuter plusieurs requêtes référençant plusieurs fois la même valeur d'année fiscale, sans la coder en dur à chaque fois.",
    options: [
      "Utiliser une table temporaire.",
      "Utiliser une variable de session.",
      "Utiliser une valeur par défaut de colonne.",
      "Utiliser une bind variable.",
    ],
    correctIndexes: [1],
    explanation:
      "Les variables de session (SET fiscal_year = 2026;) permettent de définir une valeur une fois et de la référencer ($fiscal_year) dans plusieurs requêtes de la même session.",
  },
  {
    id: "sf-q12",
    question:
      "Une colonne JSON LOG_DATA contient un tableau imbriqué de transactions pour chaque entrée de log. Quelle table function permet de convertir ce tableau JSON en plusieurs lignes et de faire un lateral join ?",
    options: ["JSON_EXTRACT_PATH_TEXT", "OBJECT_CONSTRUCT", "FLATTEN", "PARSE_JSON"],
    correctIndexes: [2],
    explanation:
      "FLATTEN explose les éléments imbriqués d'un tableau/objet en plusieurs lignes, typiquement utilisé avec LATERAL FLATTEN(input => colonne).",
  },
  {
    id: "sf-q13",
    question:
      "Les départements A et B doivent tous deux accéder aux mêmes données, mais des informations sensibles doivent être cachées au département B.",
    options: [
      "Créer et partager un rapport avec le département B sans les données sensibles.",
      "Mettre en place une masking policy sur les données sensibles.",
      "Construire des data marts et rapports séparés pour chaque département.",
      "Restreindre l'accès du département B aux colonnes sensibles.",
    ],
    correctIndexes: [1],
    explanation:
      "Une masking policy dynamique permet aux deux départements d'interroger la même table/vue, en masquant les valeurs sensibles selon le rôle de l'utilisateur, sans duplication ni maintenance manuelle.",
  },
  {
    id: "sf-q14",
    question:
      "Quel est l'impact en stockage du clonage d'une table de 1 To puis de la mise à jour de 10% des lignes ?",
    options: [
      "Seules les métadonnées sont stockées.",
      "Le stockage complet est dupliqué.",
      "Aucun stockage additionnel n'est utilisé.",
      "Seules les données modifiées consomment du stockage additionnel.",
    ],
    correctIndexes: [3],
    explanation:
      "Le clonage zero-copy partage initialement les mêmes micro-partitions. Une fois 10% des lignes mises à jour, Snowflake écrit de nouvelles micro-partitions uniquement pour les données modifiées (architecture de stockage immuable).",
  },
  {
    id: "sf-q15",
    question: "Quelle est la différence clé entre Snowflake CLI et SnowSQL ?",
    options: [
      "Snowflake CLI sert principalement à gérer workloads et applications, tandis que SnowSQL sert à exécuter des opérations (requêtes).",
      "SnowSQL sert à gérer workloads et applications, tandis que Snowflake CLI sert à exécuter des requêtes.",
      "Les deux outils servent exclusivement à exécuter des requêtes SQL.",
      "Snowflake CLI remplace entièrement SnowSQL, qui ne fonctionne plus.",
    ],
    correctIndexes: [0],
    explanation:
      "Snowflake CLI est un outil plus récent pour gérer des objets Snowflake et déployer/gérer des workloads (apps Snowpark, Streamlit, native apps, SPCS). SnowSQL est le client CLI traditionnel pour exécuter des requêtes SQL et du DDL/DML.",
  },
  {
    id: "sf-q16",
    question: "Quelle affirmation sur les streams de table est correcte ?",
    options: [
      "Des streams peuvent être créés pour suivre les changements sur des vues, des tables externes et des stages externes.",
      "Un seul stream peut être créé par table à la fois.",
      "Renommer une table rend son stream obsolète (stale).",
      "Les streams ne peuvent pas suivre les changements sur des vues.",
    ],
    correctIndexes: [0],
    explanation:
      "Plusieurs streams PEUVENT être créés sur la même table. Renommer une table ne rend PAS le stream obsolète — il suit la table renommée. Les streams supportent le suivi des changements sur les tables standards, vues, tables externes et directory tables de stages externes.",
  },
  {
    id: "sf-q17",
    question: "Quel est le meilleur choix pour un retour quasi temps réel sur l'ingestion de données ?",
    options: [
      "Snowpipe",
      "La commande COPY INTO <table> planifiée via une Task",
      "Streams",
      "Snowpipe Streaming",
    ],
    correctIndexes: [3],
    explanation:
      "Snowpipe Streaming est conçu pour une ingestion ligne par ligne à faible latence via API — les données deviennent interrogeables en quelques secondes, plus rapide que le Snowpipe classique basé sur des fichiers.",
  },
  {
    id: "sf-q18",
    question:
      "Quelle fonctionnalité permet une montée en charge temporaire pour des requêtes complexes et coûteuses en calcul ?",
    options: [
      "Search optimization service",
      "Une scaling policy de virtual warehouse",
      "Query acceleration service",
      "Un virtual warehouse multi-cluster",
    ],
    correctIndexes: [2],
    explanation:
      "Le query acceleration service décharge temporairement des portions d'une requête individuelle vers des ressources de calcul serverless additionnelles, sans redimensionner le warehouse lui-même.",
  },
  {
    id: "sf-q19",
    question: "Quelle copy option inclut les en-têtes de colonnes lors d'un unload vers Parquet ?",
    options: [
      "PARSE_HEADER = TRUE",
      "SKIP_HEADER = <entier>",
      "HEADER = TRUE",
      "HEADER = ('<en-tête_1>' = '<valeur_1>')",
    ],
    correctIndexes: [2],
    explanation:
      "HEADER = TRUE indique à Snowflake d'inclure les noms de colonnes lors de l'unload. PARSE_HEADER et SKIP_HEADER sont des options côté chargement pour les fichiers CSV.",
  },
  {
    id: "sf-q20",
    question: "Quand les requêtes bénéficient-elles du clustering ? (choisir deux réponses)",
    options: [
      "Quand les requêtes filtrent ou trient sur la clustering key.",
      "Quand les requêtes utilisent SELECT DISTINCT.",
      "Quand les requêtes utilisent un échantillonnage aléatoire.",
      "Quand les requêtes utilisent ORDER BY ou GROUP BY sur la clustering key.",
      "Quand les clustering keys sont appliquées à des colonnes non utilisées dans les filtres ou jointures.",
    ],
    correctIndexes: [0, 3],
    explanation:
      "Le clustering améliore le partition pruning ; les requêtes filtrant/triant/groupant sur les colonnes clusterisées en bénéficient. La dernière option est l'inverse d'un cas bénéfique.",
  },
  {
    id: "sf-q21",
    question:
      "Un secret API_INTEGRATION_SECRET, créé par SECRET_ROLE, génère une erreur \"does not exist or operation not authorized\" quand une fonction (exécutée en tant que API_ROLE) tente de l'utiliser, même après un GRANT USAGE à API_ROLE.",
    options: [
      "Spécifier l'option de paramètre COPY GRANTS.",
      "Recréer le secret en utilisant API_ROLE.",
      "Changer le propriétaire du secret pour SECRET_ROLE.",
      "Accorder READ sur le secret.",
    ],
    correctIndexes: [1],
    explanation:
      "Le rôle propriétaire du secret doit correspondre au rôle exécutant la fonction pour une autorisation non ambiguë.",
  },
  {
    id: "sf-q22",
    question:
      "Une équipe a besoin d'un warehouse à la demande, optimisé en coût, pendant les heures de pointe en fin de mois. Quels paramètres complètent la configuration ?",
    options: [
      "AUTO_SUSPEND=600, MAX_CLUSTER_COUNT=5, SCALING_POLICY='STANDARD'",
      "AUTO_SUSPEND=NULL, MAX_CLUSTER_COUNT=5, SCALING_POLICY='STANDARD'",
      "AUTO_SUSPEND=600, MIN_CLUSTER_COUNT=5, SCALING_POLICY='ECONOMY'",
      "AUTO_SUSPEND=10, MAX_CLUSTER_COUNT=5, SCALING_POLICY='ECONOMY'",
    ],
    correctIndexes: [3],
    explanation:
      "Une suspension rapide (10s) minimise les coûts en période d'inactivité ; MAX_CLUSTER_COUNT permet le scale-out ; ECONOMY privilégie le contrôle des coûts sur la pure performance.",
  },
  {
    id: "sf-q23",
    question: "Quelle est l'édition minimale pour bénéficier de 90 jours de Time Travel ?",
    options: ["Standard", "Enterprise", "Business Critical", "Virtual Private Snowflake (VPS)"],
    correctIndexes: [1],
    explanation:
      "L'édition Standard est plafonnée à 1 jour. Enterprise (et au-delà) permet jusqu'à 90 jours de rétention Time Travel — c'est l'édition minimale requise.",
  },
  {
    id: "sf-q24",
    question: "Comment valider l'efficacité du pruning des micro-partitions pour une requête donnée ?",
    options: [
      "En inspectant le panneau de statistiques du Query Profile.",
      "En exécutant la commande SHOW PARTITIONS.",
      "En consultant la vue WAREHOUSE_LOAD_HISTORY.",
      "En consultant la vue ACCESS_HISTORY.",
    ],
    correctIndexes: [0],
    explanation:
      "Le Query Profile affiche \"Partitions scanned\" vs \"Partitions total\", révélant directement l'efficacité du pruning pour une requête donnée.",
  },
  {
    id: "sf-q25",
    question: "Quel est le statut initial d'une task clonée ?",
    options: ["Suspended", "Running", "Started", "Resumed"],
    correctIndexes: [0],
    explanation:
      "Une task clonée démarre toujours à l'état SUSPENDED, quel que soit l'état de la task source, par mesure de sécurité (nécessite un RESUME manuel).",
  },
  {
    id: "sf-q26",
    question: "Quelles actions réduisent le memory spilling ? (choisir deux réponses)",
    options: [
      "Augmenter la taille du virtual warehouse.",
      "Modifier les requêtes pour traiter les données par plus petits lots.",
      "Augmenter le nombre de clusters du virtual warehouse.",
      "Suspendre puis reprendre le virtual warehouse.",
      "Définir une clustering key sur les tables utilisées par les requêtes.",
    ],
    correctIndexes: [0, 1],
    explanation:
      "Un warehouse plus grand fournit plus de mémoire/cache local par nœud. Réduire le volume de données traité par requête réduit l'espace de travail nécessaire en une fois.",
  },
  {
    id: "sf-q27",
    question:
      "Où spécifier les copy options pour décharger régulièrement des données au format similaire ?",
    options: [
      "Dans la définition d'un named stage.",
      "Dans la configuration du warehouse.",
      "Dans les paramètres par défaut de la base de données.",
      "Dans une variable de session.",
    ],
    correctIndexes: [0],
    explanation:
      "Pour des unloads répétés régulièrement avec le même format, il est recommandé de spécifier les options directement dans le named stage, évitant de les répéter dans chaque commande COPY.",
  },
  {
    id: "sf-q28",
    question:
      "Quelle fonctionnalité de scaling ne démarre un nouveau cluster que lorsqu'il y a suffisamment de charge estimée ?",
    options: [
      "La scaling policy Standard",
      "La scaling policy Economy",
      "La politique d'auto-suspend",
      "Le mode maximized multi-cluster",
    ],
    correctIndexes: [1],
    explanation:
      "La politique Economy est conservatrice — elle ne démarre un nouveau cluster que si le système estime qu'il y a assez de charge de requêtes pour occuper ce cluster pendant au moins 6 minutes, minimisant la consommation de crédits.",
  },
  {
    id: "sf-q29",
    question: "Quel objet fournit la liste des fichiers stockés dans un stage ?",
    options: ["Directory table", "External table", "Materialized view", "Information schema view"],
    correctIndexes: [0],
    explanation:
      "Une directory table catalogue les fichiers (noms, chemins, tailles, métadonnées) présents dans un stage.",
  },
  {
    id: "sf-q30",
    question:
      "Quelles valeurs entraînent des requêtes plus lentes et une consommation de stockage accrue dans une colonne VARIANT ? (choisir deux réponses)",
    options: [
      "Les valeurs JSON null",
      "Les nombres à virgule flottante",
      "Les tableaux (arrays)",
      "Les vecteurs",
      "Les timestamps sous forme de chaînes",
    ],
    correctIndexes: [1, 4],
    explanation:
      "Les nombres à virgule flottante stockés en VARIANT perdent en précision et en efficacité de stockage. Les timestamps intégrés comme chaînes en VARIANT empêchent les optimisations colonnaires natives.",
  },
  {
    id: "sf-q31",
    question: "À quoi sert principalement SnowSQL ?",
    options: [
      "Charger et décharger des données.",
      "Gérer des applications Snowpark.",
      "Configurer des network policies.",
      "Construire des applications Streamlit.",
    ],
    correctIndexes: [0],
    explanation:
      "SnowSQL est le client CLI couramment utilisé pour le chargement/déchargement en masse via PUT et COPY INTO.",
  },
  {
    id: "sf-q32",
    question: "Quelle action SYSADMIN peut-il réaliser sans privilèges élevés ?",
    options: [
      "Gérer les virtual warehouses.",
      "Gérer la facturation au niveau du compte.",
      "Accorder le rôle ACCOUNTADMIN.",
      "Modifier les paramètres de l'organisation.",
    ],
    correctIndexes: [0],
    explanation:
      "SYSADMIN a des privilèges inhérents pour créer/gérer des warehouses, bases de données et autres objets, sans élévation requise.",
  },
  {
    id: "sf-q33",
    question:
      "Une table est mise à jour tout au long de la journée. Un utilisateur veut automatiser la capture des seules lignes modifiées toutes les 20 minutes, sans intervention manuelle.",
    options: [
      "Créer un stream et exécuter une task uniquement s'il y a des changements.",
      "Créer une task qui se déclenche toutes les 20 minutes.",
      "Créer un stream et planifier une task toutes les 20 minutes.",
      "Utiliser une dynamic table pour matérialiser les changements et exécuter une task toutes les 20 minutes.",
    ],
    correctIndexes: [2],
    explanation:
      "Un stream capture les lignes modifiées ; une task planifiée toutes les 20 minutes consomme automatiquement le stream, sans intervention manuelle.",
  },
  {
    id: "sf-q34",
    question: "Quelle est la méthode la plus efficace pour partager un sous-ensemble de données avec un compte consommateur ?",
    options: [
      "Créer une User-Defined Function (UDF) sécurisée.",
      "Utiliser une dynamic table.",
      "Créer une table externe.",
      "Créer une vue sécurisée (secure view).",
    ],
    correctIndexes: [3],
    explanation:
      "Les secure views sont le mécanisme standard pour partager des données filtrées via Secure Data Sharing tout en masquant la définition de la vue sous-jacente.",
  },
  {
    id: "sf-q35",
    question: "Quelle intégration est requise pour cloner un dépôt Git dans Snowflake ?",
    options: [
      "Storage integration",
      "Security integration",
      "External Access integration",
      "API integration",
    ],
    correctIndexes: [3],
    explanation:
      "CREATE GIT REPOSITORY requiert un paramètre API_INTEGRATION, en utilisant une intégration créée avec API_PROVIDER = git_https_api.",
  },
  {
    id: "sf-q36",
    question: "Comment les directory tables sont-elles utilisées dans les pipelines de données ? (choisir deux réponses)",
    options: [
      "Pour interroger des données structurées résidant dans un stage externe.",
      "Pour décharger les résultats d'un traitement de fichiers non structurés.",
      "Pour interroger une liste de fichiers stagés résidant dans un stockage interne ou externe.",
      "Pour stocker les informations de contrôle d'accès basé sur les rôles pour des données non structurées.",
      "Pour joindre des données avec une table Snowflake contenant des métadonnées de fichiers non structurés.",
    ],
    correctIndexes: [2, 4],
    explanation:
      "Les directory tables cataloguent les fichiers d'un stage (interne ou externe) et peuvent être jointes à d'autres tables Snowflake via leurs métadonnées.",
  },
  {
    id: "sf-q37",
    question: "Quel objet peut être référencé depuis une User-Defined Function (UDF) ?",
    options: ["Vue", "Stream", "Table externe", "Vue matérialisée"],
    correctIndexes: [0],
    explanation:
      "Une UDF SQL peut référencer des tables et des vues dans sa logique SELECT. Les streams et tables externes ne sont pas des objets référençables typiques pour les UDF.",
  },
  {
    id: "sf-q38",
    question:
      "Quelle fonctionnalité utilise une clé Snowflake combinée à une clé gérée par le client pour protéger les données ?",
    options: ["Trust Center", "Tri-Secret Secure", "Key-pair authentication", "Multi-Factor Authentication (MFA)"],
    correctIndexes: [1],
    explanation:
      "Tri-Secret Secure combine une clé maintenue par Snowflake avec une clé gérée par le client (KMS externe) pour créer une clé maître composite chiffrant les données.",
  },
  {
    id: "sf-q39",
    question:
      "Quelles métadonnées Snowflake stocke-t-il à propos des lignes d'une micro-partition ? (choisir deux réponses)",
    options: [
      "La plage de valeurs de chaque colonne",
      "La valeur moyenne de chaque colonne",
      "Le nombre de valeurs distinctes",
      "Le nombre total de valeurs",
      "Le nombre de fois où chaque colonne a été interrogée",
    ],
    correctIndexes: [0, 3],
    explanation:
      "Snowflake stocke le min/max par colonne (pour le pruning) et le nombre de lignes par micro-partition.",
  },
  {
    id: "sf-q40",
    question:
      "Quelle étape permet d'optimiser les coûts pour un warehouse mixte (chargement continu + reporting) ?",
    options: [
      "Créer des warehouses séparés pour chaque workload.",
      "Activer le query acceleration service.",
      "Passer à un warehouse multi-cluster.",
      "Redimensionner le warehouse en taille Small.",
    ],
    correctIndexes: [0],
    explanation:
      "Séparer les workloads (chargement continu vs requêtes de reporting) permet un dimensionnement/scaling indépendant, évitant le gaspillage de crédits.",
  },
  {
    id: "sf-q41",
    question: "Quelle requête permet d'exploser un tableau JSON en lignes séparées pour analyse ?",
    options: [
      "SELECT details FROM events, LATERAL FLATTEN(INPUT => details);",
      "SELECT details[0] FROM events;",
      "SELECT value FROM events, LATERAL FLATTEN(INPUT => details);",
      "SELECT ARRAY_AGG(value) FROM events, LATERAL FLATTEN(INPUT => details);",
    ],
    correctIndexes: [2],
    explanation:
      "value est la colonne de sortie standard de LATERAL FLATTEN représentant chaque élément exploité du tableau.",
  },
  {
    id: "sf-q42",
    question:
      "Quelle fonctionnalité de sécurité permet le remplacement de clés actives (authentification par paire de clés) ?",
    options: ["Authentication", "Passkeys", "Rotation", "Codes temporaires (TOTP)"],
    correctIndexes: [2],
    explanation:
      "La rotation de clés permet d'avoir deux paires de clés actives simultanément afin de remplacer une ancienne clé sans interruption d'authentification.",
  },
  {
    id: "sf-q43",
    question: "Comment Snowflake gère-t-il le stockage pour les tables externes ?",
    options: [
      "Snowflake réplique et stocke automatiquement toutes les données des tables externes.",
      "Snowflake stocke les métadonnées des tables externes.",
      "Snowflake référence les tables externes via des directory tables internes.",
      "Snowflake référence les tables externes via des tables transientes internes.",
    ],
    correctIndexes: [1],
    explanation:
      "Les données restent physiquement dans le stockage cloud externe ; Snowflake ne stocke que les métadonnées (chemins de fichiers, mapping de schéma, etc.).",
  },
  {
    id: "sf-q44",
    question: "Quelle fonction retourne une estimation de cardinalité (ville/état/code postal) ?",
    options: ["COVAR_POP", "OBJECT_AGG", "APPROX_COUNT_DISTINCT", "REGR_COUNT"],
    correctIndexes: [2],
    explanation:
      "Utilise l'algorithme HyperLogLog pour une estimation de cardinalité rapide et économe en mémoire.",
  },
  {
    id: "sf-q45",
    question:
      "Pourquoi la première requête sur un warehouse est-elle plus longue que la même requête relancée une heure plus tard ?",
    options: [
      "La connexion réseau est plus lente à cause d'un trafic élevé.",
      "Le warehouse copie toutes les données du stockage avant d'exécuter la première requête.",
      "La première requête a été compilée par la base, la seconde utilise une version précompilée.",
      "Le warehouse était suspendu initialement, la seconde requête utilise des données en cache.",
    ],
    correctIndexes: [1],
    explanation:
      "Un warehouse démarre avec un cache SSD local vide. La première exécution peuple ce cache depuis le stockage distant ; les requêtes suivantes bénéficient du cache local plus rapide.",
  },
  {
    id: "sf-q46",
    question: "Quelle action est autorisée sur une masking policy basée sur des tags ?",
    options: [
      "Plusieurs masking policies par type de données peuvent être créées.",
      "Une vue matérialisée peut être créée si la table sous-jacente est protégée par une masking policy basée sur des tags.",
      "La masking policy peut être supprimée si elle n'est assignée à aucun tag.",
      "Une colonne masquée peut être utilisée comme colonne conditionnelle dans une masking policy.",
    ],
    correctIndexes: [2],
    explanation:
      "Une masking policy doit d'abord être désassignée de tout tag avant de pouvoir être supprimée.",
  },
  {
    id: "sf-q47",
    question:
      "Quelles requêtes peuvent être exécutées en parallèle via le Query Acceleration Service ? (choisir deux réponses)",
    options: [
      "De larges scans qui suppriment de nombreuses lignes et colonnes",
      "De larges scans utilisant une agrégation ou un filtre sélectif",
      "Des requêtes avec des jointures complexes sur de petites tables",
      "De petits scans qui lisent et écrivent des lignes très lentement",
      "De larges scans qui insèrent de nombreuses nouvelles lignes",
    ],
    correctIndexes: [1, 4],
    explanation:
      "Le QAS accélère 2 profils de requêtes : (1) larges scans avec agrégation ou filtre sélectif, (2) larges scans qui insèrent ou copient de nombreuses nouvelles lignes.",
  },
  {
    id: "sf-q48",
    question: "Quel type de table doit être utilisé avec un stream insert-only ?",
    options: ["Temporary", "Hybrid", "External", "Transient"],
    correctIndexes: [2],
    explanation:
      "Les streams insert-only (INSERT_ONLY = TRUE) sont spécifiquement documentés comme supportés pour les tables externes.",
  },
  {
    id: "sf-q49",
    question: "Comment permettre à ETL_ROLE d'accéder à une table dès sa création ?",
    options: [
      "GRANT SELECT ON TABLE MYTABLE TO ROLE ETL_ROLE;",
      "GRANT SELECT ON TABLE MYTABLE TO ROLE DEVELOPER_ROLE;",
      "GRANT SELECT ON FUTURE TABLES IN SCHEMA MYSCH TO ROLE ETL_ROLE;",
      "GRANT SELECT ON FUTURE TABLES IN SCHEMA MYSCH TO ROLE DEVELOPER_ROLE;",
    ],
    correctIndexes: [2],
    explanation:
      "Les future grants s'appliquent automatiquement dès qu'un nouvel objet est créé dans le schéma, sans intervention manuelle répétée.",
  },
  {
    id: "sf-q50",
    question: "Quelle fonction permet de récupérer toutes les erreurs de la dernière exécution d'un COPY INTO <table> ?",
    options: ["LIST", "VALIDATE", "RESULT_SCAN", "COPY_HISTORY"],
    correctIndexes: [3],
    explanation:
      "Table function retournant des métadonnées détaillées sur les exécutions passées de COPY INTO, y compris les erreurs.",
  },
  {
    id: "sf-q51",
    question: "Quel paramètre de COPY permet de charger des données non structurées ?",
    options: ["FORCE", "LOAD_UNCERTAIN_FILES", "FILE_PROCESSOR", "LOAD_MODE"],
    correctIndexes: [2],
    explanation:
      "Permet de spécifier une UDTF qui traite/extrait le contenu structuré de fichiers non structurés (images, PDF, etc.).",
  },
  {
    id: "sf-q52",
    question:
      "Quelles méthodes d'authentification sont possibles pour connecter VS Code à Snowflake ? (choisir deux réponses)",
    options: [
      "Nom d'utilisateur/mot de passe",
      "Multi-Factor Authentication (MFA)",
      "Single Sign-On (SSO)",
      "Clé API",
      "Pilote JDBC/ODBC",
    ],
    correctIndexes: [0, 2],
    explanation:
      "L'extension VS Code documente 3 méthodes : nom d'utilisateur/mot de passe, paire de clés, et SSO. MFA n'est pas une méthode d'authentification primaire distincte, la clé API n'est pas listée, et JDBC/ODBC est un type de pilote, pas une méthode d'authentification.",
  },
  {
    id: "sf-q53",
    question: "Quel type de données Snowsight affiche-t-il pour une colonne définie en CHARACTER(25) ?",
    options: ["STRING(25)", "TEXT(25)", "VARCHAR(25)", "CHARACTER(25)"],
    correctIndexes: [2],
    explanation:
      "CHAR, CHARACTER, STRING, TEXT sont tous des synonymes de VARCHAR ; Snowflake normalise et affiche toujours VARCHAR.",
  },
  {
    id: "sf-q54",
    question:
      "Quelles fonctionnalités de sécurité contrôlent l'accès entrant à Snowflake et aux stages internes ? (choisir deux réponses)",
    options: [
      "Network rules",
      "Feature policies",
      "Network policies",
      "Packages policies",
      "Authentication policies",
    ],
    correctIndexes: [0, 2],
    explanation:
      "Les network rules définissent les IP/hôtes autorisés/bloqués ; les network policies les utilisent pour restreindre l'accès entrant.",
  },
  {
    id: "sf-q55",
    question:
      "Quels paramètres configurent le mode Maximized par rapport au mode Auto-scale ? (choisir deux réponses)",
    options: [
      "SET WAREHOUSE_SIZE",
      "SET MIN_CLUSTER_COUNT",
      "SET MAX_CONCURRENCY_LEVEL",
      "SET WAREHOUSE_TYPE",
      "SET MAX_CLUSTER_COUNT",
    ],
    correctIndexes: [1, 4],
    explanation:
      "Le mode Maximized = MIN=MAX (nombre fixe de clusters) ; l'Auto-scale = MIN < MAX (scaling dynamique).",
  },
  {
    id: "sf-q56",
    question: "Quel type de listing du Marketplace restreint le partage aux seuls comptes invités ?",
    options: ["Public listing", "Private listing", "Personalized Data Exchange", "Provider profile listing"],
    correctIndexes: [1],
    explanation:
      "N'apparaît pas dans les résultats de recherche publics ; seuls les comptes invités peuvent voir/s'abonner.",
  },
  {
    id: "sf-q57",
    question:
      "Quelle est la méthode recommandée pour partager un jeu de données avec n'importe quel compte Snowflake (même région cloud) ?",
    options: [
      "Utiliser un public listing.",
      "Utiliser un direct share.",
      "Utiliser un Data Exchange.",
      "Utiliser un stage externe.",
    ],
    correctIndexes: [0],
    explanation:
      "Rend le jeu de données découvrable par n'importe quel compte Snowflake sans restriction, contrairement au direct share (manuel) ou au Data Exchange (groupe restreint).",
  },
  {
    id: "sf-q58",
    question: "Quel mot-clé de Query History correspond à un COPY INTO <stage> déchargeant 1 To ?",
    options: ["INSERT", "UNLOAD", "COPY", "UPDATE"],
    correctIndexes: [1],
    explanation:
      "QUERY_TYPE distingue UNLOAD (déchargement vers un stage) de COPY (chargement dans une table).",
  },
  {
    id: "sf-q59",
    question:
      "Quels objets permettent une récupération rapide des résultats pour des requêtes avec des fonctions d'agrégation ? (choisir deux réponses)",
    options: ["Hybrid table", "Materialized view", "Dynamic table", "External table", "Secure view"],
    correctIndexes: [1, 2],
    explanation:
      "Les deux pré-calculent et stockent les résultats agrégés. Les secure views n'apportent aucun bénéfice de performance — elles exécutent toujours la requête sous-jacente à chaque fois.",
  },
];
