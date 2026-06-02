import { apiRequest } from '../../../app/apiClient';

export async function repayCreditCard(token: string, cardId: string) {
  return apiRequest<string>(`/api/cards/${cardId}/repayment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
