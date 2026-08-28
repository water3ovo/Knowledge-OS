const { Plugin, ItemView, MarkdownRenderer, setIcon, Notice } = require('obsidian');

const VIEW = 'knowledge-workbench-view';
const K = '01-知识库';
const L = '02-学习记录';
const S = '03-资料库';
const P = '04-实战手册';
const CANVAS = '07-白板/00-知识全景.canvas';
const DOMAINS = [
  ['战略与经营','战略与经营','target'],
  ['GTM','GTM','compass'],
  ['增长','增长','trending-up'],
  ['AI产品','AI 产品','bot'],
  ['数据分析','数据分析','chart-no-axes-combined'],
  ['平台机制','平台机制','network']
];

const A = v => v == null ? [] : (Array.isArray(v) ? v : [v]);
const stripFM = s => s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
const plain = s => String(s || '').replace(/[#>*_`\[\]()!-]/g,' ').replace(/\s+/g,' ').trim();
function dateText(ms){
  const d=new Date(ms),n=new Date();
  return d.toDateString()===n.toDateString()?`今天 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`:`${d.getMonth()+1}月${d.getDate()}日`;
}

class Workbench extends ItemView {
  constructor(leaf,plugin){ super(leaf); this.plugin=plugin; this.route='home'; this.query=''; this.domain='全部'; this.file=null; }
  getViewType(){ return VIEW; }
  getDisplayText(){ return '知识工作台'; }
  getIcon(){ return 'layout-dashboard'; }
  async onOpen(){ document.body.classList.add('knowledge-workbench-active'); await this.render(); }
  async onClose(){ document.body.classList.remove('knowledge-workbench-active'); }

  icon(parent,name){ const el=parent.createSpan({cls:'kwb-icon'}); setIcon(el,name); return el; }
  files(folder){ return this.app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(folder+'/')&&!f.basename.startsWith('00-')); }
  fm(file){ return this.app.metadataCache.getFileCache(file)?.frontmatter || {}; }
  tags(file){
    const a=A(this.fm(file).tags).map(x=>String(x).replace(/^#/,''));
    const b=(this.app.metadataCache.getFileCache(file)?.tags||[]).map(x=>x.tag.replace(/^#/,''));
    return [...new Set([...a,...b])].filter(Boolean);
  }
  domainOf(file){
    for(const [folder,label] of DOMAINS) if(file.path.includes('/'+folder+'/')) return label;
    const raw=String(this.fm(file).domain||'');
    return ({strategy:'战略与经营',growth:'增长',ai:'AI 产品',data:'数据分析',platform:'平台机制',gtm:'GTM'})[raw]||raw||'其他';
  }
  statusOf(file){ const x=String(this.fm(file).status||''); return /draft|整理|processing|curat/i.test(x)?'整理中':'永久'; }

  async render(){
    this.contentEl.empty(); this.contentEl.addClass('kwb-root');
    const shell=this.contentEl.createDiv({cls:'kwb-shell'});
    const side=shell.createEl('aside',{cls:'kwb-sidebar kwb-glass'}); this.sidebar(side);
    const main=shell.createEl('main',{cls:'kwb-main'}); this.topbar(main);
    const stage=main.createDiv({cls:'kwb-stage'});
    if(this.route==='home') await this.home(stage);
    else if(this.route==='knowledge') await this.knowledge(stage);
    else if(this.route==='reader'&&this.file) await this.reader(stage,this.file);
    else await this.home(stage);
  }

  nav(parent,icon,label,route,active=false,handler=null){
    const b=parent.createEl('button',{cls:'kwb-nav-item'+(active?' is-active':'')}); this.icon(b,icon); b.createSpan({text:label});
    b.addEventListener('click',async()=>{ if(handler)return handler(); this.route=route; this.file=null; await this.render(); });
  }
  sidebar(side){
    const brand=side.createDiv({cls:'kwb-brand'}); this.icon(brand,'gem'); brand.createSpan({text:'Obsidian 工作台'});
    const n=side.createDiv({cls:'kwb-nav'});
    this.nav(n,'house','首页','home',this.route==='home');
    this.nav(n,'book-open','知识库','knowledge',['knowledge','reader'].includes(this.route));
    this.nav(n,'check-circle-2','学习记录','home',false,()=>this.openPath('02-学习记录/00-学习记录.md'));
    this.nav(n,'folder','资料库','home',false,()=>this.openPath('03-资料库/00-资料库.md'));
    this.nav(n,'presentation','白板','home',false,()=>this.openCanvas());
    this.nav(n,'copy','模板','home',false,()=>new Notice('模板入口将在下一版接入工作台视图'));
    side.createDiv({cls:'kwb-divider'});
    const n2=side.createDiv({cls:'kwb-nav kwb-nav-secondary'});
    this.nav(n2,'tag','标签','knowledge',false,async()=>{this.route='knowledge';this.query='#';await this.render();});
    this.nav(n2,'waypoints','图谱视图','home',false,()=>this.app.commands.executeCommandById('graph:open'));
    const foot=side.createDiv({cls:'kwb-sidebar-footer'}); foot.createDiv({cls:'kwb-sidebar-label',text:'知识资产'}); foot.createDiv({cls:'kwb-storage-value',text:`${this.files(K).length} 篇核心知识`}); const bar=foot.createDiv({cls:'kwb-storage-bar'});bar.createDiv({cls:'kwb-storage-fill'});
    const s=foot.createEl('button',{cls:'kwb-settings-btn'});this.icon(s,'settings');s.createSpan({text:'设置'});s.addEventListener('click',()=>this.app.setting.open());
  }

  topbar(main){
    const top=main.createEl('header',{cls:'kwb-topbar'});
    const sw=top.createDiv({cls:'kwb-search kwb-glass'});this.icon(sw,'search');const input=sw.createEl('input',{attr:{placeholder:'搜索笔记、文件、标签或链接…'}});input.value=this.query==='#'?'':this.query;
    input.addEventListener('keydown',async e=>{if(e.key==='Enter'){this.query=input.value.trim();this.route='knowledge';await this.render();}});
    const nav=top.createEl('nav',{cls:'kwb-topnav'});
    [['知识驾驶舱','home'],['笔记','knowledge'],['图谱','graph'],['白板','canvas']].forEach(([label,r])=>{const active=(r==='home'&&this.route==='home')||(r==='knowledge'&&['knowledge','reader'].includes(this.route));const b=nav.createEl('button',{cls:active?'is-active':'',text:label});b.addEventListener('click',async()=>{if(r==='graph')return this.app.commands.executeCommandById('graph:open');if(r==='canvas')return this.openCanvas();this.route=r;this.file=null;await this.render();});});
    const actions=top.createDiv({cls:'kwb-actions'});['calendar-days','layout-grid','bell'].forEach(i=>{const b=actions.createEl('button',{cls:'kwb-icon-btn'});this.icon(b,i);});const profile=actions.createDiv({cls:'kwb-profile kwb-glass'});const av=profile.createDiv({cls:'kwb-avatar'});this.icon(av,'sparkles');profile.createSpan({text:'个人知识系统'});this.icon(profile,'chevron-down');
  }

  stat(parent,icon,label,value,sub=''){ const c=parent.createDiv({cls:'kwb-stat kwb-glass'});this.icon(c,icon);c.createDiv({cls:'kwb-stat-label',text:label});c.createDiv({cls:'kwb-stat-value',text:String(value)});if(sub)c.createDiv({cls:'kwb-stat-sub',text:sub}); }
  head(panel,title,icon,action='',handler=null){ const h=panel.createDiv({cls:'kwb-panel-head'}),l=h.createDiv({cls:'kwb-panel-title'});this.icon(l,icon);l.createSpan({text:title});if(action){const b=h.createEl('button',{cls:'kwb-panel-action',text:action});if(handler)b.addEventListener('click',handler);} }
  row(parent,file,meta,when,handler){ const r=parent.createEl('button',{cls:'kwb-list-row'}),left=r.createDiv({cls:'kwb-list-main'});this.icon(left,'file-text');const t=left.createDiv();t.createDiv({cls:'kwb-list-title',text:file.basename});if(meta)t.createDiv({cls:'kwb-list-meta',text:meta});r.createSpan({cls:'kwb-list-time',text:when});r.addEventListener('click',handler); }

  async home(stage){
    const hero=stage.createEl('section',{cls:'kwb-hero kwb-glass'});hero.createDiv({cls:'kwb-eyebrow',text:'PERSONAL KNOWLEDGE WORKBENCH'});hero.createEl('h1',{text:'知识驾驶舱'});hero.createEl('p',{text:'学习 · 连接 · 沉淀 · 复用。把 ChatGPT 中的学习与研究，持续长成可连接、可检索、可复用的长期知识。'});const ha=hero.createDiv({cls:'kwb-hero-actions'});const kb=ha.createEl('button',{cls:'kwb-primary-btn',text:'进入知识库'});kb.addEventListener('click',async()=>{this.route='knowledge';await this.render();});const cb=ha.createEl('button',{cls:'kwb-secondary-btn',text:'打开知识全景'});cb.addEventListener('click',()=>this.openCanvas());
    const stats=stage.createDiv({cls:'kwb-stats-row'});this.stat(stats,'book-open','核心知识',this.files(K).length,'Canonical Knowledge');this.stat(stats,'check-circle-2','学习记录',this.files(L).length,'Learning Episodes');this.stat(stats,'inbox','资料来源',this.files(S).length,'Sources & Inbox');this.stat(stats,'route','实战手册',this.files(P).length,'Playbooks');
    const grid=stage.createDiv({cls:'kwb-home-grid'});
    const recent=grid.createEl('section',{cls:'kwb-panel kwb-glass kwb-span-2'});this.head(recent,'最近更新','clock-3','全部记录',()=>{this.route='knowledge';this.render();});this.files(K).sort((a,b)=>b.stat.mtime-a.stat.mtime).slice(0,6).forEach(f=>this.row(recent,f,this.domainOf(f),dateText(f.stat.mtime),()=>this.openReader(f)));
    const domains=grid.createEl('section',{cls:'kwb-panel kwb-glass'});this.head(domains,'六大知识领域','layers-3');DOMAINS.forEach(([folder,label,icon])=>{const count=this.app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(`${K}/${folder}/`)&&!f.basename.startsWith('00-')).length;const r=domains.createEl('button',{cls:'kwb-domain-row'});this.icon(r,icon);r.createSpan({text:label});r.createSpan({cls:'kwb-count',text:String(count)});r.addEventListener('click',async()=>{this.route='knowledge';this.domain=label;await this.render();});});
    const questions=grid.createEl('section',{cls:'kwb-panel kwb-glass'});this.head(questions,'开放问题','circle-help');const qs=[];for(const f of this.files(L))for(const q of A(this.fm(f).open_questions))if(q)qs.push([f,String(q)]);if(!qs.length)questions.createDiv({cls:'kwb-empty',text:'暂无开放问题'});qs.slice(0,5).forEach(([f,q])=>{const r=questions.createEl('button',{cls:'kwb-question-row'});this.icon(r,'circle');r.createSpan({text:q});r.addEventListener('click',()=>this.openNative(f));});
    const learning=grid.createEl('section',{cls:'kwb-panel kwb-glass kwb-span-2'});this.head(learning,'当前学习','graduation-cap');const current=this.app.vault.getAbstractFileByPath('00-驾驶舱/01-当前学习.md');if(current&&current.extension==='md'){const md=stripFM(await this.app.vault.cachedRead(current));learning.createEl('p',{cls:'kwb-learning-copy',text:plain(md).slice(0,420)||'当前学习内容会显示在这里。'});}
  }

  filtered(){ let fs=this.files(K);if(this.domain!=='全部')fs=fs.filter(f=>this.domainOf(f)===this.domain);const q=this.query.trim().toLowerCase();if(q&&q!=='#')fs=fs.filter(f=>[f.basename,this.domainOf(f),this.tags(f).join(' '),JSON.stringify(this.fm(f))].join(' ').toLowerCase().includes(q));return fs.sort((a,b)=>b.stat.mtime-a.stat.mtime); }

  async knowledge(stage){
    const layout=stage.createDiv({cls:'kwb-index-layout'}),main=layout.createDiv({cls:'kwb-index-main'}),rail=layout.createEl('aside',{cls:'kwb-index-rail'});const intro=main.createDiv({cls:'kwb-page-title'}),line=intro.createDiv({cls:'kwb-title-line'});this.icon(line,'book-open');line.createEl('h1',{text:'知识索引'});intro.createEl('p',{text:'快速浏览、查找与管理你的全部知识资产'});
    const filter=main.createDiv({cls:'kwb-filterbar kwb-glass'}),qw=filter.createDiv({cls:'kwb-filter-search'});this.icon(qw,'search');const input=qw.createEl('input',{attr:{placeholder:'搜索笔记标题、标签、领域…'}});input.value=this.query==='#'?'':this.query;input.addEventListener('keydown',async e=>{if(e.key==='Enter'){this.query=input.value.trim();await this.render();}});const clear=filter.createEl('button',{cls:'kwb-clear-filter'});this.icon(clear,'rotate-ccw');clear.createSpan({text:'清除筛选'});clear.addEventListener('click',async()=>{this.query='';this.domain='全部';await this.render();});
    const chips=main.createDiv({cls:'kwb-domain-chips'});['全部',...DOMAINS.map(x=>x[1])].forEach(x=>{const b=chips.createEl('button',{cls:'kwb-chip'+(this.domain===x?' is-active':''),text:x});b.addEventListener('click',async()=>{this.domain=x;await this.render();});});
    const all=this.files(K),stats=main.createDiv({cls:'kwb-index-stats'});this.stat(stats,'files','全部笔记',all.length);this.stat(stats,'gem','核心领域',DOMAINS.length);this.stat(stats,'link-2','已链接笔记',all.filter(f=>(this.app.metadataCache.getFileCache(f)?.links||[]).length>0).length);this.stat(stats,'tags','标签总数',new Set(all.flatMap(f=>this.tags(f))).size);
    const table=main.createEl('section',{cls:'kwb-table-card kwb-glass'});this.head(table,'知识索引','layout-grid');const th=table.createDiv({cls:'kwb-table-row kwb-table-header'});['标题','标签','最后更新','状态'].forEach(x=>th.createSpan({text:x}));const fs=this.filtered();fs.slice(0,40).forEach(f=>{const r=table.createEl('button',{cls:'kwb-table-row'}),title=r.createDiv({cls:'kwb-table-title'});this.icon(title,'file-text');title.createSpan({text:f.basename});const tags=r.createDiv({cls:'kwb-tagset'});[this.domainOf(f),...this.tags(f)].filter(Boolean).slice(0,3).forEach(t=>tags.createSpan({cls:'kwb-tag',text:t}));r.createSpan({text:dateText(f.stat.mtime)});r.createSpan({cls:'kwb-status '+(this.statusOf(f)==='整理中'?'kwb-status-working':'kwb-status-stable'),text:this.statusOf(f)});r.addEventListener('click',()=>this.openReader(f));});table.createDiv({cls:'kwb-table-foot',text:`共 ${fs.length} 条`});
    const popular=rail.createEl('section',{cls:'kwb-panel kwb-glass'});this.head(popular,'热门标签','tags');const freq=new Map();all.flatMap(f=>this.tags(f)).forEach(t=>freq.set(t,(freq.get(t)||0)+1));const cloud=popular.createDiv({cls:'kwb-tag-cloud'});[...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).forEach(([t,c])=>{const b=cloud.createEl('button',{cls:'kwb-tag'});b.createSpan({text:t});b.createSpan({cls:'kwb-tag-count',text:String(c)});b.addEventListener('click',async()=>{this.query=t;await this.render();});});
    const recent=rail.createEl('section',{cls:'kwb-panel kwb-glass'});this.head(recent,'最近更新','history');all.sort((a,b)=>b.stat.mtime-a.stat.mtime).slice(0,6).forEach(f=>this.row(recent,f,'',dateText(f.stat.mtime),()=>this.openReader(f)));
  }

  async reader(stage,file){
    const layout=stage.createDiv({cls:'kwb-reader-layout'}),article=layout.createEl('article',{cls:'kwb-article kwb-glass'}),rail=layout.createEl('aside',{cls:'kwb-reader-rail'});const back=article.createEl('button',{cls:'kwb-back-btn'});this.icon(back,'arrow-left');back.createSpan({text:'返回知识索引'});back.addEventListener('click',async()=>{this.route='knowledge';this.file=null;await this.render();});const fm=this.fm(file);article.createEl('h1',{cls:'kwb-reader-title',text:fm.title||file.basename});const meta=article.createDiv({cls:'kwb-reader-meta'});this.icon(meta,'folder');meta.createSpan({text:this.domainOf(file)});this.icon(meta,'calendar-days');meta.createSpan({text:dateText(file.stat.mtime)});this.icon(meta,'clock-3');meta.createSpan({text:`${Math.max(2,Math.ceil(file.stat.size/1100))} min read`});this.tags(file).slice(0,3).forEach(t=>meta.createSpan({cls:'kwb-tag',text:t}));
    const body=article.createDiv({cls:'kwb-rendered markdown-rendered'}),raw=stripFM(await this.app.vault.cachedRead(file));await MarkdownRenderer.render(this.app,raw,body,file.path,this);body.querySelectorAll('a.internal-link').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();this.app.workspace.openLinkText(a.getAttribute('data-href')||a.getAttribute('href')||'',file.path,false);}));const foot=article.createDiv({cls:'kwb-reader-footer'});this.tags(file).forEach(t=>foot.createSpan({cls:'kwb-tag',text:'#'+t}));const edit=foot.createEl('button',{cls:'kwb-edit-native'});this.icon(edit,'pencil');edit.createSpan({text:'在 Obsidian 编辑'});edit.addEventListener('click',()=>this.openNative(file));
    const related=rail.createEl('section',{cls:'kwb-panel kwb-glass'});this.head(related,'相关知识','link-2');const links=(this.app.metadataCache.getFileCache(file)?.links||[]).slice(0,6);if(!links.length)related.createDiv({cls:'kwb-empty',text:'暂无显式关联'});links.forEach(l=>{const b=related.createEl('button',{cls:'kwb-related-row'});this.icon(b,'file-text');b.createSpan({text:l.displayText||l.link});b.addEventListener('click',()=>this.app.workspace.openLinkText(l.link,file.path,false));});
    const sources=rail.createEl('section',{cls:'kwb-panel kwb-glass'});this.head(sources,'来源与引用','paperclip');const ss=[...A(fm.source),...A(fm.sources),...A(fm.source_url)].filter(Boolean);if(!ss.length)sources.createDiv({cls:'kwb-source-quote',text:'该知识卡片暂无单独来源字段；可继续从 Sources 层补充 provenance。'});ss.slice(0,5).forEach(s=>sources.createDiv({cls:'kwb-source-item',text:String(s)}));
    const qs=rail.createEl('section',{cls:'kwb-panel kwb-glass'});this.head(qs,'开放问题','circle-help');const qv=A(fm.open_questions).filter(Boolean);if(!qv.length)qs.createDiv({cls:'kwb-empty',text:'暂无开放问题'});qv.slice(0,6).forEach(q=>{const r=qs.createDiv({cls:'kwb-question-row'});this.icon(r,'circle');r.createSpan({text:String(q)});});
  }

  async openReader(f){this.route='reader';this.file=f;await this.render();}
  async openNative(f){await this.app.workspace.getLeaf('tab').openFile(f);}
  async openPath(path){const f=this.app.vault.getAbstractFileByPath(path);if(f&&f.extension==='md')await this.openNative(f);else new Notice('入口将在下一版接入工作台视图');}
  async openCanvas(){const f=this.app.vault.getAbstractFileByPath(CANVAS);if(f&&f.extension==='canvas')await this.app.workspace.getLeaf('tab').openFile(f);else new Notice('未找到知识全景白板');}
}

module.exports=class KnowledgeWorkbenchPlugin extends Plugin{
  async onload(){
    this.registerView(VIEW,leaf=>new Workbench(leaf,this));
    this.addRibbonIcon('layout-dashboard','打开知识工作台',()=>this.activate());
    this.addCommand({id:'open-knowledge-workbench',name:'打开知识工作台',callback:()=>this.activate()});
    this.registerEvent(this.app.workspace.on('active-leaf-change',leaf=>document.body.classList.toggle('knowledge-workbench-active',leaf?.view?.getViewType?.()===VIEW)));
    this.app.workspace.onLayoutReady(()=>window.setTimeout(()=>this.activate(),350));
  }
  onunload(){document.body.classList.remove('knowledge-workbench-active');this.app.workspace.detachLeavesOfType(VIEW);}
  async activate(){let [leaf]=this.app.workspace.getLeavesOfType(VIEW);if(!leaf){leaf=this.app.workspace.getLeaf('tab');await leaf.setViewState({type:VIEW,active:true});}await this.app.workspace.revealLeaf(leaf);}
};
