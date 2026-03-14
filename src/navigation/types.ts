  export type RootStackParamList = {
  index: undefined;
  onboarding: undefined;
  login: undefined;
  register: undefined;
  "(tabs)": undefined;
};

export type TabParamList = {
  dashboard: undefined;
  notifications: undefined;
  profile: undefined;
  settings: undefined;
};

export const ROUTES = {
  INDEX: "/" as const,
  ONBOARDING: "/onboarding" as const,
  LOGIN: "/login" as const,
  REGISTER: "/register" as const,
  TABS: {
    DASHBOARD: "/(tabs)/dashboard" as const,
    NOTIFICATIONS: "/(tabs)/notifications" as const,
    PROFILE: "/(tabs)/profile" as const,
    SETTINGS: "/(tabs)/settings" as const,
  },
} as const;
