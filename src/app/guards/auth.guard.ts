import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { UtenteService } from '../services/utente.service';

export const authGuard: CanActivateFn = () => {

  const utenteService =
    inject(UtenteService);

  const router =
    inject(Router);

  if (
    utenteService.isLoggedIn()
  ) {
    return true;
  }

  return router.createUrlTree([
    '/login'
  ]);
};