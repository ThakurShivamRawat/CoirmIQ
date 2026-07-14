package com.coirmiq.ticket.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MockPaymentService {

    public boolean processPayment() {
        log.info("Processing payment... (simulating 1000ms delay)");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Payment processing was interrupted", e);
            return false;
        }
        log.info("Payment processed successfully!");
        return true;
    }

    public void refundPayment() {
        log.info("Initiating automatic refund due to database constraint rollback...");
    }
}
