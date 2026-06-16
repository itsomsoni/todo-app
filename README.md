# Todo Management Application
A Todo Management Application built with React. Features include pagination, debounced search, CRUD operations via the JSONPlaceholder API, and form validation.

## Features
- __Initial Data Fetching__: Retrieves todos from the JSONPlaceholder API on component mount.
- __Pagination__: Client-side pagination displaying 10 items per page with full navigation controls.
- __Debounced Search__: Filter todos by title with a 500ms debounce mechanism.
- __CRUD Operations__:
    - __Create__: Add new todos with form validation.
    - __Read__: Display todos in a table format with status (Completed/Pending).
    - __Update__: Edit existing titles and statuses without refreshing the page.
    - __Delete__: Remove todos with a confirmation prompt.
