import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserPagesService } from "../user-pages/services/user-pages.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserPagesService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkUserLogin(route);
  }

  checkUserLogin(route: ActivatedRouteSnapshot) {
    let user = this.userService.getUser();
    if(user){
      let rol = this.userService.getRol();
      if(route.data.role.includes(rol.nombre)){
        return true;
      }else{
        this.router.navigateByUrl('/error-pages/unauthorized');         //hacer página ups
        return false;
      }
    }else{
      this.router.navigateByUrl('/user-pages/login');
      return false;
    }
  }
}
