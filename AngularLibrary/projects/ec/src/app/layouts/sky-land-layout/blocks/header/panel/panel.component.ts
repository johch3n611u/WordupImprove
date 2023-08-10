import { Component, Input } from '@angular/core';
import { Theme, ThemeService } from 'lib/feature/theme/theme.service';
import { DeviceCheckService, TranslateService } from 'lib/public-api';
import { PanelService } from './panel.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'ec-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  Theme = Theme;
  @Input() data: any = {};
  language = [
    {
      name: 'EN',
      active: true
    },
    {
      name: '繁體',
      active: false
    },
    {
      name: '简体',
      active: false
    },
    {
      name: '日本語',
      active: false
    },
    {
      name: 'แบบไทย',
      active: false
    }
  ];

  multilevelNavDisplay$: Observable<boolean>;

  constructor(
    private translateService: TranslateService,
    public themeService: ThemeService,
    public panelService: PanelService,
    public deviceCheckService: DeviceCheckService,
  ) {
    this.multilevelNavDisplay$ = panelService.multilevelNavDisplay$;
  }

  ngOnInit(): void {
    // console.log(this.data.leftNav);
  }

  ChangeLang(selected?: string): void {
    this.language.forEach(lang => lang.active = false);
    let lang = this.language.find(lang => lang.name === selected);
    if (lang) {
      lang.active = true;
      this.translateService.Use(lang.name);
    }
  }

  GetActive() {
    return this.language.find(lang => lang.active)?.name;
  }

  GetPassive() {
    return this.language.filter(lang => !lang.active).map(lang => lang.name);
  }
}
