import { Utente } from './utente';
import { Materia } from './materia';

export interface Competenza {
  idCompetenza?: number;

  livello: 'BASE' | 'INTERMEDIO' | 'AVANZATO';
  descrizione?: string;

  utente?: Utente;
  materia?: Materia;

  idUtente?: number;
  idMateria?: number;
}