I have fixed the `Jenkinsfile` syntax and updated the Git URL to the SSH format (`git@github.com:notnat1/website-order-picking.git`).

However, the Jenkins pipeline is still likely to fail due to a `sudo` permission issue. The Jenkins output log indicated that `sudo` commands require a password, which Jenkins cannot provide interactively.

To resolve this, you need to configure passwordless `sudo` for the `jenkins` user on your server (62.84.186.196). Please follow these steps:

1.  **SSH into your Jenkins server:**
    ```bash
    ssh natte@62.84.186.196
    ```
    (Use the password `ignaciojanis` if `natte` user doesn't have SSH keys configured for passwordless login.)

2.  **Edit the sudoers file:**
    ```bash
    sudo visudo
    ```

3.  **Add the following line to the end of the file:**
    ```
    jenkins ALL=(ALL) NOPASSWD: ALL
    ```
    This line allows the `jenkins` user to run any command with `sudo` without being prompted for a password. Save and exit the file.

Once you have made these changes on your server, the Jenkins pipeline should be able to execute the `sudo` commands successfully and complete the deployment.

After you have performed these steps, you can trigger a new build in Jenkins (e.g., by pushing another commit to the `main` branch of your GitHub repository) to verify the fix.
