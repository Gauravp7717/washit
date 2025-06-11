// import React from 'react'
import { Star, Quote } from "lucide-react";

const Testimonial = () => {
  const testimonials = [
    {
      name: "John Smith",
      role: "Regular Customer",
      image: "/api/placeholder/80/80",
      comment:
        "Best laundry service I've ever used! The quality is exceptional and delivery is always on time.",
      rating: 5,
    },
    {
      name: "Emily Brown",
      role: "Business Owner",
      image: "/api/placeholder/80/80",
      comment:
        "Their business laundry solutions have transformed how we handle our hotel's laundry needs.",
      rating: 5,
    },
    {
      name: "David Wilson",
      role: "Weekly Customer",
      image: "/api/placeholder/80/80",
      comment:
        "Consistent quality and professional service. Makes my life so much easier!",
      rating: 5,
    },
  ];
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read what our satisfied customers have to say about their experience
            with our services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-blue-100 mb-2" />
              <p className="text-gray-600">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
