<template>
  <UPopover overlay>
    <UChip inset size="md" :show="isFiltered">
      <UButton variant="outline"
               color="primary"
               size="md"
               :ui="{ rounded: 'rounded-full' }"
               icon="fluent:textbox-settings-20-filled"
               :aria-label="$t('aria.filterOptions')"
      />
    </UChip>
    <template #panel>
      <div class="p-4">
        <div class="mb-4 flex flex-wrap gap-4">
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
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">{{ $t('filters.order') }}</h3>
            <Draggable v-if="order?.length" v-model="order">
              <transition-group type="transition" name="flip-list">
                <li v-for="r in order" :key="r" class="list-group-item">
                  <i
                    aria-hidden="true"
                  ></i>
                  {{ r }}
                </li>
              </transition-group>
            </Draggable>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'

export default defineNuxtComponent({
  name: "OptionsMenu",
  components: {
    Draggable: VueDraggableNext,
  },
  setup() {
    const cookie = useCookie('config', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    const orderCookie = useCookie('order', { maxAge: 60 * 60 * 24 * 365 }); // 1 year

    const conf = useState('config', () => {
      return cookie.value || {
        filters: {
          vegan: false,
          eggFree: false,
          milkFree: false,
          glutenFree: false,
          lactoseFree: false,
          recommended: false,
        },
        method: "highlight",
      };
    });

    const order = useState('order');

    return { cookie, conf, orderCookie, order };
  },
  computed: {
    availableMethods() {
      return [
        { value: "highlight", label: this.$t("filters.highlight") },
        { value: "hide", label: this.$t("filters.hide") },
      ];
    },
    isFiltered() {
      return Object.values(this.conf.filters).some(v => v);
    },
  },
  watch: {
    conf: {
      deep: true,
      handler() {
        this.cookie = this.conf;
      }
    },
    order: {
      deep: true,
      handler() {
        this.orderCookie = this.order;
      }
    }
  }
});
</script>

<style scoped>
.fieldset :deep(fieldset) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/*noinspection CssUnusedSymbol*/
.flip-list-move {
  transition: transform 0.5s;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
