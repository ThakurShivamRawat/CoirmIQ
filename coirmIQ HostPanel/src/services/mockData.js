// LocalStorage keys for simulated database for the Host Organizer panel
const KEYS = {
  BOOKINGS: 'antigravity_db_bookings',
  CATEGORIES: 'antigravity_db_categories',
  VENUES: 'antigravity_db_venues',
  EVENTS: 'antigravity_db_events',
  INVENTORIES: 'antigravity_db_inventories',
  USERS: 'antigravity_db_users'
};

// Seeding Initial Data if not present
const seedData = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    const initialUsers = [
      {
        id: 'host-id-123',
        username: 'elite_organizer',
        email: 'host@antigravity.com',
        role: 'HOST',
        mobNo: '+15550199',
        city: 'New York'
      }
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    const initialCategories = [
      { id: 'cat-1-uuid', name: 'Music Concerts', description: 'Live rock, pop, and electronic concert spectacles.' },
      { id: 'cat-2-uuid', name: 'Theater & Drama', description: 'Broadway plays, stand-up comedy, and performance arts.' },
      { id: 'cat-3-uuid', name: 'Sports Tournaments', description: 'Football matches, athletic events, and arena matches.' },
      { id: 'cat-4-uuid', name: 'Tech Conferences', description: 'Developer workshops, keynote sessions, and product launches.' }
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
        host: { id: 'host-id-123', username: 'elite_organizer' },
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
        name: 'Neon Gardens Pavilion',
        city: 'Las Vegas',
        landmark: 'Strip Boulevard Mall',
        address: '3655 S Las Vegas Blvd',
        buildingNumber: 'North Hall 3',
        pincode: '89109',
        host: { id: 'host-id-123', username: 'elite_organizer' },
        sections: [
          {
            id: 'sec-2-1',
            sectionName: 'Main Floor Clubbing',
            rows: [
              { id: 'row-2-1-1', rowName: 'Floor Row 1', capacity: 50 },
              { id: 'row-2-1-2', rowName: 'Floor Row 2', capacity: 50 }
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
        host: { id: 'host-id-123', username: 'elite_organizer' },
        venue: { id: 'venue-2-uuid', name: 'Neon Gardens Pavilion', city: 'Las Vegas', address: '3655 S Las Vegas Blvd', buildingNumber: 'North Hall 3', pincode: '89109', landmark: 'Strip Boulevard Mall' },
        category: { id: 'cat-1-uuid', name: 'Music Concerts' },
        startTime: '2026-12-31T20:00:00',
        duration: 180,
        description: 'A spectacular electronic synthwave concert featuring live laser visualizer elements and legendary international EDM artists.'
      },
      {
        id: 'event-2-uuid',
        name: 'World Cyber Championship 2026',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60',
        host: { id: 'host-id-123', username: 'elite_organizer' },
        venue: { id: 'venue-1-uuid', name: 'Antigravity Arena', city: 'New York', address: '5th Ave & E 84th St', buildingNumber: 'Block A-1', pincode: '10028', landmark: 'Near Central Park' },
        category: { id: 'cat-3-uuid', name: 'Sports Tournaments' },
        startTime: '2026-11-15T15:00:00',
        duration: 240,
        description: 'The final showdown for competitive esports teams worldwide, live in the arena.'
      }
    ];
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(initialEvents));
  }

  if (!localStorage.getItem(KEYS.INVENTORIES)) {
    const initialInventories = [
      {
        id: 'inv-1-uuid',
        eventId: 'event-1-uuid',
        rowId: 'row-2-1-1',
        availableSeats: 50,
        price: 150.00
      },
      {
        id: 'inv-2-uuid',
        eventId: 'event-2-uuid',
        rowId: 'row-1-1-1',
        availableSeats: 15,
        price: 99.99
      }
    ];
    localStorage.setItem(KEYS.INVENTORIES, JSON.stringify(initialInventories));
  }

  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    const initialBookings = [
      {
        id: 'book-1-uuid',
        user: { id: 'usr-1-uuid', username: 'john_doe', email: 'john.doe@gmail.com' },
        bookingTime: '2026-07-12T14:23:00',
        totalAmount: 199.98,
        status: 'CONFIRMED',
        tickets: [
          {
            id: 'tkt-1-1',
            bookingId: 'book-1-uuid',
            seatNumber: 'A1-03',
            eventInventory: {
              id: 'inv-2-uuid',
              price: 99.99,
              rowId: 'row-1-1-1',
              eventId: 'event-2-uuid'
            }
          },
          {
            id: 'tkt-1-2',
            bookingId: 'book-1-uuid',
            seatNumber: 'A1-04',
            eventInventory: {
              id: 'inv-2-uuid',
              price: 99.99,
              rowId: 'row-1-1-1',
              eventId: 'event-2-uuid'
            }
          }
        ]
      },
      {
        id: 'book-2-uuid',
        user: { id: 'usr-2-uuid', username: 'alice_w', email: 'alice.w@yahoo.com' },
        bookingTime: '2026-07-11T19:45:00',
        totalAmount: 150.00,
        status: 'CONFIRMED',
        tickets: [
          {
            id: 'tkt-2-1',
            bookingId: 'book-2-uuid',
            seatNumber: 'FloorRow1-22',
            eventInventory: {
              id: 'inv-1-uuid',
              price: 150.00,
              rowId: 'row-2-1-1',
              eventId: 'event-1-uuid'
            }
          }
        ]
      },
      {
        id: 'book-3-uuid',
        user: { id: 'usr-3-uuid', username: 'bob_builder', email: 'bob.builder@outlook.com' },
        bookingTime: '2026-07-12T09:12:00',
        totalAmount: 300.00,
        status: 'PENDING',
        tickets: [
          {
            id: 'tkt-3-1',
            bookingId: 'book-3-uuid',
            seatNumber: 'FloorRow1-23',
            eventInventory: {
              id: 'inv-1-uuid',
              price: 150.00,
              rowId: 'row-2-1-1',
              eventId: 'event-1-uuid'
            }
          },
          {
            id: 'tkt-3-2',
            bookingId: 'book-3-uuid',
            seatNumber: 'FloorRow1-24',
            eventInventory: {
              id: 'inv-1-uuid',
              price: 150.00,
              rowId: 'row-2-1-1',
              eventId: 'event-1-uuid'
            }
          }
        ]
      },
      {
        id: 'book-4-uuid',
        user: { id: 'usr-4-uuid', username: 'fail_user', email: 'fail.user@gmail.com' },
        bookingTime: '2026-07-10T11:00:00',
        totalAmount: 99.99,
        status: 'FAILED',
        tickets: [
          {
            id: 'tkt-4-1',
            bookingId: 'book-4-uuid',
            seatNumber: 'A1-15',
            eventInventory: {
              id: 'inv-2-uuid',
              price: 99.99,
              rowId: 'row-1-1-1',
              eventId: 'event-2-uuid'
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
  const page = params?.page || 0;
  const size = params?.size || 10;

  // Simulate server-side latency (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const cleanUrl = url.replace(/\/+$/, '');

  // 1. --- AUTH ROUTES ---
  if (cleanUrl.endsWith('/api/v1/auth/login') && method.toLowerCase() === 'post') {
    if (body.email && body.password) {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      let user = users.find((u) => u.email.toLowerCase() === body.email.toLowerCase() && u.role === 'HOST');
      if (!user) {
        // Auto create or seed user if they use registration parameters
        user = {
          id: 'host-id-' + Math.random().toString(36).substring(2, 9),
          username: body.email.split('@')[0],
          email: body.email,
          role: 'HOST',
          mobNo: '+15550199',
          city: 'New York'
        };
        users.push(user);
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      }
      return {
        status: 200,
        data: {
          success: true,
          message: 'Login successful (MOCK MODE)',
          data: {
            token: 'mock-jwt-token-for-host-user-xyz',
            user: user
          }
        }
      };
    }
    return {
      status: 400,
      data: { success: false, message: 'Email and password are required' }
    };
  }

  if (cleanUrl.endsWith('/api/v1/auth/register') && method.toLowerCase() === 'post') {
    if (body.email && body.username && body.password) {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const exists = users.some((u) => u.email.toLowerCase() === body.email.toLowerCase());
      if (exists) {
        return Promise.reject({
          config,
          response: {
            status: 400,
            data: { success: false, message: 'Email address is already in use' }
          }
        });
      }
      const newUser = {
        id: 'host-id-' + Math.random().toString(36).substring(2, 9),
        username: body.username,
        email: body.email,
        role: body.role || 'HOST',
        mobNo: body.mobNo || '',
        city: body.city || ''
      };
      users.push(newUser);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      return {
        status: 200,
        data: {
          success: true,
          message: 'Host registered successfully (MOCK MODE)',
          data: {
            token: 'mock-jwt-token-for-host-user-xyz',
            user: newUser
          }
        }
      };
    }
    return {
      status: 400,
      data: { success: false, message: 'Invalid registration parameters' }
    };
  }

  // 2. --- BOOKINGS SALES ROUTES ---
  if (cleanUrl.endsWith('/api/v1/bookings/host/sales') && method.toLowerCase() === 'get') {
    const list = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    const paginated = paginateArray(list, page, size);
    return {
      status: 200,
      data: { success: true, message: 'Host sales fetched successfully', data: paginated }
    };
  }

  if (/\/api\/v1\/bookings\/[a-f0-9-]+$/i.test(cleanUrl) && method.toLowerCase() === 'get') {
    const id = cleanUrl.split('/').pop();
    const list = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
    const booking = list.find((b) => b.id === id);
    if (booking) {
      // populate event name
      const events = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
      const populatedTickets = booking.tickets.map((tkt) => {
        const invs = JSON.parse(localStorage.getItem(KEYS.INVENTORIES) || '[]');
        const inv = invs.find((i) => i.id === tkt.eventInventory?.id) || tkt.eventInventory;
        const evt = events.find((e) => e.id === inv?.eventId);
        return {
          ...tkt,
          eventInventory: {
            ...inv,
            event: evt
          }
        };
      });
      return {
        status: 200,
        data: { success: true, message: 'Booking details fetched successfully', data: { ...booking, tickets: populatedTickets } }
      };
    }
    return Promise.reject({
      config,
      response: {
        status: 404,
        data: { success: false, message: `Booking ID ${id} not found` }
      }
    });
  }

  // 3. --- EVENTS ROUTES ---
  if (cleanUrl.endsWith('/api/v1/events/host/me') && method.toLowerCase() === 'get') {
    const list = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    // Filter to host only
    return {
      status: 200,
      data: { success: true, message: 'Host events fetched successfully', data: list }
    };
  }

  if (cleanUrl.endsWith('/api/v1/events') && method.toLowerCase() === 'post') {
    const list = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    const venues = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const cats = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
    const targetVenue = venues.find((v) => v.id === body.venueId) || { name: 'Unknown Venue', city: 'Unknown' };
    const targetCat = cats.find((c) => c.id === body.categoryId) || { name: 'Unknown Category' };

    const newEvent = {
      id: 'event-id-' + Math.random().toString(36).substring(2, 9),
      name: body.name,
      description: body.description,
      startTime: body.startTime,
      duration: body.duration,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&auto=format&fit=crop&q=60',
      host: { id: 'host-id-123', username: 'elite_organizer' },
      venue: targetVenue,
      category: targetCat
    };
    list.push(newEvent);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(list));
    return {
      status: 201,
      data: { success: true, message: 'Event created successfully', data: newEvent }
    };
  }

  if (/\/api\/v1\/events\/[a-f0-9-]+$/i.test(cleanUrl) && method.toLowerCase() === 'put') {
    const id = cleanUrl.split('/').pop();
    const list = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    const index = list.findIndex((e) => e.id === id);
    if (index !== -1) {
      const venues = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
      const cats = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
      const targetVenue = venues.find((v) => v.id === body.venueId) || list[index].venue;
      const targetCat = cats.find((c) => c.id === body.categoryId) || list[index].category;

      list[index] = {
        ...list[index],
        name: body.name,
        description: body.description,
        startTime: body.startTime,
        duration: body.duration,
        imageUrl: body.imageUrl || list[index].imageUrl,
        venue: targetVenue,
        category: targetCat
      };
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(list));
      return {
        status: 200,
        data: { success: true, message: 'Event updated successfully', data: list[index] }
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

  if (/\/api\/v1\/events\/[a-f0-9-]+$/i.test(cleanUrl) && method.toLowerCase() === 'delete') {
    const id = cleanUrl.split('/').pop();
    const list = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
    const updated = list.filter((e) => e.id !== id);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
    return {
      status: 200,
      data: { success: true, message: 'Event deleted successfully', data: null }
    };
  }

  // 4. --- CATEGORIES FOR SELECTS ---
  if (cleanUrl.endsWith('/api/v1/categories') && method.toLowerCase() === 'get') {
    const list = JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
    return {
      status: 200,
      data: { success: true, message: 'Categories fetched successfully', data: list }
    };
  }

  // 5. --- VENUE WORKSPACE ROUTES ---
  if (cleanUrl.endsWith('/api/v1/venues/host/me') && method.toLowerCase() === 'get') {
    const list = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const summaries = list.map(({ sections, ...rest }) => rest);
    const paginated = paginateArray(summaries, page, size);
    return {
      status: 200,
      data: { success: true, message: 'Host venues fetched successfully', data: paginated }
    };
  }

  if (cleanUrl.endsWith('/api/v1/venues') && method.toLowerCase() === 'post') {
    const list = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const newVenue = {
      id: 'venue-id-' + Math.random().toString(36).substring(2, 9),
      name: body.name,
      address: body.address,
      buildingNumber: body.buildingNumber,
      city: body.city,
      pincode: body.pincode,
      landmark: body.landmark,
      host: { id: 'host-id-123', username: 'elite_organizer' },
      sections: []
    };
    list.push(newVenue);
    localStorage.setItem(KEYS.VENUES, JSON.stringify(list));
    return {
      status: 201,
      data: { success: true, message: 'Venue created successfully', data: newVenue }
    };
  }

  if (/\/api\/v1\/venues\/[a-f0-9-]+\/hierarchy$/i.test(cleanUrl) && method.toLowerCase() === 'get') {
    const parts = cleanUrl.split('/');
    const venueId = parts[parts.length - 2];
    const list = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const venue = list.find((v) => v.id === venueId);
    if (venue) {
      return {
        status: 200,
        data: { success: true, message: 'Venue hierarchy fetched successfully', data: venue }
      };
    }
    return Promise.reject({
      config,
      response: {
        status: 404,
        data: { success: false, message: `Venue ID ${venueId} not found` }
      }
    });
  }

  if (/\/api\/v1\/venues\/[a-f0-9-]+\/layout\/sections$/i.test(cleanUrl) && method.toLowerCase() === 'post') {
    const parts = cleanUrl.split('/');
    const venueId = parts[parts.length - 3];
    const list = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const index = list.findIndex((v) => v.id === venueId);
    if (index !== -1) {
      const venue = list[index];
      if (!venue.sections) venue.sections = [];
      const newSec = {
        id: 'sec-id-' + Math.random().toString(36).substring(2, 9),
        sectionName: body.sectionName,
        rows: []
      };
      venue.sections.push(newSec);
      localStorage.setItem(KEYS.VENUES, JSON.stringify(list));
      return {
        status: 200,
        data: { success: true, message: 'Section added to venue layout successfully', data: newSec }
      };
    }
    return Promise.reject({
      config,
      response: {
        status: 404,
        data: { success: false, message: 'Venue not found' }
      }
    });
  }

  if (/\/api\/v1\/venues\/[a-f0-9-]+\/layout\/sections\/[a-f0-9-]+\/rows$/i.test(cleanUrl) && method.toLowerCase() === 'post') {
    const parts = cleanUrl.split('/');
    const venueId = parts[parts.length - 5];
    const sectionId = parts[parts.length - 2];
    const list = JSON.parse(localStorage.getItem(KEYS.VENUES) || '[]');
    const vIndex = list.findIndex((v) => v.id === venueId);
    if (vIndex !== -1) {
      const venue = list[vIndex];
      const sIndex = venue.sections.findIndex((s) => s.id === sectionId);
      if (sIndex !== -1) {
        const section = venue.sections[sIndex];
        if (!section.rows) section.rows = [];
        const newRow = {
          id: 'row-id-' + Math.random().toString(36).substring(2, 9),
          rowName: body.rowName,
          capacity: body.capacity
        };
        section.rows.push(newRow);
        localStorage.setItem(KEYS.VENUES, JSON.stringify(list));
        return {
          status: 200,
          data: { success: true, message: 'Row added to section layout successfully', data: newRow }
        };
      }
      return Promise.reject({
        config,
        response: {
          status: 404,
          data: { success: false, message: 'Section not found' }
        }
      });
    }
    return Promise.reject({
      config,
      response: {
        status: 404,
        data: { success: false, message: 'Venue not found' }
      }
    });
  }

  // 6. --- INVENTORY MECHANICS ---
  if (cleanUrl.endsWith('/api/v1/inventory') && method.toLowerCase() === 'post') {
    const list = JSON.parse(localStorage.getItem(KEYS.INVENTORIES) || '[]');
    // Check duplicate eventId + rowId
    const existingIndex = list.findIndex((inv) => inv.eventId === body.eventId && inv.rowId === body.rowId);
    const item = {
      id: existingIndex !== -1 ? list[existingIndex].id : 'inv-id-' + Math.random().toString(36).substring(2, 9),
      eventId: body.eventId,
      rowId: body.rowId,
      availableSeats: body.availableSeats,
      price: body.price
    };
    if (existingIndex !== -1) {
      list[existingIndex] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(KEYS.INVENTORIES, JSON.stringify(list));
    return {
      status: 201,
      data: { success: true, message: 'Event inventory allocated successfully', data: item }
    };
  }

  // 7. --- IMAGE SIGNATURE MECHANICS ---
  if (cleanUrl.endsWith('/api/v1/images/signature') && method.toLowerCase() === 'get') {
    return {
      status: 200,
      data: {
        success: true,
        message: 'Signature generated successfully (MOCK MODE)',
        data: {
          signature: 'mock_signature_string',
          timestamp: Math.floor(Date.now() / 1000),
          api_key: 'mock_api_key_123',
          cloud_name: 'mock_cloudinary_cloud',
          folder: params?.folder || 'ticket_events'
        }
      }
    };
  }

  // Fallback to Cloudinary Upload API if mock is on
  if (cleanUrl.includes('api.cloudinary.com') && method.toLowerCase() === 'post') {
    // Simulate a successful image upload response
    return {
      status: 200,
      data: {
        secure_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=60'
      }
    };
  }

  // Default Mock Response
  return Promise.reject({
    config,
    response: {
      status: 404,
      data: { success: false, message: `Mock API: Path '${url}' not matched` }
    }
  });
};
