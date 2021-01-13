import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Board} from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) {
  }

  async save(board: Board): Promise<void> {
    const existing = await this.http.get<Board[]>('https://api.mandy-blaschke.de/storage/kanban-demo').toPromise();
    for (const item of existing) {
      await this.http.delete('https://api.mandy-blaschke.de/storage/kanban-demo/' + item.id).toPromise();
    }
    await this.http.post('https://api.mandy-blaschke.de/storage/kanban-demo', board).toPromise();
  }

  async load(): Promise<Board> {
    const existing = await this.http.get<Board[]>('https://api.mandy-blaschke.de/storage/kanban-demo').toPromise();
    if (existing.length > 0) {
      return existing[0];
    } else {
      return null;
    }
  }
}
