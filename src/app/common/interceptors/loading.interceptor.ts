import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingSrv = inject(LoadingService);
  let keyInstance: string | undefined;

  if (req.url.includes(environment.arcgisUrl)) {
    keyInstance = loadingSrv.loadingInstance();
  }
  return next(req).pipe(
    finalize(() => {
      if (keyInstance) {
        loadingSrv.loadingInstance(keyInstance);
      }
    })
  );
};
