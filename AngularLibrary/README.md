# 知識點

1. tsconfig.json => path "projects/lib/*", "dist/lib/*" 
   * ng serve 開發模式優先從 projects/lib 目錄下尋找模組
   * ng build 解析器會優先從 dist/lib 目錄下尋找模組
2. `ng generate application <app-name>` 新增新站台
3. 新增 component 可以透過 gui 新增資料夾在在 application 專案後，在搬移至 library 專案 ( gui 套件結構問題，除非去改 generate schame )

## AngularLibrary

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
