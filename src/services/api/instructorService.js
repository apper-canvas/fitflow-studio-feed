import instructorData from '../mockData/instructors.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InstructorService {
  constructor() {
    this.data = [...instructorData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(i => i.id === id);
    if (!item) throw new Error('Instructor not found');
    return { ...item };
  }

  async create(instructor) {
    await delay(300);
    const newInstructor = {
      ...instructor,
      id: Date.now().toString()
    };
    this.data.push(newInstructor);
    return { ...newInstructor };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Instructor not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Instructor not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getBySpecialty(specialty) {
    await delay(250);
    return this.data.filter(i => i.specialties.includes(specialty)).map(i => ({ ...i }));
  }
}

export default new InstructorService();