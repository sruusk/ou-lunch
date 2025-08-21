import {ref} from 'vue';

const current = ref<Date>(new Date());

export const useSelectedDate = () => {
    const setSelectedDate = (date: Date) => {
        current.value = date;
    };

    const getSelectedDate = () => {
        return current.value;
    };

    return {
        current,
        setSelectedDate,
        getSelectedDate,
    };
}
