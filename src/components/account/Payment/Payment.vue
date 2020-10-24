<template>
    <div>
        <div class="max-w-lg mx-auto">
            <h3 class="text-3xl pt-5 pb-5">Enter Details</h3>
            <p class="pb-6 text-lg">Amount to pay: £5.99</p>
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="card-number">
                Card Number
            </label>
            <div id="card-number" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-20" ></div>
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="card-number">
                Expiration Date
            </label>
            <div id="expiration-date" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-20" ></div>
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="card-number">
                CVV
            </label>
            <div id="cvv" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-20 mb-5" ></div>

            <div v-if="error !== null" class="bg-red-100 border-l-4 border-red-500 text-orange-700 p-4 mb-6" role="alert">
                <p class="font-bold">Be Warned</p>
                <div class="alert alert-danger">{{ error.message }}</div>
            </div>

            <div v-if="transactionData !== null" class="max-w-lg mx-auto mt-10">
                <div role="alert">
                    <div class="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                        Successful payment info
                    </div>
                    <div class="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700 mb-6">
                        <p class="pb-3">Your payment has been accepted!</p>
                        <p>Transaction ID: <b>{{ transactionData.transaction_id }}</b></p>
                    </div>
                </div>
            </div>

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

export default {
    name: 'Payment',
    data() {
        return {
            error: null,
            amount: 5.99,
            transactionData: null,
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
            braintree.client.create({authorization: 'sandbox_pgfdy57x_r7szh49z3pjxfmgz'})
                .then(clientInstance => {
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
                })
                .then(hostedFieldsInstance => {
                    this.hostedFieldsInstance = hostedFieldsInstance;
                })
                .catch(error => {
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
            this.transactionData = null;
            await this.hostedFieldsInstance.tokenize()
                .then(response => {
                    this.submitPayment(response);
                })
                .catch(error => {
                    this.error = error;
                })
        },

        /**
         * Submit payment
         */
        async submitPayment(response) {
            await axios.post("api/payments", {
                nonce: response.nonce,
                amount: this.amount,
            })
                .then(response => {
                    this.transactionData = response.data.data;
                })
                .catch(error => {
                    console.error(error);
                    this.error = error;
                })
        }
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
        }
    },
}
</script>
