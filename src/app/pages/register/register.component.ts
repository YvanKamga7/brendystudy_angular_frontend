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
import { Utente } from '../../models/utente';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  nome = '';
  cognome = '';
  email = '';
  username = '';
  password = '';
  confermaPassword = '';

  caricamento = false;
  erroreMsg = '';
  successoMsg = '';

  constructor(
    private utenteService: UtenteService,
    private router: Router
  ) {}

  registra(): void {

    this.erroreMsg = '';
    this.successoMsg = '';

    if (
      !this.nome.trim() ||
      !this.cognome.trim() ||
      !this.email.trim() ||
      !this.username.trim() ||
      !this.password.trim() ||
      !this.confermaPassword.trim()
    ) {
      this.erroreMsg =
        'Compila tutti i campi.';
      return;
    }

    if (
      !this.email.includes('@')
    ) {
      this.erroreMsg =
        'Inserisci un indirizzo email valido.';
      return;
    }

    if (
      this.password.length < 4
    ) {
      this.erroreMsg =
        'La password deve contenere almeno 4 caratteri.';
      return;
    }

    if (
      this.password !== this.confermaPassword
    ) {
      this.erroreMsg =
        'Le password non coincidono.';
      return;
    }

    const nuovoUtente: Utente = {
      nome: this.nome.trim(),
      cognome: this.cognome.trim(),
      email: this.email.trim(),
      username: this.username.trim(),
      password: this.password
    };

    this.caricamento = true;

    this.utenteService
      .registrazione(nuovoUtente)
      .subscribe({

        next: () => {

          this.caricamento = false;

          this.successoMsg =
            'Registrazione completata correttamente.';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 700);
        },

        error: errore => {

          console.error(errore);

          this.caricamento = false;

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante la registrazione.';
        }

      });
  }
}