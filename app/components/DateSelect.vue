<template>
  <UTabs v-model="selected" :content="false" :items="items" />
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'DateSelect',
  props: {
    dates: {
      type: Array as () => Date[],
      required: true,
    },
  },
  setup() {
    const date = useSelectedDate();
    return {
      date,
    };
  },
  computed: {
    items() {
      return this.dates.map(date => ({
        label: this.formatDate(date),
        value: date.toDateString(),
      }));
    },
    selected: {
      get() {
        return this.date.current.value.toDateString();
      },
      set(date: string) {
        this.date.setSelectedDate(new Date(date));
      },
    },
  },
  methods: {
    formatDate(date: Date) {
      const lang = this.$i18n.locale === 'en' ? 'en' : 'fi';
      return date.toLocaleDateString(lang, {
        weekday: 'short',
        timeZone: 'Europe/Helsinki',
      });
    },
  },
});
</script>

<style scoped>

</style>
