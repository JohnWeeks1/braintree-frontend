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
            error: null
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
            braintree.client.create({
                authorization: process.env.VUE_APP_BRAINTREE_SANDBOX_KEY
            }).then(function (clientInstance) {
                return braintree.paypalCheckout.create({
                    client: clientInstance
                });
            }).then(function (paypalInstance) {
                return paypal.Button.render({
                    env: 'sandbox',
                    style: {
                        label: 'paypal',
                        size: 'responsive',
                        shape: 'rect'
                    },
                    payment() {
                        return paypalInstance.createPayment({
                            flow: 'checkout',
                            intent: 'sale',
                            amount: 10.00,
                            displayName: 'Braintree Testing',
                            currency: 'USD'
                        })
                    },
                    onAuthorize(data, options) {
                        return paypalInstance.tokenizePayment(options)
                            .then(response => {
                            console.log(response);
                            // this.error = "";
                            axios.post("api/payments", {
                                nonce: response.nonce,
                                amount: 10.00,
                            }).then(() => {
                                    this.success = true;
                            }).catch(error => {
                                console.log(error);
                            })
                        })
                    },
                    // onCancel: (data) => {
                    //     console.log(data);
                    //     console.log("Payment Cancelled");
                    // },
                    // onError: (err) => {
                    //     console.error(err);
                    //     this.error = "An error occurred while processing the paypal payment.";
                    // }
                }, '#paypal-button')
            }).catch(function (err) {
                console.error('Error!', err);
            });
        },
    },
}
</script>
