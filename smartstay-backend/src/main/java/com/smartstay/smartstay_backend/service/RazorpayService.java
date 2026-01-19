package com.smartstay.smartstay_backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class RazorpayService {

    @Value("${razorpay.keyId}")
    private String keyId;

    @Value("${razorpay.keySecret}")
    private String keySecret;

    // Create Razorpay Order
    public Order createOrder(double amount, String receipt) throws Exception {

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject request = new JSONObject();
        request.put("amount", (int) (amount * 100)); // in paise
        request.put("currency", "INR");
        request.put("receipt", receipt);

        return client.orders.create(request);
    }

    //  CORRECT Razorpay Signature Verification
    public boolean verifySignature(String orderId, String paymentId, String razorpaySignature) {
        try {
            String payload = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(keySecret.getBytes(), "HmacSHA256");
            mac.init(secretKey);

            byte[] hash = mac.doFinal(payload.getBytes());

            // Convert to HEX string (Razorpay expects hex)
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                String s = Integer.toHexString(0xff & b);
                if (s.length() == 1) hex.append('0');
                hex.append(s);
            }

            String generatedSignature = hex.toString();

            System.out.println("Generated Signature = " + generatedSignature);
            System.out.println("Razorpay Signature = " + razorpaySignature);

            return generatedSignature.equals(razorpaySignature);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
