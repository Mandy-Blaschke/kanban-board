import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Board} from '../models/board.model';
import {MainService} from './main.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  currentlyChanging = false;

  constructor(private main: MainService) {
  }

  newTask = '';
  newColumnName = '';
  board: Board = {
    name: 'Kanban Board',
    columns: [
      {
        name: 'TODO',
        tasks: [],
      },
      {
        name: 'WIP',
        tasks: [],
      },
      {
        name: 'DONE',
        tasks: [],
      }
    ]
  };

  async ngOnInit(): Promise<void> {
    await this.loadBoard();
    setInterval(() => this.loadBoard(), 1000);
  }

  private async loadBoard(): Promise<void> {
    const board = await this.main.load();
    if (board !== null && !this.currentlyChanging) {
      this.board = board;
    }
  }

  async drop(event: CdkDragDrop<string[]>): Promise<void> {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    await this.main.save(this.board);
  }

  async addNewTask(newTask: string): Promise<void> {
    if (newTask.length > 0) {
      this.board.columns[0].tasks.push(newTask);
      await this.main.save(this.board);
    }
    this.newTask = '';
  }

  async addNewColumn(): Promise<void> {
    if (this.newColumnName.length > 0) {
      this.board.columns.push(
        {
          name: this.newColumnName,
          tasks: [],
        }
      );
      await this.main.save(this.board);
    }
    this.newColumnName = '';
  }

  async deleteTask(item: string): Promise<void> {
    for (const col of this.board.columns) {
      for (const task of col.tasks) {
        if (item === task) {
          col.tasks.splice(col.tasks.indexOf(item), 1);
        }
      }
    }
    await this.main.save(this.board);
  }

  async deleteColumn(columnName: string): Promise<void> {
    for (const col of this.board.columns) {
      if (col.name === columnName) {
        this.board.columns.splice(this.board.columns.indexOf(col), 1);
      }
    }
    await this.main.save(this.board);
  }
}
