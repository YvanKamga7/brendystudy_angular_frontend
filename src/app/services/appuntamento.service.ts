import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Appuntamento } from '../models/appuntamento';

@Injectable({
  providedIn: 'root'
})
export class AppuntamentoService {

  private readonly apiUrl = '/api';

  constructor(
    private http: HttpClient
  ) {}

  getAppuntamenti(): Observable<Appuntamento[]> {

    return this.http.get<Appuntamento[]>(
      `${this.apiUrl}/appuntamenti`
    );
  }

  getAppuntamentiUtente(
    idUtente: number
  ): Observable<Appuntamento[]> {

    return this.http.get<Appuntamento[]>(
      `${this.apiUrl}/utenti/${idUtente}/appuntamenti`
    );
  }

  creaAppuntamento(
    appuntamento: Appuntamento
  ): Observable<Appuntamento> {

    return this.http.post<Appuntamento>(
      `${this.apiUrl}/appuntamenti`,
      appuntamento
    );
  }

  annullaAppuntamento(
    idAppuntamento: number
  ): Observable<{ annullato: boolean }> {

    return this.http.put<{ annullato: boolean }>(
      `${this.apiUrl}/appuntamenti/${idAppuntamento}/annulla`,
      {}
    );
  }
}