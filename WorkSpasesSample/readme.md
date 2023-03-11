# NPM Workspases
## 不共用 node_module

```text
| workspases
| workspases.package
|-------------| project1
|----------------------| @workspasessample/project1
|----------------------| node_module
|----------------------| index.js (lodash)
|-------------| project2
|----------------------| @workspasessample/project2
|----------------------| node_module
|----------------------| index.js (moment)
```

1. 生成 workspases package 綁定子 workspase
2. 子 workspase 必須命名為 @主 workspase name/子 workspase
3. 新增子 workspase 依賴 packge
4. 進入子 workspase file 進行 npm i 才能安裝依賴的 node_module/package
5. 回到主 workspases package.json 內新增 script 讓 node run index ( 也可在子 package.json 新增 run script )

## 共用 node_module ( 也可不共用需要 "nohoist": [] )

```text
| workspases
| workspases.package
| node_module
|-------------| projects
|-----------------------| project1
|---------------------------------| @workspasessample/project1
|---------------------------------| index.js (lodash)
|-----------------------| project2
|---------------------------------| @workspasessample/project2
|---------------------------------| index.js (moment)
```

1. 基本上跟不共用的知識點都相同
2. yarn 也類似這種狀況只是用的方式不太同詳細可看 [[筆記] Yarn Workspaces 基礎教學](https://tokileecy.medium.com/%E7%AD%86%E8%A8%98-yarn-workspaces-%E5%9F%BA%E7%A4%8E%E6%95%99%E5%AD%B8-cbb16bb780ec)
3. nohoist 補在 workspases 的 package.json 即可不讓子 workspases 的 package 版本提升
4. 