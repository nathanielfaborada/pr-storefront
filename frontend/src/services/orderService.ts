import { apiClient } from './apiClient.ts';
import { OrderPayload } from '../types/index.ts';

export const orderService = {
  async createOrder(payload: any): Promise<OrderPayload | null> {
    const res = await apiClient.post<OrderPayload>('/api/orders', payload);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  async getOrderById(orderId: string): Promise<OrderPayload | null> {
    const res = await apiClient.get<OrderPayload>(`/api/orders/${orderId}`);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },
};
