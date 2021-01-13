import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Board} from '../models/board.model';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor() {
  }

  newTask = '';

  board: Board = {
    name: 'Test',
    columns: [
      {
        name: 'TODO',
        tasks: ['test1'],
      },
      {
        name: 'WIP',
        tasks: ['test2'],
      },
      {
        name: 'DONE',
        tasks: ['test3'],
      }
    ]
  };

  newColumnName = '';

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  addNewTask(newTask: string): void {
    if (newTask.length > 0) {
      this.board.columns[0].tasks.push(newTask);
    }
    this.newTask = '';
  }

  addNewColumn(): void {
    if (this.newColumnName.length > 0) {
      this.board.columns.push(
        {
          name: this.newColumnName,
          tasks: [],
        }
      );
    }
    this.newColumnName = '';
  }

  deleteTask(item: string): void {
    for (const col of this.board.columns){
      for (const task of col.tasks) {
        if (item === task){
          col.tasks.splice(col.tasks.indexOf(item), 1);
        }
      }
    }
  }

  deleteColumn(columnName: string): void {
    for (const col of this.board.columns){
        if (col.name === columnName){
          this.board.columns.splice(this.board.columns.indexOf(col), 1);
        }
    }
  }
}
