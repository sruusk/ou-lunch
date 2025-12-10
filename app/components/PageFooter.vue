<template>
  <footer>
    <UContainer class="flex justify-between items-center contain-content">
      <div />
      <ULink
        :aria-label="$t('aria.source')"
        class="text-cool-600 dark:text-cool-400 flex items-center"
        target="_blank"
        to="https://github.com/sruusk/ou-lunch"
      >
        <UIcon class="w-10 h-10" name="grommet-icons:github" />
      </ULink>

      <UModal>
        <div class="w-0">
          <UButton
            :label="$t('footer.feedback')"
            class="min-w-fit -translate-x-full whitespace-nowrap"
            color="primary"
            variant="soft"
          />
        </div>
        <template #content>
          <div class="p-5 h-[900px] max-h-[80svh]">
            <iframe
              class="rounded-lg h-full"
              src="https://forms.office.com/Pages/ResponsePage.aspx?id=muScnwFRo0qMdQ1ZNa1lJRYDqcnmLlJIpYBLLUY7cYpUN0gxNkRVN1k3QUQ4Q09IOU1EMFdXQzBZRy4u&embed=true"
              style="border: none; max-width:100%; max-height:100vh"
              width="640px"
            />
          </div>
        </template>
      </UModal>
    </UContainer>
  </footer>
</template>
