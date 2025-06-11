// import React from "react";

const Statistical = () => {
  const statistics = [
    { value: "15K+", label: "Happy Customers" },
    { value: "50K+", label: "Orders Completed" },
    { value: "24/7", label: "Customer Support" },
    { value: "98%", label: "Satisfaction Rate" },
  ];
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistical;
