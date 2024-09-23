<template>
  <div class="flex flex-wrap justify-center items-center gap-2 pb-4">
    <UTabs :items="items" v-model="selected"/>
  </div>
</template>

<script lang="ts">

export default defineNuxtComponent({
  name: "DateSelect",
  props: {
    date: {
      type: Date,
      required: true
    },
    dates: {
      type: Array as PropType<Date[]>,
      required: true
    }
  },
  emits: ["update:date"],
  computed: {
    items() {
      return this.dates.map(date => ({
        label: this.formatDate(date)
      }));
    },
    selected: {
      get() {
        return this.dates.findIndex(date => date.toDateString() === this.date.toDateString());
      },
      set(index: number) {
        this.setDate(index);
      }
    }
  },
  methods: {
    setDate(index: number) {
      this.$emit("update:date", this.dates[index]);
    },
    formatDate(date: Date) {
      const lang = this.$i18n.locale === "en" ? "en" : "fi";
      return date.toLocaleDateString(lang, {
        weekday: "short",
      });
    }
  },
});
</script>

<style scoped>

</style>
