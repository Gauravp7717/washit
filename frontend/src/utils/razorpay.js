// src/utils/razorpay.js

// Function to dynamically load the Razorpay SDK script
export const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

// Function to initiate the Razorpay payment process
export const initiatePayment = (options) => {
    return new Promise((resolve, reject) => {
        // Ensure Razorpay object is available
        if (typeof window.Razorpay === 'undefined') {
            console.error("Razorpay SDK not loaded.");
            return reject(new Error("Razorpay SDK not loaded."));
        }

        const rzp = new window.Razorpay(options);

        // Handle payment success
        rzp.on('payment.success', (response) => {
            resolve(response);
        });

        // Handle payment failure
        rzp.on('payment.failed', (response) => {
            console.error("Razorpay Payment Failed:", response);
            reject(new Error(response.error.description || "Payment failed."));
        });

        // Open the Razorpay checkout popup
        rzp.open();
    });
};