import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthenticationService} from "../services/authentification.service";

@Injectable({
  providedIn:"root"
})
export class AuthentificationGuard implements CanActivate{
  constructor(private authSirvice :AuthenticationService,private router:Router) {


  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let authecated=this.authSirvice.isAuthenticated()
      if (authecated==false){
        this.router.navigateByUrl("/login");
        return false
      }
      else {
        return true;
      }
  }

}

