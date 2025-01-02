// utils/types.ts
export interface RestaurantMeta {
  name: string;
  url: string;
  campus: string;
  city: string;
  provider: string;
  openingHours?: LunchWindow[];
}

export interface Restaurant extends RestaurantMeta {
  menu: Menu[];
}

export interface MenuItem {
  name: string;
  diets?: string;
  ingredients?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Menu {
  date: Date;
  en: MenuCategory[];
  fi: MenuCategory[];
  [key: string]: MenuCategory[] | Date;
}

export interface RestaurantFilter {
  city?: string;
  campus?: string;
}

export enum Provider {
  foodandco = 'Food&Co',
  compass = 'Compass Group',
  sodexo = 'Sodexo',
  uniresta = 'Uniresta',
  juvenes = 'Juvenes',
}

export interface Price {
    title_fi: string;
    title_en: string;
    student: string;
    staff: string;
    other: string;
}

export interface LunchWindow extends OpeningHours {
  day: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

export interface NonNormalOpeningHours extends OpeningHours {
  day: string;
}

interface OpeningHours {
  open: {
    hours: number;
    minutes: number;
  },
  close: {
    hours: number;
    minutes: number;
  }
}
