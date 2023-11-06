## Reference

1. ec： https://www.biopak.com/
2. brand： https://digitaljungle.com.br/

## Command

1. 新增庫專案 `ng generate library <library> --prefix <library>` 
   * --prefix 會更改 app-xxx 為新前綴 library-xxx
2. 新增程式專案 `ng generate application <app-name>` 

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

### Facade Pattern

簡化複雜系統，提供統一的界面，隱藏了系統內部複雜性。

EX. 封裝表單相關的功能、方法和事件，提供簡單統一的介面供其他程式使用。

[NG 依賴注入](https://ithelp.ithome.com.tw/articles/10207990)

[useFactory](https://fullstackladder.dev/blog/2018/11/05/mastering-angular-21-ngmodule-providers-2/)

```typescript
import { facadeFactory, StateUtils } from '@spartacus/core';
import { FORM_CORE_FEATURE } from '../form-feature-name';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: FormFacade,
      feature: FORM_CORE_FEATURE,
      methods: [
        'getCompleteFormStepSuccess',
        'getCompleteFormStepError',
      ],
      async: true,
    }),
})
export abstract class FormFacade {
  abstract getCompleteFormStepSuccess(
    formId: string,
    formStepId: string
  ): Observable<boolean>;
  abstract getCompleteFormStepError(
    formId: string,
    formStepId: string
  ): Observable<boolean>;
}
```

### Angular Fire

[SDK](https://github.com/angular/angularfire/issues/3353)