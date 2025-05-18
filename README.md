This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Bug Description: Inconsistent 404 Handling with Parallel Routes

This project demonstrates an issue in Next.js version 15.3.2 where 404 error handling behaves inconsistently when using parallel routes (specifically with a `@breadcrumb` slot and a `[...catchAll]/page.tsx` segment) during client-side navigation.

**The Problem:**

When navigating to a non-existent page within a route group that utilizes parallel routes:
1.  **Correct Behavior:** If the navigation originates from the root page (`/`) to a non-existent page within the group (e.g., clicking a link on `/` that points to `/does-not-exist`), the application correctly displays the custom `not-found.tsx` page for that group (HTTP 404).
2.  **Incorrect Behavior:** If the navigation originates from another page *within the same route group* (e.g., navigating from `/main-group-page` or `/exists` to `/does-not-exist`), the application incorrectly returns an HTTP 200 status. The custom `not-found.tsx` page is not rendered, and often the content of the previous page remains visible or an empty page is shown.

This issue specifically occurs during client-side transitions. A full page refresh of the non-existent URL will correctly serve the 404 page.

## Steps to Reproduce the Bug

1.  **Set up the project:**
    *   **Option A: Clone the repository:**
        ```bash
        git clone https://github.com/r4sheed/nextjs-parallel-routes-404-repro.git
        cd nextjs-parallel-routes-404-repro
        ```
    *   **Option B: Use CodeSandbox:**
        Open the project directly in CodeSandbox: [https://codesandbox.io/p/github/r4sheed/nextjs-parallel-routes-404-repro/master?import=true](https://codesandbox.io/p/github/r4sheed/nextjs-parallel-routes-404-repro/master?import=true)
        If using CodeSandbox, you can skip to step 3, as dependencies will be installed automatically.

    Ensure you have the project files as structured. The key files for reproducing the bug are:
    *   `src/app/(main)/layout.tsx` (defines the main layout with the parallel route slot)
    *   `src/app/(main)/@breadcrumb/default.tsx`
    *   `src/app/(main)/@breadcrumb/[...catchAll]/page.tsx` (provides the content for the breadcrumb slot)
    *   `src/app/(main)/not-found.tsx` (custom 404 page for the `(main)` group)
    *   `src/app/page.tsx` (root page with a link to a non-existent page)
    *   `src/app/(main)/main-group-page/page.tsx` (a page within the group, also with a link to a non-existent page)
    *   `src/app/(main)/exists/page.tsx` (another page within the group)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

5.  **Test Scenario 1 (Correct 404):**
    *   On the home page (`/`), you will see a "Go to a page that does not exist (from root)" link.
    *   Click this link.
    *   **Expected:** You should see the "Not Found" page defined in `src/app/(main)/not-found.tsx`. The browser's network tools should show a 200 status for the navigation.

6.  **Test Scenario 2 (Incorrect 200 OK):**
    *   Navigate back to the home page (`/`).
    *   Click the "Go to Main Group Page" link to navigate to `/main-group-page`.
    *   On the `/main-group-page`, you will see a "Go to a page that does not exist (from main-group-page)" link.
    *   Click this link.
    *   **Expected:** You should see the "Not Found" page.
    *   **Actual:** The "Not Found" page is **not** displayed. The browser's network tools will show an HTTP 200 status for the navigation to `/does-not-exist`. The content might remain the same as `/main-group-page` or appear as an empty page, but it's not the custom 404 page.
    *   You can repeat this by navigating to `/exists` first and then clicking the link to `/does-not-exist` from there; the behavior will be the same.

This demonstrates the inconsistent handling of 404 pages with parallel routes depending on the client-side navigation origin.
