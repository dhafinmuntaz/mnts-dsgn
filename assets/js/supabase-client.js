(function () {
  const config = window.MNTS_SUPABASE_CONFIG || {};
  const hasConfig = Boolean(config.url && config.anonKey && window.supabase);
  const client = hasConfig ? window.supabase.createClient(config.url, config.anonKey) : null;

  window.mntsSupabase = {
    enabled: hasConfig,
    client,
    async testConnection() {
      if (!client) return { connected: false, message: 'Supabase credentials are missing.' };
      const { error } = await client.from('site_content').select('id').eq('id', 'main').maybeSingle();
      if (error) return { connected: false, message: error.message };
      return { connected: true, message: 'Supabase connected and database tables are available.' };
    },
    async signIn(email, password) {
      if (!client) return { data: null, error: null };
      return client.auth.signInWithPassword({ email, password });
    },
    async signOut() {
      if (client) await client.auth.signOut();
    },
    async commitContentToGitHub() {
      if (!client) throw new Error('Supabase is not configured.');
      const { data, error } = await client.functions.invoke('commit-content');
      if (error) throw error;
      return data;
    },
    async getSiteContent() {
      if (!client) return null;
      const { data, error } = await client.from('site_content').select('content').eq('id', 'main').maybeSingle();
      if (error) throw error;
      return data ? data.content : null;
    },
    async saveSiteContent(content) {
      if (!client) return;
      const { error } = await client.from('site_content').upsert({ id: 'main', content, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    async getPages() {
      if (!client) return null;
      const { data, error } = await client.from('pages').select('id,name,slug').order('created_at');
      if (error) throw error;
      return data;
    },
    async replacePages(pages) {
      if (!client) return;
      const { data: current, error: readError } = await client.from('pages').select('id');
      if (readError) throw readError;
      const ids = pages.map((page) => page.id);
      const removed = (current || []).filter((page) => !ids.includes(page.id)).map((page) => page.id);
      if (removed.length) {
        const { error } = await client.from('pages').delete().in('id', removed);
        if (error) throw error;
      }
      if (pages.length) {
        const { error } = await client.from('pages').upsert(pages);
        if (error) throw error;
      }
    },
    async getProjects() {
      if (!client) return null;
      const { data, error } = await client.from('projects').select('id,title,location,description,image').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    async replaceProjects(projects) {
      if (!client) return;
      const { data: current, error: readError } = await client.from('projects').select('id');
      if (readError) throw readError;
      const ids = projects.map((project) => project.id);
      const removed = (current || []).filter((project) => !ids.includes(project.id)).map((project) => project.id);
      if (removed.length) {
        const { error } = await client.from('projects').delete().in('id', removed);
        if (error) throw error;
      }
      if (projects.length) {
        const { error } = await client.from('projects').upsert(projects);
        if (error) throw error;
      }
    }
  };
})();
