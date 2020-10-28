<template>
    <div class="p-6">

        <div class="max-w-lg mx-auto">
            <h3 class="text-3xl pt-5 pb-5">Enter Details</h3>
            <p class="pb-6 text-lg">Amount to pay: £5.99</p>
            <label class="hostedFieldLabel" for="card-number">
                Card Number
            </label>
            <div id="card-number" class="hostedField focus:outline-none focus:bg-white"></div>
            <div class="flex">
                <div class="mr-1">
                    <label class="hostedFieldLabel" for="card-number">
                        Expiration Date
                    </label>
                    <div id="expiration-date" class="hostedField focus:outline-none focus:bg-white" ></div>
                </div>
                <div class="ml-1">
                    <label class="hostedFieldLabel" for="card-number">
                        CVV
                    </label>
                    <div id="cvv" class="hostedField focus:outline-none focus:bg-white" ></div>
                </div>
            </div>

            <DangerAlert :error="error"/>
            <SuccessAlert v-if="success"/>

            <button class="bg-blue-500 text-white font-bold py-4 px-6 rounded" @click.prevent="submitPaymentButton" v-if="!isValidated">Submit Payment</button>
        </div>
    </div>
</template>

<script>
//REFERENCES
//https://rojas.io/how-to-use-braintree-paypal-with-vue-js/
//https://github.com/leorojas22/braintree-vuejs/blob/master/src/App.vue
//https://developers.braintreepayments.com/start/overview#how-it-works

import axios from 'axios';
import braintree from 'braintree-web';
import DangerAlert from "@/components/partials/alerts/DangerAlert";
import SuccessAlert from "@/components/partials/alerts/SuccessAlert";

export default {
    name: 'CardPayment',
    data() {
        return {
            error: null,
            amount: 5.99,
            success: false,
            hostedFieldsInstance: false
        }
    },
    mounted() {
        this.initBraintree();
    },
    methods: {

        /**
         * Initialize Braintree
         */
        initBraintree() {
            braintree.client.create({
                authorization: process.env.VUE_APP_BRAINTREE_SANDBOX_KEY
            }).then(clientInstance => {
                let formOptions = {
                    client: clientInstance,
                    styles: {
                        'input': {
                            'font-size': '16px',
                            'color': '#3A3A3A'
                        },
                        '.number': {
                            'font-family': 'monospace'
                        },
                        '.valid': {
                            'color': 'green'
                        },
                        '.invalid': {
                            'color': 'red'
                        }
                    },
                    fields: {
                        number: {
                            selector: '#card-number',
                            placeholder: '1234 1234 1234 1234'
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                            placeholder: '09/23'
                        },
                        cvv: {
                            selector: '#cvv',
                            placeholder: '123'
                        }
                    }
                }

                return braintree.hostedFields.create(formOptions);
            }).then(hostedFieldsInstance => {
                this.hostedFieldsInstance = hostedFieldsInstance;
            }).catch(error => {
                if (typeof error.message !== 'undefined') {
                    this.error = error;
                } else {
                    this.error = "An error occurred while processing the payment.";
                }
            })
        },

        /**
         * Submit payment button
         */
        async submitPaymentButton() {
            this.error = null;

            await this.hostedFieldsInstance.tokenize()
                .then(response => {
                    this.submitPayment(response);
                }).catch(error => {
                    this.error = error;
                })
        },

        /**
         * Submit payment
         */
        async submitPayment(response) {
            this.success = false;

            await axios.post("api/payments", {
                nonce: response.nonce,
                amount: this.amount,
            }).then(() => {
                this.success = true;
            }).catch(error => {
                console.log(error);
                this.error = error;
            })
        },
    },
    computed: {
        isValidated() {
            if (this.hostedFieldsInstance) {
                return (this.cardNumber || this.expirationDate || this.cvv);
            }

            return false;
        },

        cardNumber() {
            if (this.hostedFieldsInstance) {
                return !this.hostedFieldsInstance._state.fields.number.isValid;
            }

            return false;
        },

        expirationDate() {
            if (this.hostedFieldsInstance) {
                return !this.hostedFieldsInstance._state.fields.expirationDate.isValid;
            }

            return false;
        },

        cvv() {
            if (this.hostedFieldsInstance) {
                return !this.hostedFieldsInstance._state.fields.cvv.isValid;
            }

            return false;
        },
    },
    components: {
        SuccessAlert,
        DangerAlert
    }
}
</script>
