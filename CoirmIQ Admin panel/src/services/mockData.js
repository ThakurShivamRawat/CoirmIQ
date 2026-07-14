// LocalStorage keys for simulated database
const KEYS = {
  BOOKINGS: 'antigravity_db_bookings',
  CATEGORIES: 'antigravity_db_categories',
  VENUES: 'antigravity_db_venues',
  EVENTS: 'antigravity_db_events',
  USER: 'antigravity_db_admin_user'
};

// Seeding Initial Data if not present
const seedData = () => {
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    const initialCategories = [
      { id: 'cat-1-uuid', name: 'Music Concerts', description: 'Live rock, pop, and electronic concert spectacles.' },
      { id: 'cat-2-uuid', name: 'Theater & Drama', description: 'Broadaway plays, local dramas, and stand-up comedy.' },
      { id: 'cat-3-uuid', name: 'Sports Tournaments', description: 'Football matches, athletic events, and arena matches.' },
      { id: 'cat-4-uuid', name: 'Tech Conferences', description: 'Developer workshops, keynote sessions, and product launches.' },
      { id: 'cat-5-uuid', name: 'Art Exhibitions', description: 'Contemporary art galleries, museum galleries, and craft shows.' }
    ];
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }

  if (!localStorage.getItem(KEYS.VENUES)) {
    const initialVenues = [
      {
        id: 'venue-1-uuid',
        name: 'Antigravity Arena',
        city: 'New York',
        landmark: 'Near Central Park',
        address: '5th Ave & E 84th St',
        buildingNumber: 'Block A-1',
        pincode: '10028',
        host: { username: 'stadium_corp' },
        sections: [
          {
            id: 'sec-1-1',
            sectionName: 'Gold Ring A',
            rows: [
              { id: 'row-1-1-1', rowName: 'A1', capacity: 15 },
              { id: 'row-1-1-2', rowName: 'A2', capacity: 15 },
              { id: 'row-1-1-3', rowName: 'A3', capacity: 20 }
            ]
          },
          {
            id: 'sec-1-2',
            sectionName: 'Premium VIP Balcony',
            rows: [
              { id: 'row-1-2-1', rowName: 'VIP1', capacity: 10 },
              { id: 'row-1-2-2', rowName: 'VIP2', capacity: 10 }
            ]
          }
        ]
      },
      {
        id: 'venue-2-uuid',
        name: 'Metro Amphitheatre',
        city: 'San Francisco',
        landmark: 'Bay Area Pier 39',
        address: 'Beach Street & The Embarcadero',
        buildingNumber: 'Pier 39 Pavilion',
        pincode: '94133',
        host: { username: 'sf_arts_society' },
        sections: [
          {
            id: 'sec-2-1',
            sectionName: 'Front Stage Terrace',
            rows: [
              { id: 'row-2-1-1', rowName: 'Front A', capacity: 30 },
              { id: 'row-2-1-2', rowName: 'Front B', capacity: 30 }
            ]
          },
          {
            id: 'sec-2-2',
            sectionName: 'General Admission Lawn',
            rows: [
              { id: 'row-2-2-1', rowName: 'Lawn West', capacity: 100 },
              { id: 'row-2-2-2', rowName: 'Lawn East', capacity: 100 }
            ]
          }
        ]
      },
      {
        id: 'venue-3-uuid',
        name: 'Neon Gardens Arena',
        city: 'Las Vegas',
        landmark: 'Strip Boulevard Mall',
        address: '3655 S Las Vegas Blvd',
        buildingNumber: 'North Hall 3',
        pincode: '89109',
        host: { username: 'vegas_nights_corp' },
        sections: [
          {
            id: 'sec-3-1',
            sectionName: 'Main Floor Clubbing',
            rows: [
              { id: 'row-3-1-1', rowName: 'Floor 1', capacity: 50 },
              { id: 'row-3-1-2', rowName: 'Floor 2', capacity: 50 }
            ]
          }
        ]
      },
      {
        id: 'venue-4-uuid',
        name: 'Cyberdome Expo Center',
        city: 'Austin',
        landmark: 'Austin Convention Gate C',
        address: '500 E Cesar Chavez St',
        buildingNumber: 'Cyberdome',
        pincode: '78701',
        host: { username: 'texas_expo_group' },
        sections: [
          {
            id: 'sec-4-1',
            sectionName: 'Auditorium Hall',
            rows: [
              { id: 'row-4-1-1', rowName: 'Row A', capacity: 25 },
              { id: 'row-4-1-2', rowName: 'Row B', capacity: 25 },
              { id: 'row-4-1-3', rowName: 'Row C', capacity: 25 }
            ]
          }
        ]
      }
    ];
    localStorage.setItem(KEYS.VENUES, JSON.stringify(initialVenues));
  }

  if (!localStorage.getItem(KEYS.EVENTS)) {
    const initialEvents = [
      {
        id: 'event-1-uuid',
        name: 'Neon Electric Symphony',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=60',
        host: { username: 'vegas_nights_corp' },
        venue: { city: 'Las Vegas', name: 'Neon Gardens Arena' },
        category: { name: 'Music Concerts' },
        startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
        duration: 180,
        description: 'A spectacular electronic synthwave concert featuring live laser visualizer elements and legendary international EDM artists.'
      },
      {
        id: 'event-2-uuid',
        name: 'Shakespeare: Hamlet Rewired',
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=60',
        host: { username: 'sf_arts_society' },
        venue: { city: 'San Francisco', name: 'Metro Amphitheatre' },
        category: { name: 'Theater & Drama' },
        startTime: new Date(Date.now() + 86400000 * 5).toISOString(),
        duration: 150,
        description: 'A modern cyber-themed adaptation of the classic tragedy. Witness technology meet theatrical brilliance.'
      },
      {
        id: 'event-3-uuid',
        name: 'Austin Indie Rock Fest',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=60',
        host: { username: 'texas_expo_group' },
        venue: { city: 'Austin', name: 'Cyberdome Expo Center' },
        category: { name: 'Music Concerts' },
        startTime: new Date(Date.now() + 86400000 * 10).toISOString(),
        duration: 240,
        description: 'Austin\'s premier indie and alternative music showcase, presenting upcoming talents and chart-topping headliners.'
      },
      {
        id: 'event-4-uuid',
        name: 'World Cyber Championship 2026',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60',
        host: { username: 'stadium_corp' },
        venue: { city: 'New York', name: 'Antigravity Arena' },
        category: { name: 'Sports Tournaments' },
        startTime: new Date(Date.now() + 86400000 * 12).toISOString(),
        duration: 360,
        description: 'The pinnacle tournament for competitive esports teams. Catch the grand finals live.'
      },
      {
        id: 'event-5-uuid',
        name: 'Global Tech Summit Austin',
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=60',
        host: { username: 'texas_expo_group' },
        venue: { city: 'Austin', name: 'Cyberdome Expo Center' },
        category: { name: 'Tech Conferences' },
        startTime: new Date(Date.now() + 86400000 * 15).toISOString(),
        duration: 480,
        description: 'Meet global industry leaders, tech developers, and venture capitalists exploring AI technologies.'
      }
    ];
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(initialEvents));
  }

  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    const initialBookings = [
      {
        id: 'book-1-uuid',
        user: { id: 'usr-1-uuid', username: 'john_doe', email: 'john.doe@gmail.com' },
        bookingTime: new Date(Date.now() - 3600000 * 3).toISOString(),
        totalAmount: 249.99,
        status: 'CONFIRMED',
        tickets: [
          {
            id: 'tkt-1-1',
            seatNumber: 'A1-12',
            eventInventory: {
              price: 124.99,
              row: { rowName: 'A1', capacity: 15 },
              event: {
                id: 'event-4-uuid',
                name: 'World Cyber Championship 2026',
                description: 'The pinnacle tournament for competitive esports teams.',
                startTime: new Date(Date.now() + 86400000 * 12).toISOString(),
                category: { name: 'Sports Tournaments' },
                venue: { name: 'Antigravity Arena', city: 'New York' }
              }
            }
          },
          {
            id: 'tkt-1-2',
            seatNumber: 'A1-13',
            eventInventory: {
              price: 125.00,
              row: { rowName: 'A1', capacity: 15 },
              event: {
                id: 'event-4-uuid',
                name: 'World Cyber Championship 2026',
                description: 'The pinnacle tournament for competitive esports teams.',
                startTime: new Date(Date.now() + 86400000 * 12).toISOString(),
                category: { name: 'Sports Tournaments' },
                venue: { name: 'Antigravity Arena', city: 'New York' }
              }
            }
          }
        ]
      },
      {
        id: 'book-2-uuid',
        user: { id: 'usr-2-uuid', username: 'alice_w', email: 'alice.w@yahoo.com' },
        bookingTime: new Date(Date.now() - 3600000 * 24).toISOString(),
        totalAmount: 85.00,
        status: 'CONFIRMED',
        tickets: [
          {
            id: 'tkt-2-1',
            seatNumber: 'FrontA-05',
            eventInventory: {
              price: 85.00,
              row: { rowName: 'Front A', capacity: 30 },
              event: {
                id: 'event-2-uuid',
                name: 'Shakespeare: Hamlet Rewired',
                description: 'A modern cyber-themed adaptation of the classic tragedy.',
                startTime: new Date(Date.now() + 86400000 * 5).toISOString(),
                category: { name: 'Theater & Drama' },
                venue: { name: 'Metro Amphitheatre', city: 'San Francisco' }
              }
            }
          }
        ]
      },
      {
        id: 'book-3-uuid',
        user: { id: 'usr-3-uuid', username: 'bob_builder', email: 'bob.builder@outlook.com' },
        bookingTime: new Date(Date.now() - 3600000 * 12).toISOString(),
        totalAmount: 150.00,
        status: 'PENDING',
        tickets: [
          {
            id: 'tkt-3-1',
            seatNumber: 'Floor1-45',
            eventInventory: {
              price: 150.00,
              row: { rowName: 'Floor 1', capacity: 50 },
              event: {
                id: 'event-1-uuid',
                name: 'Neon Electric Symphony',
                description: 'A spectacular electronic synthwave concert.',
                startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
                category: { name: 'Music Concerts' },
                venue: { name: 'Neon Gardens Arena', city: 'Las Vegas' }
              }
            }
          }
        ]
      },
      {
        id: 'book-4-uuid',
        user: { id: 'usr-4-uuid', username: 'charlie_brown', email: 'charlie@peanuts.org' },
        bookingTime: new Date(Date.now() - 3600000 * 48).toISOString(),
        totalAmount: 75.00,
        status: 'FAILED',
        tickets: [
          {
            id: 'tkt-4-1',
            seatNumber: 'RowB-18',
            eventInventory: {
              price: 75.00,
              row: { rowName: 'Row B', capacity: 25 },
              event: {
                id: 'event-5-uuid',
                name: 'Global Tech Summit Austin',
                description: 'Meet global industry leaders and tech developers.',
                startTime: new Date(Date.now() + 86400000 * 15).toISOString(),
                category: { name: 'Tech Conferences' },
                venue: { name: 'Cyberdome Expo Center', city: 'Austin' }
              }
            }
          }
        ]
      }
    ];
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(initialBookings));
  }
};

