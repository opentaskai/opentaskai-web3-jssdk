import { errmsg } from './error';

export interface Result {
  code: number;
  error: string;
  data: any;
}
export class MakeResult {
  static success(data: any = null): Result {
    return { code: 0, error: 'success', data };
  }

  static fail(error: string = 'fail', data = null): Result {
    return { code: 1, error: 'fail', data };
  }

  static err(code = 1, error = '', data = null): Result {
    if (code <= 0) code = 1;
    if (!error) {
      error = errmsg(code);
    }
    return { code, error, data };
  }
}
