import { Session, UserRole } from '../types';

/**
 * Mock API Service to simulate backend interactions.
 * This will be replaced with Axios/Fetch calls to the Django REST API.
 */
class ApiService {
  private delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string, password?: string, role?: UserRole): Promise<Session | null> {
    await this.delay();
    // Logic from AppContext would go here if we wanted to move it out of the context
    return null; 
  }

  // Future API methods:
  // async getProjects() { ... }
  // async uploadDocument(file: File) { ... }
  // async getNotifications() { ... }
}

export const api = new ApiService();
