import { Component, OnInit } from '@angular/core';
import { State } from '../models/State';
import { PlayerService } from '../services/player.service';
import { SolveAction } from '../models/SolveAction';
import { Direction } from '../models/Direction.enum';
import { AlertifyService } from '../services/Alertify/Alertify.service';

@Component({
  selector: 'app-player-desk',
  templateUrl: './player-desk.component.html',
  styleUrls: ['./player-desk.component.css']
})
export class PlayerDeskComponent implements OnInit {

state: number[][];
shufflerCount = 1;
solveInstructions: SolveAction[];
delay = 1;
steps = 0;
readyToPlay = false; // false - create game or nothing || game was played, true - have solveInstruction
constructor(private player: PlayerService, private alertify: AlertifyService) { }
  ngOnInit() {
  }

  createGame() {
    this.player.getShuffler(this.shufflerCount)
    .subscribe(res => {
      this.state = res;
      this.alertify.success('Game was created');
      this.steps = 0;
    });
    this.readyToPlay = false;
  }

solveGame() {
  if (this.readyToPlay) {
    for (let step = 0; step < this.solveInstructions.length; step++ ) {
      setTimeout(() => {
        this.solveGameByStep(step);
        if (step + 1 === this.solveInstructions.length) {
          this.alertify.success('Game is finished');
        }
      }, (step * this.delay) * 1000);
    }
    this.readyToPlay = false;
  } else {
    this.alertify.error('Create new game or fetch solve!');
  }
}

solveGameByStep(step: number) {
  const a = this.solveInstructions[step];
  const index = this.findIndex(a.number);
  let seconIndex;
  switch (a.course) {
        case Direction.Up: {
          seconIndex = {i: index.i - 1, j: index.j};
          break;
        }
        case Direction.Down: {
          seconIndex = {i: index.i + 1, j: index.j};
          break;
        }
        case Direction.Left: {
          seconIndex = {i: index.i, j: index.j - 1};
          break;
        }
        case Direction.Right: {
          seconIndex = {i: index.i, j: index.j + 1};
          break;
        }
      }
  const temp = this.state[index.i][index.j];
  this.state[index.i][index.j] = this.state[seconIndex.i][seconIndex.j];
  this.state[seconIndex.i][seconIndex.j] = temp;
  this.alertify.success(this.getFormatStringOfStep(a));
  --this.steps;
  }

getSolutions() {
  this.player.getSolverInstructions(this.state)
    .subscribe(res => {
      this.solveInstructions = res;
      this.readyToPlay = true;
      this.steps = res.length;
      this.alertify.success('Solver instructions was download');
    });
}

getFormatStringOfStep(step: SolveAction): string {
  let str = step.number.toString();
  switch (step.course) {
    case Direction.Up: {
      str += ' ↑';
      break;
    }
    case Direction.Down: {
      str += ' ↓';
      break;
    }
    case Direction.Left: {
      str += ' ←';
      break;
    }
    case Direction.Right: {
      str += ' →';
      break;
    }
  }
  return str;
}

sleep(milliseconds: number) {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

findIndex(num: any) {
  let i = 0;
  for (const arr of this.state) {
    let j = 0;
    for ( const item of arr) {
        if (num === item) {
          return {i, j};
        }
        j++;
      }
    i++;
    }
  }
}
