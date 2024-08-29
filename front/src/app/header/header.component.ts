import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public settingsMenuOpened: boolean = false;
  public leftMenuOpened: boolean = false;

  constructor(private dataService: DataService) { }

  openSettingsMenu(): void {
    this.settingsMenuOpened = !this.settingsMenuOpened;
    this.leftMenuOpened = false;
  }

  openLeftMenu() {
    this.leftMenuOpened = !this.leftMenuOpened;
    this.settingsMenuOpened = false;
  }

  // openCart() {
  //   this.leftMenuOpened = false;
  //   this.settingsMenuOpened = false;

  //   // Redirect to cart page
  //   this.router.navigate(['/cart']);
  // }

  getCartLength(): number {
    return this.dataService.getCartLength;
  }

}
