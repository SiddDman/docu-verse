# DocuVerse - Collaborative Text Editor

DocuVerse is a collaborative text editor developed using Next.js, TypeScript, and Tailwind CSS. It features a responsive design that allows multiple users to edit documents in real-time. With rich text editing capabilities and robust user management, DocuVerse provides a seamless collaborative experience.

## Table of Contents
- [Features](#features)
- [Liveblocks SDK](#liveblocks-sdk)
- [Project Setup](#project-setup)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## Features

- **Real-time Collaboration:** Users can edit documents simultaneously, with changes reflected instantly.
- **Rich Text Editing:** Integrated Lexical for advanced text formatting and editing capabilities.
- **User Roles:** Supports different access levels with editor and viewer roles.
- **Comment Functionality:** Users can leave comments within the editor interface.
- **Shared Cursors and Avatars:** Visualize collaboration with shared cursors and avatars for active users.
- **Notifications:** Receive alerts for mentions and document access.
- **User Authentication:** Implemented secure authentication using Clerk.
- **Bug Tracking:** Integrated Sentry for monitoring and tracking application bugs.

## Liveblocks SDK

DocuVerse utilizes the Liveblocks SDK to enhance real-time collaboration features, enabling:
- **Shared Cursors:** See where other users are editing in real-time.
- **Avatar Visibility:** Display avatars of active users within the document.
- **Mentions and Notifications:** Get notified when mentioned in comments or document updates.

For more details about Liveblocks, visit the [official documentation](https://liveblocks.io/docs).

## Project Setup

To set up the project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/SiddDman/docuverse.git
    cd docuverse
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root directory and add the required environment variables:

    ```bash
    NEXT_PUBLIC_CLERK_FRONTEND_API= <your-clerk-api-key>
    CLERK_API_KEY= <your-backend-clerk-api-key>
    LIVEBLOCKS_PUBLIC_API_KEY= <your-liveblocks-api-key>
    ```

4. **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be running on `http://localhost:3000`.

## Deployment
You can view the live version of this project at [DocuVerse](https://docu-verse-sidd.vercel.app/).

## Future Improvements

- **Version History:** Implementing version control to track changes and revert to previous versions.
- **Enhanced Commenting:** Allow threaded comments for better discussions.
- **Document Templates:** Providing pre-defined document templates for users.
- **Improved User Interface:** Continuously refining the UI for a better user experience.
