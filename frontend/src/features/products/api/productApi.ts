import { apiRequest } from '../../../app/apiClient';
import type { AddProductRequest, RepayLoanRequest } from '../types/product.types';

export async function addProductRequest(token: string, payload: AddProductRequest) {
  return apiRequest<string>('/api/products', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productCategory: payload.productCategory,
      productName: payload.productName,
      currency: payload.currency,
      productType: payload.productType,
      creditLimit: payload.creditLimit ?? null,
      initialBalance: payload.initialBalance ?? null,
    }),
  });
}

export async function repayLoanRequest(token: string, loanId: string, payload: RepayLoanRequest) {
  return apiRequest<string>(`/api/products/${loanId}/repay`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sourceProductId: payload.sourceProductId,
      amount: payload.amount,
      currency: payload.currency,
      title: payload.title,
    }),
  });
}
