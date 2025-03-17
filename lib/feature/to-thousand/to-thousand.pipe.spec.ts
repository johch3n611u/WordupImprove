import { ToThousandPipe } from './to-thousand.pipe';

describe('ToThousandPipe', () => {
  it('create an instance', () => {
    const pipe = new ToThousandPipe();
    expect(pipe).toBeTruthy();
  });
});