// Helper to paginate array
const paginateArray = (array, page, size) => {
  const start = page * size;
  const end = start + size;
  const content = array.slice(start, end);
  return {
    content,
    totalPages: Math.ceil(array.length / size),
    totalElements: array.length,
    size,
    number: page
  };
};

export const handleMockRequest = async (config) => {
  seedData();
  const { url, method, data: dataStr, params } = config;
  const body = dataStr ? JSON.parse(dataStr) : null;
  const page = params?.page || 0;
  const size = params?.size || 10;

  // Simulate server-side latency (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  // --- AUTH ROUTE ---
  if (url === '/api/v1/auth/login' && method.toLowerCase() === 'post') {
    if (body.email && body.password) {
      const mockUser = {
        id: 'admin-id-123',
        username: 'System Admin',
        email: body.email,
        role: 'ADMIN'
      };
      return {
        status: 200,
        data: {
          success: true,
          message: 'Login successful (MOCK MODE)',
          data: {
            token: 'mock-jwt-token-xyz',
            user: mockUser
          }
        }
      };
    }
    return {
      status: 400,
      data: { success: false, message: 'Email and password are required' }
    };
  }

  // --- BOOKINGS ROUTES ---
  if (url === '/api/v1/bookings/admin/all' && method.toLowerCase() === 'get') {
    let list = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    
    // Filter by customer email
    if (params?.customerEmail) {
      const emailQuery = params.customerEmail.toLowerCase();
      list = list.filter((b) => b.user?.email?.toLowerCase().includes(emailQuery));
    }
    
    // Filter by status
    if (params?.status) {
      list = list.filter((b) => b.status === params.status);
    }
    
    const paginated = paginateArray(list, page, size);
    return {
      status: 200,
      data: { success: true, message: 'Bookings fetched', data: paginated }
    };
  }

  if (url.startsWith('/api/v1/bookings/') && method.toLowerCase() === 'get') {
    const id = url.split('/').pop();
    const list = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    const booking = list.find((b) => b.id === id);
    if (booking) {
      return {
        status: 200,
        data: { success: true, message: 'Booking details', data: booking }
      };
    }
    return {
      status: 404,
      data: { success: false, message: `Booking ID ${id} not found` }
    };
  }

  // --- CATEGORIES ROUTES ---
  if (url === '/api/v1/categories') {
    if (method.toLowerCase() === 'get') {
      const list = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
      return {
        status: 200,
        data: { success: true, message: 'Categories fetched', data: list }
      };
    }
    if (method.toLowerCase() === 'post') {
      const list = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
      const newCat = {
        id: `cat-${Math.random().toString(36).substring(2, 9)}`,
        name: body.name,
        description: body.description
      };
      list.push(newCat);
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
      return {
        status: 201,
        data: { success: true, message: 'Category created', data: newCat }
      };
    }
  }

  if (url.startsWith('/api/v1/categories/') && method.toLowerCase() === 'put') {
    const id = url.split('/').pop();
    const list = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
    const index = list.findIndex((c) => c.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], name: body.name, description: body.description };
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
      return {
        status: 200,
        data: { success: true, message: 'Category updated', data: list[index] }
      };
    }
    return {
      status: 404,
      data: { success: false, message: 'Category not found' }
    };
  }

  if (url.startsWith('/api/v1/categories/') && method.toLowerCase() === 'delete') {
    const id = url.split('/').pop();
    const list = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
    const updated = list.filter((c) => c.id !== id);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(updated));
    return {
      status: 200,
      data: { success: true, message: 'Category deleted', data: null }
    };
  }

  // --- VENUES ROUTES ---
  if (url === '/api/v1/venues' && method.toLowerCase() === 'get') {
    let list = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    
    // Filter by name
    if (params?.name) {
      const nameQuery = params.name.toLowerCase();
      list = list.filter((v) => v.name?.toLowerCase().includes(nameQuery));
    }
    
    // Filter by city
    if (params?.city) {
      const cityQuery = params.city.toLowerCase();
      list = list.filter((v) => v.city?.toLowerCase().includes(cityQuery));
    }

    // VenueSummaryDTO is just the venue properties without sections
    const summaries = list.map(({ sections, ...rest }) => rest);
    const paginated = paginateArray(summaries, page, size);
    return {
      status: 200,
      data: { success: true, message: 'Venues fetched', data: paginated }
    };
  }

  if (url.endsWith('/hierarchy') && method.toLowerCase() === 'get') {
    const parts = url.split('/');
    const id = parts[parts.length - 2];
    const list = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const venue = list.find((v) => v.id === id);
    if (venue) {
      return {
        status: 200,
        data: { success: true, message: 'Venue hierarchy details', data: venue }
      };
    }
    return {
      status: 404,
      data: { success: false, message: `Venue ID ${id} not found` }
    };
  }

  // --- EVENTS ROUTES ---
  if (url === '/api/v1/events' && method.toLowerCase() === 'get') {
    let list = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    
    // Filter by event name
    if (params?.name) {
      const nameQuery = params.name.toLowerCase();
      list = list.filter((e) => e.name?.toLowerCase().includes(nameQuery));
    }
    
    // Filter by city
    if (params?.city) {
      const cityQuery = params.city.toLowerCase();
      list = list.filter((e) => e.venue?.city?.toLowerCase().includes(cityQuery));
    }
    
    // Filter by category (category is name or ID from select)
    if (params?.category) {
      const catQuery = params.category.toLowerCase();
      list = list.filter((e) => e.category?.name?.toLowerCase() === catQuery);
    }
    
    const paginated = paginateArray(list, page, size);
    return {
      status: 200,
      data: { success: true, message: 'Events fetched', data: paginated }
    };
  }

  if (url.startsWith('/api/v1/events/') && method.toLowerCase() === 'delete') {
    const id = url.split('/').pop();
    const list = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    const updated = list.filter((e) => e.id !== id);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
    return {
      status: 200,
      data: { success: true, message: 'Event deleted', data: null }
    };
  }

  // Default Fallback
  return {
    status: 404,
    data: { success: false, message: `Mock API: Path '${url}' not matched` }
  };
};

