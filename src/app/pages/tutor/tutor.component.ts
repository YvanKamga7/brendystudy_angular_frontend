import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MateriaService } from '../../services/materia.service';
import { CompetenzaService } from '../../services/competenza.service';

import { Materia } from '../../models/materia';
import { Competenza } from '../../models/competenza';

@Component({
  selector: 'app-tutor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tutor.component.html',
  styleUrl: './tutor.component.scss'
})
export class TutorComponent implements OnInit {

  materie: Materia[] = [];
  tutor: Competenza[] = [];

  materiaSelezionata?: number;

  caricamentoMaterie = true;
  caricamentoTutor = false;

  erroreMsg = '';

  constructor(
    private materiaService: MateriaService,
    private competenzaService: CompetenzaService
  ) {}

  ngOnInit(): void {
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

  cercaTutor(): void {

    if (this.materiaSelezionata === undefined) {
      this.tutor = [];
      return;
    }

    this.caricamentoTutor = true;
    this.erroreMsg = '';
    this.tutor = [];

    this.competenzaService
      .getTutorByMateria(this.materiaSelezionata)
      .subscribe({
        next: tutor => {
          this.tutor = tutor;
          this.caricamentoTutor = false;
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Errore durante la ricerca dei tutor.';

          this.caricamentoTutor = false;
        }
      });
  }
}