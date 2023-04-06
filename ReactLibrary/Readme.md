# Component

原先計畫由 [在30天利用HTML & CSS & JavaScript完成Side Project實作](https://ithelp.ithome.com.tw/articles/10288482) 內的第一個元件 collapse 開始，但這篇文章的範例其實是可折疊的 Cards 感覺沒對應到確切的 collapse 轉而找到 w3c 的 [How TO - Collapsibles/Accordion](https://www.w3schools.com/howto/howto_js_accordion.asp) 但 w3c 的也不是 React Component 可以參考，又輾轉找了 [Antd 的 collapse](https://github.com/ant-design/ant-design/tree/master/components/collapse) 看了原碼才發現還有更深的 [react-component / collapse](https://github.com/react-component/collapse/tree/master/src)，才發現對於 React 初學者來說直接看原始碼蠻多 hook 或套件庫要補坑的，所以找了篇循序漸進的 IT 幫幫忙系列文章來參考，等熟悉後再繼續看源碼

[30 天擁有一套自己手刻的 React UI 元件庫](https://ithelp.ithome.com.tw/m/users/20111490/ironman/3999)

[以經典小遊戲為主題之ReactJS應用練習](https://ithelp.ithome.com.tw/m/users/20111490/ironman/2007)

## 渲染

* React Virtual DOM 渲染：提高性能和渲染速度。Virtual DOM 是一种轻量级的 JavaScript 对象树，它代表了真实 DOM 中的所有节点，每当数据变化时，React 会先对Virtual DOM 进行操作，然后通过比较新旧两个 Virtual DOM 树的差异，最终只更新需要改变的部分，从而提高渲染效率。
  * 优点：轻量级，节省内存，只更新需要改变的部分，提高渲染效率，非常适合开发大型和复杂的 Web 应用程序
  * 缺点：需要额外的编译步骤来将 JSX 代码转换成 JavaScript 代码，增加了代码复杂度，需要学习 React 特有的编程范式和语法规则
* Angular 和 Vue 数据绑定后渲染：实现视图和数据的自动同步。当数据发生变化时，Angular 和 Vue 会自动更新相应的视图部分，从而提高渲染效率。
  * 优点：数据与视图自动同步，减少手动 DOM 操作，提高开发效率，避免了手动处理 DOM 更新的繁琐细节，使代码更加简洁
  * 缺点：对于大型和复杂的 Web 应用程序，数据绑定的性能可能会受到影响，需要进行优化和调整，对于一些特殊的 DOM 操作，可能需要手动操作 DOM 来实现
* jQuery 的 DOM 操作渲染：提供了方便的 DOM 操作和事件处理等功能。使用 jQuery 进行 DOM 操作时，可以直接修改 DOM 元素的属性和内容，从而实现渲染。
  * 优点：使用方便，容易上手，适用于快速原型开发和小型Web应用程序
  * 缺点：需要手动处理 DOM 更新的繁琐细节，使代码难以维护，对于大型和复杂的 Web 应用程序，渲染性能可能会受到影响，需要进行优化和调整
