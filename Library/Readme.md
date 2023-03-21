# Component

原先計畫由 [在30天利用HTML & CSS & JavaScript完成Side Project實作](https://ithelp.ithome.com.tw/articles/10288482) 內的第一個元件 collapse 開始，但這篇文章的範例其實是可折疊的 Cards 感覺沒對應到確切的 collapse 轉而找到 w3c 的 [How TO - Collapsibles/Accordion](https://www.w3schools.com/howto/howto_js_accordion.asp) 但 w3c 的也不是 React Component 可以參考，又輾轉找了 [Antd 的 collapse](https://github.com/ant-design/ant-design/tree/master/components/collapse) 看了原碼才發現還有更深的 [react-component / collapse](https://github.com/react-component/collapse/tree/master/src)，對於 React 初學者來說直接看原始碼蠻多 hook 或套件庫要補坑的，所以找了篇循序漸進的 IT 幫幫忙系列文章來參考，等熟悉後再繼續看源碼

[30 天擁有一套自己手刻的 React UI 元件庫](https://ithelp.ithome.com.tw/m/users/20111490/ironman/3999)

[以經典小遊戲為主題之ReactJS應用練習](https://ithelp.ithome.com.tw/m/users/20111490/ironman/2007)

<details>

<summary>forwardRef、useMergedState、受控非受控</summary>

## forwardRef

forwardRef 是 React 中一個重要的 API 之一，其主要用途是允許子組件（child component）向父組件（parent component）傳遞參數，並且可以獲得對子組件 DOM 元素的引用。

在一般情況下，如果要讓父組件能夠直接訪問子組件中的 DOM 元素，需要在子組件中定義一個回調函數（callback function），然後將這個回調函數傳遞給子組件的 props，讓子組件在適當的時候調用這個回調函數，將 DOM 元素作為參數傳遞給父組件。

使用 forwardRef 可以簡化這個過程，通過 forwardRef，父組件可以直接獲得對子組件 DOM 元素的引用，而無需在子組件中定義回調函數。

```js
import React, { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return (
    <input type="text" ref={ref} {...props} />
  );
});

const App = () => {
  const inputRef = React.createRef();

  const handleButtonClick = () => {
    console.log(inputRef.current.value);
  };

  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={handleButtonClick}>Submit</button>
    </div>
  );
};
```

## useMergedState

[react-component/util/useMergedState](https://github.com/react-component/util/blob/master/src/hooks/useMergedState.ts)

[我们应该如何优雅的处理 React 中受控与非受控](https://juejin.cn/post/7178485530223444026)

通过该 Hook 你可以自由定义表单控件的受控和非受控状态。

在前端工程中，受控元素和被控元素是指在表單中的輸入元素。

受控元素是指表單中的輸入元素，如input、textarea、select等元素，其值是由React或其他JavaScript框架管理的元素。這些元素的值被存儲在組件狀態中，並且只能通過setState()方法更改。

被控元素是指表單中的輸入元素，其值由DOM管理。這些元素的值可以通過JavaScript編程更改，也可以由用戶輸入更改。但是，值並不存儲在組件狀態中，因此在React或其他JavaScript框架中，它們需要透過refs來讀取或更改。

簡而言之，受控元素是由React或其他JavaScript框架管理其值的元素，而被控元素則由DOM管理其值的元素。受控元素的值存儲在組件狀態中，而被控元素的值不是。

</details>