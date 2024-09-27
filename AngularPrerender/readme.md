# PREFACE

因為 XXX 所以想將 HEXO 與 AG MONOREPO 弄再一起

# PRERENDER

1. Scully: AG SSG Tool, 特徵簡易, 預渲染, 插件系統, 不支持動態渲染.
2. AnalogJS: AG SSR/SSG Tool, Vite, 動態路由, 把一些 AG Prerender 需要實作的部分做掉了, 但必須要熟悉它的新用法.
3. AG Universal: AG SSR 方案, 伺服器端動態生成頁面, 適合 seo / 快取, 前後端夾雜再一起有一些坑, 但近些時間都慢慢被補上了.
3. AG Prerender: AG SSG 方案, 提前靜態生成頁面, 減少首次加載時間, 動態部分還是要靠 SSR, 部分內容需要自己實作, EX.MarkdownContentToHTML.

# REF.

1. [預渲染坑#1](https://medium.com/kuraki5336/angular-%E9%80%8F%E9%81%8E-scully-%E5%81%9A%E9%A0%90%E6%B8%B2%E6%9F%93-pre-renders-1-cedbb7c0b5ea)
2. [預渲染坑#2](https://medium.com/kuraki5336/angular-%E9%80%8F%E9%81%8E-scully-%E5%81%9A%E9%A0%90%E6%B8%B2%E6%9F%93-pre-renders-2-f0222388be15)
3. [Angular universal服务器端渲染与预渲染](https://www.cnblogs.com/guoapeng/p/17381852.html#%E6%B7%BB%E5%8A%A0robotstxt)
4. [hwdc-24-angular-ssg](https://github.com/wellwind/hwdc-24-angular-ssg/tree/main)
5. [[Angular Universal] 使用 Prerender 建立自己的 Static Site Generator](https://fullstackladder.dev/blog/2021/10/16/static-site-generator-using-angular-universal-prerender/)
5. [scully](https://scully.io/)
5. [analogjs](https://analogjs.org)