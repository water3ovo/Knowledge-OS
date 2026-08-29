"use client";

import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ModuleKey = "global" | "hero" | "delta" | "recent" | "questions" | "links" | "map";

type ModuleStyle = {
  opacity: number;
  blur: number;
  radius: number;
};

type NavLabels = {
  dashboard: string;
  knowledge: string;
  topics: string;
  learning: string;
  cases: string;
  map: string;
};

export type WebsitePreferences = {
  editMode: boolean;
  navLabels: NavLabels;
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  heroQuestion: string;
  openQuestions: string[];
  moduleStyles: Record<ModuleKey, ModuleStyle>;
};

type PreferencesContextValue = {
  preferences: WebsitePreferences;
  setEditMode: (value: boolean) => void;
  updateContent: <K extends keyof Pick<WebsitePreferences, "heroEyebrow" | "heroTitle" | "heroSummary" | "heroQuestion">>(key: K, value: WebsitePreferences[K]) => void;
  updateNavLabel: (key: keyof NavLabels, value: string) => void;
  updateOpenQuestions: (value: string[]) => void;
  updateModuleStyle: (key: ModuleKey, patch: Partial<ModuleStyle>) => void;
  moduleStyle: (key: Exclude<ModuleKey, "global">) => CSSProperties;
  resetPreferences: () => void;
};

const DEFAULT_MODULE_STYLE: ModuleStyle = { opacity: 0.58, blur: 16, radius: 18 };

export const defaultWebsitePreferences: WebsitePreferences = {
  editMode: false,
  navLabels: {
    dashboard: "驾驶舱",
    knowledge: "知识索引",
    topics: "专题",
    learning: "学习记录",
    cases: "案例",
    map: "地图",
  },
  heroEyebrow: "CURRENT RESEARCH / 当前研究",
  heroTitle: "Google / Meta 出海广告",
  heroSummary: "建立从账户结构、竞价机制、受众与素材，到转化追踪、投放策略与数据诊断的完整方法体系。",
  heroQuestion: "PMax 与 Search 应该如何分工，才能兼顾增量与投放效率？",
  openQuestions: [
    "PMax 如何更好结合品牌搜索词？",
    "如何提升 Meta 广告的自然扩量上限？",
    "出海电商在不同市场的出价策略差异？",
    "如何判断素材 fatigue 的真实拐点？",
  ],
  moduleStyles: {
    global: { ...DEFAULT_MODULE_STYLE },
    hero: { opacity: 0.56, blur: 18, radius: 18 },
    delta: { opacity: 0.54, blur: 16, radius: 18 },
    recent: { ...DEFAULT_MODULE_STYLE },
    questions: { ...DEFAULT_MODULE_STYLE },
    links: { opacity: 0.62, blur: 15, radius: 18 },
    map: { ...DEFAULT_MODULE_STYLE },
  },
};

const STORAGE_KEY = "knowledge-os:website-preferences:v1";
const PreferencesContext = createContext<PreferencesContextValue | null>(null);

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

function mergePreferences(value: Partial<WebsitePreferences>): WebsitePreferences {
  const moduleStyles = { ...defaultWebsitePreferences.moduleStyles };
  if (value.moduleStyles) {
    (Object.keys(moduleStyles) as ModuleKey[]).forEach((key) => {
      moduleStyles[key] = { ...moduleStyles[key], ...(value.moduleStyles?.[key] ?? {}) };
    });
  }
  return {
    ...defaultWebsitePreferences,
    ...value,
    navLabels: { ...defaultWebsitePreferences.navLabels, ...(value.navLabels ?? {}) },
    openQuestions: Array.isArray(value.openQuestions) && value.openQuestions.length ? value.openQuestions : defaultWebsitePreferences.openQuestions,
    moduleStyles,
  };
}

