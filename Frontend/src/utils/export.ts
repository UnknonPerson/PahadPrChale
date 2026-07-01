/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const csvHeaders = headers || Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(csvHeaders.join(','));

  // Add data rows
  for (const row of data) {
    const values = csvHeaders.map((header) => {
      let value = row[header];

      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        value = value.name || value.title || JSON.stringify(value);
      }

      // Handle arrays
      if (Array.isArray(value)) {
        value = value.join('; ');
      }

      // Escape quotes and wrap in quotes if contains comma or newline
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value}"`;
        }
      }

      return value ?? '';
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to JSON format
 */
export const exportToJSON = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for display
 */
const formatDate = (date: string | Date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Export bookings data
 */
export const exportBookings = (bookings: any[], format: 'csv' | 'json' = 'csv') => {
  const data = bookings.map((b) => ({
    BookingID: b._id || b.id,
    CustomerName: b.customerName,
    CustomerEmail: b.customerEmail,
    CustomerPhone: b.customerPhone,
    PackageName: b.packageName,
    Destination: b.destination,
    TravelDate: formatDate(b.travelDate),
    Travelers: b.travelers,
    TotalAmount: b.totalAmount,
    Status: b.status,
    PaymentStatus: b.paymentStatus,
    CreatedAt: formatDate(b.createdAt),
  }));

  if (format === 'csv') {
    exportToCSV(data, 'bookings');
  } else {
    exportToJSON(data, 'bookings');
  }
};

/**
 * Export customers/users data
 */
export const exportCustomers = (customers: any[], format: 'csv' | 'json' = 'csv') => {
  const data = customers.map((c) => ({
    CustomerID: c._id || c.id,
    Name: c.name,
    Email: c.email,
    Phone: c.phone || '',
    Role: c.role || 'user',
    Status: c.status || 'active',
    TotalBookings: c.totalBookings || 0,
    TotalSpent: c.totalSpent || 0,
    JoinedDate: formatDate(c.createdAt || c.joinedDate),
  }));

  if (format === 'csv') {
    exportToCSV(data, 'customers');
  } else {
    exportToJSON(data, 'customers');
  }
};

/**
 * Export packages data
 */
export const exportPackages = (packages: any[], format: 'csv' | 'json' = 'csv') => {
  const data = packages.map((p) => ({
    PackageID: p._id || p.id,
    Name: p.name,
    Destination: p.destination,
    Duration: p.duration,
    Days: p.days,
    Nights: p.nights,
    Price: p.price,
    OriginalPrice: p.originalPrice || '',
    Category: p.category,
    Difficulty: p.difficulty,
    MaxGroup: p.maxGroup,
    Rating: p.rating || 0,
    Featured: p.featured ? 'Yes' : 'No',
    Active: p.isActive !== false ? 'Yes' : 'No',
  }));

  if (format === 'csv') {
    exportToCSV(data, 'packages');
  } else {
    exportToJSON(data, 'packages');
  }
};

/**
 * Export hotels data
 */
export const exportHotels = (hotels: any[], format: 'csv' | 'json' = 'csv') => {
  const data = hotels.map((h) => ({
    HotelID: h._id || h.id,
    Name: h.hotelName || h.name,
    Destination: h.destination?.name || h.destination,
    Category: h.category,
    PricePerNight: h.pricePerNight,
    Rating: h.rating,
    Address: h.address || '',
    ContactNumber: h.contactNumber || '',
    Availability: h.availability ? 'Yes' : 'No',
  }));

  if (format === 'csv') {
    exportToCSV(data, 'hotels');
  } else {
    exportToJSON(data, 'hotels');
  }
};

/**
 * Export vehicles data
 */
export const exportVehicles = (vehicles: any[], format: 'csv' | 'json' = 'csv') => {
  const data = vehicles.map((v) => ({
    VehicleID: v._id || v.id,
    Name: v.vehicleName || v.name,
    Type: v.vehicleType,
    Seats: v.seats,
    Destination: v.destination?.name || v.destination,
    PricePerDay: v.pricePerDay,
    PricePerKm: v.pricePerKm || '',
    Availability: v.availability ? 'Yes' : 'No',
  }));

  if (format === 'csv') {
    exportToCSV(data, 'vehicles');
  } else {
    exportToJSON(data, 'vehicles');
  }
};

/**
 * Export messages data
 */
export const exportMessages = (messages: any[], format: 'csv' | 'json' = 'csv') => {
  const data = messages.map((m) => ({
    MessageID: m._id || m.id,
    UserName: m.user?.name || m.name,
    UserEmail: m.user?.email || m.email,
    Subject: m.subject,
    Status: m.status,
    Priority: m.priority || 'normal',
    Reply: m.reply || '',
    RepliedAt: m.repliedAt ? formatDate(m.repliedAt) : '',
    CreatedAt: formatDate(m.createdAt),
  }));

  if (format === 'csv') {
    exportToCSV(data, 'messages');
  } else {
    exportToJSON(data, 'messages');
  }
};

/**
 * Export custom tour requests data
 */
export const exportCustomTours = (requests: any[], format: 'csv' | 'json' = 'csv') => {
  const data = requests.map((r) => ({
    RequestID: r.requestId || r._id,
    UserName: r.user?.name,
    UserEmail: r.user?.email,
    Destinations: r.destinations?.join('; '),
    StartDate: formatDate(r.startDate),
    EndDate: formatDate(r.endDate),
    Adults: r.adults,
    Children: r.children,
    Budget: r.budget,
    BudgetType: r.budgetType,
    Accommodation: r.accommodationType,
    Transport: r.transportation,
    Meals: r.meals,
    Status: r.status,
    QuotedPrice: r.quotedPrice || '',
    CreatedAt: formatDate(r.createdAt),
  }));

  if (format === 'csv') {
    exportToCSV(data, 'custom_tour_requests');
  } else {
    exportToJSON(data, 'custom_tour_requests');
  }
};

/**
 * Export activities data
 */
export const exportActivities = (activities: any[], format: 'csv' | 'json' = 'csv') => {
  const data = activities.map((a) => ({
    ActivityID: a._id,
    Type: a.type,
    Description: a.description,
    UserName: a.user?.name || '',
    UserEmail: a.user?.email || '',
    IPAddress: a.ipAddress || '',
    CreatedAt: formatDate(a.createdAt),
  }));

  if (format === 'csv') {
    exportToCSV(data, 'activities');
  } else {
    exportToJSON(data, 'activities');
  }
};

/**
 * Export reviews data
 */
export const exportReviews = (reviews: any[], format: 'csv' | 'json' = 'csv') => {
  const data = reviews.map((r) => ({
    ReviewID: r._id,
    UserName: r.user?.name || '',
    UserEmail: r.user?.email || '',
    PackageName: r.package?.name || '',
    Rating: r.rating,
    Comment: r.comment?.substring(0, 200) || '',
    Status: r.status,
    IsVerified: r.isVerified ? 'Yes' : 'No',
    CreatedAt: formatDate(r.createdAt),
  }));

  if (format === 'csv') {
    exportToCSV(data, 'reviews');
  } else {
    exportToJSON(data, 'reviews');
  }
};
