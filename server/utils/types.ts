// utils/types.ts
export interface RestaurantMeta {
  name: string;
  url: string;
  campus: string;
  city: string;
}

export interface Restaurant {
  name: string;
  url: string;
  campus: string;
  city: string;
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
