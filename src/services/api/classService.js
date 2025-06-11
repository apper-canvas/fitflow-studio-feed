import classData from '../mockData/classes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ClassService {
  constructor() {
    this.data = [...classData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(c => c.id === id);
    if (!item) throw new Error('Class not found');
    return { ...item };
  }

  async create(classItem) {
    await delay(300);
    const newClass = {
      ...classItem,
      id: Date.now().toString(),
      bookedCount: 0
    };
    this.data.push(newClass);
    return { ...newClass };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Class not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Class not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByInstructor(instructor) {
    await delay(250);
    return this.data.filter(c => c.instructor === instructor).map(c => ({ ...c }));
  }

  async getByType(type) {
    await delay(250);
    return this.data.filter(c => c.type === type).map(c => ({ ...c }));
  }
}

export default new ClassService();