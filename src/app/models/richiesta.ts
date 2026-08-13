import { Utente } from './utente';
import { Materia } from './materia';

export interface Richiesta {
  idRichiesta?: number;

  dataRichiesta?: string;
  messaggio: string;

  stato?:
    | 'IN_ATTESA'
    | 'ACCETTATA'
    | 'RIFIUTATA'
    | 'COMPLETATA';

  richiedente?: Utente;
  tutor?: Utente;
  materia?: Materia;

  idRichiedente?: number;
  idTutor?: number;
  idMateria?: number;
}