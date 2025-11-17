# Contribution Guidelines for the Project

Welcome to the project! We appreciate your interest in contributing. To maintain a high standard of code quality and consistency, please adhere to the following guidelines when making contributions.

## File Naming Conventions

- **Use Hyphens**: All file names should use hyphens (`-`) to separate words. Avoid using camel casing or snake casing. For example, use `user-profile.ts` instead of `UserProfile.ts` or `user_profile.ts`.

## Directory Structure

- **Feature Organization**: In the `src/features` directory, each feature must have its own API slice. This helps in organizing the codebase and makes it easier to manage feature-specific logic. For example, if you are working on a user feature, create a file named `user-api-slice.ts`.

## Code Quality

- **Unit Testing**: All code must be unit tested. Ensure that you write comprehensive tests for any new functionality you introduce. This helps maintain the reliability of the codebase and makes it easier to catch bugs early.

## API Calls

- **Service Functions Only**: Do not use `fetch` or `axios` for API calls. Instead, utilize service functions provided by `@iblai/ibl-api`. This ensures consistency in how API interactions are handled across the project.

## Code Export

- **Export Newly Added Code**: Ensure that any new functions, hooks, or components you create are properly exported. This allows other parts of the application to access and utilize your code.

## TypeScript Usage

- **Type Safety**: Use TypeScript types wherever possible. Avoid using `any` as a type, as it defeats the purpose of type safety. Instead, define and use specific types to enhance code clarity and maintainability.

## Additional Best Practices

- **Documentation**: Comment your code where necessary to explain complex logic or decisions. This will help other contributors understand your thought process and the purpose of your code.
- **Consistent Formatting**: Follow consistent code formatting practices. Use tools like Prettier or ESLint to maintain code style across the project.
- **Pull Requests**: When submitting a pull request, provide a clear description of the changes you made and the reasons behind them. This helps reviewers understand your contributions better.

## Conclusion

Thank you for contributing to our project! By following these guidelines, you help us maintain a clean, organized, and efficient codebase. If you have any questions or need further clarification, feel free to reach out to the maintainers. Happy coding!
