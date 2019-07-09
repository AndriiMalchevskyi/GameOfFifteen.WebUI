import { Component, OnInit } from '@angular/core';
import { State } from '../models/State';
import { PlayerService } from '../services/player.service';
import { SolveAction } from '../models/SolveAction';
import { Direction } from '../models/Direction.enum';

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
readyToPlay = false; // 0-create game or nothing, 1 - have solveInstruction, 2-game was played
constructor(private player: PlayerService) { }
  ngOnInit() {
  }

  createGame() {
    this.player.getShuffler(this.shufflerCount)
    .subscribe(res => {
      this.state = res;
    });
    this.readyToPlay = false;
  }

solveGame() {
  if (this.readyToPlay) {
    for (let step = 0; step < this.solveInstructions.length; step++ ) {
      setTimeout(() => { this.solveGameByStep(step); }, (step * this.delay) * 1000);
    }
    this.readyToPlay = false;
    console.log('Game is finished');
  } else {
    console.log('Create new game or fetch solve!');
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

  }

getSolutions() {
  this.player.getSolverInstructions(this.state)
    .subscribe(res => {
      this.solveInstructions = res;
      this.readyToPlay = true;
      console.log('Solver instructions was download');
    });
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
