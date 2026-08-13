import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MateriaService } from '../../services/materia.service';
import { UtenteService } from '../../services/utente.service';

import { Materia } from '../../models/materia';
import { Utente } from '../../models/utente';

@Component({
  selector: 'app-materie',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './materie.component.html',
  styleUrl: './materie.component.scss'
})
export class MaterieComponent implements OnInit {

  materie: Materia[] = [];

  utenteLoggato: Utente | null = null;

  caricamento = true;
  erroreMsg = '';
  successoMsg = '';

  mostraForm = false;

  nuovaMateria: Materia = {
    nome: '',
    descrizione: ''
  };

  constructor(
    private materiaService: MateriaService,
    private utenteService: UtenteService
  ) {}

  ngOnInit(): void {

    this.utenteLoggato =
      this.utenteService.getUtenteLoggato();

    this.caricaMaterie();
  }

  isAdmin(): boolean {

    return this.utenteLoggato?.ruolo === 'ADMIN';
  }

  caricaMaterie(): void {

    this.caricamento = true;
    this.erroreMsg = '';

    this.materiaService
      .getMaterie()
      .subscribe({

        next: materie => {

          this.materie = materie;
          this.caricamento = false;
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            'Impossibile caricare le materie.';

          this.caricamento = false;
        }

      });
  }

  apriForm(): void {

    if (!this.isAdmin()) {
      return;
    }

    this.nuovaMateria = {
      nome: '',
      descrizione: ''
    };

    this.mostraForm = true;
    this.erroreMsg = '';
    this.successoMsg = '';
  }

  annullaForm(): void {

    this.mostraForm = false;

    this.nuovaMateria = {
      nome: '',
      descrizione: ''
    };
  }

  aggiungiMateria(): void {

    this.erroreMsg = '';
    this.successoMsg = '';

    if (!this.isAdmin()) {
      this.erroreMsg =
        'Operazione consentita solo agli amministratori.';
      return;
    }

    if (!this.nuovaMateria.nome.trim()) {
      this.erroreMsg =
        'Inserisci il nome della materia.';
      return;
    }

    const materia: Materia = {
      nome: this.nuovaMateria.nome.trim(),
      descrizione:
        this.nuovaMateria.descrizione?.trim() || ''
    };

    this.materiaService
      .creaMateria(materia)
      .subscribe({

        next: () => {

          this.successoMsg =
            'Materia aggiunta correttamente.';

          this.mostraForm = false;

          this.nuovaMateria = {
            nome: '',
            descrizione: ''
          };

          this.caricaMaterie();
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante la creazione della materia.';
        }

      });
  }

  eliminaMateria(
    materia: Materia
  ): void {

    if (
      !this.isAdmin() ||
      materia.idMateria === undefined
    ) {
      return;
    }

    const conferma = confirm(
      `Vuoi eliminare la materia "${materia.nome}"?`
    );

    if (!conferma) {
      return;
    }

    this.erroreMsg = '';
    this.successoMsg = '';

    this.materiaService
      .eliminaMateria(
        materia.idMateria
      )
      .subscribe({

        next: risposta => {

          if (risposta.deleted) {

            this.successoMsg =
              'Materia eliminata correttamente.';

            this.caricaMaterie();
          }
        },

        error: errore => {

          console.error(errore);

          this.erroreMsg =
            errore.error?.erroreMsg ??
            'Errore durante l’eliminazione della materia.';
        }

      });
  }
}