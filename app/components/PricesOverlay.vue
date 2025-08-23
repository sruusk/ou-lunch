<template>
  <UModal :open="open" @update:open="$emit('update:open', $event)">
    <template #content>
      <div class="p-8" tabindex="0">
        <h3 class="text-2xl font-bold">
          {{ $t('restaurant.prices') }}
        </h3>
        <UTable :columns="columns" :data="prices" class="my-3" />
        <UAlert
          :description="$t('restaurant.disclaimer')"
          icon="ion:information-circle-outline"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'PricesOverlay',
  props: {
    menu: {
      type: Object as () => RestaurantMeta,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:open'],
  computed: {
    prices() {
      return this.menu.prices?.map(price => ({
        title: this.$i18n.locale === 'en' ? price.title_en : price.title_fi,
        student: price.student,
        staff: price.staff,
        other: price.other,
      }));
    },
    columns() {
      return [
        {
          accessorKey: 'title',
          header: '',
        },
        {
          accessorKey: 'student',
          header: this.$t('restaurant.student'),
        },
        {
          accessorKey: 'staff',
          header: this.$t('restaurant.staff'),
        },
        {
          accessorKey: 'other',
          header: this.$t('restaurant.other'),
        },
      ];
    },
  },
});
</script>
