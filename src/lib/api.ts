import { store } from '@/store';

const API_BASE_URL = 'http://localhost:8080';

// API client with token support
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthToken(): string | null {
    const state = store.getState()
    return state.auth.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()

    const config: RequestInit = {
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier: email, password }),
    })
  }

  async register(userData: unknown): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me")
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>("/api/customers")
  }

  async createCustomer(customerData: CreateCustomerInput): Promise<Customer> {
    return this.request<Customer>("/api/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    })
  }

  async updateCustomer(
    id: string,
    customerData: UpdateCustomerInput
  ): Promise<Customer> {
    return this.request<Customer>(`/api/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(customerData),
    })
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.request<void>(`/api/customers/${id}`, {
      method: "DELETE",
    })
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>(`/api/customers/${id}`)
  }

  // Services methods
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>("/api/services")
  }

  async createService(serviceData: CreateServiceInput): Promise<Service> {
    return this.request<Service>("/api/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  async updateService(
    id: string,
    serviceData: UpdateServiceInput
  ): Promise<Service> {
    return this.request<Service>(`/api/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    })
  }

  async deleteService(id: string): Promise<void> {
    return this.request<void>(`/api/services/${id}`, {
      method: "DELETE",
    })
  }

  async getService(id: string): Promise<Service> {
    return this.request<Service>(`/api/services/${id}`)
  }

  // Invoices methods
  async getInvoices(): Promise<Invoice[]> {
    return this.request<Invoice[]>("/api/invoices")
  }

  async createInvoice(invoiceData: CreateInvoiceInput): Promise<Invoice> {
    return this.request<Invoice>("/api/invoices", {
      method: "POST",
      body: JSON.stringify(invoiceData),
    })
  }

  async updateInvoice(
    id: string,
    invoiceData: UpdateInvoiceInput
  ): Promise<Invoice> {
    return this.request<Invoice>(`/api/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoiceData),
    })
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.request<void>(`/api/invoices/${id}`, {
      method: "DELETE",
    })
  }

  async getInvoice(id: string): Promise<Invoice> {
    return this.request<Invoice>(`/api/invoices/${id}`)
  }

  // Reports methods
  async getReports(): Promise<AnalyticsSummary> {
    return this.request<AnalyticsSummary>('/api/reports');
  }

  // Dashboard methods
  async getDashboardOverview(): Promise<DashboardOverview> {
    return this.request<DashboardOverview>('/api/dashboard');
  }

  // Settings methods
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/profile');
  }

  async updateProfile(profileData: UpdateProfileInput): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateWorkingHours(workingHours: WorkingHour[]): Promise<void> {
    return this.request<void>('/auth/working-hours', {
      method: 'PUT',
      body: JSON.stringify({ workingHours }),
    });
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    return this.request<void>('/auth/notification-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getReminderTemplates(): Promise<ReminderTemplates> {
    return this.request<ReminderTemplates>('/api/reminder-templates');
  }

  async updateReminderTemplates(templates: ReminderTemplateInput): Promise<void> {
    return this.request<void>('/api/reminder-templates', {
      method: 'PUT',
      body: JSON.stringify(templates),
    });
  }
}

// Service types matching your backend
export interface CreateServiceInput {
  name: string
  description?: string
  price: number
  duration: number // in minutes
  category?: string
}

export interface UpdateServiceInput {
  name?: string
  description?: string
  price?: number
  duration?: number // in minutes
  category?: string
  isActive?: boolean
}

export interface Service {
  ID: string
  SalonID: string
  Name: string
  Description: string
  Price: number
  Duration: number // in minutes
  Category: string
  IsActive: boolean
  CreatedAt: string
  UpdatedAt: string
}

// Customer interfaces
export interface CreateCustomerInput {
  name: string
  phone: string
  email?: string
  birthday?: string // ISO date string
  anniversary?: string // ISO date string
  notes?: string
}

export interface UpdateCustomerInput {
  name?: string
  phone?: string
  email?: string
  birthday?: string // ISO date string
  anniversary?: string // ISO date string
  notes?: string
  isActive?: boolean
}

export interface Customer {
  ID: string
  SalonID: string
  Name: string
  Phone: string
  Email: string
  Birthday?: string
  Anniversary?: string
  Notes: string
  TotalVisits: number
  TotalSpent: number
  LastVisit?: string
  IsActive: boolean
  CreatedAt: string
  UpdatedAt: string
}

// Invoice interfaces
export interface InvoiceItemInput {
  serviceId: string
  quantity: number
}

export interface CreateInvoiceInput {
  customerId: string
  invoiceDate?: string // ISO date string
  items: InvoiceItemInput[]
  discount: number
  tax: number
  paymentStatus: "paid" | "unpaid" | "partial"
  paidAmount: number
  paymentMethod?: string
  notes?: string
}

export interface UpdateInvoiceInput {
  customerId?: string
  invoiceDate?: string // ISO date string
  items?: InvoiceItemInput[]
  discount?: number
  tax?: number
  paymentStatus?: "paid" | "unpaid" | "partial"
  paidAmount?: number
  paymentMethod?: string
  notes?: string
}

export interface InvoiceItem {
  ID: string
  InvoiceID: string
  ServiceID: string
  ServiceName: string
  Quantity: number
  UnitPrice: number
  TotalPrice: number
  CreatedAt: string
  UpdatedAt: string
}

export interface Invoice {
  ID: string
  InvoiceNumber: string
  SalonID: string
  CustomerID: string
  InvoiceDate: string
  Subtotal: number
  Discount: number
  Tax: number
  Total: number
  PaymentStatus: "paid" | "unpaid" | "partial"
  PaidAmount: number
  PaymentMethod: string
  Notes: string
  Items: InvoiceItem[]
  CreatedAt: string
  UpdatedAt: string
}

// User interface for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  salonName?: string;
  phone?: string;
}

// Auth response interfaces
export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterResponse {
  user: User
  token: string
}

// Reports interfaces
export interface ServiceSummary {
  name: string
  count: number
  revenue: number
}

export interface CustomerSummary {
  name: string
  visits: number
  spent: number
}

export interface QuickStatistics {
  totalCustomers: number;
  totalInvoices: number;
  avgMonthlyVisits: number;
  avgOrderValue: number;
}

export interface AnalyticsSummary {
  currentMonthRevenue: number;
  monthGrowth: number;
  currentQuarterRevenue: number;
  quarterGrowth: number;
  currentYearRevenue: number;
  yearGrowth: number;
  topServices: ServiceSummary[] | null;
  topCustomers: CustomerSummary[] | null;
  quickStats: QuickStatistics;
}

// Dashboard interfaces
export interface DashboardOverview {
  totalCustomers: number;
  monthlyRevenue: number;
  totalInvoices: number;
  upcomingBirthdays: UpcomingEvent[];
  recentCustomers: RecentCustomer[];
  upcomingReminders: UpcomingReminder[];
}

export interface UpcomingEvent {
  name: string;
  date: string; // e.g. "Tomorrow", "3 days", etc.
}

export interface RecentCustomer {
  name: string;
  service: string;
  visitDate: string; // e.g. "Today", "Yesterday"
}

export interface UpcomingReminder {
  name: string;
  type: string; // "Birthday" or "Anniversary"
  date: string; // e.g. "Tomorrow", "3 days"
}

// Settings interfaces
export interface UpdateProfileInput {
  salonName: string;
  salonAddress: string;
  phone: string;
  email: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  salonName: string;
  salonAddress: string;
  phone: string;
}

export interface WorkingHour {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface NotificationSettings {
  birthdayReminders: boolean;
  anniversaryReminders: boolean;
  whatsappNotifications: boolean;
  smsNotifications: boolean;
}

export interface ReminderTemplates {
  birthday: string;
  anniversary: string;
}

export interface ReminderTemplateInput {
  birthday?: string;
  anniversary?: string;
}

export const apiClient = new ApiClient(API_BASE_URL)
