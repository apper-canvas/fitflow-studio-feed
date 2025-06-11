import bookingData from '../mockData/bookings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BookingService {
  constructor() {
    this.data = [...bookingData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(b => b.id === id);
    if (!item) throw new Error('Booking not found');
    return { ...item };
  }

  async create(booking) {
    await delay(400);
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      bookedAt: booking.bookedAt || new Date().toISOString(),
      status: booking.status || 'confirmed'
    };
    this.data.push(newBooking);
    return { ...newBooking };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByUserId(userId) {
    await delay(250);
    return this.data.filter(b => b.userId === userId).map(b => ({ ...b }));
  }

  async getByClassId(classId) {
    await delay(250);
    return this.data.filter(b => b.classId === classId).map(b => ({ ...b }));
  }
}

export default new BookingService();