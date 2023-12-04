export function formatAddress(val: string) {
  if (val.length === 66) {
    return '0x' + val.substring(26);
  }
  return val;
}
