### 建立元件庫

#### 建立 Angular 元件庫

* [使用AngularCli搭配ng-packagr建立元件](https://jiaming0708.github.io/2018/06/13/angular-cli-packagr/)
* [Storybook UI View](https://ithelp.ithome.com.tw/articles/10245423)
* [手把手教你搭建自己的Angular元件庫](https://segmentfault.com/a/1190000022637243)

```bat
npm install --global yarn
yarn add @angular/cli
ng new <project>
cd <project>
ng generate library <library> --prefix <library>
--prefix 會更改 app-xxx 為新前綴 library-xxx
```

![prefix](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/prefix.png)

如果要改 layout 需要同步修改配置檔的對應路徑

![layout](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/libraryLayoutPath.png)

SecondaryExport

![SecondaryExport](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/secondaryExport.png)

設定完 tsconfig.json 即可 HMR

![HMR](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/HMR.png)

#### Angula StoryBook

[Storybook for Angular tutorial](https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/)

[玩轉 Storybook 系列](https://ithelp.ithome.com.tw/users/20130417/ironman/3608)

[Storybook | 說說元件的故事吧！](https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/storybook-tutorial-90189a4d0275)

[PJCHENder [npm] Storybook](https://pjchender.dev/npm/npm-storybook/)

* yarn 才能解依賴 bug，npm 需要自己手動一個個解依賴
* .storybook 設定檔的內容並不會熱重載，修改後需要重啟
* @storybook/addon-essentials：是一個 Storybook 的擴充套件（addon），其目的是簡化 Storybook 的使用流程，提供一些常用的功能和工具，以便更容易地開發和測試 React、Vue、Angular 等前端框架的 UI 組件。
  * actions：用於在 Storybook 中模擬 UI 組件的事件和行為，方便進行測試和開發。
  * controls：用於在 Storybook 中動態調整 UI 組件的 props 值，以便快速測試不同的使用場景。
  * docs：用於在 Storybook 中生成組件的說明文檔，方便開發者記錄和共享組件的使用方式和注意事項。
  * viewport：用於在 Storybook 中模擬不同的設備和屏幕尺寸，以便測試 UI 組件在不同環境下的表現。
  * backgrounds：用於在 Storybook 中設置不同的背景色或背景圖片，以便測試 UI 組件在不同背景下的可讀性和美觀度。
* .storybook/preview.js
  * 設置全局的樣式和主題，包括 CSS 文件、字體、配色等，以便在預覽模式中使用。
  * 設置全局的 decorators 和 parameters，用於對預覽組件進行修飾和設置，如添加圖標、* 設置尺寸等。
  * 設置全局的資源路徑和模組別名，以便在預覽模式中載入組件需要的資源和模組。
  * 設置全局的動畫和交互效果，如 hover、click 等，以便在預覽模式中模擬不同的使用場景。
* @storybook/addon-ally：供了一個 UI 界面和一個 CLI 工具，用於自動檢查 Storybook 中的所有組件，並生成一份詳細的可訪問性報告
  * 可訪問性問題的類型和嚴重程度，如缺少 alt 屬性、鍵盤焦點問題等。
  * 有問題的組件代碼和說明，以便開發者快速定位和修復問題。
  * 建議的修復方案和參考資料，以便開發者了解如何解決可訪問性問題。
* Storybook Manager：是一個獨立的 Web 應用程序，用於管理 Storybook 中的所有故事（stories），包括組件的列表、搜索功能、組件的層次結構、主題選擇器等。
* storybook/manager.js：文件可以用於修改和擴展 Storybook Manager 的功能和外觀
  * 修改 Manager 的標題和標誌，以適應特定項目或品牌。
  * 添加自定義的項目篩選器，以便開發者快速找到特定類型的組件。
  * 修改 Manager 的佈局和樣式，以適應不同的屏幕大小和設備。
  * 添加自定義的插件和小部件，以擴展 Manager 的功能和組件庫。

####　Storybook 5.2 ↑ Component Story Format (CSF)

一個 CSF 會包含一個 

Export default 描述一個元件故事的基本設定

包含多個 Named export 描述一個元件可能會出現的各種故事

[玩轉 Storybook: Day 06 Component Story Format](https://ithelp.ithome.com.tw/articles/10240995)

#### 建立 React 元件庫

> `TL;DR` 綜合環境不好建置最好直接找現成的整合方案

* [Create a React component library with Vite and Typescript](https://dev.to/nicolaserny/create-a-react-component-library-with-vite-and-typescript-1ih9)：此為使用 Vite 及 TypeScript 建立 React 元件庫的教學，可透過此教學了解如何建立一個可重複使用的 React 元件庫，並透過 Vite 進行開發、打包及發布等流程。
  * Speedy Web Compiler：(SWC)是一個用Rust撰寫的線上程式碼編譯器，可視為Babel的替代品。它比Babel更快，可以單線程運行20倍，使用四個核心可以運行70倍。SWC目前被Next.js預設選擇作為compiler，也被Deno用來加速TypeScript的啟動速度，Vite 支援 SWC。
  * Monorepo：你真的懂Monorepo？五分鐘帶你認識前端大型架構、為什麼前端工程越來越愛使用 Monorepo 架構
  * Npm v7 Workspaces：它允許在同一個 repository 內的多個 package 中共用相同的 node_modules，搭配 Monorepo，方便地管理專案中的多個 packages，這樣可以更好地隔離不同的功能，減少相依性的問題，並且可以簡化專案的結構，使其更易於維護和開發
  * vite-plugin-dts：是一個 Vite 插件，用於生成 TypeScript 宣告檔，方便其他 TypeScript 項目使用當前項目中的模組，如果引入你的组件项目是由TS构建的，但你却没有对项目打包自动生成文件声明，那么会出现组件引入的类型报错
  * @types/node：因為 vite 針對 typescript 設定有用到 node core 環境變數所以需要安裝 @types/node

```cmd
yarn create vite <library>  --template react-ts

yarn add --dev vite-plugin-dts -W

npm install --save-dev @types/node

npm i --save-dev @types/styled-components

npm install --save-dev vite-plugin-dts

// 確保 package.json xx-lib: file:路徑 ，才會是本地依賴

npm link my-react-components-library

yarn workspace @react-project/site add @react-project/lib@^0.0.0

npm install ../my-library
```

#### React Storybook 直接看官網的就簡單易懂了 ( 支援度最高的也是 React 還有中文 )

[Storybook 教學：React 篇](https://storybook.js.org/tutorials/intro-to-storybook/react/zh-TW/get-started/)

[在vite项目中使用storybook](https://zhuanlan.zhihu.com/p/387127953)

`yarn add --dev @storybook/builder-vite`

* storybook-builder-vite 與 @storybook/builder-vite 都是 Storybook 的 ViteJS 建構工具
  * 它們之間的差異在於：storybook-builder-vite 是由社群開發的第三方建構工具，而 @storybook/builder-vite 則是由 Storybook 團隊開發和維護的官方建構工具。storybook-builder-vite 提供了更多自定義選項，例如配置 ViteJS 插件、自定義 Webpack 設定等等。而 @storybook/builder-vite 則提供了更多的默認設定和預設值，可以更快速地啟動 Storybook。@storybook/builder-vite 已經包含在最新版本的 Storybook 中，因此無需額外安裝，而 storybook-builder-vite 則需要單獨安裝和配置。總體而言，如果您需要更多自定義選項並且願意進行額外的配置，那麼 storybook-builder-vite 可能更適合您。但如果您想要更快速地啟動 Storybook，並希望使用官方支援的建構工具，那麼 @storybook/builder-vite 可能更適合您
  * [Error: Cannot find module '@storybook/builder-storybook-builder-vite'](https://github.com/storybookjs/builder-vite/issues/4)
  * [Error message "error:0308010C:digital envelope routines::unsupported"](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported)
  * [Vite + Storybook 6.3 + Jest: "global is not defined"](https://github.com/storybookjs/storybook/issues/15391)
* workspace nomorepo 整合上與熱重載遇到許多問題，架構直接改為單一 repo 並利用 storybook 測試兼展示
  * ![aa](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/2node.png)
* pnpm：[pnpm是一款當代備受關注的 新興 (問題較多) 包管理工具，使用過的同學們都會被它極快的安裝速度、極少的磁盤存儲空間所吸引
](https://www.readfog.com/a/1658320214914338816)
* Nx Template：也有支援 React 但問題好像也蠻多
  * [documents/generate](https://nx.dev/packages/nx/documents/generate)
  * [angular-standalone-tutorial](https://nx.dev/getting-started/angular-standalone-tutorial)
  * Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more
  * [storybookjs/storybookSupport React 18 #18331](https://github.com/storybookjs/storybook/issues/18331)

#### !!! Vite / Template React & TS  / Init Storybook !!! 建議直接使用以下人家整理好的 Repo

大型 [https://github.com/NiGhTTraX/ts-monorepo](https://github.com/NiGhTTraX/ts-monorepo)

較小 [https://github.com/adiun/vite-monorepo](https://github.com/adiun/vite-monorepo)