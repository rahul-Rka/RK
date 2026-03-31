// import { Component } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   IsLoggin:any=false;
//   roleName: string | null;
//   constructor(private authService: AuthService, private router:Router)
//   {
//     debugger;
//     this.IsLoggin=authService.getLoginStatus;
//     this.roleName=authService.getRole;
//     if(this.IsLoggin==false)
//     {
//       this.router.navigateByUrl('/login'); 
    
//     }
//   }
//   logout()
// {
//   this.authService.logout();
//   window.location.reload();
// }

// }
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService, private router: Router) {
    if (!this.authService.getLoginStatus) {
      this.router.navigateByUrl('/login');
    }
  }

  // Getters so navbar always reflects current state reactively
  get IsLoggin(): boolean {
    return this.authService.getLoginStatus;
  }

  get roleName(): string {
    return this.authService.getRole;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');  // ← no full page reload needed
  }
}