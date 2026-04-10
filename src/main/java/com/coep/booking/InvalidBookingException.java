package com.coep.booking;

public class InvalidBookingException extends RuntimeException {
    public InvalidBookingException(String msg) {
        super(msg);
    }
}
