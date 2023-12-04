export interface WrapOrderInterface {
  wrapOrder(order: any, taker?: string): any;
  wrapOrders(order: any[], taker?: string): any[];
}

export function getMarketSourceByName(name: string) {
  if (!name) throw new Error('empty');
  if (name.indexOf('seaport') === 0) {
    return 'opensea';
  } else if (name.indexOf('looksrare') === 0) {
    return 'looksrare';
  }
  return name;
}
