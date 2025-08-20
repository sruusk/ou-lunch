<template>
  <UTabs v-model="selected" :content="false" :items="items"/>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'DateSelect',
  props: {
    date: {
      type: Date,
      required: true
    },
    dates: {
      type: Array as () => Date[],
      required: true
    }
  },
  emits: ['update:date'],
  computed: {
    items() {
      return this.dates.map(date => ({
        label: this.formatDate(date)
      }));
    },
    selected: {
      get() {
        return this.dates.findIndex((date: Date) => date.toISOString() === this.date.toISOString());
      },
      set(index: number) {
        this.setDate(index);
      }
    }
  },
  methods: {
    setDate(index: number) {
      this.$emit('update:date', this.dates[index]);
    },
    formatDate(date: Date) {
      const lang = this.$i18n.locale === 'en' ? 'en' : 'fi';
      return date.toLocaleDateString(lang, {
        weekday: 'short',
        timeZone: 'Europe/Helsinki'
      });
    }
  },
});
</script>

<style scoped>

</style>
