import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization) return json({ error: 'Authentication required.' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authorization } } }
  );
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Authentication required.' }, 401);

  const owner = Deno.env.get('GITHUB_OWNER');
  const repo = Deno.env.get('GITHUB_REPO');
  const token = Deno.env.get('GITHUB_TOKEN');
  const branch = Deno.env.get('GITHUB_BRANCH') || 'main';
  const filePath = Deno.env.get('GITHUB_FILE_PATH') || 'content-export.json';
  if (!owner || !repo || !token) return json({ error: 'GitHub secrets are not configured.' }, 500);

  const [contentResult, pagesResult, projectsResult] = await Promise.all([
    supabase.from('site_content').select('content,updated_at').eq('id', 'main').maybeSingle(),
    supabase.from('pages').select('id,name,slug,created_at').order('created_at'),
    supabase.from('projects').select('id,title,location,description,image,created_at').order('created_at', { ascending: false })
  ]);
  if (contentResult.error || pagesResult.error || projectsResult.error) {
    return json({ error: 'Could not read content from Supabase.' }, 500);
  }

  const snapshot = {
    exportedAt: new Date().toISOString(),
    exportedBy: userData.user.email,
    siteContent: contentResult.data?.content || {},
    pages: pagesResult.data || [],
    projects: projectsResult.data || []
  };
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  };

  let sha: string | undefined;
  const existing = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
  if (existing.ok) sha = (await existing.json()).sha;
  else if (existing.status !== 404) return json({ error: 'Could not read the GitHub file.' }, 502);

  const update = await fetch(apiUrl, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Update content snapshot from admin (${new Date().toISOString()})`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(snapshot, null, 2)))),
      branch,
      ...(sha ? { sha } : {})
    })
  });
  if (!update.ok) return json({ error: 'GitHub rejected the commit.' }, 502);
  const result = await update.json();
  return json({ message: 'Content committed to GitHub successfully.', url: result.commit?.html_url || null });
});
