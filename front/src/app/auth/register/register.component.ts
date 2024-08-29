import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/country';
import { AuthService } from 'src/app/services/auth.service';
import { countries } from 'src/app/services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', './../auth.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup = new FormBuilder().group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    email: [''],
    firstName: [''],
    lastName: [''],
    address: [''],
    city: [''],
    postalCode: [''],
    country: ['']
  });

  public readonly countries: Country[] = [];

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    this.countries = countries;
  }

  ngOnInit(): void {
    // Redirect to main page if already authenticated (register page should not be accessible if already authenticated)
    if (this.authService.isAuthenticated()) {
      if (!this.authService.isUserAdmin()) {
        this.router.navigate(['/main']);
      } else {
        this.router.navigate(['/admin']);
      }
    }
  }

  register(): void {
    let username: string = this.registerForm.controls["username"].value;
    if (!username) {
      this.snackBar.open('Veuillez entrer un nom d\'utilisateur', '', { duration: 2500, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
      return;
    }

    let password: string = this.registerForm.controls["password"].value;
    let confirmPassword: string = this.registerForm.controls["confirmPassword"].value;

    if (!password || !confirmPassword || password !== confirmPassword) {
      this.snackBar.open('Les mots de passe ne correspondent pas', '', { duration: 2500, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
      return;
    }

    let email: string = this.registerForm.controls["email"].value;
    let firstName: string = this.registerForm.controls["firstName"].value;
    let lastName: string = this.registerForm.controls["lastName"].value;
    let address: string = this.registerForm.controls["address"].value;
    let city: string = this.registerForm.controls["city"].value;
    let postalCode: string = this.registerForm.controls["postalCode"].value;
    let country: Country = this.registerForm.controls["country"].value;

    this.authService.register({
      username: username,
      password: password,
      email: email,
      firstname: firstName,
      lastname: lastName,
      address: address,
      city: city,
      postalCode: postalCode,
      country: country.name
    });
  }

}
