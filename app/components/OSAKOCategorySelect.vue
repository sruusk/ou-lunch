<template>
		<div class="flex justify-center mb-6">
			<div 
				:class="[
					'flex items-center gap-1 rounded-lg p-1 overflow-x-auto max-w-full',
					'bg-gray-100 dark:bg-gray-800',
					'border border-gray-200 dark:border-gray-700'
				]"
			>
			<button
				v-for="category in categories"
				:key="category.id"
					:class="[
						'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2',
						isSelected(category.id) 
							? 'bg-blue-600 text-white shadow-sm' 
							: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
					]"
				@click="selectCategory(category.id)"
				:aria-label="getCategoryLabel(category)"
			>
				<UIcon :name="category.icon" class="w-4 h-4" />
				<span class="hidden sm:inline">{{ getCategoryLabel(category) }}</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Category {
	id: string;
	name_en: string;
	name_fi: string;
	icon: string;
}

const props = defineProps<{
	selectedCategory: string | null;
	categories: Category[];
}>();

const emit = defineEmits<{ 'update:selectedCategory': [category: string | null] }>();
const { $i18n } = useNuxtApp();

function isSelected(categoryId: string): boolean {
	return (categoryId === 'all' && !props.selectedCategory) || props.selectedCategory === categoryId;
}

function selectCategory(categoryId: string): void {
	const newCategory = categoryId === 'all' ? null : categoryId;
	emit('update:selectedCategory', newCategory);
}

function getCategoryLabel(category: Category): string {
	return (String($i18n.locale) === 'en') ? category.name_en : category.name_fi;
}
</script>
