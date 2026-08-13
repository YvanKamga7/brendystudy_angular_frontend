import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Utente } from '../models/utente';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private readonly apiUrl = '/api';

  private readonly storageKey =
    'brendystudy_utente';

  constructor(
    private http: HttpClient
  ) {}

  login(
    username: string,
    password: string
  ): Observable<Utente> {

    return this.http
      .post<Utente>(
        `${this.apiUrl}/login`,
        {
          username,
          password
        }
      )
      .pipe(
        tap(utente => {
          localStorage.setItem(
            this.storageKey,
            JSON.stringify(utente)
          );
        })
      );
  }

  registrazione(
    utente: Utente
  ): Observable<Utente> {

    return this.http.post<Utente>(
      `${this.apiUrl}/utenti`,
      utente
    );
  }

  getUtenti(): Observable<Utente[]> {

    return this.http.get<Utente[]>(
      `${this.apiUrl}/utenti`
    );
  }

  getUtenteLoggato(): Utente | null {

    const dati =
      localStorage.getItem(this.storageKey);

    if (!dati) {
      return null;
    }

    try {
      return JSON.parse(dati) as Utente;
    } catch {

      localStorage.removeItem(
        this.storageKey
      );

      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getUtenteLoggato() !== null;
  }

  isAdmin(): boolean {
    return this.getUtenteLoggato()?.ruolo === 'ADMIN';
  }

  logout(): void {

    localStorage.removeItem(
      this.storageKey
    );
  }

  bloccaUtente(
    idUtente: number
  ): Observable<{ blocked: boolean }> {

    return this.http.put<{ blocked: boolean }>(
      `${this.apiUrl}/utenti/${idUtente}/blocco`,
      {}
    );
  }

  sbloccaUtente(
    idUtente: number
  ): Observable<{ unblocked: boolean }> {

    return this.http.put<{ unblocked: boolean }>(
      `${this.apiUrl}/utenti/${idUtente}/sblocco`,
      {}
    );
  }
}