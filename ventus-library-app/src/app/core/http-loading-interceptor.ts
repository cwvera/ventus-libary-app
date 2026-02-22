import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(finalize(() => {}));
};
