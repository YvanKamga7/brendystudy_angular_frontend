import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = '';
  password = '';

  erroreMsg = '';
  caricamento = false;

  constructor(
    private utenteService: UtenteService,
    private router: Router
  ) {}

  login(): void {

    this.erroreMsg = '';

    if (
      !this.username.trim() ||
      !this.password.trim()
    ) {
      this.erroreMsg =
        'Inserisci username e password.';

      return;
    }

    this.caricamento = true;

    this.utenteService
      .login(
        this.username.trim(),
        this.password
      )
      .subscribe({

        next: () => {

          this.caricamento = false;

          // Dopo il login si va sempre alla Home
          this.router.navigate(['/']);
        },

        error: errore => {

          this.caricamento = false;

          if (errore.status === 401) {

            this.erroreMsg =
              'Username o password non corretti.';

            return;
          }

          if (errore.status === 403) {

            this.erroreMsg =
              errore.error?.erroreMsg ??
              'Il tuo account è bloccato.';

            return;
          }

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante l’accesso.';
        }

      });
  }
}