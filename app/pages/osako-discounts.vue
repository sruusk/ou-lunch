<template>
	<UCard :ui="{ body: 'grow' }" class="flex flex-col min-h-dvh">
		<template #header>
			<PageHeader class="h-10"/>
		</template>

		<UContainer class="py-8">
			<!-- Title & Description in content area -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					{{ $t('osako.page_title') }}
				</h1>
				<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					{{ $t('osako.page_description') }}
				</p>
			</div>

			<!-- Category Selector -->
			<OSAKOCategorySelect
				v-model:selected-category="selectedCategory"
				:categories="categories"
				class="mb-6"
			/>

			<!-- Search Bar -->
			<div class="max-w-md mx-auto mb-6">
				<UInput
					v-model="searchQuery"
					:placeholder="$t('osako.search_placeholder')"
					icon="heroicons:magnifying-glass"
					size="lg"
							:class="[
								'bg-white dark:bg-gray-800',
								'border-gray-300 dark:border-gray-600',
								'text-gray-900 dark:text-white'
							]"
					:ui="{ icon: { trailing: { pointer: '' } }, rounded: 'rounded-xl' }"
				>
					<template #trailing>
						<UButton
							v-if="searchQuery"
							icon="heroicons:x-mark"
							variant="ghost"
							size="xs"
							:aria-label="$t('osako.clear_filters')"
									@click="searchQuery = ''"
									:class="['text-gray-500 dark:text-gray-400', 'hover:text-gray-700 dark:hover:text-gray-200']"
						/>
					</template>
				</UInput>
			</div>

			<!-- Results Counter / Loading -->
			<div class="text-center mb-6">
				<template v-if="pending">
					<UIcon name="heroicons:arrow-path" class="animate-spin w-8 h-8 inline-block" />
				</template>
				<template v-else>
					<p class="text-gray-600 dark:text-gray-400">
						{{ $t('osako.showing_results', { count: filteredDiscounts.length }) }}
					</p>
				</template>
			</div>

			<!-- Discounts Grid / Empty -->
			<div v-if="!pending && filteredDiscounts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<OSAKODiscountCard
					v-for="discount in filteredDiscounts"
					:key="discount.id"
					:discount="discount"
					@view-details="showDiscountModal"
				/>
			</div>

			<div v-else-if="!pending" class="text-center py-12">
				<UIcon name="heroicons:tag" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
					{{ $t('osako.no_discounts_found') }}
				</h3>
				<p class="text-gray-500 mb-4">
					{{ $t('osako.try_different_search') }}
				</p>
				<UButton variant="outline" @click="resetFilters">
					{{ $t('osako.clear_filters') }}
				</UButton>
			</div>
		</UContainer>

		<template #footer>
			<PageFooter class="h-10"/>
		</template>
	</UCard>
</template>

<script setup lang="ts">
useHead({
	title: 'OSAKO Student Discounts in Oulu',
	meta: [
		{ name: 'description', content: 'Exclusive discounts for University of Oulu and OAMK students at local businesses' }
	]
});

type Coords = { lat: number; lng: number };
type OSAKOCityDiscount = {
	id: string;
	business_name: string;
	category: string; // culture-events | beauty-health | sports-leisure | food-restaurants | specialty-shops
	address?: string;
	discount_type: 'percentage' | 'fixed_amount' | 'special_offer';
	discount_value: number;
	discount_description_en: string;
	discount_description_fi: string;
	phone?: string;
	website?: string;
	coordinates?: Coords;
}

const selectedCategory = ref<string | null>(null);
const searchQuery = ref('');
const selectedDiscount = ref<OSAKOCityDiscount | null>(null);
const showModal = ref(false);

const categories = [
	{ id: 'all', name_en: 'All Categories', name_fi: 'Kaikki kategoriat', icon: 'heroicons:squares-2x2' },
	{ id: 'culture-events', name_en: 'Culture & Events', name_fi: 'Kulttuuri ja tapahtumat', icon: 'heroicons:film' },
	{ id: 'beauty-health', name_en: 'Beauty & Health', name_fi: 'Kauneus ja terveys', icon: 'heroicons:sparkles' },
	{ id: 'sports-leisure', name_en: 'Sports & Leisure', name_fi: 'Liikunta ja vapaa-aika', icon: 'heroicons:heart' },
	{ id: 'food-restaurants', name_en: 'Food & Restaurants', name_fi: 'Ruoka ja ravintolat', icon: 'heroicons:cake' },
	{ id: 'specialty-shops', name_en: 'Specialty Shops', name_fi: 'Erikoisliikkeet', icon: 'heroicons:shopping-bag' }
];

const { data: discounts, pending } = await useFetch<OSAKOCityDiscount[]>('/api/osako/discounts', {
	query: computed(() => ({
		category: selectedCategory.value || undefined,
		search: searchQuery.value || undefined
	}))
});

const filteredDiscounts = computed(() => discounts.value || []);

function showDiscountModal(discount: OSAKOCityDiscount) {
	selectedDiscount.value = discount;
	showModal.value = true;
}

function resetFilters() {
	selectedCategory.value = null;
	searchQuery.value = '';
}

watch(selectedCategory, (newCategory) => {
	const query = { ...useRoute().query } as Record<string, string>;
	if (newCategory && newCategory !== 'all') query.category = newCategory;
	else delete query.category;
	navigateTo({ query }, { replace: true });
});

onMounted(() => {
	const route = useRoute();
	if (route.query.category) selectedCategory.value = route.query.category as string;
	if (route.query.search) searchQuery.value = route.query.search as string;
});
</script>

