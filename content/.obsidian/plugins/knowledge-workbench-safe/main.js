const { Plugin, ItemView, MarkdownRenderer, setIcon, Notice } = require('obsidian');

const VIEW = 'knowledge-workbench-safe-view';
const K = '01-知识库';
const L = '02-学习记录';
const S = '03-资料库';
const CANVAS = '07-白板/00-知识全景.canvas';
const DOMAINS = [
  ['战略与经营','战略与经营','target'],
  ['GTM','GTM','compass'],
  ['增长','增长','trending-up'],
  ['AI产品','AI 产品','bot'],
  ['数据分析','数据分析','bar-chart-3'],
  ['平台机制','平台机制','network']
];

const arr = v => v == null ? [] : Array.isArray(v) ? v : [v];
const stripFM = s => String(s || '').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
const plain = s => String(s || '').replace(/[#>*_`\[\]()!-]/g,' ').replace(/\s+/g,' ').trim();
const dateText = ms => {
  const d = new Date(ms), n = new Date();
  return d.toDateString() === n.toDateString()
    ? `今天 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    : `${d.getMonth()+1}月${d.getDate()}日`;
};

class SafeWorkbenchView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.route = 'home';
    this.query = '';
    this.domain = '全部';
    this.currentFile = null;
  }

  getViewType() { return VIEW; }
  getDisplayText() { return '知识工作台'; }
  getIcon() { return 'layout-dashboard'; }

  async onOpen() {
    document.body.classList.add('knowledge-workbench-safe-active');
    await this.renderSafe();
  }

  async onClose() {
    document.body.classList.remove('knowledge-workbench-safe-active');
  }

  el(tag, cls = '', text = '') {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  icon(name) {
    const span = this.el('span', 'kwbs-icon');
    try {
      setIcon(span, name);
    } catch (err) {
      span.textContent = '·';
      console.warn('[Knowledge Workbench] icon fallback', name, err);
    }
    return span;
  }

  append(parent, child) { parent.appendChild(child); return child; }

  files(folder) {
    return this.app.vault.getMarkdownFiles().filter(f => f.path.startsWith(folder + '/') && !f.basename.startsWith('00-'));
  }

  fm(file) { return this.app.metadataCache.getFileCache(file)?.frontmatter || {}; }

  tags(file) {
    const a = arr(this.fm(file).tags).map(x => String(x).replace(/^#/,''));
    const b = (this.app.metadataCache.getFileCache(file)?.tags || []).map(x => x.tag.replace(/^#/,''));
    return [...new Set([...a,...b])].filter(Boolean);
  }

  domainOf(file) {
    for (const [folder,label] of DOMAINS) if (file.path.includes('/' + folder + '/')) return label;
    const raw = String(this.fm(file).domain || '');
    return ({strategy:'战略与经营',growth:'增长',ai:'AI 产品',data:'数据分析',platform:'平台机制',gtm:'GTM'})[raw] || raw || '其他';
  }

  async renderSafe() {
    try {
      await this.render();
    } catch (err) {
      console.error('[Knowledge Workbench] render failed', err);
      this.contentEl.empty();
      this.contentEl.addClass('kwbs-root');
      const box = this.el('div','kwbs-fatal');
      this.append(box, this.el('h2','', '知识工作台加载失败'));
      this.append(box, this.el('p','', String(err?.message || err)));
      this.append(box, this.el('p','kwbs-muted','这个错误已被兜底显示，不会再出现整页空白。'));
      this.contentEl.appendChild(box);
    }
  }

  async render() {
    this.contentEl.empty();
    this.contentEl.addClass('kwbs-root');

    const shell = this.el('div','kwbs-shell');
    const side = this.el('aside','kwbs-sidebar kwbs-glass');
    const main = this.el('main','kwbs-main');
    shell.append(side, main);
    this.contentEl.appendChild(shell);

    this.renderSidebar(side);
    this.renderTopbar(main);
    const stage = this.el('div','kwbs-stage');
    main.appendChild(stage);

    if (this.route === 'knowledge') return this.renderKnowledge(stage);
    if (this.route === 'reader' && this.currentFile) return this.renderReader(stage, this.currentFile);
    return this.renderHome(stage);
  }

  navButton(parent, iconName, label, route, active = false, handler = null) {
    const b = this.el('button','kwbs-nav-item' + (active ? ' is-active' : ''));
    b.append(this.icon(iconName), this.el('span','',label));
    b.addEventListener('click', async () => {
      if (handler) return handler();
      this.route = route;
      this.currentFile = null;
      await this.renderSafe();
    });
    parent.appendChild(b);
  }

  renderSidebar(side) {
    const brand = this.el('div','kwbs-brand');
    brand.append(this.icon('gem'), this.el('span','', 'Obsidian 工作台'));
    side.appendChild(brand);

    const nav = this.el('div','kwbs-nav');
    side.appendChild(nav);
    this.navButton(nav,'house','首页','home',this.route === 'home');
    this.navButton(nav,'book-open','知识库','knowledge',['knowledge','reader'].includes(this.route));
    this.navButton(nav,'check-circle-2','学习记录','home',false,()=>this.openPath('02-学习记录/00-学习记录.md'));
    this.navButton(nav,'folder','资料库','home',false,()=>this.openPath('03-资料库/00-资料库.md'));
    this.navButton(nav,'presentation','白板','home',false,()=>this.openCanvas());
    this.navButton(nav,'copy','模板','home',false,()=>this.openPath('08-模板'));

    side.appendChild(this.el('div','kwbs-divider'));
    const sub = this.el('div','kwbs-nav kwbs-subnav');
    side.appendChild(sub);
    this.navButton(sub,'tag','标签','knowledge');
    this.navButton(sub,'waypoints','图谱视图','home',false,()=>this.app.commands.executeCommandById('graph:open'));

    const foot = this.el('div','kwbs-sidebar-footer');
    foot.append(this.el('div','kwbs-foot-label','知识资产'), this.el('div','kwbs-foot-value',`${this.files(K).length} 篇核心知识`));
    const bar = this.el('div','kwbs-storage-bar');
    bar.appendChild(this.el('div','kwbs-storage-fill'));
    foot.appendChild(bar);
    side.appendChild(foot);
  }

  renderTopbar(main) {
    const top = this.el('header','kwbs-topbar');
    const search = this.el('div','kwbs-search kwbs-glass');
    search.appendChild(this.icon('search'));
    const input = this.el('input');
    input.placeholder = '搜索笔记、文件、标签或链接…';
    input.value = this.query;
    input.addEventListener('keydown', async e => {
      if (e.key !== 'Enter') return;
      this.query = input.value.trim();
      this.route = 'knowledge';
      await this.renderSafe();
    });
    search.appendChild(input);
    top.appendChild(search);

    const tabs = this.el('nav','kwbs-topnav');
    [['知识驾驶舱','home'],['笔记','knowledge'],['图谱','graph'],['白板','canvas']].forEach(([label,route]) => {
      const active = (route === 'home' && this.route === 'home') || (route === 'knowledge' && ['knowledge','reader'].includes(this.route));
      const b = this.el('button', active ? 'is-active' : '', label);
      b.addEventListener('click', async () => {
        if (route === 'graph') return this.app.commands.executeCommandById('graph:open');
        if (route === 'canvas') return this.openCanvas();
        this.route = route;
        this.currentFile = null;
        await this.renderSafe();
      });
      tabs.appendChild(b);
    });
    top.appendChild(tabs);

    const profile = this.el('div','kwbs-profile kwbs-glass');
    profile.append(this.icon('sparkles'), this.el('span','', '个人知识系统'));
    top.appendChild(profile);
    main.appendChild(top);
  }

  glass(tag = 'section', extra = '') { return this.el(tag, `kwbs-glass ${extra}`.trim()); }

  stat(parent, label, value, sub) {
    const c = this.glass('div','kwbs-stat');
    c.append(this.el('div','kwbs-stat-label',label), this.el('div','kwbs-stat-value',String(value)), this.el('div','kwbs-stat-sub',sub));
    parent.appendChild(c);
  }

  panelHead(panel, title, iconName) {
    const h = this.el('div','kwbs-panel-head');
    const left = this.el('div','kwbs-panel-title');
    left.append(this.icon(iconName), this.el('span','',title));
    h.appendChild(left);
    panel.appendChild(h);
  }

  async renderHome(stage) {
    const hero = this.glass('section','kwbs-hero');
    hero.append(this.el('div','kwbs-eyebrow','PERSONAL KNOWLEDGE WORKBENCH'), this.el('h1','', '知识驾驶舱'), this.el('p','', '学习 · 连接 · 沉淀 · 复用。把 ChatGPT 中的学习与研究持续长成可连接、可检索、可复用的长期知识。'));
    const actions = this.el('div','kwbs-hero-actions');
    const kb = this.el('button','kwbs-primary','进入知识库');
    kb.addEventListener('click',async()=>{this.route='knowledge';await this.renderSafe();});
    const cb = this.el('button','kwbs-secondary','打开知识全景');
    cb.addEventListener('click',()=>this.openCanvas());
    actions.append(kb,cb); hero.appendChild(actions); stage.appendChild(hero);

    const stats = this.el('div','kwbs-stats');
    this.stat(stats,'核心知识',this.files(K).length,'Canonical Knowledge');
    this.stat(stats,'学习记录',this.files(L).length,'Learning Episodes');
    this.stat(stats,'资料来源',this.files(S).length,'Sources & Inbox');
    this.stat(stats,'知识领域',DOMAINS.length,'Knowledge Domains');
    stage.appendChild(stats);

    const grid = this.el('div','kwbs-home-grid');
    const recent = this.glass('section','kwbs-panel kwbs-span-2');
    this.panelHead(recent,'最近更新','clock-3');
    this.files(K).sort((a,b)=>b.stat.mtime-a.stat.mtime).slice(0,6).forEach(file=>{
      const row = this.el('button','kwbs-row');
      const left = this.el('div','kwbs-row-left'); left.append(this.icon('file-text'), this.el('span','',file.basename));
      row.append(left,this.el('span','kwbs-muted',dateText(file.stat.mtime)));
      row.addEventListener('click',()=>this.openReader(file)); recent.appendChild(row);
    });
    grid.appendChild(recent);

    const domains = this.glass('section','kwbs-panel');
    this.panelHead(domains,'六大知识领域','layers-3');
    DOMAINS.forEach(([folder,label,iconName])=>{
      const count = this.app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(`${K}/${folder}/`)&&!f.basename.startsWith('00-')).length;
      const row = this.el('button','kwbs-domain-row');
      row.append(this.icon(iconName),this.el('span','',label),this.el('span','kwbs-count',String(count)));
      row.addEventListener('click',async()=>{this.domain=label;this.route='knowledge';await this.renderSafe();});
      domains.appendChild(row);
    });
    grid.appendChild(domains);

    const learning = this.glass('section','kwbs-panel');
    this.panelHead(learning,'当前学习','graduation-cap');
    const current = this.app.vault.getAbstractFileByPath('00-驾驶舱/01-当前学习.md');
    if (current && current.extension === 'md') {
      const text = plain(stripFM(await this.app.vault.cachedRead(current))).slice(0,360);
      learning.appendChild(this.el('p','kwbs-learning', text || '当前学习内容会显示在这里。'));
    }
    grid.appendChild(learning);
    stage.appendChild(grid);
  }

  filteredFiles() {
    let files = this.files(K);
    if (this.domain !== '全部') files = files.filter(f=>this.domainOf(f) === this.domain);
    const q = this.query.trim().toLowerCase();
    if (q) files = files.filter(f=>[f.basename,this.domainOf(f),this.tags(f).join(' ')].join(' ').toLowerCase().includes(q));
    return files.sort((a,b)=>b.stat.mtime-a.stat.mtime);
  }

  async renderKnowledge(stage) {
    const title = this.el('div','kwbs-page-title');
    const line = this.el('div','kwbs-title-line'); line.append(this.icon('book-open'),this.el('h1','', '知识索引'));
    title.append(line,this.el('p','', '快速浏览、查找与管理你的全部知识资产')); stage.appendChild(title);

    const chips = this.el('div','kwbs-chips');
    ['全部',...DOMAINS.map(x=>x[1])].forEach(label=>{
      const b = this.el('button','kwbs-chip' + (this.domain === label ? ' is-active' : ''),label);
      b.addEventListener('click',async()=>{this.domain=label;await this.renderSafe();}); chips.appendChild(b);
    }); stage.appendChild(chips);

    const card = this.glass('section','kwbs-table-card');
    const header = this.el('div','kwbs-table-row kwbs-table-header');
    ['标题','领域/标签','最后更新','状态'].forEach(t=>header.appendChild(this.el('span','',t))); card.appendChild(header);
    this.filteredFiles().slice(0,60).forEach(file=>{
      const row = this.el('button','kwbs-table-row');
      const titleCell = this.el('div','kwbs-table-title'); titleCell.append(this.icon('file-text'),this.el('span','',file.basename));
      const tags = this.el('div','kwbs-tagset'); [this.domainOf(file),...this.tags(file)].slice(0,3).forEach(t=>tags.appendChild(this.el('span','kwbs-tag',t)));
      row.append(titleCell,tags,this.el('span','',dateText(file.stat.mtime)),this.el('span','kwbs-status','永久'));
      row.addEventListener('click',()=>this.openReader(file)); card.appendChild(row);
    });
    stage.appendChild(card);
  }

  async renderReader(stage,file) {
    const layout = this.el('div','kwbs-reader-layout');
    const article = this.glass('article','kwbs-article');
    const back = this.el('button','kwbs-back','← 返回知识库'); back.addEventListener('click',async()=>{this.route='knowledge';this.currentFile=null;await this.renderSafe();});
    article.appendChild(back);
    article.appendChild(this.el('h1','',file.basename));
    const body = this.el('div','kwbs-markdown markdown-rendered');
    article.appendChild(body); layout.appendChild(article);

    const rail = this.el('aside','kwbs-reader-rail');
    const related = this.glass('section','kwbs-side-card'); this.panelHead(related,'相关知识','link-2');
    const domain = this.domainOf(file);
    this.files(K).filter(f=>f.path!==file.path && this.domainOf(f)===domain).slice(0,5).forEach(f=>{
      const r=this.el('button','kwbs-side-row',f.basename);r.addEventListener('click',()=>this.openReader(f));related.appendChild(r);
    });
    rail.appendChild(related);
    layout.appendChild(rail); stage.appendChild(layout);

    try {
      const md = stripFM(await this.app.vault.cachedRead(file));
      await MarkdownRenderer.render(this.app, md, body, file.path, this);
    } catch (err) {
      body.textContent = stripFM(await this.app.vault.cachedRead(file));
      console.warn('[Knowledge Workbench] markdown fallback', err);
    }
  }

  async openReader(file) { this.currentFile=file; this.route='reader'; await this.renderSafe(); }

  async openPath(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file && file.extension) return this.app.workspace.getLeaf('tab').openFile(file);
    new Notice(`未找到：${path}`);
  }

  async openCanvas() {
    const file = this.app.vault.getAbstractFileByPath(CANVAS);
    if (file && file.extension === 'canvas') return this.app.workspace.getLeaf('tab').openFile(file);
    new Notice('未找到知识全景白板');
  }
}

module.exports = class KnowledgeWorkbenchSafePlugin extends Plugin {
  async onload() {
    this.registerView(VIEW, leaf => new SafeWorkbenchView(leaf, this));
    this.addCommand({ id:'open-knowledge-workbench-safe', name:'打开知识工作台', callback:()=>this.activate() });
    this.addRibbonIcon('layout-dashboard','知识工作台',()=>this.activate());
    this.app.workspace.onLayoutReady(()=>this.activate());
  }

  async activate() {
    try {
      let leaf = this.app.workspace.getLeavesOfType(VIEW)[0];
      if (!leaf) {
        leaf = this.app.workspace.getLeaf(true);
        await leaf.setViewState({ type: VIEW, active: true });
      }
      this.app.workspace.revealLeaf(leaf);
    } catch (err) {
      console.error('[Knowledge Workbench] activation failed', err);
      new Notice(`知识工作台启动失败：${err?.message || err}`);
    }
  }
};
