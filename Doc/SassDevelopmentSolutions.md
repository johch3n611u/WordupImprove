# Components SASS Global Variables and Media Query RWD, Theme Transformation

## 需求 => Components SASS 全域變數與媒體查詢 RWD、Theme 變換

必須要全域 CSS 變數才能方便 Theme 變換導入 => [完美的Angular深色（暗黑）模式解决方案](https://www.ifuyun.com/post/50b2f3339d6c90cd)

目前爬文後發現有兩種解決方案

1. 使用原生 [CSS3 var / evn](https://stackoverflow.com/questions/70481841/angular-global-variables-on-styles-scss-to-share-among-all-components)，缺點是 evn 很新基本上不支援舊瀏覽器，並且無法配合 SASS Function

2. 導入 sass-resources-loader：Webpack 的載入器 (loader)，用於處理 Sass 檔案。它可以讓您在多個 Sass 檔案之間共享 Sass 變數、mixin 和函式，而不需要在每個檔案中都顯式地引入它們，缺點是要自定義 Webpack，[Angular 本身似乎不推薦這個](https://github.com/angular/angular-cli/issues/7548)

## [sass-vs-tailwind-css-vs-styled-components-a-css-methodology-comparison](https://ttt.studio/tech/sass-vs-tailwind-css-vs-styled-components-a-css-methodology-comparison/)

CSS 中最大的議題

1. 不好確定是否重複命名
2. 選擇器權重在專案過大時不好管控最後可能會束諸 !important
3. 切換頁面開發會增加心智負擔 ( 透過 CSS in JS 解決 )

目前還是看好 SASS 解決方案，1、2 可以透過 Component Style 解決，CSS in JS 可以透過 Angular 的 Component Styles 搞定，所以最後決定嘗試導入 sass-resources-loader

導入載入器首先要透過 NG 提供的客製化 Webpack 介面 [angular-customize-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack#custom-webpack-dev-server) 並且下載 [sass-resources-loader](https://www.npmjs.com/package/sass-resources-loader) 使用方式可以參考以下文章

1. [Angular：如何在 Angular(8.0) 中配置 Webpack](https://limeii.github.io/2019/08/angular-customize-webpack/)
2. [sandangel webpack.config.js](https://github.com/sandangel/angular-hmr-global-scss/blob/master/webpack.config.js)
3. [angular-cli-with-webpack-how-to-include-global-scss-in-project](https://stackoverflow.com/questions/39155417/angular-cli-with-webpack-how-to-include-global-scss-in-project)
4. [自定義 WP 還可以做到很多事 => Angular9 自定义webpack配置拆分入口文件 优化加载速度](https://segmentfault.com/a/1190000042566595)

## 總結異動檔案

* angular.json

![Image](https://user-images.githubusercontent.com/46659635/257032422-1f8a2b18-88ef-4a92-b413-a4d81c3b5ea2.png)

* package.json

![Image](https://user-images.githubusercontent.com/46659635/257032476-62a18976-a83c-4a3c-80ff-92dcd0682dfc.png)

* extra-webpack.config.js ( 自定義名稱，搭配 angular.json )

![Image](https://user-images.githubusercontent.com/46659635/257032507-ce226e05-1306-4beb-8eaf-6073720f9d65.png)