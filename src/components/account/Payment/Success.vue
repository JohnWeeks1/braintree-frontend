<template>
    <div>
        <div class="max-w-lg mx-auto mt-10">
            <div role="alert">
                <div class="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                    Successful payment info
                </div>
                <div class="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
                    <p>Something not ideal might be happening.</p>
                    <p>Something not ideal might be happening.</p>
                    <p>Something not ideal might be happening.</p>
                    <p class="mb-6">Something not ideal might be happening.</p>
                    <router-link :to="{ name: 'Payment' }" class="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Next Payment
                    </router-link>
                </div>
            </div>
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
    name: 'BrainTree',
    data() {
        return {
            error: null,
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
                    console.log(hostedFieldsInstance.nonce);
                    this.hostedFieldsInstance = hostedFieldsInstance;
                })
                .catch(error => {
                    console.log(error);
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
                    console.log(response);
                    console.log(response.nonce);

                    this.submitPayment(response);
                })
                .catch(error => {
                    console.error(error);
                    this.error = error;
                })
        },

        /**
         * Submit payment
         */
        async submitPayment(response) {
            await axios.post("api/payments", {
                nonce: response.nonce
            })
                .then(response => {
                    console.log(response);
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
