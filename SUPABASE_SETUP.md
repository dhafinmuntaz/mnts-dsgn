# Supabase and GitHub Pages setup

This project is a static site, so GitHub Pages can host the frontend while Supabase provides online authentication and database storage on its free tier.

## 1. Create the Supabase project

1. Create a project at <https://supabase.com>.
2. Open **SQL Editor**, click **New query**, copy all contents of `supabase/schema.sql` into it, and click **Run**. GitHub does not run this SQL file automatically.
3. Open **Authentication > Users** and create the admin accounts. Do not store passwords in this repository.
4. Copy the project URL and the browser-safe `anon` key from **Project Settings > API**.

The `service_role` key must never be added to browser code, GitHub, or this repository.

## 2. GitHub Pages

1. Create a GitHub repository and push this folder to the `main` branch.
2. Open **Settings > Pages** and set the source to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy-pages.yml` deploys the repository automatically after each push.

## 3. Next application migration

The current prototype still uses localStorage so it remains usable offline. The next code change should replace these functions in `assets/js/admin.js` and `assets/js/site.js` with Supabase calls:

- admin login: Supabase Auth email/password sign-in
- profile/about data: `site_content`
- pages: `pages`
- projects: `projects`
- images: a Supabase Storage bucket with authenticated upload policies

After running the SQL, open the hosted admin dashboard. Its status message should say `Supabase connected and database tables are available.`

Do not publish the site as production CMS until the Supabase URL and anon key are configured and the RLS policies have been tested.