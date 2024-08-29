import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';
import { JWTToken } from '../models/jwt-token';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') private apiBaseUrl: string,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    let currentUser = localStorage.getItem('currentUser');
    let user = null;

    if (currentUser) {
      user = JSON.parse(currentUser);
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(user);
  }

  register(user: User): void {
    this.http.post(this.apiBaseUrl + 'api/auth/register', user)
      .subscribe({
        next: (resp: any) => {
          if (!resp) {
            console.error('Error while registering');
            return;
          }

          this.login(user);
          this.snackBar.open('Votre compte a été créé', '', { duration: 2500, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snack-bar-container'] });
        },
        error: (error) => {
          if (error.error && error.error.message) {
            if (error.error.message === "Un compte est déjà associé à cet email") {
              this.snackBar.open('Un compte est déjà associé à ce nom d\'utilisateur/cet email', '', { duration: 1500, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
              // alert("Un compte est déjà associé à cet email");
              this.login(user);
              return;
            }
          }
          console.error(error);
        }
      });
  }

  login(user: User, redirect: boolean = true): void {
    let params: HttpParams = new HttpParams()
      .set('username', user.username)
      .set('password', user.password);

    this.http.post<JWTToken>(this.apiBaseUrl + 'api/auth/login', null, { params: params })
      .subscribe({
        next: (resp: JWTToken) => {
          user.token = resp;
          // Reset password to hide it in localStorage
          user.password = '';

          const decodedToken: any = this.decodeToken(user.token);

          // User roles
          user.roles = [];
          for (let role of decodedToken.roles) {//this.getUserRolesFromToken(user.token)) {
            user.roles.push({ name: role });
          }

          // User details
          if (decodedToken.creation_date) {
            user.creationDate = new Date(decodedToken.creation_date * 1000);
          }
          user.email = decodedToken.email;
          user.firstname = decodedToken.given_name;
          user.lastname = decodedToken.family_name;
          user.address = decodedToken.address;
          user.postalCode = decodedToken.postal_code;
          user.city = decodedToken.city;
          user.country = decodedToken.country;

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          console.log(resp['accessToken']);

          if (redirect) {
            if (this.route.snapshot.queryParams['returnUrl']) {
              // Redirect to redirectUrl
              this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl']);
              return;
            }

            if (!this.isUserAdmin()) {
              // Redirect to home page
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/admin']);
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  logout(returnUrl: string | null = null): void {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.currentUserValue?.token?.accessToken
    });
    this.http.post(this.apiBaseUrl + 'api/auth/logout', null, { headers: headers })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
        }
      });
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    // If returnUrl is defined, redirect to it
    this.router.navigate(['/login'], (returnUrl ? { queryParams: { returnUrl: returnUrl }} : undefined));
  }

  saveRefreshToken(token: JWTToken): void {
    let user = this.currentUserValue;
    if (!user || !token) {
      // Fail to refresh token -> disconnect user and save current url to restore it after login
      this.logout(window.location.pathname);
      return;
    }

    user.token = token;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);// = new BehaviorSubject<User | null>(user);
  }

  refreshTokenRequest(): Observable<JWTToken> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.currentUserValue?.token?.refreshToken);
    console.log('refreshToken to send: ' + this.currentUserValue?.token?.refreshToken);

    return this.http.get<JWTToken>(this.apiBaseUrl + 'api/auth/refreshtoken', { headers: headers });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.currentUserValue.token;
  }

  isTokenExpired(): boolean {
    if (!this.currentUserValue || !this.currentUserValue.token) return true;

    const decoded: any = jwt_decode(this.currentUserValue.token.accessToken);
    if (!decoded || !decoded.exp) return true;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return !(date.valueOf() > new Date().valueOf());
  }

  private decodeToken(token: JWTToken): any {
    return jwt_decode(token.accessToken);
  }

  // private getUserRolesFromToken(token: JWTToken): string[] {
  //   let roles: string[] = [];

  //   const decoded: any = this.decodeToken(token);
  //   if (!decoded || !decoded.roles) return roles;

  //   return decoded.roles;
  // }

  isUserAdmin(): boolean {
    if (!this.currentUserValue || !this.currentUserValue.roles) return false;

    let roles = this.currentUserValue.roles;
    return !!roles.length && !!roles.find(r => r.name === 'ADMIN');
  }

  isUser(): boolean {
    let roles = this.currentUserValue!.roles!;
    return !!roles.length && !!roles.find(r => r.name === 'USER');
  }

  get currentUserValue(): User | null {
    if (!this.currentUserSubject) return null;

    return this.currentUserSubject.value;
  }

}
