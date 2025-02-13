import React from "react";
import { MapPin, Phone, Clock, ChevronDown } from "lucide-react";

const Location = () => {
  const [expandedLocation, setExpandedLocation] = React.useState(null);

  const locations = [
    {
      id: 1,
      area: "Downtown Manhattan",
      address: "123 Broadway Street, New York, NY 10013",
      phone: "(212) 555-0123",
      email: "downtown@laundryservice.com",
      hours: {
        weekday: "7:00 AM - 9:00 PM",
        weekend: "8:00 AM - 7:00 PM",
      },
      serviceAreas: [
        "Financial District",
        "Tribeca",
        "Lower Manhattan",
        "Chinatown",
        "Little Italy",
      ],
      specialServices: [
        "24/7 Dropbox Available",
        "Express Service",
        "Corporate Accounts",
        "Wedding Dress Preservation",
      ],
    },
    {
      id: 2,
      area: "Upper East Side",
      address: "456 East 86th Street, New York, NY 10028",
      phone: "(212) 555-0456",
      email: "ues@laundryservice.com",
      hours: {
        weekday: "6:30 AM - 8:00 PM",
        weekend: "8:00 AM - 6:00 PM",
      },
      serviceAreas: [
        "Yorkville",
        "Lenox Hill",
        "Carnegie Hill",
        "Upper East Side",
      ],
      specialServices: [
        "High-End Designer Care",
        "Same-Day Service",
        "Eco-Friendly Cleaning",
        "Home Decor Cleaning",
      ],
    },
    {
      id: 3,
      area: "Brooklyn Heights",
      address: "789 Atlantic Avenue, Brooklyn, NY 11201",
      phone: "(718) 555-0789",
      email: "brooklyn@laundryservice.com",
      hours: {
        weekday: "7:00 AM - 8:00 PM",
        weekend: "9:00 AM - 6:00 PM",
      },
      serviceAreas: [
        "DUMBO",
        "Brooklyn Heights",
        "Cobble Hill",
        "Boerum Hill",
        "Downtown Brooklyn",
      ],
      specialServices: [
        "Organic Cleaning",
        "Pickup & Delivery",
        "Wash & Fold",
        "Alterations & Repairs",
      ],
    },
  ];

  const toggleLocation = (locationId) => {
    setExpandedLocation(expandedLocation === locationId ? null : locationId);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Our Service Locations</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find your nearest laundry service location. We offer convenient pickup
          and delivery services throughout these areas with specialized services
          at each location.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <div
              className="p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleLocation(location.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold">{location.area}</h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200
                    ${
                      expandedLocation === location.id
                        ? "transform rotate-180"
                        : ""
                    }`}
                />
              </div>

              <p className="mt-2 text-gray-600">{location.address}</p>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Mon-Fri: {location.hours.weekday}</span>
                </div>
              </div>
            </div>

            {expandedLocation === location.id && (
              <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Service Areas</h3>
                    <ul className="space-y-2">
                      {location.serviceAreas.map((area) => (
                        <li key={area} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Special Services</h3>
                    <ul className="space-y-2">
                      {location.specialServices.map((service) => (
                        <li key={service} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-3">Hours of Operation</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Weekdays</p>
                        <p className="text-gray-600">
                          {location.hours.weekday}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Weekends</p>
                        <p className="text-gray-600">
                          {location.hours.weekend}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Location;
