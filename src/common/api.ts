import axios, { Axios, AxiosResponse } from 'axios';
import { get_env } from '../constants';

export class BaseAPIClient {
  apiKey?: string;
  apiBaseURL: string;
  httpClient: Axios;
  headers: any = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  constructor(apiBaseURL: string, apiKeyValue?: string, apiKeyName?: string) {
    this.apiBaseURL = apiBaseURL;
    this.apiKey = apiKeyValue ?? '';
    if (apiKeyValue && apiKeyName) {
      this.headers[apiKeyName] = apiKeyValue;
    } else if (apiKeyValue) {
      this.headers['X-API-KEY'] = apiKeyValue;
    }

    const gatewayApiKey = get_env('X-GATEWAY-API-KEY');
    if (gatewayApiKey) {
      this.headers['X-GATEWAY-API-KEY'] = gatewayApiKey;
    }

    // if (typeof process !== 'undefined') {
    //   axios.defaults.adapter = require('axios/lib/adapters/http');
    // }
    this.httpClient = new Axios({
      baseURL: apiBaseURL,
      timeout: 60_000,
    });
  }

  async _get(path: string, params: Record<string, string>) {
    // console.log('_get...', this.apiBaseURL + path, params, this.headers);
    const resp = await this.httpClient.get(path, {
      params,
      headers: this.headers,
    });

    return this._handleResponse(resp);
  }

  async _post<T>(path: string, payload: T) {
    // console.log('_post...', this.apiBaseURL + path, payload, this.headers);
    const resp = await this.httpClient.post(path, JSON.stringify(payload), {
      headers: this.headers,
    });
    return this._handleResponse(resp);
  }

  async _handleResponse(resp: any) {
    if (resp.status >= 300 || resp.status < 200) {
      console.error('response, status:', resp.status, 'path:', resp?.config?.baseURL + resp?.config?.url);
      // console.debug('req config:', resp?.config);
      // console.debug('req data:', resp?.config?.data);
      // console.debug('resp data:', resp?.data);
      throw new Error(resp?.data);
    }
    return JSON.parse(resp.data);
  }
}
