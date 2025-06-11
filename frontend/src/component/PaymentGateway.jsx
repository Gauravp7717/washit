const PaymentGateway = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Payment Gateway updated</h2>

      {/* Products Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {/* {products.map((product, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="mt-2 font-semibold text-center">{product.name}</h3>
          </div>
        ))} */}
      </div>

      {/* Payment Options */}
      <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <img src="/visa.png" alt="Visa" className="h-12" />
          <img src="/upi.png" alt="UPI" className="h-12" />
          <img src="/phonepe.png" alt="PhonePe" className="h-12" />
          <img src="/gpay.png" alt="GPay" className="h-12" />
        </div>
        <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;
