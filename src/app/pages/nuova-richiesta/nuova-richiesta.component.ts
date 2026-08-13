import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MateriaService } from '../../services/materia.service';
import { CompetenzaService } from '../../services/competenza.service';
import { RichiestaService } from '../../services/richiesta.service';
import { UtenteService } from '../../services/utente.service';

import { Materia } from '../../models/materia';
import { Competenza } from '../../models/competenza';
import { Utente } from '../../models/utente';
import { Richiesta } from '../../models/richiesta';

@Component({
  selector: 'app-nuova-richiesta',
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
  templateUrl: './nuova-richiesta.component.html',
  styleUrl: './nuova-richiesta.component.scss'
})
export class NuovaRichiestaComponent implements OnInit {

  utenteLoggato: Utente | null = null;

  materie: Materia[] = [];
  tutorDisponibili: Competenza[] = [];

  idMateriaSelezionata?: number;
  idTutorSelezionato?: number;

  messaggio = '';

  caricamentoMaterie = true;
  caricamentoTutor = false;
  invioInCorso = false;

  erroreMsg = '';
  successoMsg = '';

  constructor(
    private materiaService: MateriaService,
    private competenzaService: CompetenzaService,
    private richiestaService: RichiestaService,
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
      this.erroreMsg = 'Utente non autenticato.';
      this.caricamentoMaterie = false;
      return;
    }

    this.caricaMaterie();
  }

  caricaMaterie(): void {

    this.caricamentoMaterie = true;
    this.erroreMsg = '';

    this.materiaService
      .getMaterie()
      .subscribe({
        next: materie => {

          this.materie = materie;
          this.caricamentoMaterie = false;
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il caricamento delle materie.';

          this.caricamentoMaterie = false;
        }
      });
  }

  cambiaMateria(): void {

    this.tutorDisponibili = [];
    this.idTutorSelezionato = undefined;
    this.erroreMsg = '';
    this.successoMsg = '';

    if (this.idMateriaSelezionata === undefined) {
      return;
    }

    this.caricamentoTutor = true;

    this.competenzaService
      .getTutorByMateria(
        this.idMateriaSelezionata
      )
      .subscribe({
        next: tutor => {

          this.tutorDisponibili = tutor.filter(
            competenza =>
              competenza.utente?.idUtente !==
              this.utenteLoggato?.idUtente
          );

          this.caricamentoTutor = false;
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante il caricamento dei tutor.';

          this.caricamentoTutor = false;
        }
      });
  }

  inviaRichiesta(): void {

    this.erroreMsg = '';
    this.successoMsg = '';

    if (
      this.utenteLoggato === null ||
      this.utenteLoggato.idUtente === undefined
    ) {
      this.erroreMsg = 'Utente non autenticato.';
      return;
    }

    if (this.idMateriaSelezionata === undefined) {
      this.erroreMsg = 'Seleziona una materia.';
      return;
    }

    if (this.idTutorSelezionato === undefined) {
      this.erroreMsg = 'Seleziona un tutor.';
      return;
    }

    if (!this.messaggio.trim()) {
      this.erroreMsg = 'Inserisci un messaggio.';
      return;
    }

    const richiesta: Richiesta = {
      messaggio: this.messaggio.trim(),
      idRichiedente: this.utenteLoggato.idUtente,
      idTutor: this.idTutorSelezionato,
      idMateria: this.idMateriaSelezionata
    };

    this.invioInCorso = true;

    this.richiestaService
      .creaRichiesta(richiesta)
      .subscribe({
        next: () => {

          this.invioInCorso = false;

          this.successoMsg =
            'Richiesta inviata correttamente.';

          setTimeout(() => {
            this.router.navigate(['/richieste']);
          }, 700);
        },

        error: errore => {

          console.error(errore);

          this.invioInCorso = false;

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante l’invio della richiesta.';
        }
      });
  }
}