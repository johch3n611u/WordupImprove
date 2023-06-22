https://aihongxin.com/6617.html

https://layout.bradwoods.io/customize?

https://csslayout.io/

https://loading.io/

https://cssgrid-generator.netlify.app/

https://grid.layoutit.com/

搭配 sass 產生器

##　gpt 4

請幫我生成一段可以在瀏覽器執行的 js code 須滿足以下的 input 與 output 與以下 2 個條件

1. 过滤同级重复的选择器
2. 只在原先的基础上增加新的选择器规则，不删减

input：

```html
  <div class="box">
    <button id="btn"></button>
    <transition name='fade'>
      <p class="box2">
        <a class="box3"></a>
        <span></span>
      </p>
    </transition>
  </div>
```

output：

```scss
.box {
    #btn {
    }
    .box2 {
      .box3 {
      }
      span {
      }
    }
}
```

產出確定能用，但目前缺轉成 css

```javascript
        function generateSCSS() {
            // 取得 body 元素作為 DOM 樹的根節點
            const rootNode = document.querySelector('body');
            // 創建一個 Set 來儲存選擇器，以避免重複
            const selectors = new Set();

            // 遍歷 DOM 樹的遞迴函數
            function traverse(node, depth, selectors) {
                // 確認節點是否為可用的節點
                const validNode = isNodeValid(node);
                if (validNode) {
                    // 取得節點的識別符
                    const identifier = getIdentifier(node);
                    // 如果識別符還未在選擇器集合中，則加入並產生該節點對應的 SCSS 代碼
                    if (!selectors.has(identifier)) {
                        selectors.add(identifier);
                        const scss = generateNodeSCSS(node, depth, selectors);
                        return scss;
                    }
                }
                // 如果節點不可用，則遍歷其子節點
                let scss = '';
                for (const child of node.children) {
                    scss += traverse(child, depth, selectors);
                }
                return scss;
            }

            // 判斷節點是否為可用節點（有 id 或 class 屬性）
            function isNodeValid(node) {
                return node.nodeType === 1 && (node.id || node.className);
            }

            // 取得節點的識別符
            function getIdentifier(node) {
                return node.id ? `#${node.id}` : `.${node.className}`;
            }

            // 產生節點對應的 SCSS 代碼
            function generateNodeSCSS(node, depth, selectors) {
                const identifier = getIdentifier(node);
                const scss = `${'  '.repeat(depth)}${identifier} {\n`;
                let childSCSS = '';
                for (const child of node.children) {
                    childSCSS += traverse(child, depth + 1, selectors);
                }
                return `${scss}${childSCSS}${'  '.repeat(depth)}}\n`;
            }

            // 從根節點開始遍歷 DOM 樹
            return traverse(rootNode, 0, selectors);
        }

        const outputSCSS = generateSCSS();

        console.log(outputSCSS);
```