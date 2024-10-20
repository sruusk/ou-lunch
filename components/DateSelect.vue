<template>
    <UTabs :items="items" v-model="selected" :content="false"/>
</template>

<script>

export default defineNuxtComponent({
  name: "DateSelect",
  props: {
    date: {
      type: Date,
      required: true
    },
    dates: {
      type: Array,
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
      set(index) {
        this.setDate(index);
      }
    }
  },
  methods: {
    setDate(index) {
      this.$emit("update:date", this.dates[index]);
    },
    formatDate(date) {
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
