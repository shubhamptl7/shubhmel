import { percentOf } from "../lib/money";

/*
  Illustrative sample only — invented order IDs and amounts, labelled as
  "Sample data" wherever they appear. The rates mirror a typical settlement
  (commission on order value, 18% GST on commission, a payment-gateway fee,
  0.1% TDS) but are not any real restaurant's agreement.
*/

export const AGREED_COMMISSION_PERCENT = 24;
const GST_ON_COMMISSION_PERCENT = 18;
const GATEWAY_PERCENT = 2;
const TDS_PERCENT = 0.1;

export type Breakdown = {
  orderValue: number;
  commission: number;
  gstOnCommission: number;
  gateway: number;
  tds: number;
  payout: number;
};

export function breakdown(orderValue: number, commissionPercent: number): Breakdown {
  const commission = percentOf(orderValue, commissionPercent);
  const gstOnCommission = percentOf(commission, GST_ON_COMMISSION_PERCENT);
  const gateway = percentOf(orderValue, GATEWAY_PERCENT);
  const tds = percentOf(orderValue, TDS_PERCENT);
  const payout = orderValue - commission - gstOnCommission - gateway - tds;
  return { orderValue, commission, gstOnCommission, gateway, tds, payout };
}

export type SampleOrder = {
  id: string;
  date: string;
  orderValue: number; // paise
  billedCommissionPercent: number;
};

export const SAMPLE_FILE = "zomato_settlement_04-10_Aug.xlsx";

export const SAMPLE_ORDERS: SampleOrder[] = [
  { id: "7408116291", date: "04 Aug", orderValue: 48_600, billedCommissionPercent: 24 },
  { id: "7408231870", date: "04 Aug", orderValue: 124_000, billedCommissionPercent: 24 },
  { id: "7408559012", date: "05 Aug", orderValue: 31_250, billedCommissionPercent: 24 },
  { id: "7409104476", date: "06 Aug", orderValue: 218_000, billedCommissionPercent: 27 },
  { id: "7409388125", date: "07 Aug", orderValue: 75_500, billedCommissionPercent: 24 },
  { id: "7410027763", date: "08 Aug", orderValue: 59_800, billedCommissionPercent: 24 },
];

export type CheckedOrder = SampleOrder & {
  expected: Breakdown; // at the agreed rate
  settled: Breakdown; // as the platform billed it
  difference: number; // expected payout − settled payout, in paise
  needsReview: boolean;
};

export const CHECKED_ORDERS: CheckedOrder[] = SAMPLE_ORDERS.map((order) => {
  const expected = breakdown(order.orderValue, AGREED_COMMISSION_PERCENT);
  const settled = breakdown(order.orderValue, order.billedCommissionPercent);
  const difference = expected.payout - settled.payout;
  return { ...order, expected, settled, difference, needsReview: difference !== 0 };
});

export const SUMMARY = {
  orders: CHECKED_ORDERS.length,
  matched: CHECKED_ORDERS.filter((o) => !o.needsReview).length,
  review: CHECKED_ORDERS.filter((o) => o.needsReview).length,
  settledTotal: CHECKED_ORDERS.reduce((sum, o) => sum + o.settled.payout, 0),
  differenceTotal: CHECKED_ORDERS.reduce((sum, o) => sum + o.difference, 0),
};
