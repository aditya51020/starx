# Fixing "413 Request Entity Too Large" Error

This error usually means your **Web Server** (Nginx, Apache, or Vercel) is rejecting the upload before it even reaches your Node.js backend.

## 1. Using Nginx (Most Common)
If you are running on a VPS (EC2, DigitalOcean) with Nginx:

1.  SSH into your server.
2.  Edit the Nginx config file (usually `/etc/nginx/nginx.conf` or `/etc/nginx/sites-available/default`).
3.  Add or modify `client_max_body_size`:

    ```nginx
    server {
        ...
        client_max_body_size 200M;
        ...
    }
    ```
4.  Restart Nginx:
    ```bash
    sudo service nginx restart
    ```

## 2. Using Apache
1.  Open your `.htaccess` or `httpd.conf` file.
2.  Add:
    ```apache
    LimitRequestBody 209715200
    ```
    (200 MB in bytes)

## 3. Vercel / Serverless
If your backend is on Vercel:
- Vercel Serverless Functions have a payload limit of **4.5 MB**.
- You CANNOT increase this for standard functions.
- **Solution**: Upload directly to Cloudinary from the Frontend (Client-side upload) instead of sending it through your backend.

## 4. Cloudflare
If you are behind Cloudflare (Free Plan):
- Max upload size is **100 MB**.
- You must upgrade to Pro for larger uploads or bypass Cloudflare for uploads.
