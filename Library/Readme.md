# Component

## Collapsibles/Accordion

https://ithelp.ithome.com.tw/articles/10288482

too easy

https://www.w3schools.com/howto/howto_js_accordion.asp

https://github.com/ant-design/ant-design/blob/master/components/collapse/CollapsePanel.tsx

https://github.com/react-component/collapse/tree/master/src

https://github.com/react-component/collapse/blob/master/src/Collapse.tsx

forwardRef 是 React 中一個重要的 API 之一，其主要用途是允許子組件（child component）向父組件（parent component）傳遞參數，並且可以獲得對子組件 DOM 元素的引用。

在一般情況下，如果要讓父組件能夠直接訪問子組件中的 DOM 元素，需要在子組件中定義一個回調函數（callback function），然後將這個回調函數傳遞給子組件的 props，讓子組件在適當的時候調用這個回調函數，將 DOM 元素作為參數傳遞給父組件。

使用 forwardRef 可以簡化這個過程，通過 forwardRef，父組件可以直接獲得對子組件 DOM 元素的引用，而無需在子組件中定義回調函數。

以下是一個使用 forwardRef 的示例代碼：

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

https://github.com/react-component/util/blob/master/src/hooks/useMergedState.ts

https://juejin.cn/post/7178485530223444026

useMergedState：通过该 Hook 你可以自由定义表单控件的受控和非受控状态

在前端工程中，受控元素和被控元素是指在表單中的輸入元素。

受控元素是指表單中的輸入元素，如input、textarea、select等元素，其值是由React或其他JavaScript框架管理的元素。這些元素的值被存儲在組件狀態中，並且只能通過setState()方法更改。

被控元素是指表單中的輸入元素，其值由DOM管理。這些元素的值可以通過JavaScript編程更改，也可以由用戶輸入更改。但是，值並不存儲在組件狀態中，因此在React或其他JavaScript框架中，它們需要透過refs來讀取或更改。

簡而言之，受控元素是由React或其他JavaScript框架管理其值的元素，而被控元素則由DOM管理其值的元素。受控元素的值存儲在組件狀態中，而被控元素的值不是。
