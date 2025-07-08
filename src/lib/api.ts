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
  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    return this.request<GetCurrentUserResponse>("/auth/me")
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

  // Settings methods - updated to match new endpoints
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/profile');
  }

  async updateSalonProfile(profileData: UpdateSalonProfileInput): Promise<void> {
    return this.request<void>('/auth/profile/update-salon', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateWorkingHours(workingHours: WorkingHoursInput): Promise<void> {
    return this.request<void>('/auth/profile/update-hours', {
      method: 'PUT',
      body: JSON.stringify(workingHours),
    });
  }

  async updateNotificationSettings(settings: NotificationSettingsInput): Promise<void> {
    return this.request<void>('/auth/profile/update-notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async updateReminderTemplates(templates: UpdateReminderTemplatesInput): Promise<void> {
    return this.request<void>('/auth/profile/update-templates', {
      method: 'PUT',
      body: JSON.stringify(templates),
    });
  }

  // Employee management endpoints
  async getEmployees(): Promise<Employee[]> {
    const response = await this.request<{ employees: Employee[] }>('/api/employees', {
      method: 'GET',
    });
    return response.employees;
  }

  async createEmployee(employeeData: CreateEmployeeInput): Promise<Employee> {
    const response = await this.request<{ employee: Employee }>('/api/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
    return response.employee;
  }

  async updateEmployee(employeeId: string, updateData: UpdateEmployeeInput): Promise<Employee> {
    const response = await this.request<{ employee: Employee }>(`/api/employees/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.employee;
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    await this.request<void>(`/api/employees/${employeeId}`, {
      method: 'DELETE',
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

// Employee interface
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'employee' | 'manager' | 'owner';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string | null;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string; // optional if your backend allows
}

export interface UpdateEmployeeInput {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

// Invoice interfaces
export interface InvoiceItemInput {
  serviceId: string
  quantity: number
  employeeId?: string // Optional employee assignment
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
  EmployeeID?: string // Optional employee who provided the service
  EmployeeName?: string // Optional employee name for display
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
  ID: string;
  Name: string;
  Email: string;
  Phone: string;
  role: 'owner' | 'employee';
  SalonName?: string;
  SalonID?: string;
  CreatedAt: string;
  UpdatedAt: string;
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

export interface GetCurrentUserResponse {
  user: User;
  salon: any; // You can replace 'any' with a proper Salon type if needed
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

// Settings interfaces - updated to match new backend structure
export interface UpdateSalonProfileInput {
  salonName: string;
  salonAddress: string;
  phone: string;
  email: string;
}

export interface UserProfile {
  salonProfile: {
    salonName: string;
    address: string;
    phone: string;
    email: string;
    workingHours: WorkingHoursData;
  };
  notifications: {
    birthdayReminders: boolean;
    anniversaryReminders: boolean;
    whatsAppNotifications: boolean;
    smsNotifications: boolean;
  };
  messageTemplates: {
    birthday: string;
    anniversary: string;
  };
}

export interface WorkingHoursData {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

export interface WorkingHoursInput {
  workingHours: WorkingHoursData;
}

export interface NotificationSettingsInput {
  birthdayReminders: boolean;
  anniversaryReminders: boolean;
  whatsappNotifications: boolean;
  smsNotifications: boolean;
}

export interface ReminderTemplate {
  id: string;
  type: 'birthday' | 'anniversary';
  message: string;
  isActive: boolean;
}

export interface UpdateReminderTemplatesInput {
  birthday?: string;
  anniversary?: string;
}

export const apiClient = new ApiClient(API_BASE_URL)
