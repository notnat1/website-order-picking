The last build failed with an "address already in use" error on port 80. This is a common issue and means that another service on your server (most likely your main Nginx web server) is already using port 80.

To get your pipeline running, I have applied a quick fix:

**The Fix:**
I have changed the port mapping in your `docker-compose.yml` for the `frontend` service from `"80:80"` to `"8080:80"`.

**What this means:**
*   Your application will now be accessible on `http://<your_server_ip>:8080`.
*   This avoids the port conflict and should allow the Jenkins pipeline to complete successfully.

**Long-Term Solution (Recommended):**
The presence of the "Nginx Reload" stage in your `Jenkinsfile` suggests that the intended setup is to use your main Nginx server as a **reverse proxy**. This is the standard way to host multiple websites or applications on a single server.

In a reverse proxy setup, you would typically:
1.  **Not** expose the frontend container's port in `docker-compose.yml` (so you would remove the `ports` section from the `frontend` service).
2.  Create a configuration file for Nginx on your server (e.g., in `/etc/nginx/sites-available/`) that tells it to listen on port 80 for your domain (e.g., `your-app.com`) and forward the traffic to the frontend Docker container (e.g., `http://localhost:8080` if you were to expose it, or directly to the container's IP if you set up a Docker network).

While setting up the Nginx reverse proxy is a more involved task that requires server-side configuration, the port change I've implemented should resolve your immediate pipeline failure.

I have committed the port change. Please push the changes to GitHub to trigger a new build.
