import { apiRequest } from '../../../app/apiClient';

export async function repayCashLoanEarly(token: string, productId: string, mainAccountId: string) {
  return apiRequest<string>(`/api/products/${productId}/early-repayment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mainAccountId,
    }),
  });
}
