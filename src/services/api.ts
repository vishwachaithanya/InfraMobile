import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = 'https://bestinframobile.onrender.com/api';

async function getHeaders(requireAuth = true): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (requireAuth) {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export interface LoginResponse {
  token: string;
  consumerName: string;
  userId: number;
}

export interface DashboardData {
  consumerName: string;
  meterNumber: string;
  balance: number;
  dueAmount: number;
  dueDate: string;
  lastCommunication: string;
  monthlyUsage: number;
  avgDailyUsage: number;
  peakUsage: number;
  usageHistory: { date: string; value: number }[];
  alerts: {
    id: number;
    serialNumber: string;
    meterSerialNumber: string;
    consumerName: string;
    alertType: string;
    createdAt: string;
  }[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  meterNumber?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      headers: await getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
  },

  async register(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ message: string }> {
  // REMOVED the single quotes inside the string
  return request("/auth/register", { 
    method: "POST",
    headers: await getHeaders(false),
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
},
  async getDashboard(): Promise<DashboardData> {
    return request<DashboardData>("/dashboard/home", {
      headers: await getHeaders(),
    });
  },

  async getProfile(): Promise<UserProfile> {
    return request<UserProfile>("/profile/getRecord", {
      headers: await getHeaders(),
    });
  },

  async updateProfile(
    data: Partial<Pick<UserProfile, "name" | "phone" | "address">>
  ): Promise<UserProfile> {
    return request<UserProfile>("/profile/updateRecord", {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
  },

  async getNotifications(): Promise<NotificationsResponse> {
    return request<NotificationsResponse>("/notifications/alerts", {
      headers: await getHeaders(),
    });
  },
};
