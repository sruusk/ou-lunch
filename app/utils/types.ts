export interface FilterConfig {
  filters: {
    vegan: boolean;
    eggFree: boolean;
    milkFree: boolean;
    glutenFree: boolean;
    lactoseFree: boolean;
    recommended: boolean;
    [key: string]: boolean;
  };
  method: 'highlight' | 'hide' | 'hideLunch';
}
