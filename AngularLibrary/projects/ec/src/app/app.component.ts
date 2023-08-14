import { Component } from '@angular/core';
import { ThemeService } from 'lib/feature/theme/theme.service';
@Component({
  selector: 'ec-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private themeService: ThemeService,
  ) {
  }

  ngOnInit(): void {
    this.themeService.SetTheme(this.themeService.GetTheme());
  }
}
