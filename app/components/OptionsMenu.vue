<template>
  <UPopover class="ml-5" overlay>
    <UButton variant="outline"
             color="primary"
             size="md"
             :ui="{ rounded: 'rounded-full' }"
             icon="fluent:textbox-settings-20-filled"
    />
    <template #panel>
      <div class="p-4">

        <div class="mb-4 flex">
          <div class="flex flex-wrap gap-2 flex-col">
            <h3 class="text-lg">{{ $t('filters.filter') }}</h3>
            <UCheckbox v-for="filter in Object.keys(conf.filters)"
                       :key="filter"
                       v-model="conf.filters[filter]"
                       :label="$t(`filters.${filter}`)"
            />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">{{ $t('filters.method') }}</h3>
            <URadioGroup v-model="conf.method" :options="availableMethods" class="fieldset"/>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "OptionsMenu",
  emits: ["update:config"],
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      conf: this.config,
    };
  },
  computed: {
    availableMethods() {
      return [
        { value: "highlight", label: this.$t("filters.highlight") },
        { value: "hide", label: this.$t("filters.hide") },
      ];
    },
  },
  watch: {
    conf: {
      handler() {
        this.$emit("update:config", this.conf);
      },
      deep: true,
    },
    config: {
      handler() {
        this.conf = this.config;
      },
      deep: true,
    },
  },
});
</script>

<style scoped>
.fieldset :deep(fieldset) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
