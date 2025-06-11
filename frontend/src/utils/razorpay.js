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

export const initiatePayment = (options) => {
    return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay(options);
        rzp.on('razorpay_payment_failed', (response) => {
            console.error('Payment failed:', response.error);
            reject(new Error(response.error.description || 'Payment failed'));
        });
        rzp.open();
    });
};