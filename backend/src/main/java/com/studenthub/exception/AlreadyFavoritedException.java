package com.studenthub.exception;

public class AlreadyFavoritedException extends RuntimeException {
    public AlreadyFavoritedException(String message) {
        super(message);
    }
}
