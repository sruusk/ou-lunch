<template>
	<UCard 
		:class="[
			'hover:shadow-lg transition-all duration-200',
			'bg-white dark:bg-gray-800',
			'border-gray-200 dark:border-gray-700'
		]"
	>
		<template #header>
			<div class="flex justify-between items-start">
				<div class="flex-1">
					<h3 class="font-semibold text-lg text-gray-900 dark:text-white">
						{{ discount.business_name }}
					</h3>
					<div v-if="discount.address" class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
						<UIcon name="heroicons:map-pin" class="w-4 h-4" />
						<span>{{ discount.address }}</span>
					</div>
				</div>
				<UBadge :color="getCategoryColor(discount.category)" variant="soft" size="sm" class="ml-2">
					{{ getCategoryLabel(discount.category) }}
				</UBadge>
			</div>
		</template>

		<!-- Discount Display - Theme Responsive -->
		<div class="mb-4">
			<div 
				:class="[
					'border rounded-lg p-4 transition-colors',
					'bg-orange-50 dark:bg-orange-600/20',
					'border-orange-200 dark:border-orange-500'
				]"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
							{{ formatDiscount(discount) }}
						</p>
						<p class="text-sm text-orange-700 dark:text-orange-300">
							{{ getDiscountDescription(discount) }}
						</p>
					</div>
					<UIcon name="heroicons:tag" class="w-8 h-8 text-orange-500 dark:text-orange-400" />
				</div>
			</div>
		</div>

		<!-- Action Buttons - Theme Responsive -->
		<div class="flex flex-wrap gap-2 mb-4">
			<UButton v-if="discount.phone" :href="`tel:${discount.phone}`" size="xs" variant="outline" icon="heroicons:phone" color="gray" :class="btnThemeClasses">
				{{ $t('osako.call') }}
			</UButton>
			<UButton v-if="discount.website" :href="discount.website" target="_blank" size="xs" variant="outline" icon="heroicons:globe-alt" color="gray" :class="btnThemeClasses">
				{{ $t('osako.website') }}
			</UButton>
			<UButton v-if="discount.coordinates" :href="getMapUrl(discount.coordinates)" target="_blank" size="xs" variant="outline" icon="heroicons:map" color="gray" :class="btnThemeClasses">
				{{ $t('osako.directions') }}
			</UButton>
		</div>

		<template #footer>
			<div class="flex justify-between items-center">
				<div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
					<UIcon name="heroicons:identification" class="w-4 h-4 mr-1" />
					{{ $t('osako.student_card_required') }}
				</div>
				<UButton color="primary" size="sm" @click="$emit('view-details', discount)" :class="'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'">
					{{ $t('osako.view_details') }}
				</UButton>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
type Coords = { lat: number; lng: number };
type OSAKOCityDiscount = {
	id: string;
	business_name: string;
	category: string;
	address?: string;
	discount_type: 'percentage' | 'fixed_amount' | 'special_offer';
	discount_value: number;
	discount_description_en: string;
	discount_description_fi: string;
	phone?: string;
	website?: string;
	coordinates?: Coords;
}

defineProps<{ discount: OSAKOCityDiscount }>();

const { t, locale } = useI18n();

const btnThemeClasses = [
	'border-gray-300 dark:border-gray-600',
	'text-gray-700 dark:text-gray-300',
	'hover:bg-gray-50 dark:hover:bg-gray-700'
];

function formatDiscount(discount: OSAKOCityDiscount): string {
	switch (discount.discount_type) {
		case 'percentage':
			return `${discount.discount_value}%`;
		case 'fixed_amount':
			return `${discount.discount_value}€`;
			case 'special_offer':
				return t('osako.special_offer');
		default:
			return '';
	}
}

function getDiscountDescription(discount: OSAKOCityDiscount): string {
	return (String(locale.value) === 'en')
		? discount.discount_description_en
		: discount.discount_description_fi;
}

function getCategoryColor(category: string): string {
	const colors: Record<string, string> = {
		'culture-events': 'purple',
		'beauty-health': 'pink',
		'sports-leisure': 'green',
		'food-restaurants': 'red',
		'specialty-shops': 'blue'
	};
	return colors[category] || 'gray';
}

function getMapUrl(coordinates: Coords): string {
	return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
}

function getCategoryLabel(category: string): string {
	const isEn = String(locale.value) === 'en';
	const labels: Record<string, { en: string; fi: string }> = {
		'culture-events': { en: 'Culture & Events', fi: 'Kulttuuri ja tapahtumat' },
		'beauty-health': { en: 'Beauty & Health', fi: 'Kauneus ja terveys' },
		'sports-leisure': { en: 'Sports & Leisure', fi: 'Liikunta ja vapaa-aika' },
		'food-restaurants': { en: 'Food & Restaurants', fi: 'Ruoka ja ravintolat' },
		'specialty-shops': { en: 'Specialty Shops', fi: 'Erikoisliikkeet' }
	};
	return labels[category] ? (isEn ? labels[category].en : labels[category].fi) : category;
}
</script>
