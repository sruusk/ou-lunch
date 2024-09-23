<template>
  <UContainer class="flex justify-between items-center">
    <h1 class="text-2xl">{{ $t('title') }}</h1>
    <div class="flex gap-2">
      <ColourMode />
      <LanguageSelect />
    </div>
  </UContainer>
</template>
<script>
export default {
  name: 'PageHeader'
};
</script>
