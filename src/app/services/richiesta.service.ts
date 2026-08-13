import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Richiesta } from '../models/richiesta';

@Injectable({
  providedIn: 'root'
})
export class RichiestaService {

  private readonly apiUrl = '/api';

  constructor(
    private http: HttpClient
  ) {}

  getRichieste(): Observable<Richiesta[]> {

    return this.http.get<Richiesta[]>(
      `${this.apiUrl}/richieste`
    );
  }

  getRichiesteUtente(
    idUtente: number
  ): Observable<Richiesta[]> {

    return this.http.get<Richiesta[]>(
      `${this.apiUrl}/utenti/${idUtente}/richieste`
    );
  }

  creaRichiesta(
    richiesta: Richiesta
  ): Observable<Richiesta> {

    return this.http.post<Richiesta>(
      `${this.apiUrl}/richieste`,
      richiesta
    );
  }

  aggiornaStato(
    idRichiesta: number,
    stato:
      | 'IN_ATTESA'
      | 'ACCETTATA'
      | 'RIFIUTATA'
      | 'COMPLETATA'
  ): Observable<{ message: string }> {

    return this.http.put<{ message: string }>(
      `${this.apiUrl}/richieste/${idRichiesta}/stato`,
      {
        stato
      }
    );
  }
}