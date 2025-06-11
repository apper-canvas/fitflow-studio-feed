import timeSlotData from '../mockData/timeSlots.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TimeSlotService {
  constructor() {
    this.data = [...timeSlotData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(t => t.id === id);
    if (!item) throw new Error('Time slot not found');
    return { ...item };
  }

  async create(timeSlot) {
    await delay(300);
    const newTimeSlot = {
      ...timeSlot,
      id: Date.now().toString()
    };
    this.data.push(newTimeSlot);
    return { ...newTimeSlot };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Time slot not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Time slot not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByDate(date) {
    await delay(250);
    return this.data.filter(t => t.date === date).map(t => ({ ...t }));
  }

  async getAvailable() {
    await delay(250);
    return this.data.filter(t => t.available).map(t => ({ ...t }));
  }
}

export default new TimeSlotService();