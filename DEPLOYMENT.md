# Deploying Student Attendance Portal to Vercel

This guide provides step-by-step instructions to deploy your application to Vercel.

## Prerequisites

Before starting, ensure you have the following installed on your computer:

1.  **Node.js**: [Download and install Node.js (LTS version recommended)](https://nodejs.org/).
2.  **Git**: [Download and install Git](https://git-scm.com/downloads).
3.  **Vercel Account**: [Sign up for Vercel](https://vercel.com/signup).

## Step 1: Open Your Project

Open a terminal (Command Prompt, PowerShell, or Git Bash) in your project folder:
`c:\Users\acer\Downloads\student-attendance-portal`

## Step 2: Install Dependencies & Verify Build

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Verify the build**:
    ```bash
    npm run build
    ```
    If this command completes without errors, your project is ready for deployment.

## Step 3: Push Your Code to GitHub

Vercel deploys directly from GitHub, which is the easiest and most reliable method.

1.  **Initialize Git** (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a new repository on GitHub**:
    - Go to [GitHub.com/new](https://github.com/new).
    - Name your repository (e.g., `student-attendance-portal`).
    - Click "Create repository".

3.  **Push your code**:
    - Copy the commands shown on GitHub under "…or push an existing repository from the command line".
    - Run them in your terminal. They will look like this:
      ```bash
      git remote add origin https://github.com/YOUR_USERNAME/student-attendance-portal.git
      git branch -M main
      git push -u origin main
      ```

## Step 4: Deploy to Vercel

1.  **Log in to Vercel**: Go to [vercel.com/dashboard](https://vercel.com/dashboard).
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import GitHub Repository**:
    - Find your `student-attendance-portal` repository in the list.
    - Click **Import**.

## Step 5: Configure Environment Variables (CRITICAL)

**Do not skip this step.** Your app will not work properly without these settings.

1.  In the Vercel "Configure Project" screen, expand the **Environment Variables** section.
2.  Add the following variables (copy values from your `.env.local` file):

    - `VITE_FIREBASE_API_KEY`: `AIza...` (your actual key)
    - `VITE_FIREBASE_AUTH_DOMAIN`: `face-reco-8d1dd.firebaseapp.com`
    - `VITE_FIREBASE_PROJECT_ID`: `face-reco-8d1dd`
    - `VITE_FIREBASE_STORAGE_BUCKET`: `face-reco-8d1dd.firebasestorage.app`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`: `476517902742`
    - `VITE_FIREBASE_APP_ID`: `1:476517902742:web:c5cef4a88cf656948a95b7`
    - `VITE_FIREBASE_MEASUREMENT_ID`: `G-JG42W0P9Q1`

3.  Click **Deploy**.

## Troubleshooting

- **404 on Refresh**: If you encounter 404 errors when refreshing pages, ensure your project has a `vercel.json` file with rewrite rules. (I have added this file for you).
- **TypeScript Errors**: Check the "Build Logs" in Vercel. Common errors include missing dependencies or strict type checks.
