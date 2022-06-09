import axios from 'axios';
import { GeneralChart } from '@/types/global';

export interface RecentTrade {
  commission: number;
  price: number;
  qty: number;
  quoteQty: number;
  realizedPnl: number;
  side: string;
  positionSide: string;
  symbol: string;
  time: string;
}

export interface ValData {
  date: string;
  val: number;
}

export interface PositionData {
  symbol: string;
  qty: number;
}

export interface DataOverviewRes {
  currentBalance: number;
  initAssetsBalance: number;
  totalProfit: number;
  avgProfit: number;
  balanceDataList: {
    date: string;
    initAssetsBalance: number;
    totalAssetsBalance: number;
  }[];
  longPosition: PositionData[];
  shortPosition: PositionData[];
  annuitizationList: ValData[];
  btcPrices: ValData[];
  totalNums: ValData[];
  recentTrades: RecentTrade[];
  profits: ValData[];
}

export interface DataOverviewParam {
  beginDate: string;
  endDate: string;
  accountId: number;
}

export function queryDataOverview({
  beginDate,
  endDate,
  accountId,
}: DataOverviewParam) {
  return axios.get<DataOverviewRes>(
    `/api/trade-account/data/overview?accountId=${accountId}&beginDate=${beginDate}&endDate=${endDate}`
  );
}
