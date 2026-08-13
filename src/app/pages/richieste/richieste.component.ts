import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RichiestaService } from '../../services/richiesta.service';
import { AppuntamentoService } from '../../services/appuntamento.service';
import { UtenteService } from '../../services/utente.service';

import { Richiesta } from '../../models/richiesta';
import { Utente } from '../../models/utente';

@Component({
  selector: 'app-richieste',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './richieste.component.html',
  styleUrl: './richieste.component.scss'
})
export class RichiesteComponent implements OnInit {

  utenteLoggato: Utente | null = null;

  richiesteRicevute: Richiesta[] = [];
  richiesteInviate: Richiesta[] = [];

  /*
   * Contiene gli ID delle richieste
   * che hanno già un appuntamento.
   */
  richiesteConAppuntamento = new Set<number>();

  caricamento = true;
  erroreMsg = '';

  constructor(
    private richiestaService: RichiestaService,
    private appuntamentoService: AppuntamentoService,
    private utenteService: UtenteService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.utenteLoggato =
      this.utenteService.getUtenteLoggato();

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      this.erroreMsg =
        'Utente non autenticato.';

      this.caricamento = false;
      return;
    }

    this.caricaDati();
  }

  caricaDati(): void {

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      return;
    }

    const idUtente =
      this.utenteLoggato.idUtente;

    this.caricamento = true;
    this.erroreMsg = '';

    forkJoin({

      richieste:
        this.richiestaService
          .getRichiesteUtente(idUtente),

      appuntamenti:
        this.appuntamentoService
          .getAppuntamentiUtente(idUtente)

    }).subscribe({

      next: risultato => {

        /*
         * Separiamo le richieste ricevute
         * da quelle inviate.
         */
        this.richiesteRicevute =
          risultato.richieste.filter(
            richiesta =>
              richiesta.tutor?.idUtente === idUtente
          );

        this.richiesteInviate =
          risultato.richieste.filter(
            richiesta =>
              richiesta.richiedente?.idUtente === idUtente
          );

        /*
         * Ricostruiamo l'elenco delle richieste
         * che possiedono già un appuntamento.
         */
        this.richiesteConAppuntamento.clear();

        risultato.appuntamenti.forEach(
          appuntamento => {

            const idRichiesta =
              appuntamento.richiesta?.idRichiesta;

            if (idRichiesta !== undefined) {

              this.richiesteConAppuntamento.add(
                idRichiesta
              );
            }
          }
        );

        this.caricamento = false;
      },

      error: errore => {

        console.error(errore);

        this.erroreMsg =
          'Errore durante il caricamento delle richieste.';

        this.caricamento = false;
      }

    });
  }

  accetta(
    idRichiesta: number
  ): void {

    this.erroreMsg = '';

    this.richiestaService
      .aggiornaStato(
        idRichiesta,
        'ACCETTATA'
      )
      .subscribe({

        next: () => {
          this.caricaDati();
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante l’accettazione della richiesta.';
        }

      });
  }

  rifiuta(
    idRichiesta: number
  ): void {

    this.erroreMsg = '';

    this.richiestaService
      .aggiornaStato(
        idRichiesta,
        'RIFIUTATA'
      )
      .subscribe({

        next: () => {
          this.caricaDati();
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il rifiuto della richiesta.';
        }

      });
  }

  haAppuntamento(
    richiesta: Richiesta
  ): boolean {

    if (
      richiesta.idRichiesta === undefined
    ) {
      return false;
    }

    return this.richiesteConAppuntamento.has(
      richiesta.idRichiesta
    );
  }

  creaAppuntamento(
    richiesta: Richiesta
  ): void {

    if (
      richiesta.idRichiesta === undefined
    ) {
      return;
    }

    /*
     * Sicurezza aggiuntiva:
     * non permettiamo di aprire il form
     * se l'appuntamento esiste già.
     */
    if (
      this.haAppuntamento(richiesta)
    ) {
      this.erroreMsg =
        'Esiste già un appuntamento per questa richiesta.';

      return;
    }

    this.router.navigate(
      ['/appuntamenti'],
      {
        queryParams: {
          crea: richiesta.idRichiesta
        }
      }
    );
  }
}