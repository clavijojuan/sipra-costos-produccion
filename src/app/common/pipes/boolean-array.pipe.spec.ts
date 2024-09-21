import { BooleanArrayPipe } from './boolean-array.pipe';

describe('BooleanArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new BooleanArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
