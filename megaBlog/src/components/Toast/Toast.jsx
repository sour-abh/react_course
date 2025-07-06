import React, { useState, useEffect } from 'react';
import errorHandler from '../../utils/errorHandler';

const Toast = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(true);

    const getToastStyles = (type) => {
        const baseStyles = "fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 max-w-md";
        
        switch (type) {
            case 'error':
                return `${baseStyles} bg-red-500 text-white border-l-4 border-red-700`;
            case 'success':
                return `${baseStyles} bg-green-500 text-white border-l-4 border-green-700`;
            case 'warning':
                return `${baseStyles} bg-yellow-500 text-white border-l-4 border-yellow-700`;
            case 'info':
                return `${baseStyles} bg-blue-500 text-white border-l-4 border-blue-700`;
            default:
                return `${baseStyles} bg-gray-500 text-white border-l-4 border-gray-700`;
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'error':
                return (
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case 'success':
                return (
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
    };

    return (
        <div 
            className={`${getToastStyles(toast.type)} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            style={{ top: `${1 + (toast.index || 0) * 5}rem` }}
        >
            <div className="flex items-start">
                {getIcon(toast.type)}
                <div className="flex-1">
                    <p className="text-sm font-medium break-words">{toast.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                        {new Date(toast.timestamp).toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="ml-4 flex-shrink-0 text-white hover:opacity-75 transition-opacity"
                    aria-label="Close notification"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsubscribe = errorHandler.addToastListener((newToasts) => {
            setToasts(newToasts.map((toast, index) => ({ ...toast, index })));
        });

        // Set initial toasts
        setToasts(errorHandler.getToasts().map((toast, index) => ({ ...toast, index })));

        return unsubscribe;
    }, []);

    const handleRemoveToast = (toastId) => {
        errorHandler.removeToast(toastId);
    };

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onRemove={handleRemoveToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
export { Toast };
