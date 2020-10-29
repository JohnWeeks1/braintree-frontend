<template>
    <div class="max-w-lg mx-auto">
        <div id="paypal-button"></div>
    </div>
</template>

<script>

import axios from 'axios';
import braintree from 'braintree-web';
import paypal from 'paypal-checkout';

export default {
    name: 'Paypal',
    data() {
        return {
            error: null,
            amount: 10.00
        }
    },
    mounted() {
        this.initPaypal();
    },
    methods: {
        /**
         * Initialize Paypal
         */
        initPaypal() {
            const self = this;

            braintree.client.create({
                authorization: process.env.VUE_APP_BRAINTREE_SANDBOX_KEY
            }).then(clientInstance => {
                return braintree.paypalCheckout.create({
                    client: clientInstance
                });
            }).then(paypalInstance => {
                return paypal.Button.render( {
                    env: 'sandbox',
                    style: {
                        label: 'paypal',
                        size : 'responsive',
                        shape: 'rect'
                    },
                    payment() {
                        return paypalInstance.createPayment({
                            flow: 'checkout',
                            intent: 'sale',
                            amount: self.amount,
                            displayName: 'Braintree Testing',
                            currency: 'USD',
                        })
                    },
                    onAuthorize(data, options) {
                        return paypalInstance.tokenizePayment(options)
                            .then(response => {
                                self.error = null;
                                self.submitPayment(response);
                        })
                    },
                    onCancel(data) {
                        console.log(data);
                        console.log("Payment Cancelled");
                    },
                    onError(err) {
                        console.error(err);
                        self.error = "An error occurred while processing the paypal payment.";
                    }
                }, '#paypal-button')
            }).catch(function (err) {
                console.error('Error!', err);
            });
        },

        /**
         * Submit payment.
         *
         * @param response
         */
        submitPayment(response) {
            axios.post("api/payments", {
                nonce: response.nonce,
                amount: this.amount,
            }).then(() => {
                this.success = true;
            }).catch(error => {
                console.log(error);
            })
        }

    },
}
</script>
