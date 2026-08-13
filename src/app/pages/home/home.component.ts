import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UtenteService } from '../../services/utente.service';
import { CompetenzaService } from '../../services/competenza.service';

import { Utente } from '../../models/utente';
import { Competenza } from '../../models/competenza';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  utenteLoggato: Utente | null = null;

  competenze: Competenza[] = [];

  caricamento = false;
  erroreMsg = '';

  constructor(
    public utenteService: UtenteService,
    private competenzaService: CompetenzaService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.utenteLoggato =
      this.utenteService.getUtenteLoggato();

    if (
      this.utenteLoggato !== null &&
      this.utenteLoggato.idUtente !== undefined
    ) {
      this.caricaCompetenze();
    }
  }

  caricaCompetenze(): void {

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      return;
    }

    this.caricamento = true;
    this.erroreMsg = '';

    this.competenzaService
      .getCompetenzeUtente(
        this.utenteLoggato.idUtente
      )
      .subscribe({
        next: competenze => {

          this.competenze = competenze;
          this.caricamento = false;
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il caricamento delle competenze.';

          this.caricamento = false;
        }
      });
  }

  bloccaAccount(): void {

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      return;
    }

    const conferma = confirm(
      'Sei sicuro di voler bloccare il tuo account?'
    );

    if (!conferma) {
      return;
    }

    this.utenteService
      .bloccaUtente(
        this.utenteLoggato.idUtente
      )
      .subscribe({
        next: risposta => {

          if (risposta.blocked) {

            this.utenteService.logout();

            alert(
              'Account bloccato correttamente.'
            );

            this.router.navigate(['/login']);
          }
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il blocco dell’account.';
        }
      });
  }
}