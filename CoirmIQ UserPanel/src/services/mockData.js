// LocalStorage keys for simulated database for the Consumer Marketplace panel
const KEYS = {
  BOOKINGS: 'antigravity_db_bookings',
  CATEGORIES: 'antigravity_db_categories',
  VENUES: 'antigravity_db_venues',
  EVENTS: 'antigravity_db_events',
  INVENTORIES: 'antigravity_db_inventories',
  USERS: 'antigravity_db_users'
};

// Seed initial data if not present
export const seedData = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    const initialUsers = [
      {
        id: 'usr-1-uuid',
        username: 'john_doe',
        email: 'john.doe@gmail.com',
        role: 'USER',
        mobNo: '+15550199',
        city: 'New York'
      }
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    const initialCategories = [
      { id: 'cat-1-uuid', name: 'Music Festivals', description: 'Live rock, pop, and electronic concert spectacles.' },
      { id: 'cat-2-uuid', name: 'Theater & Comedy', description: 'Broadway plays, stand-up comedy, and performance arts.' },
      { id: 'cat-3-uuid', name: 'Esports & Sports', description: 'Championship matches, athletic events, and arena tournaments.' },
      { id: 'cat-4-uuid', name: 'Web3 & Tech', description: 'Developer workshops, keynote sessions, and product launches.' }
    ];
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }

  if (!localStorage.getItem(KEYS.VENUES)) {
    const initialVenues = [
      {
        id: 'venue-1-uuid',
        name: 'COIMIQ Arena',
        city: 'New York',
        landmark: 'Near Central Park',
        address: '5th Ave & E 84th St',
        buildingNumber: 'Block A-1',
        pincode: '10028',
        sections: [
          {
            id: 'sec-1-1',
            sectionName: 'Gold Ring Vip',
            rows: [
              { id: 'row-1-1-1', rowName: 'VIP A', capacity: 8 },
              { id: 'row-1-1-2', rowName: 'VIP B', capacity: 8 }
            ]
          },
          {
            id: 'sec-1-2',
            sectionName: 'General Balcony',
            rows: [
              { id: 'row-1-2-1', rowName: 'Balcony 1', capacity: 12 },
              { id: 'row-1-2-2', rowName: 'Balcony 2', capacity: 12 }
            ]
          }
        ]
      },
      {
        id: 'venue-2-uuid',
        name: 'Neon Gardens Pavilion',
        city: 'Las Vegas',
        landmark: 'Strip Boulevard Mall',
        address: '3655 S Las Vegas Blvd',
        buildingNumber: 'North Hall 3',
        pincode: '89109',
        sections: [
          {
            id: 'sec-2-1',
            sectionName: 'Front Stage Lounge',
            rows: [
              { id: 'row-2-1-1', rowName: 'Lounge L1', capacity: 10 },
              { id: 'row-2-1-2', rowName: 'Lounge L2', capacity: 10 }
            ]
          },
          {
            id: 'sec-2-2',
            sectionName: 'Neon Terrace',
            rows: [
              { id: 'row-2-2-1', rowName: 'Terrace T1', capacity: 15 }
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
        name: 'Neon Cyber Symphony 2026',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        venue: { id: 'venue-2-uuid', name: 'Neon Gardens Pavilion', city: 'Las Vegas', address: '3655 S Las Vegas Blvd', buildingNumber: 'North Hall 3', pincode: '89109', landmark: 'Strip Boulevard Mall' },
        category: { id: 'cat-1-uuid', name: 'Music Festivals' },
        startTime: '2026-12-31T21:00:00',
        duration: 180,
        description: 'Immerse yourself in a legendary electronic synthwave concert featuring laser light visualizers, cyber-beats, and legendary EDM headline acts.'
      },
      {
        id: 'event-2-uuid',
        name: 'World Esports Championship Finals',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
        venue: { id: 'venue-1-uuid', name: 'COIMIQ Arena', city: 'New York', address: '5th Ave & E 84th St', buildingNumber: 'Block A-1', pincode: '10028', landmark: 'Near Central Park' },
        category: { id: 'cat-3-uuid', name: 'Esports & Sports' },
        startTime: '2026-11-20T17:00:00',
        duration: 240,
        description: 'Witness the absolute pinnacle of competitive gaming as top esports organizations clash for glory and a multi-million dollar prize pool.'
      },
      {
        id: 'event-3-uuid',
        name: 'Retro Disco Revival Night',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        venue: { id: 'venue-2-uuid', name: 'Neon Gardens Pavilion', city: 'Las Vegas', address: '3655 S Las Vegas Blvd' },
        category: { id: 'cat-1-uuid', name: 'Music Festivals' },
        startTime: '2026-10-18T20:00:00',
        duration: 150,
        description: 'Travel back in time with live orchestrations of absolute disco classics under an array of massive glass disco spheres.'
      },
      {
        id: 'event-4-uuid',
        name: 'AI Frontiers Tech Summit 2026',
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
        venue: { id: 'venue-1-uuid', name: 'COIMIQ Arena', city: 'New York', address: '5th Ave & E 84th St' },
        category: { id: 'cat-4-uuid', name: 'Web3 & Tech' },
        startTime: '2026-09-05T09:00:00',
        duration: 480,
        description: 'Join leading scientists, creators, and engineers as they chart the course for agentic automation, LLMs, and humanoid robotics.'
      }
    ];
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(initialEvents));
  }

  if (!localStorage.getItem(KEYS.INVENTORIES)) {
    const initialInventories = [
      // Event 1 (Neon Cyber Symphony)
      { id: 'inv-1-1', eventId: 'event-1-uuid', rowId: 'row-2-1-1', availableSeats: 10, price: 180.00 },
      { id: 'inv-1-2', eventId: 'event-1-uuid', rowId: 'row-2-1-2', availableSeats: 8, price: 150.00 },
      { id: 'inv-1-3', eventId: 'event-1-uuid', rowId: 'row-2-2-1', availableSeats: 15, price: 95.00 },

      // Event 2 (World Esports Finals)
      { id: 'inv-2-1', eventId: 'event-2-uuid', rowId: 'row-1-1-1', availableSeats: 6, price: 250.00 },
      { id: 'inv-2-2', eventId: 'event-2-uuid', rowId: 'row-1-1-2', availableSeats: 8, price: 200.00 },
      { id: 'inv-2-3', eventId: 'event-2-uuid', rowId: 'row-1-2-1', availableSeats: 10, price: 120.00 },
      { id: 'inv-2-4', eventId: 'event-2-uuid', rowId: 'row-1-2-2', availableSeats: 12, price: 90.00 },

      // Event 3 (Retro Disco Revival)
      { id: 'inv-3-1', eventId: 'event-3-uuid', rowId: 'row-2-1-1', availableSeats: 10, price: 75.00 },
      { id: 'inv-3-2', eventId: 'event-3-uuid', rowId: 'row-2-2-1', availableSeats: 15, price: 45.00 },

      // Event 4 (AI Frontiers)
      { id: 'inv-4-1', eventId: 'event-4-uuid', rowId: 'row-1-1-1', availableSeats: 5, price: 499.00 },
      { id: 'inv-4-2', eventId: 'event-4-uuid', rowId: 'row-1-2-1', availableSeats: 12, price: 299.00 }
    ];
    localStorage.setItem(KEYS.INVENTORIES, JSON.stringify(initialInventories));
  }

  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    const initialBookings = [
      {
        id: 'book-1-uuid',
        user: { id: 'usr-1-uuid', username: 'john_doe', email: 'john.doe@gmail.com' },
        bookingTime: '2026-07-12T14:23:00',
        totalAmount: 360.00,
        status: 'CONFIRMED',
        tickets: [
          {
            id: 'tkt-1-1',
            bookingId: 'book-1-uuid',
            seatNumber: 'Lounge L1-01',
            eventInventory: {
              id: 'inv-1-1',
              price: 180.00,
              rowId: 'row-2-1-1',
              eventId: 'event-1-uuid'
            }
          },
          {
            id: 'tkt-1-2',
            bookingId: 'book-1-uuid',
            seatNumber: 'Lounge L1-02',
            eventInventory: {
              id: 'inv-1-1',
              price: 180.00,
              rowId: 'row-2-1-1',
              eventId: 'event-1-uuid'
            }
          }
        ]
      }
    ];
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(initialBookings));
  }
};

