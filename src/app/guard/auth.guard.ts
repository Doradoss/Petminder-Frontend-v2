import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // return true;
  const lService = inject(LoginService);  // Inyecta LoginService
  const router = inject(Router);          // Inyecta Router

  const rpta = lService.verificar();      // Llama al método de verificación
  if (!rpta) {
    router.navigate(['/login']);           // Redirige si no está autenticado
    return false;
  }
  return rpta;
};