<template>
  <UContainer class="flex justify-between items-center">
    <div/>
    <ULink
      class="text-cool-600 dark:text-cool-400 flex items-center"
      to="https://github.com/sruusk/ou-lunch"
      target="_blank"
      :aria-label="$t('aria.source')"
    >
      <UIcon class="w-10 h-10" name="grommet-icons:github"/>
    </ULink>
    <UPopover class="w-0">
      <UButton :label="$t('footer.feedback')" color="primary" variant="soft" class="-translate-x-full"/>
      <template #panel>
        <div class="p-5 flex flex-col gap-2">
          <UButton
            :label="$t('footer.feedbackGithub')"
            to="https://github.com/sruusk/ou-lunch/issues/new"
          />
          <UButton
            :label="$t('footer.feedbackTelegram')"
            @click="openTelegram"
          />
        </div>
      </template>
    </UPopover>
  </UContainer>
</template>
<script>
export default {
  name: 'PageFooter',
  methods: {
    openTelegram() {
      window.open('https://t.me/+IL4dgF98VahmY2U0', '_blank');
    },
  },
};
</script>