const paginateArray = (array, page, size) => {
  const start = page * size;
  const end = start + size;
  const content = array.slice(start, end);
  return {
    content,
    totalPages: Math.ceil(array.length / size) || 1,
    totalElements: array.length,
    size,
    number: page,
    first: page === 0,
    last: end >= array.length,
    numberOfElements: content.length,
    empty: content.length === 0
  };
};

export const handleMockRequest = async (config) => {
  seedData();
  const { url, method, data: dataStr, params } = config;
  const body = dataStr ? JSON.parse(dataStr) : null;
  const page = parseInt(params?.page || 0, 10);
  const size = parseInt(params?.size || 6, 10);

  await new Promise((resolve) => setTimeout(resolve, 250)); // Latency

  const cleanUrl = url.replace(/\/+$/, '').split('?')[0];

  // POST /api/v1/auth/login
  if (cleanUrl.endsWith('/api/v1/auth/login') && method.toLowerCase() === 'post') {
    if (!body.email || !body.password) {
      return {
        status: 400,
        data: { success: false, message: 'Email and password are required' }
      };
    }
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    let user = users.find(u => u.email.toLowerCase() === body.email.toLowerCase());
    
    if (!user) {
      // Auto-register mock user for convenience
      user = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        username: body.email.split('@')[0],
        email: body.email,
        role: 'USER',
        mobNo: '+15550000',
        city: 'Las Vegas'
      };
      users.push(user);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }

    return {
      status: 200,
      data: {
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token-for-user-' + user.id,
          user: user
        }
      }
    };
  }

  // POST /api/v1/auth/register
  if (cleanUrl.endsWith('/api/v1/auth/register') && method.toLowerCase() === 'post') {
    if (!body.email || !body.username || !body.password || !body.mobNo) {
      return {
        status: 400,
        data: { success: false, message: 'All registration parameters are required.' }
      };
    }
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const exists = users.some(u => u.email.toLowerCase() === body.email.toLowerCase());
    if (exists) {
      return Promise.reject({
        config,
        response: {
          status: 400,
          data: { success: false, message: 'Email address is already in use.' }
        }
      });
    }

    const newUser = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      username: body.username,
      email: body.email,
      role: 'USER',
      mobNo: body.mobNo,
      city: body.city || ''
    };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    return {
      status: 200,
      data: {
        success: true,
        message: 'User registered successfully',
        data: {
          token: 'mock-jwt-token-for-user-' + newUser.id,
          user: newUser
        }
      }
    };
  }

  // GET /api/v1/categories
  if (cleanUrl.endsWith('/api/v1/categories') && method.toLowerCase() === 'get') {
    const categories = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
    return {
      status: 200,
      data: { success: true, message: 'Categories fetched successfully', data: categories }
    };
  }

  // GET /api/v1/events
  if (cleanUrl.endsWith('/api/v1/events') && method.toLowerCase() === 'get') {
    let events = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    const nameFilter = params?.name || '';
    const cityFilter = params?.city || '';
    const categoryFilter = params?.category || '';

    if (nameFilter) {
      events = events.filter(e => e.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (cityFilter) {
      events = events.filter(e => e.venue?.city?.toLowerCase().includes(cityFilter.toLowerCase()));
    }
    if (categoryFilter) {
      events = events.filter(e => e.category?.id === categoryFilter || e.category?.name === categoryFilter);
    }

    const paginated = paginateArray(events, page, size);
    return {
      status: 200,
      data: { success: true, message: 'Events search completed', data: paginated }
    };
  }

  // GET /api/v1/events/{id}
  if (/\/api\/v1\/events\/[a-f0-9-]+$/i.test(cleanUrl) && method.toLowerCase() === 'get') {
    const id = cleanUrl.split('/').pop();
    const events = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    const event = events.find(e => e.id === id);
    if (event) {
      return {
        status: 200,
        data: { success: true, message: 'Event details fetched', data: event }
      };
    }
    return Promise.reject({
      config,
      response: {
        status: 404,
        data: { success: false, message: 'Event not found' }
      }
    });
  }

  // GET /api/v1/events/{eventId}/inventory
  if (/\/api\/v1\/events\/[a-f0-9-]+\/inventory$/i.test(cleanUrl) && method.toLowerCase() === 'get') {
    const parts = cleanUrl.split('/');
    const eventId = parts[parts.length - 2];
    const inventories = JSON.parse(localStorage.getItem(KEYS.INVENTORIES) || '[]');
    const filtered = inventories.filter(i => i.eventId === eventId);
    return {
      status: 200,
      data: { success: true, message: 'Event inventories fetched', data: filtered }
    };
  }

  // GET /api/v1/venues/{id}/hierarchy
  if (/\/api\/v1\/venues\/[a-f0-9-]+\/hierarchy$/i.test(cleanUrl) && method.toLowerCase() === 'get') {
    const parts = cleanUrl.split('/');
    const venueId = parts[parts.length - 2];
    const venues = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      return {
        status: 200,
        data: { success: true, message: 'Venue hierarchy loaded', data: venue }
      };
    }
    return Promise.reject({
      config,
      response: {
        status: 404,
        data: { success: false, message: 'Venue hierarchy not found' }
      }
    });
  }

  // POST /api/v1/checkout
  if (cleanUrl.endsWith('/api/v1/checkout') && method.toLowerCase() === 'post') {
    const { eventInventoryId, seatNumbers } = body;
    if (!eventInventoryId || !seatNumbers || !seatNumbers.length) {
      return {
        status: 400,
        data: { success: false, message: 'eventInventoryId and seatNumbers array are required' }
      };
    }

    const inventories = JSON.parse(localStorage.getItem(KEYS.INVENTORIES) || '[]');
    const invIndex = inventories.findIndex(i => i.id === eventInventoryId);
    if (invIndex === -1) {
      return Promise.reject({
        config,
        response: {
          status: 404,
          data: { success: false, message: 'Selected ticket tier inventory not found' }
        }
      });
    }

    const inventory = inventories[invIndex];
    if (inventory.availableSeats < seatNumbers.length) {
      return Promise.reject({
        config,
        response: {
          status: 400,
          data: { success: false, message: `Insufficient seats. Only ${inventory.availableSeats} seats left.` }
        }
      });
    }

    // Deduct seats
    inventory.availableSeats -= seatNumbers.length;
    localStorage.setItem(KEYS.INVENTORIES, JSON.stringify(inventories));

    // Get current user details from local storage or context state
    const currentUser = JSON.parse(localStorage.getItem('antigravity_user')) || {
      id: 'usr-1-uuid',
      username: 'john_doe',
      email: 'john.doe@gmail.com'
    };

    const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    const newBooking = {
      id: 'book-' + Math.random().toString(36).substring(2, 9),
      user: {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email
      },
      bookingTime: new Date().toISOString(),
      totalAmount: parseFloat((inventory.price * seatNumbers.length).toFixed(2)),
      status: 'CONFIRMED',
      tickets: seatNumbers.map(seat => ({
        id: 'tkt-' + Math.random().toString(36).substring(2, 9),
        seatNumber: seat,
        eventInventory: {
          id: inventory.id,
          price: inventory.price,
          rowId: inventory.rowId,
          eventId: inventory.eventId
        }
      }))
    };

    bookings.unshift(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

    return {
      status: 200,
      data: {
        success: true,
        message: 'Passes reserved successfully!',
        data: newBooking
      }
    };
  }

  // GET /api/v1/bookings
  if (cleanUrl.endsWith('/api/v1/bookings') && method.toLowerCase() === 'get') {
    const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    // Filter by active user if needed
    const currentUser = JSON.parse(localStorage.getItem('antigravity_user'));
    let userBookings = bookings;
    if (currentUser) {
      userBookings = bookings.filter(b => b.user?.id === currentUser.id || b.user?.email === currentUser.email);
    }
    return {
      status: 200,
      data: { success: true, message: 'Bookings retrieved', data: userBookings }
    };
  }

  // GET /api/v1/bookings/{id}
  if (/\/api\/v1\/bookings\/[a-f0-9-]+$/i.test(cleanUrl) && method.toLowerCase() === 'get') {
    const id = cleanUrl.split('/').pop();
    const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      // Populate event name, image, and details
      const events = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
      const populatedTickets = booking.tickets.map(tkt => {
        const eventId = tkt.eventInventory?.eventId;
        const event = events.find(e => e.id === eventId);
        return {
          ...tkt,
          eventInventory: {
            ...tkt.eventInventory,
            event
          }
        };
      });

      return {
        status: 200,
        data: {
          success: true,
          message: 'Booking details retrieved',
          data: {
            ...booking,
            tickets: populatedTickets
          }
        }
      };
    }
    return Promise.reject({
      config,
      response: {
        status: 404,
        data: { success: false, message: 'Booking not found' }
      }
    });
  }

  return Promise.reject({
    config,
    response: {
      status: 404,
      data: { success: false, message: `Mock API: Route '${url}' not matched` }
    }
  });
};
