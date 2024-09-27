# PREFACE

因為現有 HEXO 專案展示 AG MONOREPO 上遇到 JS 不可共用, 且 HEXO 不好維護問題, 所以想將 HEXO 與 AG MONOREPO 弄再一起, 進而發現 Angular 也提供 [SSG](https://angular.dev/guide/prerendering) 方案了, 進而有了以下研究.

# PRERENDER

1. Scully: AG SSG Tool, 特徵簡易, 預渲染, 插件系統, 不支持動態渲染.
2. AnalogJS: AG SSR/SSG Tool, Vite, 動態路由, 把一些 AG Prerender 需要實作的部分做掉了, 但必須要熟悉它的新用法.
3. AG Universal: AG SSR 方案, 伺服器端動態生成頁面, 適合 seo / 快取, 前後端夾雜再一起有一些坑, 但近些時間都慢慢被補上了.
3. AG Prerender: AG SSG 方案, 提前靜態生成頁面, 減少首次加載時間, 動態部分還是要靠 SSR, 部分內容需要自己實作, EX.MarkdownContentToHTML. ( P.S. 參考 REF.8 因為與 SSR 同流程, 所以必須要安裝 SSR, 但可不啟用單純使用 SSG )

# CONCLUSION

研究過 Scully, AnalogJS 後有了以下考量：

1. 路由部分考量 SEO 階層不應該超過三層, 所以非常動態的路由似乎用不太到, 且要熟悉框架規則
2. Vite / Nx 雖然速度快, 但 SSG 編譯屬於提前編譯, 只在開發上可以減少幾分鐘
3. API 路由似乎都有其於解決方案
4. AnalogJS 相對於原生 AG Prerender 學習成本較高
5. 目前比較有差的部分例如 SSR-Firebase 有問題, 似乎上述框架都會遇到同樣問題 

最終採取使用原生 AG Prerender 方案, 檢視影響 SEO 的各種問題與 SSR/SSG 的坑. 

# REF.

1. [預渲染坑 #1](https://medium.com/kuraki5336/angular-%E9%80%8F%E9%81%8E-scully-%E5%81%9A%E9%A0%90%E6%B8%B2%E6%9F%93-pre-renders-1-cedbb7c0b5ea)
2. [預渲染坑 #2](https://medium.com/kuraki5336/angular-%E9%80%8F%E9%81%8E-scully-%E5%81%9A%E9%A0%90%E6%B8%B2%E6%9F%93-pre-renders-2-f0222388be15)
3. [Angular universal 服务器端渲染与预渲染](https://www.cnblogs.com/guoapeng/p/17381852.html#%E6%B7%BB%E5%8A%A0robotstxt)
4. [hwdc-24-angular-ssg](https://github.com/wellwind/hwdc-24-angular-ssg/tree/main)
6. [[Angular Universal] 使用 Prerender 建立自己的 Static Site Generator](https://fullstackladder.dev/blog/2021/10/16/static-site-generator-using-angular-universal-prerender/)
7. [scully](https://scully.io/)
8. [analogjs](https://analogjs.org)
9. [Confusion about SSG and SSR in Angular 18](https://stackoverflow.com/questions/78649459/confusion-about-ssg-and-ssr-in-angular-18)
