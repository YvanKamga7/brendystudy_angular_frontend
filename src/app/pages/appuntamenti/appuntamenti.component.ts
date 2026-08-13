import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatIconModule } from '@angular/material/icon';

import { AppuntamentoService } from '../../services/appuntamento.service';
import { UtenteService } from '../../services/utente.service';

import { Appuntamento } from '../../models/appuntamento';
import { Utente } from '../../models/utente';

@Component({
  selector: 'app-appuntamenti',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatIconModule
  ],
  templateUrl: './appuntamenti.component.html',
  styleUrl: './appuntamenti.component.scss'
})
export class AppuntamentiComponent implements OnInit {

  utenteLoggato: Utente | null = null;

  appuntamenti: Appuntamento[] = [];

  caricamento = true;
  invioInCorso = false;

  erroreMsg = '';
  successoMsg = '';

  mostraForm = false;

  idRichiesta?: number;

  dataMinima = new Date();

  dataSelezionata: Date | null = null;
  oraSelezionata: Date | null = null;

  nuovoAppuntamento: Appuntamento = {
    dataAppuntamento: '',
    oraAppuntamento: '',
    modalita: 'ONLINE',
    descrizione: '',
    idRichiesta: undefined
  };

  constructor(
    private appuntamentoService: AppuntamentoService,
    private utenteService: UtenteService,
    private route: ActivatedRoute,
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

    this.route.queryParamMap.subscribe(
      params => {

        const crea =
          params.get('crea');

        if (crea !== null) {

          const id =
            Number(crea);

          if (!Number.isNaN(id)) {

            this.idRichiesta = id;

            this.nuovoAppuntamento = {
              dataAppuntamento: '',
              oraAppuntamento: '',
              modalita: 'ONLINE',
              descrizione: '',
              idRichiesta: id
            };

            this.dataSelezionata = null;
            this.oraSelezionata = null;

            this.mostraForm = true;
          }
        }
      }
    );

    this.caricaAppuntamenti();
  }

  private formattaData(
    data: Date
  ): string {

    const anno =
      data.getFullYear();

    const mese =
      String(
        data.getMonth() + 1
      ).padStart(2, '0');

    const giorno =
      String(
        data.getDate()
      ).padStart(2, '0');

    return `${anno}-${mese}-${giorno}`;
  }

  private formattaOra(
    data: Date
  ): string {

    const ore =
      String(
        data.getHours()
      ).padStart(2, '0');

    const minuti =
      String(
        data.getMinutes()
      ).padStart(2, '0');

    return `${ore}:${minuti}`;
  }

  aggiornaData(): void {

    if (this.dataSelezionata === null) {

      this.nuovoAppuntamento.dataAppuntamento = '';

      return;
    }

    this.nuovoAppuntamento.dataAppuntamento =
      this.formattaData(
        this.dataSelezionata
      );
  }

  aggiornaOra(): void {

    if (this.oraSelezionata === null) {

      this.nuovoAppuntamento.oraAppuntamento = '';

      return;
    }

    this.nuovoAppuntamento.oraAppuntamento =
      this.formattaOra(
        this.oraSelezionata
      );
  }

  appuntamentoNelPassato(): boolean {

    if (
      this.dataSelezionata === null ||
      this.oraSelezionata === null
    ) {
      return false;
    }

    const dataOra =
      new Date(
        this.dataSelezionata.getFullYear(),
        this.dataSelezionata.getMonth(),
        this.dataSelezionata.getDate(),
        this.oraSelezionata.getHours(),
        this.oraSelezionata.getMinutes(),
        0,
        0
      );

    return dataOra <= new Date();
  }

  caricaAppuntamenti(): void {

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      return;
    }

    this.caricamento = true;
    this.erroreMsg = '';

    this.appuntamentoService
      .getAppuntamentiUtente(
        this.utenteLoggato.idUtente
      )
      .subscribe({

        next: appuntamenti => {

          this.appuntamenti =
            appuntamenti;

          this.caricamento = false;
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il caricamento degli appuntamenti.';

          this.caricamento = false;
        }

      });
  }

  creaAppuntamento(): void {

    this.erroreMsg = '';
    this.successoMsg = '';

    this.aggiornaData();
    this.aggiornaOra();

    if (
      this.nuovoAppuntamento.idRichiesta === undefined
    ) {
      this.erroreMsg =
        'Richiesta non valida.';

      return;
    }

    if (this.dataSelezionata === null) {

      this.erroreMsg =
        'Seleziona una data.';

      return;
    }

    if (this.oraSelezionata === null) {

      this.erroreMsg =
        'Seleziona un orario.';

      return;
    }

    if (
      this.appuntamentoNelPassato()
    ) {
      this.erroreMsg =
        'La data e l’orario dell’appuntamento devono essere nel futuro.';

      return;
    }

    this.invioInCorso = true;

    this.appuntamentoService
      .creaAppuntamento(
        this.nuovoAppuntamento
      )
      .subscribe({

        next: () => {

          this.invioInCorso = false;

          this.successoMsg =
            'Appuntamento creato correttamente.';

          this.mostraForm = false;

          this.dataSelezionata = null;
          this.oraSelezionata = null;

          this.caricaAppuntamenti();

          this.router.navigate(
            ['/appuntamenti']
          );
        },

        error: errore => {

          console.error(errore);

          this.invioInCorso = false;

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante la creazione dell’appuntamento.';
        }

      });
  }

  annullaCreazione(): void {

    this.mostraForm = false;

    this.idRichiesta = undefined;

    this.dataSelezionata = null;
    this.oraSelezionata = null;

    this.nuovoAppuntamento = {
      dataAppuntamento: '',
      oraAppuntamento: '',
      modalita: 'ONLINE',
      descrizione: '',
      idRichiesta: undefined
    };

    this.router.navigate(
      ['/appuntamenti']
    );
  }

  annullaAppuntamento(
    idAppuntamento: number
  ): void {

    const conferma =
      confirm(
        'Vuoi annullare questo appuntamento?'
      );

    if (!conferma) {
      return;
    }

    this.erroreMsg = '';
    this.successoMsg = '';

    this.appuntamentoService
      .annullaAppuntamento(
        idAppuntamento
      )
      .subscribe({

        next: risposta => {

          if (risposta.annullato) {

            this.successoMsg =
              'Appuntamento annullato correttamente.';

            this.caricaAppuntamenti();
          }
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante l’annullamento dell’appuntamento.';
        }

      });
  }
}