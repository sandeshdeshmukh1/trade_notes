<script setup>
import { onBeforeMount} from 'vue'
import SpinnerLoadingPage from '../components/SpinnerLoadingPage.vue';
import Filters from '../components/Filters.vue'
import NoData from '../components/NoData.vue';
import Calendar from '../components/Calendar.vue';
import { spinnerLoadingPage, calendarData, filteredTrades } from '../stores/globals';
import { useMountCalendar } from '../utils/utils'

onBeforeMount(async () => {
    useMountCalendar()
})

</script>

<template>
    <SpinnerLoadingPage />
    <div v-show="!spinnerLoadingPage" class="row mt-2 mb-2">
        <Filters />
        <div v-if="filteredTrades.length == 0">
            <NoData />
        </div>
        <div v-else>
            <div>
                <!-- ============ CALENDAR ============ -->
                <div v-show="calendarData" class="col-12 text-center mt-2 align-self-start">
                    <div class="dailyCard">
                        <div class="row justify-content-center">
                            <Calendar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>