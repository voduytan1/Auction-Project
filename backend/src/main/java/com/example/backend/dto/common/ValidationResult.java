package com.example.backend.dto.common;

/**
 * Represents the result of a validation operation
 * This class encapsulates the validation status and any error message
 */
public class ValidationResult {
    private final boolean valid;
    private final String errorMessage;

    private ValidationResult(boolean valid, String errorMessage) {
        this.valid = valid;
        this.errorMessage = errorMessage;
    }

    /**
     * Creates a successful validation result
     * @return ValidationResult indicating success
     */
    public static ValidationResult success() {
        return new ValidationResult(true, null);
    }

    /**
     * Creates a failed validation result with error message
     * @param message the error message
     * @return ValidationResult indicating failure with error message
     */
    public static ValidationResult error(String message) {
        return new ValidationResult(false, message);
    }

    /**
     * Checks if the validation was successful
     * @return true if validation passed, false otherwise
     */
    public boolean isValid() {
        return valid;
    }

    /**
     * Gets the error message if validation failed
     * @return error message or null if validation was successful
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * Checks if there is an error message
     * @return true if there is an error message, false otherwise
     */
    public boolean hasErrorMessage() {
        return errorMessage != null && !errorMessage.trim().isEmpty();
    }

    @Override
    public String toString() {
        return "ValidationResult{" +
                "valid=" + valid +
                ", errorMessage='" + errorMessage + '\'' +
                '}';
    }
}
