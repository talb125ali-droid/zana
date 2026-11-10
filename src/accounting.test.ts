import test from 'node:test';
import assert from 'node:assert/strict';

// Core business logic functions mirroring PHP functions
function calculateGrossProfit(netSales: number, cogs: number): number {
  return Math.round((netSales - cogs) * 100) / 100;
}

function calculateNetProfit(grossProfit: number, operatingExpenses: number): number {
  return Math.round((grossProfit - operatingExpenses) * 100) / 100;
}

function usdToIqd(usdAmount: number, rate: number = 1530): number {
  return Math.round(usdAmount * rate);
}

function iqdToUsd(iqdAmount: number, rate: number = 1530): number {
  if (rate <= 0) return 0;
  return Math.round((iqdAmount / rate) * 100) / 100;
}

function generateUniqueBarcode(prefix: string = 'ZN'): string {
  return `${prefix}${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
}

test('Gross Profit calculation: Net Sales minus COGS', () => {
  const sales = 15000000;
  const cogs = 9500000;
  const grossProfit = calculateGrossProfit(sales, cogs);
  assert.equal(grossProfit, 5500000);
});

test('Net Profit calculation: Gross Profit minus Operating Expenses', () => {
  const grossProfit = 5500000;
  const expenses = 2200000;
  const netProfit = calculateNetProfit(grossProfit, expenses);
  assert.equal(netProfit, 3300000);
});

test('Multi-currency conversion: USD to IQD at 1530 exchange rate', () => {
  const usd = 100;
  const iqd = usdToIqd(usd, 1530);
  assert.equal(iqd, 153000);
});

test('Multi-currency conversion: IQD to USD at 1530 exchange rate', () => {
  const iqd = 153000;
  const usd = iqdToUsd(iqd, 1530);
  assert.equal(usd, 100);
});

test('Barcode generation creates unique non-empty string with prefix', () => {
  const b1 = generateUniqueBarcode('ZN');
  const b2 = generateUniqueBarcode('ZN');
  assert.ok(b1.startsWith('ZN'));
  assert.ok(b2.startsWith('ZN'));
  assert.notEqual(b1, b2);
});
