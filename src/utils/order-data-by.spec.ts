import { orderDataBy } from './order-data-by';

describe('orderDataBy', () => {
  it('should order data by the specified property in ascending order', () => {
    const data = [
      { id: 1, value: 10 },
      { id: 2, value: 5 },
      { id: 3, value: 15 },
    ];
    const property = 'value';
    const result = orderDataBy(data, property);
    expect(result).toEqual([
      { id: 2, value: 5 },
      { id: 1, value: 10 },
      { id: 3, value: 15 },
    ]);
  });

  it('should handle an empty array', () => {
    const data: any[] = [];
    const property = 'value';
    const result = orderDataBy(data, property);
    expect(result).toEqual([]);
  });
});
