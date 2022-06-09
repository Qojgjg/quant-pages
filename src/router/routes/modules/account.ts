import { DEFAULT_LAYOUT } from '@/router/constans';
import { RouteMeta } from 'vue-router';

export default [
  {
    path: '/account',
    name: 'account-list',
    component: DEFAULT_LAYOUT,
    meta: {
      locale: '账号列表',
      requiresAuth: true,
      icon: 'icon-user-group',
      order: 2,
      noAffix: true,
    } as RouteMeta,
    children: [
      {
        path: 'exchange-account-list',
        name: 'ExchangeAccountList',
        component: () =>
          import('@/views/account-list/exchange-account/index.vue'),
        meta: {
          locale: '监听账号',
          requiresAuth: true,
          roles: ['*'],
        } as RouteMeta,
      },
      {
        path: 'trade-account-list',
        name: 'TradeAccountList',
        component: () => import('@/views/account-list/trade-account/index.vue'),
        meta: {
          locale: '交易账号',
          requiresAuth: true,
          roles: ['*'],
        } as RouteMeta,
      },
      {
        path: 'trade-account/edit/:id(\\d+)?',
        name: 'EditTradeAccount',
        component: () => import('@/views/account-list/trade-account/edit.vue'),
        meta: {
          locale: '编辑交易账号',
          requiresAuth: true,
          roles: ['*'],
          hideInMenu: true,
        } as RouteMeta,
      },
      {
        path: 'trade-account/overview/:id',
        name: 'TradeAccountDataOverview',
        component: () =>
          import('@/views/account-list/trade-account/date-perview.vue'),
        meta: {
          locale: '统计数据',
          requiresAuth: true,
          roles: ['*'],
          hideInMenu: true,
        },
      },
    ],
  },
];
