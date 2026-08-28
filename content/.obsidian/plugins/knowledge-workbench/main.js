const { Plugin, ItemView, MarkdownRenderer, setIcon, Notice } = require('obsidian');

const VIEW_TYPE = 'knowledge-workbench-view';
const KNOWLEDGE_DIR = '01-知识库';
const LEARNING_DIR = '02-学习记录';
const SOURCES_DIR = '03-资料库';
const PLAYBOOK_DIR = '04-实战手册';
const CASES_DIR = '05-案例';
const TOOLS_DIR = '06-工具与数据';
const CANVAS_PATH = '07-白板/00-知识全景.canvas';
const TEMPLATE_DIR = '08-模板';

const DOMAIN_LABELS = [
  ['战略与经营', '战略与经营'],
  ['GTM', 'GTM'],
  ['增长', '增长'],
  ['AI产品', 'AI 产品'],
  ['数据分析', '数据分析'],
  ['平台机制', '平台机制'],
];

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function arrayify(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function formatDate(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `今天 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function words(text) {
  return String(text || '').replace(/[#>*_`\[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim();
}

class KnowledgeWorkbenchView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.route = 'home';
    this.searchTerm = '';
    this.domain = '全部';
    this.currentFile = null;
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return '知识工作台'; }
  getIcon() { return 'layout-dashboard'; }

  async onOpen() {
    document.body.classList.add('knowledge-workbench-active');
    await this.render();
  }

  async onClose() {
    document.body.classList.remove('knowledge-workbench-active');
  }

  icon(parent, name, cls = '') {
    const el = parent.createSpan({ cls: `kwb-icon ${cls}`.trim() });
    setIcon(el, name);
    return el;
  }

  navButton(parent, icon, label, route, active = false, onClick = null) {
    const btn = parent.createEl('button', { cls: `kwb-nav-item${active ? ' is-active' : ''}` });
    this.icon(btn, icon);
    btn.createSpan({ text: label });
    btn.addEventListener('click', async () => {
      if (onClick) return onClick();
      this.route = route;
      this.currentFile = null;
      await this.render();
    });
    return btn;
  }

  async openCanvas() {
    const file = this.app.vault.getAbstractFileByPath(CANVAS_PATH);
    if (file && file.extension === 'canvas') {
      await this.app.workspace.getLeaf('tab').openFile(file);
    } else {
      new Notice('未找到知识全景白板');
    }
  }

  async openGraph() {
    await this.app.commands.executeCommandById('graph:open');
  }

  markdownFiles(folder) {
    return this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(`${folder}/`) && !f.basename.startsWith('00-'));
  }

  frontmatter(file) {
    return this.app.metadataCache.getFileCache(file)?.frontmatter || {};
  }

  tagsFor(file) {
    const fm = this.frontmatter(file);
    const tags = arrayify(fm.tags).map(t => String(t).replace(/^#/, ''));
    const cacheTags = (this.app.metadataCache.getFileCache(file)?.tags || []).map(t => t.tag.replace(/^#/, ''));
    return [...new Set([...tags, ...cacheTags])].filter(Boolean);
  }

  statusFor(file) {
    const status = String(this.frontmatter(file).status || '').trim();
    if (!status) return '永久';
    if (/draft|整理|processing|curat/i.test(status)) return '整理中';
    if (/question|open|todo/i.test(status)) return '待处理';
    return status;
  }

  domainFor(file) {
    const path = file.path;
    for (const [folder, label] of DOMAIN_LABELS) {
      if (path.includes(`/${folder}/`)) return label;
    }
    const raw = String(this.frontmatter(file).domain || '');
    const map = { strategy: '战略与经营', growth: '增长', ai: 'AI 产品', data: '数据分析', platform: '平台机制', gtm: 'GTM' };
    return map[raw] || raw || '其他';
  }

  async render() {
    this.contentEl.empty();
    this.contentEl.addClass('kwb-root');

    const shell = this.contentEl.createDiv({ cls: 'kwb-shell' });
    const sidebar = shell.createAside({ cls: 'kwb-sidebar kwb-glass' });
    this.renderSidebar(sidebar);

    const main = shell.createMain({ cls: 'kwb-main' });
    this.renderTopbar(main);
    const stage = main.createDiv({ cls: 'kwb-stage' });

    if (this.route === 'home') await this.renderHome(stage);
    else if (this.route === 'knowledge') await this.renderKnowledge(stage);
    else if (this.route === 'learning') await this.renderSimpleLibrary(stage, '学习记录', LEARNING_DIR, 'check-circle-2');
    else if (this.route === 'sources') await this.renderSimpleLibrary(stage, '资料库', SOURCES_DIR, 'folder');
    else if (this.route === 'templates') await this.renderSimpleLibrary(stage, '模板', TEMPLATE_DIR, 'copy');
    else if (this.route === 'reader' && this.currentFile) await this.renderReader(stage, this.currentFile);
    else await this.renderHome(stage);
  }

  renderSidebar(sidebar) {
    const brand = sidebar.createDiv({ cls: 'kwb-brand' });
    this.icon(brand, 'gem');
    brand.createSpan({ text: 'Obsidian 工作台' });

    const primary = sidebar.createDiv({ cls: 'kwb-nav' });
    this.navButton(primary, 'house', '首页', 'home', this.route === 'home');
    this.navButton(primary, 'book-open', '知识库', 'knowledge', ['knowledge', 'reader'].includes(this.route));
    this.navButton(primary, 'check-circle-2', '学习记录', 'learning', this.route === 'learning');
    this.navButton(primary, 'folder', '资料库', 'sources', this.route === 'sources');
    this.navButton(primary, 'presentation', '白板', 'canvas', false, () => this.openCanvas());
    this.navButton(primary, 'copy', '模板', 'templates', this.route === 'templates');

    sidebar.createDiv({ cls: 'kwb-divider' });
    const secondary = sidebar.createDiv({ cls: 'kwb-nav kwb-nav-secondary' });
    this.navButton(secondary, 'tag', '标签', 'knowledge', false, async () => {
      this.route = 'knowledge'; this.searchTerm = '#'; await this.render();
    });
    this.navButton(secondary, 'waypoints', '图谱视图', 'graph', false, () => this.openGraph());

    const stats = sidebar.createDiv({ cls: 'kwb-sidebar-footer' });
    stats.createDiv({ cls: 'kwb-sidebar-label', text: '知识资产' });
    const total = this.markdownFiles(KNOWLEDGE_DIR).length;
    stats.createDiv({ cls: 'kwb-storage-value', text: `${total} 篇核心知识` });
    const bar = stats.createDiv({ cls: 'kwb-storage-bar' });
    bar.createDiv({ cls: 'kwb-storage-fill' });
    const settings = stats.createEl('button', { cls: 'kwb-settings-btn' });
    this.icon(settings, 'settings');
    settings.createSpan({ text: '设置' });
    settings.addEventListener('click', () => this.app.setting.open());
  }

  renderTopbar(main) {
    const topbar = main.createHeader({ cls: 'kwb-topbar' });
    const searchWrap = topbar.createDiv({ cls: 'kwb-search kwb-glass' });
    this.icon(searchWrap, 'search');
    const search = searchWrap.createEl('input', { attr: { placeholder: '搜索笔记、文件、标签或链接…' } });
    search.value = this.searchTerm === '#' ? '' : this.searchTerm;
    search.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') return;
      this.searchTerm = search.value.trim();
      this.route = 'knowledge';
      await this.render();
    });

    const nav = topbar.createNav({ cls: 'kwb-topnav' });
    const items = [
      ['知识驾驶舱', 'home'], ['笔记', 'knowledge'], ['图谱', 'graph'], ['白板', 'canvas']
    ];
    items.forEach(([label, route]) => {
      const b = nav.createEl('button', { text: label, cls: ((route === 'home' && this.route === 'home') || (route === 'knowledge' && ['knowledge','reader'].includes(this.route))) ? 'is-active' : '' });
      b.addEventListener('click', async () => {
        if (route === 'graph') return this.openGraph();
        if (route === 'canvas') return this.openCanvas();
        this.route = route; this.currentFile = null; await this.render();
      });
    });

    const actions = topbar.createDiv({ cls: 'kwb-actions' });
    ['calendar-days', 'layout-grid', 'bell'].forEach(name => {
      const b = actions.createEl('button', { cls: 'kwb-icon-btn' });
      this.icon(b, name);
    });
    const profile = actions.createDiv({ cls: 'kwb-profile kwb-glass' });
    const avatar = profile.createDiv({ cls: 'kwb-avatar' });
    this.icon(avatar, 'sparkles');
    profile.createSpan({ text: '个人知识系统' });
    this.icon(profile, 'chevron-down');
  }

  statCard(parent, icon, label, value, sub = '') {
    const card = parent.createDiv({ cls: 'kwb-stat kwb-glass' });
    this.icon(card, icon);
    card.createDiv({ cls: 'kwb-stat-label', text: label });
    card.createDiv({ cls: 'kwb-stat-value', text: String(value) });
    if (sub) card.createDiv({ cls: 'kwb-stat-sub', text: sub });
  }

  async renderHome(stage) {
    const hero = stage.createSection({ cls: 'kwb-hero kwb-glass' });
    hero.createDiv({ cls: 'kwb-eyebrow', text: 'PERSONAL KNOWLEDGE WORKBENCH' });
    hero.createEl('h1', { text: '知识驾驶舱' });
    hero.createEl('p', { text: '学习 · 连接 · 沉淀 · 复用。把 ChatGPT 中的学习与研究，持续长成可连接、可检索、可复用的长期知识。' });
    const heroActions = hero.createDiv({ cls: 'kwb-hero-actions' });
    const knowledgeBtn = heroActions.createEl('button', { cls: 'kwb-primary-btn', text: '进入知识库' });
    knowledgeBtn.addEventListener('click', async () => { this.route = 'knowledge'; await this.render(); });
    const canvasBtn = heroActions.createEl('button', { cls: 'kwb-secondary-btn', text: '打开知识全景' });
    canvasBtn.addEventListener('click', () => this.openCanvas());

    const stats = stage.createDiv({ cls: 'kwb-stats-row' });
    this.statCard(stats, 'book-open', '核心知识', this.markdownFiles(KNOWLEDGE_DIR).length, 'Canonical Knowledge');
    this.statCard(stats, 'check-circle-2', '学习记录', this.markdownFiles(LEARNING_DIR).length, 'Learning Episodes');
    this.statCard(stats, 'inbox', '资料来源', this.markdownFiles(SOURCES_DIR).length, 'Sources & Inbox');
    this.statCard(stats, 'route', '实战手册', this.markdownFiles(PLAYBOOK_DIR).length, 'Playbooks');

    const grid = stage.createDiv({ cls: 'kwb-home-grid' });
    const recent = grid.createSection({ cls: 'kwb-panel kwb-glass kwb-span-2' });
    this.panelHeader(recent, '最近更新', 'clock-3', '全部记录', () => { this.route = 'knowledge'; this.render(); });
    const recentFiles = this.markdownFiles(KNOWLEDGE_DIR).sort((a,b) => b.stat.mtime - a.stat.mtime).slice(0, 6);
    recentFiles.forEach(file => this.listRow(recent, file, this.domainFor(file), formatDate(file.stat.mtime), () => this.openReader(file)));

    const domains = grid.createSection({ cls: 'kwb-panel kwb-glass' });
    this.panelHeader(domains, '六大知识领域', 'layers-3');
    DOMAIN_LABELS.forEach(([folder, label]) => {
      const count = this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(`${KNOWLEDGE_DIR}/${folder}/`) && !f.basename.startsWith('00-')).length;
      const row = domains.createEl('button', { cls: 'kwb-domain-row' });
      this.icon(row, label === 'GTM' ? 'compass' : label === '增长' ? 'trending-up' : label === 'AI 产品' ? 'bot' : label === '数据分析' ? 'chart-no-axes-combined' : label === '平台机制' ? 'network' : 'target');
      row.createSpan({ text: label });
      row.createSpan({ cls: 'kwb-count', text: String(count) });
      row.addEventListener('click', async () => { this.route='knowledge'; this.domain=label; await this.render(); });
    });

    const questions = grid.createSection({ cls: 'kwb-panel kwb-glass' });
    this.panelHeader(questions, '开放问题', 'circle-help');
    const qs = [];
    for (const file of this.markdownFiles(LEARNING_DIR)) {
      const arr = arrayify(this.frontmatter(file).open_questions);
      for (const q of arr) if (q) qs.push([file, String(q)]);
    }
    if (!qs.length) questions.createDiv({ cls: 'kwb-empty', text: '暂无开放问题' });
    qs.slice(0, 5).forEach(([file, q]) => {
      const item = questions.createEl('button', { cls: 'kwb-question-row' });
      this.icon(item, 'circle'); item.createSpan({ text: q });
      item.addEventListener('click', () => this.openNative(file));
    });

    const learning = grid.createSection({ cls: 'kwb-panel kwb-glass kwb-span-2' });
    this.panelHeader(learning, '当前学习', 'graduation-cap');
    const current = this.app.vault.getAbstractFileByPath('00-驾驶舱/01-当前学习.md');
    if (current && current.extension === 'md') {
      const md = stripFrontmatter(await this.app.vault.cachedRead(current));
      const snippet = words(md).slice(0, 420);
      learning.createEl('p', { cls: 'kwb-learning-copy', text: snippet || '当前学习内容会显示在这里。' });
    }
  }

  panelHeader(panel, title, icon, actionLabel = '', action = null) {
    const head = panel.createDiv({ cls: 'kwb-panel-head' });
    const left = head.createDiv({ cls: 'kwb-panel-title' });
    this.icon(left, icon); left.createSpan({ text: title });
    if (actionLabel) {
      const b = head.createEl('button', { text: actionLabel, cls: 'kwb-panel-action' });
      if (action) b.addEventListener('click', action);
    }
  }

  listRow(parent, file, meta, when, onClick) {
    const row = parent.createEl('button', { cls: 'kwb-list-row' });
    const left = row.createDiv({ cls: 'kwb-list-main' });
    this.icon(left, 'file-text');
    const text = left.createDiv();
    text.createDiv({ cls: 'kwb-list-title', text: file.basename });
    if (meta) text.createDiv({ cls: 'kwb-list-meta', text: meta });
    row.createSpan({ cls: 'kwb-list-time', text: when });
    row.addEventListener('click', onClick);
  }

  filteredKnowledge() {
    let files = this.markdownFiles(KNOWLEDGE_DIR);
    if (this.domain !== '全部') files = files.filter(f => this.domainFor(f) === this.domain);
    const q = this.searchTerm.trim().toLowerCase();
    if (q && q !== '#') files = files.filter(f => {
      const hay = [f.basename, this.domainFor(f), this.tagsFor(f).join(' '), JSON.stringify(this.frontmatter(f))].join(' ').toLowerCase();
      return hay.includes(q);
    });
    return files.sort((a,b) => b.stat.mtime - a.stat.mtime);
  }

  async renderKnowledge(stage) {
    const layout = stage.createDiv({ cls: 'kwb-index-layout' });
    const main = layout.createDiv({ cls: 'kwb-index-main' });
    const rail = layout.createAside({ cls: 'kwb-index-rail' });

    const intro = main.createDiv({ cls: 'kwb-page-title' });
    const titleLine = intro.createDiv({ cls: 'kwb-title-line' });
    this.icon(titleLine, 'book-open'); titleLine.createEl('h1', { text: '知识索引' });
    intro.createEl('p', { text: '快速浏览、查找与管理你的全部知识资产' });

    const filter = main.createDiv({ cls: 'kwb-filterbar kwb-glass' });
    const qWrap = filter.createDiv({ cls: 'kwb-filter-search' });
    this.icon(qWrap, 'search');
    const input = qWrap.createEl('input', { attr: { placeholder: '搜索笔记标题、标签、领域…' } });
    input.value = this.searchTerm === '#' ? '' : this.searchTerm;
    const apply = async () => { this.searchTerm = input.value.trim(); await this.render(); };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') apply(); });
    const clear = filter.createEl('button', { cls: 'kwb-clear-filter' });
    this.icon(clear, 'rotate-ccw'); clear.createSpan({ text: '清除筛选' });
    clear.addEventListener('click', async () => { this.searchTerm=''; this.domain='全部'; await this.render(); });

    const chips = main.createDiv({ cls: 'kwb-domain-chips' });
    ['全部', ...DOMAIN_LABELS.map(x => x[1])].forEach(label => {
      const b = chips.createEl('button', { text: label, cls: `kwb-chip${this.domain === label ? ' is-active' : ''}` });
      b.addEventListener('click', async () => { this.domain = label; await this.render(); });
    });

    const all = this.markdownFiles(KNOWLEDGE_DIR);
    const stats = main.createDiv({ cls: 'kwb-index-stats' });
    this.statCard(stats, 'files', '全部笔记', all.length);
    this.statCard(stats, 'gem', '核心领域', DOMAIN_LABELS.length);
    this.statCard(stats, 'link-2', '已链接笔记', all.filter(f => (this.app.metadataCache.getFileCache(f)?.links || []).length > 0).length);
    this.statCard(stats, 'tags', '标签总数', new Set(all.flatMap(f => this.tagsFor(f))).size);

    const table = main.createSection({ cls: 'kwb-table-card kwb-glass' });
    this.panelHeader(table, '知识索引', 'layout-grid');
    const header = table.createDiv({ cls: 'kwb-table-row kwb-table-header' });
    ['标题', '标签', '最后更新', '状态'].forEach(x => header.createSpan({ text: x }));
    const filtered = this.filteredKnowledge();
    filtered.slice(0, 40).forEach(file => {
      const row = table.createEl('button', { cls: 'kwb-table-row' });
      const title = row.createDiv({ cls: 'kwb-table-title' });
      this.icon(title, 'file-text'); title.createSpan({ text: file.basename });
      const tags = row.createDiv({ cls: 'kwb-tagset' });
      const shown = [this.domainFor(file), ...this.tagsFor(file)].filter(Boolean).slice(0,3);
      shown.forEach(tag => tags.createSpan({ cls: 'kwb-tag', text: tag }));
      row.createSpan({ text: formatDate(file.stat.mtime) });
      row.createSpan({ cls: `kwb-status kwb-status-${this.statusFor(file) === '整理中' ? 'working' : 'stable'}`, text: this.statusFor(file) });
      row.addEventListener('click', () => this.openReader(file));
    });
    table.createDiv({ cls: 'kwb-table-foot', text: `共 ${filtered.length} 条` });

    const popular = rail.createSection({ cls: 'kwb-panel kwb-glass' });
    this.panelHeader(popular, '热门标签', 'tags');
    const freq = new Map();
    all.flatMap(f => this.tagsFor(f)).forEach(t => freq.set(t, (freq.get(t) || 0) + 1));
    const cloud = popular.createDiv({ cls: 'kwb-tag-cloud' });
    [...freq.entries()].sort((a,b) => b[1]-a[1]).slice(0,10).forEach(([tag,count]) => {
      const b = cloud.createEl('button', { cls: 'kwb-tag' });
      b.createSpan({ text: tag }); b.createSpan({ cls:'kwb-tag-count', text:String(count) });
      b.addEventListener('click', async () => { this.searchTerm = tag; await this.render(); });
    });

    const recent = rail.createSection({ cls: 'kwb-panel kwb-glass' });
    this.panelHeader(recent, '最近更新', 'history');
    all.sort((a,b)=>b.stat.mtime-a.stat.mtime).slice(0,6).forEach(f => this.listRow(recent, f, '', formatDate(f.stat.mtime), () => this.openReader(f)));
  }

  async renderReader(stage, file) {
    const layout = stage.createDiv({ cls: 'kwb-reader-layout' });
    const article = layout.createArticle({ cls: 'kwb-article kwb-glass' });
    const rail = layout.createAside({ cls: 'kwb-reader-rail' });

    const crumb = article.createEl('button', { cls: 'kwb-back-btn' });
    this.icon(crumb, 'arrow-left'); crumb.createSpan({ text: '返回知识索引' });
    crumb.addEventListener('click', async () => { this.route='knowledge'; this.currentFile=null; await this.render(); });

    const fm = this.frontmatter(file);
    article.createEl('h1', { cls: 'kwb-reader-title', text: fm.title || file.basename });
    const meta = article.createDiv({ cls: 'kwb-reader-meta' });
    this.icon(meta, 'folder'); meta.createSpan({ text: this.domainFor(file) });
    this.icon(meta, 'calendar-days'); meta.createSpan({ text: formatDate(file.stat.mtime) });
    this.icon(meta, 'clock-3'); meta.createSpan({ text: `${Math.max(2, Math.ceil(file.stat.size / 1100))} min read` });
    this.tagsFor(file).slice(0,3).forEach(tag => meta.createSpan({ cls:'kwb-tag', text:tag }));

    const body = article.createDiv({ cls: 'kwb-rendered markdown-rendered' });
    const raw = stripFrontmatter(await this.app.vault.cachedRead(file));
    await MarkdownRenderer.render(this.app, raw, body, file.path, this);
    body.querySelectorAll('a.internal-link').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.getAttribute('data-href') || a.getAttribute('href') || '';
        this.app.workspace.openLinkText(href, file.path, false);
      });
    });

    const footer = article.createDiv({ cls: 'kwb-reader-footer' });
    this.tagsFor(file).forEach(tag => footer.createSpan({ cls:'kwb-tag', text:`#${tag}` }));
    const edit = footer.createEl('button', { cls:'kwb-edit-native' });
    this.icon(edit, 'pencil'); edit.createSpan({ text:'在 Obsidian 编辑' });
    edit.addEventListener('click', () => this.openNative(file));

    const cache = this.app.metadataCache.getFileCache(file);
    const related = rail.createSection({ cls:'kwb-panel kwb-glass' });
    this.panelHeader(related, '相关知识', 'link-2');
    const links = (cache?.links || []).slice(0,6);
    if (!links.length) related.createDiv({ cls:'kwb-empty', text:'暂无显式关联' });
    links.forEach(link => {
      const b = related.createEl('button', { cls:'kwb-related-row' });
      this.icon(b,'file-text'); b.createSpan({ text: link.displayText || link.link });
      b.addEventListener('click', () => this.app.workspace.openLinkText(link.link, file.path, false));
    });

    const sources = rail.createSection({ cls:'kwb-panel kwb-glass' });
    this.panelHeader(sources, '来源与引用', 'paperclip');
    const sourceVals = [...arrayify(fm.source), ...arrayify(fm.sources), ...arrayify(fm.source_url)].filter(Boolean);
    if (!sourceVals.length) sources.createDiv({ cls:'kwb-source-quote', text:'该知识卡片暂无单独来源字段；可通过 Sources 层继续补充 provenance。' });
    sourceVals.slice(0,5).forEach(s => sources.createDiv({ cls:'kwb-source-item', text:String(s) }));

    const questions = rail.createSection({ cls:'kwb-panel kwb-glass' });
    this.panelHeader(questions, '开放问题', 'circle-help');
    const qs = arrayify(fm.open_questions).filter(Boolean);
    if (!qs.length) questions.createDiv({ cls:'kwb-empty', text:'暂无开放问题' });
    qs.slice(0,6).forEach(q => {
      const item = questions.createDiv({ cls:'kwb-question-row' });
      this.icon(item,'circle'); item.createSpan({ text:String(q) });
    });
  }

  async renderSimpleLibrary(stage, title, folder, icon) {
    const intro = stage.createDiv({ cls:'kwb-page-title' });
    const line = intro.createDiv({ cls:'kwb-title-line' }); this.icon(line, icon); line.createEl('h1',{text:title});
    intro.createEl('p',{text:`浏览 ${title} 中的全部内容`});
    const panel = stage.createSection({ cls:'kwb-panel kwb-glass kwb-library-list' });
    const files = this.markdownFiles(folder).sort((a,b)=>b.stat.mtime-a.stat.mtime);
    files.forEach(f => this.listRow(panel, f, this.tagsFor(f).slice(0,3).join(' · '), formatDate(f.stat.mtime), () => this.openNative(f)));
    if (!files.length) panel.createDiv({cls:'kwb-empty', text:'暂无内容'});
  }

  async openReader(file) {
    this.route = 'reader'; this.currentFile = file; await this.render();
  }

  async openNative(file) {
    await this.app.workspace.getLeaf('tab').openFile(file);
  }
}

module.exports = class KnowledgeWorkbenchPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE, leaf => new KnowledgeWorkbenchView(leaf, this));
    this.addRibbonIcon('layout-dashboard', '打开知识工作台', () => this.activate());
    this.addCommand({ id:'open-knowledge-workbench', name:'打开知识工作台', callback:() => this.activate() });
    this.registerEvent(this.app.workspace.on('active-leaf-change', leaf => {
      const active = leaf?.view?.getViewType?.() === VIEW_TYPE;
      document.body.classList.toggle('knowledge-workbench-active', active);
    }));
    this.app.workspace.onLayoutReady(() => {
      window.setTimeout(() => this.activate(), 250);
    });
  }

  onunload() {
    document.body.classList.remove('knowledge-workbench-active');
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async activate() {
    let [leaf] = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (!leaf) {
      leaf = this.app.workspace.getLeaf('tab');
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
  }
};
