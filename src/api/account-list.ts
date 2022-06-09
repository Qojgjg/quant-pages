import axios from 'axios';
import qs from 'query-string';

export interface ExchangeAccount {
  id?: number;
  apiKey?: string;
  apiSecret?: string;
  nickname?: string;
  apiSremarkecret?: string;
  exchange?: 'Binance';
  accountStatus?: 'Enable' | 'Disable';
  createTime?: string;
  remark?: string;
}

export interface TradeAccount {
  id?: number;
  apiKey?: string;
  apiSecret?: string;
  nickname?: string;
  apiSremarkecret?: string;
  exchange?: 'Binance';
  accountStatus?: 'Enable' | 'Disable';
  createTime?: string;
  factor?: number;
  follow?: { id: number } | number;
  remark?: string;
}

export interface PageParam {
  page: number;
  size: number;
}

export interface PageRes<T> {
  list: T[];
  total: number;
}

declare type ExchangeAccountListParam = PageParam & ExchangeAccount;
declare type TradeAccountListParam = PageParam & TradeAccount;

export function queryExchangeAccountList(params: ExchangeAccountListParam) {
  return axios.get<PageRes<ExchangeAccount>>('/api/exchange-account/page', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryAllExchangeAccount() {
  return axios.get<ExchangeAccount[]>('/api/exchange-account/all');
}

export function queryTradeAccountList(params: TradeAccountListParam) {
  return axios.get<PageRes<TradeAccount>>('/api/trade-account/page', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

declare type QuerySingleTradeAccountParam = {
  id: number;
};

export function querySingleTradeAccount({ id }: QuerySingleTradeAccountParam) {
  return axios.get<TradeAccount>(`/api/trade-account/single/${id}`);
}

declare type QueryExchangeAccountPositionParam = {
  id: number;
};

export function queryExchangeAccountPosition({
  id,
}: QueryExchangeAccountPositionParam) {
  return axios.get<number>(`/api/exchange-account/position/${id}`);
}

declare type QueryTradeAccountPositionParam = {
  apiKey: string;
  apiSecret: string;
};

export function queryTradeAccountPosition(
  param: QueryTradeAccountPositionParam
) {
  return axios.get<number>(
    `/api/trade-account/position/${param.apiKey}/${param.apiSecret}`
  );
}

export function saveTradeAccount(entity: TradeAccount) {
  return axios.post('/api/trade-account/save', entity);
}
