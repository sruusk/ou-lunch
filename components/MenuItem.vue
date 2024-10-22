<template>
  <div
    class="mb-2 last:mb-0 flex flex-nowrap justify-between items-center"
    :class="{
      'border-l-2 border-cool-600 dark:border-cool-300 pl-2 -ml-2': showFilter && isFiltered,
      'opacity-50': showFilter && !isFiltered,
    }"
  >
    <div>
      <h3 class="text-cool-800 dark:text-cool-200">
        {{ item.name || $t('notAvailableForLanguage') }}
      </h3>
      <p v-if="item.diets?.length" class="text-cool-600 dark:text-cool-400 text-xs -mt-0.5">
        {{ item.diets }}
      </p>
    </div>
    <UPopover mode="click" v-if="item.ingredients?.length > 10 && item.ingredients !== item.name"
              :label="$t('aria.ingredients')">
      <UButton icon="material-symbols:info" color="white" variant="link" size="sm" class="p-0" :aria-label="$t('aria.ingredients')"/>
      <template #panel>
        <div class="p-2 w-96 max-w-[90vw]">
          <p class="text-cool-800 dark:text-cool-300 text-sm whitespace-break-spaces" v-html="item.ingredients"/>
        </div>
      </template>
    </UPopover>
  </div>
</template>
<script>
export default defineNuxtComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
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
