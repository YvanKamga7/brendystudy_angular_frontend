import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { UtenteService } from '../../services/utente.service';
import { Utente } from '../../models/utente';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  utenti: Utente[] = [];

  caricamento = true;

  erroreMsg = '';
  successoMsg = '';

  displayedColumns: string[] = [
    'id',
    'nome',
    'username',
    'email',
    'ruolo',
    'stato',
    'azioni'
  ];

  constructor(
    public utenteService: UtenteService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (!this.utenteService.isAdmin()) {

      this.router.navigate(['/']);

      return;
    }

    this.caricaUtenti();
  }

  caricaUtenti(): void {

    this.caricamento = true;
    this.erroreMsg = '';

    this.utenteService
      .getUtenti()
      .subscribe({

        next: utenti => {

          this.utenti = utenti;

          this.caricamento = false;
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il caricamento degli utenti.';

          this.caricamento = false;
        }

      });
  }

  blocca(
    utente: Utente
  ): void {

    if (
      utente.idUtente === undefined ||
      utente.ruolo === 'ADMIN'
    ) {
      return;
    }

    const conferma = confirm(
      `Vuoi bloccare l'account di ${utente.nome} ${utente.cognome}?`
    );

    if (!conferma) {
      return;
    }

    this.erroreMsg = '';
    this.successoMsg = '';

    this.utenteService
      .bloccaUtente(
        utente.idUtente
      )
      .subscribe({

        next: risposta => {

          if (risposta.blocked) {

            this.successoMsg =
              'Utente bloccato correttamente.';

            this.caricaUtenti();
          }

        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il blocco dell’utente.';
        }

      });
  }

  sblocca(
    utente: Utente
  ): void {

    if (
      utente.idUtente === undefined ||
      utente.ruolo === 'ADMIN'
    ) {
      return;
    }

    this.erroreMsg = '';
    this.successoMsg = '';

    this.utenteService
      .sbloccaUtente(
        utente.idUtente
      )
      .subscribe({

        next: risposta => {

          if (risposta.unblocked) {

            this.successoMsg =
              'Utente riattivato correttamente.';

            this.caricaUtenti();
          }

        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante la riattivazione dell’utente.';
        }

      });
  }
}