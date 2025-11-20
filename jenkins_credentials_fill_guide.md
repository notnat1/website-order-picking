To clarify how to fill in the "Secret" and "ID" columns when creating credentials in Jenkins, using the values from your `.env` file:

For each credential you need to create in Jenkins:

1.  **For `MYSQL_ROOT_PASSWORD_SECRET_ID`:**
    *   **ID:** `MYSQL_ROOT_PASSWORD_SECRET_ID`
    *   **Secret:** `ignaciojanis` (This is the `MYSQL_ROOT_PASSWORD` value from your `.env` file)

2.  **For `MYSQL_DATABASE_SECRET_ID`:**
    *   **ID:** `MYSQL_DATABASE_SECRET_ID`
    *   **Secret:** `db-inventory` (This is the `MYSQL_DATABASE` value from your `.env` file)

3.  **For `MYSQL_USER_SECRET_ID`:**
    *   **ID:** `MYSQL_USER_SECRET_ID`
    *   **Secret:** `natte` (This is the `MYSQL_USER` value from your `.env` file)

4.  **For `MYSQL_PASSWORD_SECRET_ID`:**
    *   **ID:** `MYSQL_PASSWORD_SECRET_ID`
    *   **Secret:** `ignaciojanis` (This is the `MYSQL_PASSWORD` value from your `.env` file)

5.  **For `JWT_SECRET_SECRET_ID`:**
    *   **ID:** `JWT_SECRET_SECRET_ID`
    *   **Secret:** `Ignaciojanis11$` (This is the `JWT_SECRET` value from your `.env` file)

Remember to select "Secret text" as the "Kind" for each credential.
