import powerBiLogo from "../assets/icons8-puissance-bi-2021-96.png";
import snowflakeLogo from "../assets/snowflake-removebg-preview.png";
import dbtLogo from "../assets/dbt.png";
import gitLogo from "../assets/icons8-git-96.png";
import linuxLogo from "../assets/icons8-linux-96.png";
import sqlLogo from "../assets/icons8-sql-96.png";

// Tools of the training catalogue, in display order.
export const TOOLS = ["Power BI", "Snowflake", "dbt", "Git", "Linux", "SQL"] as const;

export const TOOL_LOGOS: Record<string, string> = {
  "Power BI": powerBiLogo,
  Snowflake: snowflakeLogo,
  dbt: dbtLogo,
  Git: gitLogo,
  Linux: linuxLogo,
  SQL: sqlLogo,
};
