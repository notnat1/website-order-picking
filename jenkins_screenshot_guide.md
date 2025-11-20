Okay, using the screenshot you provided and the information from your `.env` file, here's how to fill out the "New credentials" form in Jenkins for *each* of the five required credentials:

For each credential (e.g., `MYSQL_ROOT_PASSWORD_SECRET_ID`, `MYSQL_DATABASE_SECRET_ID`, etc.), you will fill the form as follows:

1.  **Kind:** Keep this as `Secret text` (it's already selected in your screenshot).
2.  **Scope:** Keep this as `Global (Jenkins, nodes, items, all child items, etc)` (it's already selected).
3.  **Secret:**
    *   For `MYSQL_ROOT_PASSWORD_SECRET_ID`, type `ignaciojanis`.
    *   For `MYSQL_DATABASE_SECRET_ID`, type `db-inventory`.
    *   For `MYSQL_USER_SECRET_ID`, type `natte`.
    *   For `MYSQL_PASSWORD_SECRET_ID`, type `ignaciojanis`.
    *   For `JWT_SECRET_SECRET_ID`, type `Ignaciojanis11$`.
4.  **ID:**
    *   For the MySQL root password, type `MYSQL_ROOT_PASSWORD_SECRET_ID`.
    *   For the database name, type `MYSQL_DATABASE_SECRET_ID`.
    *   For the MySQL user, type `MYSQL_USER_SECRET_ID`.
    *   For the MySQL password, type `MYSQL_PASSWORD_SECRET_ID`.
    *   For the JWT secret, type `JWT_SECRET_SECRET_ID`.
5.  **Description (Optional):** You can add a brief description here for your own reference (e.g., "MySQL Root Password for Inventory App").
6.  **Click "Create"**

**You need to repeat these steps five times, once for each of the five credential IDs.** Ensure the "Secret" value matches the "ID" you are creating it for, as specified above.
