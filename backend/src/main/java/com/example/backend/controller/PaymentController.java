package com.example.backend.controller;

import com.example.backend.entity.Transaction;
import com.example.backend.service.TransactionService;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    private final String DOMAIN = "http://localhost:5173"; // Or your frontend URL
    private final TransactionService transactionService;

    public PaymentController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(@RequestBody Long transactionId) throws Exception {
        Transaction transaction = transactionService.getOne(transactionId);
        // 1. Create Product Data
        SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("vnd")

                .setUnitAmount(transaction.getGiaCuoiCung().longValue())
                .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName("Auction Deposit: " + transaction.getProduct().getTenSanPham())
                                .build())
                .build();

        // 2. Build the Line Item
        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(priceData)
                .build();

        // 3. Create the Session
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(DOMAIN + "/payment-success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(DOMAIN + "/payment-cancel")
                .addLineItem(lineItem)
                .putMetadata("auctionId", String.valueOf(transactionId))
                .putMetadata("userId", String.valueOf(transaction.getBuyer().getUserid()))
                .build();

        Session session = Session.create(params);

        // 4. Return the URL to the frontend
        Map<String, String> responseData = new HashMap<>();
        responseData.put("url", session.getUrl());
        return responseData;
    }
}
