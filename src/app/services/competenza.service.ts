import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Competenza } from '../models/competenza';

@Injectable({
  providedIn: 'root'
})
export class CompetenzaService {

  private readonly apiUrl = '/api';

  constructor(
    private http: HttpClient
  ) {}

  getCompetenzeUtente(
    idUtente: number
  ): Observable<Competenza[]> {

    return this.http.get<Competenza[]>(
      `${this.apiUrl}/utenti/${idUtente}/competenze`
    );
  }

  getTutorByMateria(
    idMateria: number
  ): Observable<Competenza[]> {

    return this.http.get<Competenza[]>(
      `${this.apiUrl}/materie/${idMateria}/tutor`
    );
  }

  aggiungiCompetenza(
    competenza: Competenza
  ): Observable<Competenza> {

    return this.http.post<Competenza>(
      `${this.apiUrl}/competenze`,
      competenza
    );
  }

  modificaCompetenza(
    competenza: Competenza
  ): Observable<{ updated: boolean }> {

    if (competenza.idCompetenza === undefined) {
      throw new Error(
        'idCompetenza mancante'
      );
    }

    return this.http.put<{ updated: boolean }>(
      `${this.apiUrl}/competenze/${competenza.idCompetenza}`,
      competenza
    );
  }

  eliminaCompetenza(
    idCompetenza: number,
    idUtente: number
  ): Observable<{ deleted: boolean }> {

    return this.http.request<{ deleted: boolean }>(
      'DELETE',
      `${this.apiUrl}/competenze/${idCompetenza}`,
      {
        body: {
          idUtente
        }
      }
    );
  }
}