import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CompetenzaService } from '../../services/competenza.service';
import { MateriaService } from '../../services/materia.service';
import { UtenteService } from '../../services/utente.service';

import { Competenza } from '../../models/competenza';
import { Materia } from '../../models/materia';
import { Utente } from '../../models/utente';

@Component({
  selector: 'app-competenze',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './competenze.component.html',
  styleUrl: './competenze.component.scss'
})
export class CompetenzeComponent implements OnInit {

  utenteLoggato: Utente | null = null;

  competenze: Competenza[] = [];
  materie: Materia[] = [];

  caricamento = true;
  erroreMsg = '';

  mostraForm = false;
  modificaInCorso = false;

  competenzaForm: Competenza = {
    livello: 'BASE',
    descrizione: '',
    idMateria: undefined,
    idUtente: undefined
  };

  constructor(
    private competenzaService: CompetenzaService,
    private materiaService: MateriaService,
    private utenteService: UtenteService
  ) {}

  ngOnInit(): void {

    this.utenteLoggato =
      this.utenteService.getUtenteLoggato();

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      this.erroreMsg = 'Utente non autenticato.';
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

    this.caricamento = true;
    this.erroreMsg = '';

    this.materiaService.getMaterie().subscribe({
      next: materie => {

        this.materie = materie;

        this.competenzaService
          .getCompetenzeUtente(
            this.utenteLoggato!.idUtente!
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
      },

      error: errore => {

        console.error(errore);

        this.erroreMsg =
          'Errore durante il caricamento delle materie.';

        this.caricamento = false;
      }
    });
  }

  apriFormNuovaCompetenza(): void {

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      return;
    }

    this.modificaInCorso = false;

    this.competenzaForm = {
      livello: 'BASE',
      descrizione: '',
      idUtente: this.utenteLoggato.idUtente,
      idMateria: undefined
    };

    this.mostraForm = true;
  }

  modificaCompetenza(
    competenza: Competenza
  ): void {

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      return;
    }

    this.modificaInCorso = true;

    this.competenzaForm = {
      idCompetenza: competenza.idCompetenza,
      livello: competenza.livello,
      descrizione: competenza.descrizione ?? '',
      idUtente: this.utenteLoggato.idUtente,
      idMateria:
        competenza.materia?.idMateria ??
        competenza.idMateria
    };

    this.mostraForm = true;
  }

  annullaForm(): void {
    this.mostraForm = false;
    this.modificaInCorso = false;
  }

  salvaCompetenza(): void {

    this.erroreMsg = '';

    if (
      this.competenzaForm.idUtente === undefined ||
      this.competenzaForm.idMateria === undefined
    ) {
      this.erroreMsg =
        'Seleziona una materia.';
      return;
    }

    if (this.modificaInCorso) {

      this.competenzaService
        .modificaCompetenza(
          this.competenzaForm
        )
        .subscribe({
          next: () => {

            this.mostraForm = false;
            this.modificaInCorso = false;
            this.caricaDati();
          },

          error: errore => {

            console.error(errore);

            this.erroreMsg =
              errore.error?.erroreMsg ??
              'Errore durante la modifica della competenza.';
          }
        });

    } else {

      this.competenzaService
        .aggiungiCompetenza(
          this.competenzaForm
        )
        .subscribe({
          next: () => {

            this.mostraForm = false;
            this.caricaDati();
          },

          error: errore => {

            console.error(errore);

            this.erroreMsg =
              errore.error?.erroreMsg ??
              'Errore durante l’aggiunta della competenza.';
          }
        });
    }
  }

  eliminaCompetenza(
    competenza: Competenza
  ): void {

    if (
      competenza.idCompetenza === undefined ||
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      return;
    }

    const conferma = confirm(
      `Vuoi eliminare la competenza in ${competenza.materia?.nome ?? 'questa materia'}?`
    );

    if (!conferma) {
      return;
    }

    this.competenzaService
      .eliminaCompetenza(
        competenza.idCompetenza,
        this.utenteLoggato.idUtente
      )
      .subscribe({
        next: () => {
          this.caricaDati();
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante l’eliminazione della competenza.';
        }
      });
  }
}