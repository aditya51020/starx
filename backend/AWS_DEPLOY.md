# Deploying StarX Backend to AWS

This backend is an Express.js application using SQLite for the database and Cloudinary for image uploads.

## 1. Prerequisites

- **AWS Account**: You need an active AWS account.
- **Node.js**: Ensure the target environment runs Node.js 18 or later (specified in `package.json`).

## 2. Environment Variables

Create a `.env` file on your server or configure these environment variables in your deployment platform (Elastic Beanstalk, App Runner, etc.).

Refer to `.env.example` for the full list.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port the server listens on (AWS usually assigns this automatically or uses 80/8080) | `8080` |
| `NODE_ENV` | Set to production for optimization | `production` |
| `CLIENT_URL` | Your frontend production URL | `https://your-frontend.com` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `https://your-frontend.com,https://admin.your-frontend.com` |
| `CLOUDINARY_...` | Your Cloudinary credentials | *See Cloudinary Dashboard* |

## 3. Database Persistence (Critical)

> [!WARNING]
> **This application uses SQLite (`database.sqlite`) which saves data to a local file.**

- **EC2**: If you deploy to a standard EC2 instance, the data will persist as long as the instance storage persists (EBS).
- **Elastic Beanstalk / App Runner**: These platforms are "ephemeral". If the instance restarts or you deploy a new version, **ALL DATA WILL BE LOST**.
- **Solution**: For production scaling, switch to a managed database like **AWS RDS** (PostgreSQL/MySQL) and update `config/database.js`.

## 4. Deployment Steps (EC2 Example)

1.  **SSH into your instance**.
2.  **Clone your repository**:
    ```bash
    git clone https://github.com/your-repo/starx-backend.git
    cd starx-backend
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Setup Env**:
    ```bash
    cp .env.example .env
    nano .env # Edit with your real values
    ```
5.  **Start Server**:
    -   Host it using `pm2` for process management:
        ```bash
        npm install -g pm2
        pm2 start server.js --name "starx-backend"
        ```

## 5. Deployment Steps (App Runner / Beanstalk)

1.  Ensure `package.json` has a `start` script: `"start": "node server.js"`.
2.  Configure Environment Variables in the AWS Console.
3.  Deploy the code (via Zip upload or GitHub connection).
