export interface Utente {
  idUtente?: number;
  nome: string;
  cognome: string;
  email: string;
  username: string;
  password: string;
  ruolo?: 'STUDENTE' | 'ADMIN';
  stato?: 'ATTIVO' | 'BLOCCATO';
}