package com.example.backend.controller;

import com.example.backend.service.TransactionService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class WebhookController {
    private final TransactionService transactionService;
    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    public WebhookController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/webhook")
    public String handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;

        try {
            // 1. Verify the signature (Security check)
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            return "Invalid signature";
        }

        // 2. Handle the specific event "checkout.session.completed"
        if ("checkout.session.completed".equals(event.getType())) {

            // Deserialize the object inside the event
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

            if (session != null) {
                // 3. Retrieve the custom data you sent in Step 3
                String transactionId = session.getMetadata().get("transactionId");
                String userId = session.getMetadata().get("userId");

                // 4. Update your database
                transactionService.completePayment(Long.parseLong(transactionId));
                // auctionService.finalizePayment(auctionId, userId);
            }
        }

        return "ok";
    }
}
