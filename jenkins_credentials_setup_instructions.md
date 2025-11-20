I have analyzed the latest Jenkins build output. The pipeline is now failing in the "Docker Compose Deploy" stage with the error:

`ERROR: Could not find credentials entry with ID 'MYSQL_ROOT_PASSWORD_SECRET_ID'`

This indicates that Jenkins cannot find the secret text credentials with the IDs specified in your `Jenkinsfile`. You need to create these credentials in your Jenkins instance. The specific credentials required are:

*   `MYSQL_ROOT_PASSWORD_SECRET_ID`
*   `MYSQL_DATABASE_SECRET_ID`
*   `MYSQL_USER_SECRET_ID`
*   `MYSQL_PASSWORD_SECRET_ID`
*   `JWT_SECRET_SECRET_ID`

To resolve this issue, please follow these steps in your Jenkins instance:

1.  **Log in to your Jenkins instance.**
2.  **Navigate to "Manage Jenkins"**: On the Jenkins dashboard, click on "Manage Jenkins" in the left-hand menu.
3.  **Go to "Credentials"**: On the "Manage Jenkins" page, click on "Manage Credentials".
4.  **Select the global domain**: Click on "(global)" under "Stores scoped to Jenkins".
5.  **Add Credentials**: Click on "Add Credentials" in the left-hand menu.
6.  **Configure each credential (repeat for all 5 IDs):**
    *   **Kind:** Select "Secret text".
    *   **Secret:** Enter the actual secret value (e.g., your MySQL root password for `MYSQL_ROOT_PASSWORD_SECRET_ID`, your database name for `MYSQL_DATABASE_SECRET_ID`, etc.).
    *   **ID:** Enter the exact credential ID from the list above (e.g., `MYSQL_ROOT_PASSWORD_SECRET_ID`). It is crucial that the ID matches exactly what is in your `Jenkinsfile`.
    *   **Description (Optional):** Add a brief description for your reference (e.g., "MySQL Root Password for Inventory App").
    *   **Click "Create"** to save the credential.

After you have created all five secret text credentials with the correct IDs, trigger a new build in Jenkins (e.g., by pushing another commit to the `main` branch, or manually starting a build from the Jenkins UI). The "Docker Compose Deploy" stage should then be able to access these secrets and proceed.
