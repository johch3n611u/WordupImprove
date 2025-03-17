import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floor',
})
export class MathFloorPipe implements PipeTransform {

  constructor(
  ) { }

  transform(value: number): number {
    return Math.floor(value);
  }
}

