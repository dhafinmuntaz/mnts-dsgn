# Supabase and GitHub Pages setup

This project is a static site, so GitHub Pages can host the frontend while Supabase provides online authentication and database storage on its free tier.

Hosted URLs:

- Public site: `https://dhafinmuntaz.github.io/mnts-dsgn/`
- Admin login: `https://dhafinmuntaz.github.io/mnts-dsgn/login/`

## 1. Create the Supabase project

1. Create a project at <https://supabase.com>.
2. Open **SQL Editor**, click **New query**, copy all contents of `supabase/schema.sql` into it, and click **Run**. GitHub does not run this SQL file automatically.
3. Open **Authentication > Users** and create the admin accounts. Do not store passwords in this repository.
4. Copy the project URL and the browser-safe `anon` key from **Project Settings > API**.

## Admin and other accounts

Create accounts from **Authentication > Users > Add user**. Use an email and password for each person, for example:

- owner account: full access to the dashboard
- editor account: content editing account
- project account: project/page management account

The current database policies allow every authenticated account to edit all content. This is suitable for a small private team. Do not create accounts by putting passwords in JavaScript. For different permissions, add roles and stricter RLS policies before sharing the dashboard widely.

The `service_role` key must never be added to browser code, GitHub, or this repository.

## 2. GitHub Pages

1. Create a GitHub repository and push this folder to the `main` branch.
2. Open **Settings > Pages** and set the source to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy-pages.yml` deploys the repository automatically after each push.

## 3. Next application migration

The hosted application is Supabase-only. The homepage reads public rows from Supabase, and the admin pages require a Supabase Auth session before loading or saving content:

- admin login: Supabase Auth email/password sign-in
- profile/about data: `site_content`
- pages: `pages`
- projects: `projects`
- images: public image URLs entered in the dashboard; image files are not uploaded to Supabase

The dashboard currently manages these database-backed areas:

- Profile: site name, hero, featured project, and contact details
- About: title and description
- Homepage Sections: insights, career, and services
- Pages: create and delete pages
- Projects: create, edit, open, and delete project pages

## Commit updates to GitHub

The dashboard button creates or updates `content-export.json` in the GitHub repository. It is a backup snapshot of the Supabase content; the live website still reads Supabase directly.

Deploy the Edge Function in `supabase/functions/commit-content/index.ts`, then configure these Supabase Edge Function secrets:

```text
GITHUB_OWNER=dhafinmuntaz
GITHUB_REPO=mnts-dsgn
GITHUB_BRANCH=main
GITHUB_TOKEN=your-fine-grained-token
```

The GitHub token must be created with fine-grained access limited to this repository and **Contents: Read and write** only. Never put this token in `supabase-config.js` or frontend code.

### Configure the secrets

From the project folder, run:

```powershell
npx supabase login
npx supabase link --project-ref mtzkjlgbskocooqlajdj
npx supabase functions deploy commit-content
npx supabase secrets set GITHUB_OWNER=dhafinmuntaz GITHUB_REPO=mnts-dsgn GITHUB_BRANCH=main
npx supabase secrets set GITHUB_TOKEN=YOUR_FINE_GRAINED_GITHUB_TOKEN
```

The token is entered only into the terminal and stored by Supabase. Do not paste it into chat, JavaScript, or GitHub files. After deployment, reload the admin dashboard and press **Commit to GitHub**. The popup will show the success or the exact backend error.

After running the SQL, open the hosted admin login. The dashboard status should say `Supabase connected and database tables are available.`

Do not publish the site as production CMS until the Supabase URL and anon key are configured and the RLS policies have been tested.