export function WebsitePreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(defaultWebsitePreferences);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState<"style" | "content">("style");
  const [targetModule, setTargetModule] = useState<ModuleKey>("global");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPreferences(mergePreferences(JSON.parse(raw) as Partial<WebsitePreferences>));
    } catch {
      // Local preferences are optional; defaults remain fully usable.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Ignore storage failures.
    }
    document.documentElement.dataset.koEditMode = preferences.editMode ? "on" : "off";
  }, [preferences]);

  const setEditMode = (value: boolean) => {
    setPreferences((current) => ({ ...current, editMode: value }));
    if (value) setPanelOpen(true);
  };

  const updateContent: PreferencesContextValue["updateContent"] = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const updateNavLabel = (key: keyof NavLabels, value: string) => {
    setPreferences((current) => ({ ...current, navLabels: { ...current.navLabels, [key]: value } }));
  };

  const updateOpenQuestions = (value: string[]) => {
    setPreferences((current) => ({ ...current, openQuestions: value.filter(Boolean) }));
  };

  const updateModuleStyle = (key: ModuleKey, patch: Partial<ModuleStyle>) => {
    setPreferences((current) => ({
      ...current,
      moduleStyles: {
        ...current.moduleStyles,
        [key]: { ...current.moduleStyles[key], ...patch },
      },
    }));
  };

  const moduleStyle = (key: Exclude<ModuleKey, "global">): CSSProperties => {
    const globalStyle = preferences.moduleStyles.global;
    const localStyle = preferences.moduleStyles[key];
    const style: CSSVars = {
      "--ko-module-opacity": String(localStyle.opacity ?? globalStyle.opacity),
      "--ko-module-blur": `${localStyle.blur ?? globalStyle.blur}px`,
      "--ko-module-radius": `${localStyle.radius ?? globalStyle.radius}px`,
    };
    return style;
  };

  const resetPreferences = () => {
    setPreferences(defaultWebsitePreferences);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const value = useMemo<PreferencesContextValue>(() => ({
    preferences,
    setEditMode,
    updateContent,
    updateNavLabel,
    updateOpenQuestions,
    updateModuleStyle,
    moduleStyle,
    resetPreferences,
  }), [preferences]);

  const targetStyle = preferences.moduleStyles[targetModule];

  return (
    <PreferencesContext.Provider value={value}>
      {children}
      <button
        className={`ko-editor-toggle ${preferences.editMode ? "active" : ""}`}
        onClick={() => preferences.editMode ? setPanelOpen((open) => !open) : setEditMode(true)}
        aria-label="切换网站编辑模式"
      >
        {preferences.editMode ? "编辑中" : "编辑"}
      </button>

      {preferences.editMode && panelOpen && (
        <aside className="ko-editor-panel" aria-label="网站编辑模式">
          <header>
            <div>
              <span className="ko-editor-kicker">WEBSITE EDITOR</span>
              <strong>网站编辑模式</strong>
            </div>
            <button onClick={() => setPanelOpen(false)} aria-label="关闭编辑面板">×</button>
          </header>

          <div className="ko-editor-tabs">
            <button className={tab === "style" ? "active" : ""} onClick={() => setTab("style")}>样式</button>
            <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>内容</button>
          </div>

          {tab === "style" ? (
            <div className="ko-editor-body">
              <label className="ko-field">
                <span>调整模块</span>
                <select value={targetModule} onChange={(event) => setTargetModule(event.target.value as ModuleKey)}>
                  <option value="global">全局卡片</option>
                  <option value="hero">当前研究</option>
                  <option value="delta">知识变化</option>
                  <option value="recent">最近沉淀</option>
                  <option value="questions">开放问题</option>
                  <option value="links">常用网站和链接</option>
                  <option value="map">知识版图</option>
                </select>
              </label>
              <label className="ko-range-field">
                <span>透明度 <b>{Math.round(targetStyle.opacity * 100)}%</b></span>
                <input type="range" min="0.2" max="0.95" step="0.01" value={targetStyle.opacity} onChange={(event) => updateModuleStyle(targetModule, { opacity: Number(event.target.value) })} />
              </label>
              <label className="ko-range-field">
                <span>背景模糊 <b>{targetStyle.blur}px</b></span>
                <input type="range" min="0" max="32" step="1" value={targetStyle.blur} onChange={(event) => updateModuleStyle(targetModule, { blur: Number(event.target.value) })} />
              </label>
              <label className="ko-range-field">
                <span>圆角 <b>{targetStyle.radius}px</b></span>
                <input type="range" min="4" max="30" step="1" value={targetStyle.radius} onChange={(event) => updateModuleStyle(targetModule, { radius: Number(event.target.value) })} />
              </label>
              <p className="ko-editor-note">这些调整只保存在当前浏览器，不需要重新推送 GitHub。</p>
            </div>
          ) : (
            <div className="ko-editor-body">
              <label className="ko-field"><span>研究标签</span><input value={preferences.heroEyebrow} onChange={(e) => updateContent("heroEyebrow", e.target.value)} /></label>
              <label className="ko-field"><span>当前研究标题</span><input value={preferences.heroTitle} onChange={(e) => updateContent("heroTitle", e.target.value)} /></label>
              <label className="ko-field"><span>研究说明</span><textarea rows={3} value={preferences.heroSummary} onChange={(e) => updateContent("heroSummary", e.target.value)} /></label>
              <label className="ko-field"><span>当前问题</span><textarea rows={2} value={preferences.heroQuestion} onChange={(e) => updateContent("heroQuestion", e.target.value)} /></label>
              <label className="ko-field"><span>开放问题（每行一个）</span><textarea rows={5} value={preferences.openQuestions.join("\n")} onChange={(e) => updateOpenQuestions(e.target.value.split("\n"))} /></label>
              <div className="ko-inline-fields">
                {(Object.keys(preferences.navLabels) as Array<keyof NavLabels>).map((key) => (
                  <label className="ko-field" key={key}><span>{key}</span><input value={preferences.navLabels[key]} onChange={(e) => updateNavLabel(key, e.target.value)} /></label>
                ))}
              </div>
            </div>
          )}

          <footer>
            <button className="ko-subtle-button" onClick={resetPreferences}>恢复默认</button>
            <button className="ko-primary-button" onClick={() => setEditMode(false)}>完成编辑</button>
          </footer>
        </aside>
      )}
    </PreferencesContext.Provider>
  );
}

export function useWebsitePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("useWebsitePreferences must be used inside WebsitePreferencesProvider");
  return value;
}
