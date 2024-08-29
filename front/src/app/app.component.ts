import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public darkModeEnabled: boolean = false;

  constructor(private renderer: Renderer2, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Dark theme by défault
    this.changeDarkMode(true);

    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigate(['/login']);
    // }

    // TODO : load user preference
  }

  // isAuthenticated(): boolean {
  //   return this.authService.isAuthenticated();
  // }

  changeDarkMode(darkMode: boolean): void {
    this.darkModeEnabled = darkMode;
    if (darkMode) {
      this.renderer.addClass(document.body, 'darkMode');
    } else {
      this.renderer.removeClass(document.body, 'darkMode');
    }
  }

}
