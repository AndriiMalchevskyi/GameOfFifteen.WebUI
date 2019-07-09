import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { State } from '../models/State';
import { Observable } from 'rxjs';
import { SolveAction } from '../models/SolveAction';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

baseUrl = environment.apiUrl + 'game/';

constructor(private http: HttpClient) { }

getShuffler(count: number): Observable<number[][]> {
  return this.http.get<number[][]>(this.baseUrl + count);
}

getSolverInstructions(data: number[][]): Observable<SolveAction[]> {
  const body = { square: data };
  return this.http.post<SolveAction[]>(this.baseUrl, body);
}

}
