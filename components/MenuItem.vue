<template>
  <div
    :class="{
      'border-l-2 border-cool-600 dark:border-cool-300 pl-2 -ml-2': showFilter && isFiltered,
      'opacity-50': showFilter && !isFiltered,
    }"
    class="mb-2 last:mb-0 flex flex-nowrap justify-between items-center"
  >
    <div>
      <h3 class="text-cool-800 dark:text-cool-200 text-balance break-normal">
        {{ item.name || $t('notAvailableForLanguage') }}
      </h3>
      <p v-if="item.diets?.length" class="text-cool-600 dark:text-cool-400 text-xs -mt-0.5">
        {{ item.diets }}
      </p>
    </div>
    <UPopover v-if="item.ingredients && item.ingredients.length > 10 && item.ingredients !== item.name" :label="$t('aria.ingredients')"
              mode="click">
      <UButton :aria-label="$t('aria.ingredients')" class="p-0" color="white" icon="material-symbols:info" size="sm"
               variant="link"/>
      <template #panel>
        <div class="p-2 w-96 max-w-[90vw]">
          <p class="text-cool-800 dark:text-cool-300 text-sm whitespace-break-spaces" v-html="item.ingredients"/>
        </div>
      </template>
    </UPopover>
  </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object as () => MenuItem,
      required: true
    },
    isFiltered: {
      type: Boolean,
      default: false
    },
    showFilter: {
      type: Boolean,
      default: false
    },
  },
});
</script>
