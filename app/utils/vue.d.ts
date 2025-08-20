// vue-i18n.d.ts
import 'vue-i18n';
import { VueI18n } from 'vue-i18n';
import { RouteLocationNormalizedLoaded, Router } from '#vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: VueI18n['t'];
    $i18n: VueI18n;
    $route: RouteLocationNormalizedLoaded;
    $router: Router;
    $colorMode: { value: string };
  }
}
