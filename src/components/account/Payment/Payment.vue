<template>
    <div>
        <div class="pt-6 pb-3">
            <div @click="show = !show" class="max-w-lg mx-auto bg-blue-500 hover:bg-blue-700 text-white text-lg py-3 text-center font-bold py-2 px-4 rounded cursor-pointer">Card Payment</div>
            <CardPayment v-if="show"/>
        </div>

        <div v-if="!show" class="py-4">
            <Paypal/>
        </div>
    </div>
</template>

<script>
import Paypal from "@/components/account/Payment/Portails/Paypal";
import CardPayment from "@/components/account/Payment/Portails/CardPayment";

export default {
    name: 'Payment',
    data() {
        return {
            show: false
        }
    },
    components: {
        Paypal,
        CardPayment
    }
}
</script>
