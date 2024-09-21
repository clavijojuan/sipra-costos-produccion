import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './common/interceptors/loading.interceptor';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment.development';

function inititalizeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakConf.url,
        realm: environment.keycloakConf.realm,
        clientId: environment.keycloakConf.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        // silentCheckSsoRedirectUri:
        //   window.location.origin + '/silent-check-sso.html',
      },
      shouldAddToken(request) {
        const { url } = request;
        return true;
        // const ignoreURLs = [CONFIG.ARCSERVER, CONFIG.ARCSERVERTOKEN, CONFIG.ARCSERVER_GEO, 'https://server.arcgisonline.com/arcgis/rest/services']
        // return ignoreURLs.every((ignoreURL) => !url.includes(ignoreURL))
      },
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: inititalizeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    KeycloakService,
  ],
};
