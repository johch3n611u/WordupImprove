```text
| workspases
| workspases.package
|-------------| project1
|----------------------| @workspasessample/project1
|----------------------| index.js (lodash)
|-------------| project2
|----------------------| @workspasessample/project2
|----------------------| index.js (moment)
```

1. 生成 workspases package 綁定子 workspase
2. 子 workspase 必須命名為 @主 workspase name/子 workspase
3. 新增子 workspase 依賴 packge
4. 進入子 workspase file 進行 npm i 才能安裝依賴的 node_module/package
5. 回到主 workspases package.json 內新增 script 讓 node run index ( 也可在子 package.json 新增 run script )