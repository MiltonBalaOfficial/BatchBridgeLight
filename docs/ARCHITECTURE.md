# Architecture Documentation

This document outlines key architectural decisions and design patterns used in the `nemoric` project.

## Key Technologies

- **Next.js (App Router):** The primary React framework for building the application.
- **TypeScript:** Ensures type safety and improves code maintainability.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Shadcn UI:** A collection of re-usable components built with Radix UI and Tailwind CSS.
- **Clerk:** For user authentication and management.
- **ESLint & Prettier:** For code linting and formatting, ensuring consistent code style.
- **clsx & tailwind-merge:** Used together for conditionally applying Tailwind classes and merging them intelligently.

## Project Structure

- `app/`: Contains Next.js App Router routes and layouts.
- `app/(auth)/`: Specific routes for authentication flows (e.g., sign-in, sign-up) managed by Clerk.
- `components/`: Reusable React components, including Shadcn UI components.
- `lib/utils.ts`: Contains utility functions, notably `cn` for combining CSS classes.
- `public/`: Static assets.

## Styling Conventions

- **Tailwind CSS:** Prefer utility classes for styling.
- **Shadcn UI:** Utilize components from Shadcn UI for common UI elements.
- **`cn` utility:** Use the `cn` function from `lib/utils.ts` for conditional and merged Tailwind classes.

## Authentication (Clerk)

- **Middleware:** Authentication is handled by Clerk's `clerkMiddleware` in `middleware.ts`. The project correctly uses this instead of the deprecated `authMiddleware()`.

## Authentication and Redirect Strategy

This project uses a specific strategy for handling user redirects after signing in and signing out to ensure a smooth user experience.

### Sign-In Flow

- **From a Dashboard:** If a user signs in from the `guest-dashboard`, they are always redirected to the main protected `/dashboard`.
- **From Any Other Page:** If a user signs in from a non-dashboard page (e.g., `/report`), they are always redirected back to the exact same page they were on, including any URL query parameters.

### Sign-Out Flow

- **From the Protected Dashboard:** If a user signs out from the protected `/dashboard`, they are redirected to the `/guest-dashboard`.
- **From Any Other Page:** If a user signs out from a non-dashboard page (e.g., `/report`), they remain on that same page. The UI updates to a signed-out state, but they are not redirected away.

This logic is primarily handled by passing the correct redirect URLs to the appropriate Clerk components (`<SignInButton>` and `<UserButton>`). To ensure a consistent experience for both new and existing users, both the `forceRedirectUrl` (for sign-in) and `signUpForceRedirectUrl` (for sign-up) props are used on the `<SignInButton>`. Similarly, `afterSignOutUrl` is used on the `<UserButton>`. This ensures users are always returned to the correct page after authentication actions.

## Data Models

### Data Storage

This project currently uses a file-based data storage system as a temporary solution before migrating to a formal database. All application data is stored in JSON files located in the `database/` directory at the project root. Each JSON file corresponds to a database table.

### Navigation Data Structure & Database Migration

The navigation data for all courses is stored in a single JSON file, which acts as a temporary database. The structure of this file is designed to be easily migrated to a formal database system in the future.

#### Data Model: Adjacency List

The JSON file contains a single flat array of "node" objects. Each object represents a subject, unit, chapter, topic, or sub-topic. The tree-like hierarchy is represented using the **Adjacency List** pattern:

- Each node has a unique `id`.
- Each node has a `parentId` property that points to the `id` of its parent. Root nodes (i.e., subjects) have a `parentId` of `null`.
- Every node, at every level, also contains a `course` property, explicitly associating it with a course.

#### Future Database Schema

This structure maps directly to a single table in a relational database (e.g., PostgreSQL, MySQL), which might be named `navigation_nodes`.

Each node object in the JSON array corresponds to a **row** in this table. The object's properties map to the table's **columns**:

- `id` (Primary Key)
- `parentId` (Foreign Key to `navigation_nodes.id`)
- `course` (VARCHAR, or a Foreign Key to a `courses` table)
- `name` (VARCHAR)
- `type` (VARCHAR or ENUM)
- `orderIndex` (INTEGER)
- ...and so on for the other properties (`scopeId`, `collapsed`, `createdAt`, etc.).

This design ensures that the current data entry work is productive and directly reusable. The final JSON file can be used as the source for a simple migration script to populate the permanent database.

#### Schema Efficiency & Alternatives

The current **Adjacency List** model is an excellent and standard choice for representing hierarchical data. Its main advantages are simplicity and the efficiency of write operations (adding, moving, or updating nodes), which makes it ideal for the current data entry tool.

However, when migrating to a production database, it's important to consider the performance trade-offs, particularly for read operations.

- **Challenge with Adjacency Lists:** Fetching all descendants of a node (e.g., all chapters and topics within a subject) requires a recursive query. While modern databases handle this well, it can become a performance consideration on very large or deep trees.

- **Recommended Enhancement: Materialized Path:** To optimize for fast reads of entire sub-trees, consider adding a `path` column to the `navigation_nodes` table in your future database. This column would store the full, delimited chain of ancestor IDs (e.g., `subject_id/unit_id/chapter_id/`).
  - **Benefit:** This allows you to fetch all descendants with a simple and highly efficient `LIKE` query (e.g., `WHERE path LIKE 'subject_id/unit_id/%'`).
  - **Implementation:** The `path` column can be generated during the database migration script. The data entry tool does not need to be changed.

- **Advanced Alternative: Closure Table:** For even more complex querying needs, a "Closure Table" is another powerful pattern that stores all possible ancestor-descendant paths in a separate table. This offers maximum flexibility but adds complexity compared to a Materialized Path.

**Conclusion:** The current JSON structure is optimal for its purpose. The recommendations above should be considered during the design and migration to the final database schema to ensure long-term performance and scalability.

#### Recommended Columns for Maintainability

To further improve long-term maintainability and support future features, consider adding the following columns to your `navigation_nodes` database schema:

1.  **`status` column**
    - **Type:** `VARCHAR`
    - **Example Values:** `'draft'`, `'published'`, `'archived'`
    - **Purpose:** This allows for a content lifecycle. Changes can be made safely in a `'draft'` state without affecting the live application. Content would only become visible in production when explicitly `'published'`.

2.  **`version` column**
    - **Type:** `INTEGER`
    - **Example Values:** `1`, `2`, `3`...
    - **Purpose:** This enables **Optimistic Locking**. If two users try to edit the same node simultaneously, the `version` number can be used to detect the conflict and prevent one user's changes from overwriting the other's, thus preserving data integrity.
