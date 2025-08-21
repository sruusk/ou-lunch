<template>
  <header>
    <UContainer class="flex justify-between items-center">
      <!-- Logo (always returns to lunch menus) -->
      <NuxtLink 
        to="/" 
        class="flex items-center flex-shrink-0"
        @click="handleLogoClick"
      >
        <img
          :aria-label="$t('aria.logo')"
          alt="Oulu University Food"
          class="dark:hidden h-10"
          src="@/assets/ouf-high-resolution-logo-transparent.webp"
        />
        <img
          :aria-label="$t('aria.logo')"
          alt="Oulu University Food"
          class="h-10 hidden dark:block"
          src="@/assets/ouf-high-resolution-logo-white-transparent.webp"
        />
      </NuxtLink>

      <!-- Spacer to push controls to right on very small screens -->
      <div class="flex-1 min-w-0"></div>

      <!-- Right Side Controls (Discounts + Theme + Language) -->
      <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <!-- Discounts Toggle Button -->
        <UButton
          :class="[
            'rounded-lg transition-all duration-200 border flex-shrink-0 min-w-[44px]',
            isOnOSAKOPage 
              ? 'bg-orange-600 text-white border-orange-600 shadow-lg' 
              : 'text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-600 hover:border-orange-400'
          ]"
          :variant="isOnOSAKOPage ? 'solid' : 'outline'"
          :aria-label="toggleButtonLabel"
          size="sm"
          @click="handleOSAKOToggle"
        >
          <UIcon 
            name="heroicons:tag" 
            :class="[
              'transition-transform duration-200',
              isOnOSAKOPage ? 'scale-110' : 'scale-100'
            ]"
            class="w-4 h-4" 
          />
          <!-- Show text label on larger screens -->
          <span class="ml-2 hidden sm:inline">
            {{ isOnOSAKOPage ? $t('navigation.back_to_menus') : $t('navigation.discounts') }}
          </span>
        </UButton>

        <ClientOnly>
          <ColourMode size="sm"/>
        </ClientOnly>

        <ClientOnly>
          <LanguageSelect size="sm"/>
        </ClientOnly>
      </div>
    </UContainer>
  </header>
  
</template>
<script setup lang="ts">
// Nuxt 4: Built-in route access and navigation
const router = useRouter();
const route = useRoute();

// Computed: Check if currently on OSAKO page
const isOnOSAKOPage = computed(() => {
  return route.path.startsWith('/osako');
});

// Computed: Dynamic button label for accessibility
const toggleButtonLabel = computed(() => {
  return isOnOSAKOPage.value 
    ? 'Return to lunch menus' 
    : 'View student discounts';
});

// Methods
function handleOSAKOToggle() {
  if (isOnOSAKOPage.value) {
    // Currently on OSAKO page - return to lunch menus
    router.push('/');
  } else {
    // Currently on lunch menus - go to OSAKO discounts
    router.push('/osako-discounts');
  }
}

function handleLogoClick() {
  // Always return to lunch menus when logo is clicked
  router.push('/');
}
</script>
