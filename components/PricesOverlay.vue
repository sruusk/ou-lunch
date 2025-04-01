<template>
  <UModal v-model="visible">
    <div class="p-8" tabindex="0">
      <h3 class="text-2xl font-bold">{{ $t('restaurant.prices') }}</h3>
      <UTable :columns="columns" :rows="prices" class="my-3"/>
      <UAlert
        :description="$t('restaurant.disclaimer')"
        icon="ion:information-circle-outline"/>
    </div>
  </UModal>
</template>

<script lang="ts">

export default defineNuxtComponent({
  name: 'PricesOverlay',
  emits: ['show'],
  props: {
    menu: {
      type: Object as () => RestaurantMeta,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      visible: this.show,
    };
  },
  computed: {
    prices() {
      return this.menu.prices?.map(price => ({
        title: this.$i18n.locale === 'en' ? price.title_en : price.title_fi,
        student: price.student,
        staff: price.staff,
        other: price.other
      }));
    },
    columns() {
      return [
        {
          key: 'title',
          label: ''
        },
        {
          key: 'student',
          label: this.$t('restaurant.student')
        },
        {
          key: 'staff',
          label: this.$t('restaurant.staff')
        },
        {
          key: 'other',
          label: this.$t('restaurant.other')
        }
      ];
    }
  },
  watch: {
    show(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit('show', val);
    }
  }
});
</script>

<style scoped>

</style>
