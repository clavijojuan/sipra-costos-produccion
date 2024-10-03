import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override router: Router,
    protected keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.href,
      });
    }

    // Get the roles required from the route.
    // const requiredRoles: string[] = route.data.roles;

    // Allow the user to proceed if no additional roles are required to access the route.
    /*if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }*/

    // Allow the user to proceed if any the required roles are present.
    // return requiredRoles.find((role) => this.roles.includes(role)) !== undefined;
    return true;
  }
}
