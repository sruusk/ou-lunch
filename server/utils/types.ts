// utils/types.ts
export interface RestaurantMeta {
  name: string;
  url: string;
  campus: string;
  city: string;
  provider: string;
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
