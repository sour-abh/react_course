/**
 * Centralized error handling utility
 * Provides consistent error logging and user notification system
 */

class ErrorHandler {
    constructor() {
        this.toasts = [];
        this.listeners = [];
    }

    /**
     * Log error with detailed context information
     * @param {string} context - The context where error occurred (e.g., "AuthService::login")
     * @param {Error} error - The error object
     * @param {Object} additionalData - Additional context data
     */
    logError(context, error, additionalData = {}) {
        const errorLog = {
            context,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            ...additionalData
        };

        console.error(`${context} :: error`, errorLog);
        
        // In production, you might want to send this to an error monitoring service
        // this.sendToErrorMonitoring(errorLog);
        
        return errorLog;
    }

    /**
     * Log warning with context information
     * @param {string} context - The context where warning occurred
     * @param {string} message - Warning message
     * @param {Object} additionalData - Additional context data
     */
    logWarning(context, message, additionalData = {}) {
        const warningLog = {
            context,
            message,
            timestamp: new Date().toISOString(),
            ...additionalData
        };

        console.warn(`${context} :: warning`, warningLog);
        return warningLog;
    }

    /**
     * Log info with context information
     * @param {string} context - The context where info is logged
     * @param {string} message - Info message
     * @param {Object} additionalData - Additional context data
     */
    logInfo(context, message, additionalData = {}) {
        const infoLog = {
            context,
            message,
            timestamp: new Date().toISOString(),
            ...additionalData
        };

        console.log(`${context} :: info`, infoLog);
        return infoLog;
    }

    /**
     * Add a toast notification
     * @param {string} type - Type of toast ('error', 'success', 'warning', 'info')
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (default: 5000)
     */
    addToast(type, message, duration = 5000) {
        const toast = {
            id: Date.now() + Math.random(),
            type,
            message,
            duration,
            timestamp: new Date().toISOString()
        };

        this.toasts.push(toast);
        this.notifyListeners();

        // Auto-remove toast after duration
        setTimeout(() => {
            this.removeToast(toast.id);
        }, duration);

        return toast.id;
    }

    /**
     * Remove a toast notification
     * @param {string} toastId - ID of toast to remove
     */
    removeToast(toastId) {
        this.toasts = this.toasts.filter(toast => toast.id !== toastId);
        this.notifyListeners();
    }

    /**
     * Get all current toasts
     */
    getToasts() {
        return [...this.toasts];
    }

    /**
     * Add a listener for toast changes
     * @param {Function} listener - Function to call when toasts change
     */
    addToastListener(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify all listeners of toast changes
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.getToasts()));
    }

    /**
     * Handle and display an error with toast notification
     * @param {string} context - Context where error occurred
     * @param {Error} error - Error object
     * @param {Object} additionalData - Additional context data
     * @param {string} userMessage - User-friendly message (optional)
     * @returns {Object} Error log object
     */
    handleError(context, error, additionalData = {}, userMessage = null) {
        const errorLog = this.logError(context, error, additionalData);
        
        const toastMessage = userMessage || 
            `An error occurred: ${error.message}` ||
            'An unexpected error occurred. Please try again.';
            
        this.addToast('error', toastMessage);
        
        return errorLog;
    }

    /**
     * Handle and display a success message
     * @param {string} context - Context where success occurred
     * @param {string} message - Success message
     * @param {Object} additionalData - Additional context data
     */
    handleSuccess(context, message, additionalData = {}) {
        this.logInfo(context, message, additionalData);
        this.addToast('success', message);
    }

    /**
     * Handle and display a warning
     * @param {string} context - Context where warning occurred
     * @param {string} message - Warning message
     * @param {Object} additionalData - Additional context data
     */
    handleWarning(context, message, additionalData = {}) {
        this.logWarning(context, message, additionalData);
        this.addToast('warning', message);
    }

    /**
     * Create an enhanced error with context
     * @param {string} message - Error message
     * @param {string} context - Context where error occurred
     * @param {Object} additionalData - Additional context data
     */
    createError(message, context, additionalData = {}) {
        const error = new Error(message);
        error.context = context;
        error.additionalData = additionalData;
        error.timestamp = new Date().toISOString();
        return error;
    }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;

// Helper functions for common operations
export const logError = (context, error, additionalData) => 
    errorHandler.logError(context, error, additionalData);

export const logWarning = (context, message, additionalData) => 
    errorHandler.logWarning(context, message, additionalData);

export const logInfo = (context, message, additionalData) => 
    errorHandler.logInfo(context, message, additionalData);

export const handleError = (context, error, additionalData, userMessage) => 
    errorHandler.handleError(context, error, additionalData, userMessage);

export const handleSuccess = (context, message, additionalData) => 
    errorHandler.handleSuccess(context, message, additionalData);

export const handleWarning = (context, message, additionalData) => 
    errorHandler.handleWarning(context, message, additionalData);

export const addToast = (type, message, duration) => 
    errorHandler.addToast(type, message, duration);

export const createError = (message, context, additionalData) => 
    errorHandler.createError(message, context, additionalData);
