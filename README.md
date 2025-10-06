# Dolphin Trainer Pro

This application is a complete platform for marine mammal trainers to manage dolphins, track skills, and log training sessions. It's built using React for the frontend and powered entirely by a Manifest backend.

## Features

- **Secure Authentication**: Trainers can sign up and log in to manage their own portfolio of dolphins.
- **Dolphin Profiles**: Create and manage detailed profiles for each dolphin, including name, species, and birth date.
- **Skill Library**: A centrally-managed library of skills that can be taught (e.g., 'Jump', 'Vocalize').
- **Session Logging**: Detailed logging of training sessions with duration, performance ratings, notes, and skills practiced.
- **Role-Based Access**: A distinction between 'trainer' and 'admin' roles, with admins having greater control over the platform's data.
- **Built-in Admin Panel**: Access a full-featured admin dashboard at `/admin` to manage all data directly.

## Tech Stack

- **Backend**: Manifest
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Communication**: Manifest SDK

## Getting Started

This application is designed to work seamlessly with a deployed Manifest backend.

1.  **Start the Frontend**:
    ```bash
    npm install
    npm run dev
    ```
    The React application will be running on `http://localhost:5173`.

2.  **Access the Application**:
    - Open your browser to `http://localhost:5173`.
    - You can sign up as a new trainer or use the demo credentials.

3.  **Admin Panel**:
    - Access the backend's admin panel by navigating to the URL provided by your Manifest deployment, followed by `/admin`.
    - Default admin credentials are `admin@manifest.build` / `admin`.
    - In the admin panel, you can pre-populate skills, manage users, and view all data across the application.