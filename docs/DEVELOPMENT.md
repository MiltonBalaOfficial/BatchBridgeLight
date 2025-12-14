# Development Documentation

## Project Evolution

**Important:** This project is built upon an older, existing codebase. To ensure stability and avoid introducing breaking changes, it is recommended to apply modifications gradually. Large-scale refactoring efforts may have unforeseen consequences and should be approached with caution.

This document covers information relevant to the development and build process of the project.

## Build Commands

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code linting.

## Sorting Logic

For details on the student grid sorting logic, please refer to the [Sorting Logic](./sorting-logic.md) documentation.

## Developer Tooling

### "Mark All as Synced" Button

**Purpose:**

The "Mark All as Synced" button is a development utility within the Navigation Builder. Its primary function is to manually set the `synced` property to `true` for every node in the current navigation tree.

**Why it's needed:**

The `synced` flag is crucial for mimicking the behavior of data that is persisted in a database. Here's the intended workflow:

1.  **Local Changes:** When you create a new node or modify an existing one, it is considered "local" (`synced: false`).
2.  **Database Persistence:** In the final application, after saving the navigation tree to the database, the application would receive a confirmation and mark all the nodes as `synced: true`.
3.  **Behavioral Differences:** The `synced` flag affects application logic. For example, in the `deleteNode` function, a "brand new" node (where `synced` is `false`) is **hard-deleted** (removed from the state immediately). In contrast, a node that is considered "synced" is **soft-deleted** (its `deletedAt` property is set, but it remains in the tree), preserving its history as if it existed in the database.

Since the application currently saves to a JSON file instead of a database, the "Mark All as Synced" button provides a manual way to simulate a successful database save. This allows you to test and verify the soft-deletion logic and other behaviors that depend on the `synced` state.
