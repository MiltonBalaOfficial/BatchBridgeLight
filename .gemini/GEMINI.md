# Gemini Project Notes

This document outlines key aspects of the `BatchBridge` project, a platform for MBBS students of College of Medicine and JNM Hospital (COMJNMH) to connect with their seniors, juniors, and batchmates, fostering inter-batch bonding and sharing experiences. It assists the Gemini agent in understanding and interacting with the codebase effectively.

For detailed project documentation, please refer to the `docs/` directory, starting with `docs/README.md`.

## Agent Operational Notes

This section contains notes on environment-specific commands and project conventions to ensure the agent operates correctly.

### Shell Commands

The user's operating system is `win32`. Standard Unix/Linux shell commands may not work.

- **File Deletion:** Use `del` instead of `rm`. For example: `del my_file.txt`. For directories, use `rmdir /s /q` for a non-interactive recursive delete.

### Project Scripts & Conventions

- **Code Formatting:** The user has mentioned conventions like "prettify vs format". This is a reminder to always verify the exact script names in `package.json` before running commands like `npm run format` or `npm run lint`. Do not assume standard script names.

### Package Management

- **Core Packages:** Do not edit core packages (e.g., `next`, `react`, `typescript`) in `package.json` unless absolutely necessary. If a change is required, inform the user before making any modifications.
