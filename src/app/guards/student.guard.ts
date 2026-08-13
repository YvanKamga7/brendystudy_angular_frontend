import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { UtenteService } from '../services/utente.service';

export const studentGuard: CanActivateFn = () => {

  const utenteService =
    inject(UtenteService);

  const router =
    inject(Router);

  const utente =
    utenteService.getUtenteLoggato();

  if (
    utente !== null &&
    utente.ruolo === 'STUDENTE'
  ) {
    return true;
  }

  if (
    utente === null
  ) {
    return router.createUrlTree([
      '/login'
    ]);
  }

  return router.createUrlTree([
    '/'
  ]);
};