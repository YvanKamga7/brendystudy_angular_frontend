import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Materia } from '../models/materia';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  private readonly apiUrl = '/api';

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Recupera tutte le materie.
   */
  getMaterie(): Observable<Materia[]> {

    return this.http.get<Materia[]>(
      `${this.apiUrl}/materie`
    );
  }

  /**
   * Crea una nuova materia.
   * Questa operazione sarà utilizzata dall'ADMIN.
   */
  creaMateria(
    materia: Materia
  ): Observable<Materia> {

    return this.http.post<Materia>(
      `${this.apiUrl}/materie`,
      materia
    );
  }

  /**
   * Elimina una materia.
   * Questa operazione sarà utilizzata dall'ADMIN.
   */
  eliminaMateria(
    idMateria: number
  ): Observable<{ deleted: boolean }> {

    return this.http.delete<{ deleted: boolean }>(
      `${this.apiUrl}/materie/${idMateria}`
    );
  }
}