import api from "./api";
import type { Transaction } from "@/types/transaction";

// Payment request/response types
export interface CreatePaymentRequest {
  transactionId: number;
  paymentMethod: "momo" | "zalopay" | "vnpay" | "stripe" | "paypal";
  amount: number;
  returnUrl: string;
  cancelUrl: string;
}

export interface CreatePaymentResponse {
  paymentUrl: string; // URL to redirect user to payment gateway
  transactionId: number;
  orderId: string; // Provider's order ID
}

export interface PaymentCallbackParams {
  transactionId: number;
  status: "success" | "failed" | "cancelled";
  providerTransactionId?: string;
  [key: string]: unknown; // Other provider-specific params
}

export interface VerifyPaymentResponse {
  transaction: Transaction;
  paymentStatus: "success" | "failed" | "cancelled";
  message: string;
}

export interface StripePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

/**
 * Payment API Service
 * Connect to backend payment endpoints
 */
export const paymentAPI = {
  /**
   * Create payment request and get payment URL from provider
   * Backend will:
   * 1. Create payment request with provider (MoMo/ZaloPay/VNPay/etc)
   * 2. Return payment URL for redirection
   */
  createPayment: async (
    data: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> => {
    const response = await api.post<CreatePaymentResponse>(
      "/api/payment/create",
      data
    );
    return response.data;
  },

  /**
   * Verify payment status after callback from provider
   * Backend will:
   * 1. Verify payment signature from provider
   * 2. Update transaction status
   * 3. Return updated transaction
   */
  verifyPayment: async (
    params: PaymentCallbackParams
  ): Promise<VerifyPaymentResponse> => {
    const response = await api.post<VerifyPaymentResponse>(
      "/api/payment/verify",
      params
    );
    return response.data;
  },

  /**
   * Get payment status for a transaction
   */
  getPaymentStatus: async (
    transactionId: number
  ): Promise<{
    status: string;
    transaction: Transaction;
  }> => {
    const response = await api.get<{
      status: string;
      transaction: Transaction;
    }>(`/api/payment/status/${transactionId}`);
    return response.data;
  },

  /**
   * Create Stripe Payment Intent
   * Specific for Stripe payment method
   */
  createStripePaymentIntent: async (data: {
    transactionId: number;
    amount: number;
  }): Promise<StripePaymentIntentResponse> => {
    const response = await api.post<StripePaymentIntentResponse>(
      "/api/payment/stripe/create-intent",
      data
    );
    return response.data;
  },

  /**
   * Create Stripe Checkout Session
   * Táº¡o phiÃªn thanh toÃ¡n Stripe Checkout (theo backend hiá»‡n táº¡i)
   */
  createStripeCheckoutSession: async (
    transactionId: number
  ): Promise<{ url: string }> => {
    const response = await api.post<{ url: string }>(
      "/payment/create-checkout-session",
      transactionId,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
};
