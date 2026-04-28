# Insighta Labs+: Web Portal

The **Insighta Labs+ Web Portal** provides a user-friendly interface for the Profile Intelligence System. Designed for analysts and stakeholders, it offers intuitive access to profile data, advanced search, and account management.

---

## Features

-   **Dashboard**: Quick overview of system metrics and recent activity.
-   **Profile Explorer**: Interactive list with advanced filtering and pagination.
-   **Natural Language Search**: Dedicated search interface for plain English queries.
-   **Detailed Views**: Deep dive into individual profile data and demographics.
-   **Secure Authentication**: Seamless GitHub OAuth integration.
-   **Role-Based UI**: Interface elements adapt based on user roles (Admin vs Analyst).

---

## Pages Overview

| Page | Description |
|---|---|
| **Login** | Entry point for GitHub OAuth authentication. |
| **Dashboard** | Displays key metrics like total profiles and system status. |
| **Profiles** | The main data grid for viewing and filtering profiles. |
| **Search** | A focused interface for Natural Language processing. |
| **Account** | Manage user profile and view role permissions. |

---

## Tech Stack

-   **Framework**: Next.js (App Router)
-   **Styling**: Vanilla CSS / Tailwind (as per project preference)
-   **State Management**: React Hooks & Context API
-   **Authentication**: Secure Cookies (HTTP-only)
-   **Icons**: Lucide React

---

## Local Setup

### Prerequisites
-   Node.js >= 18
-   Running instance of **Insighta Labs+ API**

### Steps
1.  **Clone & Install**:
    ```bash
    cd insighta-web
    npm install
    ```
2.  **Environment**:
    ```bash
    cp .env.example .env.local
    # Set NEXT_PUBLIC_API_URL to your backend URL
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

---

## Authentication & Security

The web portal prioritizes security through several layers:

-   **HTTP-Only Cookies**: JWT tokens are stored in secure cookies, making them inaccessible to client-side scripts (mitigating XSS).
-   **CSRF Protection**: Every state-changing request includes a CSRF token validated by the backend.
-   **Protected Routes**: Client-side middleware ensures only authenticated users can access internal pages.
-   **Automatic Refresh**: The application handles token refreshing in the background to ensure a seamless session.

---
