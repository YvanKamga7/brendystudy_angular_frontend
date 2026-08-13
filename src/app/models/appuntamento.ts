import { Richiesta } from './richiesta';

export interface Appuntamento {
  idAppuntamento?: number;
  dataAppuntamento: string;
  oraAppuntamento: string;
  modalita: 'ONLINE' | 'PRESENZA';
  descrizione?: string;
  stato?: 'ATTIVO' | 'ANNULLATO';

  richiesta?: Richiesta;
  idRichiesta?: number;
}