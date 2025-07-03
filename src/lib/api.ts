import { store } from '@/store';

const API_BASE_URL = 'http://localhost:8080';

// API client with token support
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    const state = store.getState();
    return state.auth.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: email, password }),
    });
  }

  async register(userData: unknown) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>('/api/customers');
  }

  async createCustomer(customerData: CreateCustomerInput): Promise<Customer> {
    return this.request<Customer>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(id: string, customerData: UpdateCustomerInput): Promise<Customer> {
    return this.request<Customer>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.request<void>(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>(`/api/customers/${id}`);
  }

  // Services methods
  async getServices() {
    return this.request('/api/services');
  }

  async createService(serviceData: unknown) {
    return this.request('/api/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, serviceData: unknown) {
    return this.request(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: string) {
    return this.request(`/api/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoices methods
  async getInvoices() {
    return this.request('/api/invoices');
  }

  async createInvoice(invoiceData: unknown) {
    return this.request('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  // Reports methods
  async getReports() {
    return this.request('/api/reports');
  }
}

// Types matching your backend
export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  birthday?: string; // ISO date string
  anniversary?: string; // ISO date string
  notes?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  birthday?: string; // ISO date string
  anniversary?: string; // ISO date string
  notes?: string;
  isActive?: boolean;
}

export interface Customer {
  ID: string;
  SalonID: string;
  Name: string;
  Phone: string;
  Email: string;
  Birthday?: string;
  Anniversary?: string;
  Notes: string;
  TotalVisits: number;
  TotalSpent: number;
  LastVisit?: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

// User interface for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  salonName?: string;
}

export const apiClient = new ApiClient(API_BASE_URL);
