const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Embedded payment initiation endpoint (popup) - KEEP UNCHANGED
app.post('/initiate-payment', async (req, res) => {
    try {
        const { total_amount=50, currency = 'BDT', tran_id, cus_name, cus_email, cus_phone, ...rest } = req.body;

        if (!total_amount) {
            return res.status(400).json({ status: 'fail', message: 'total_amount is required' });
        }

        const sslczData = {
            store_id: process.env.STORE_ID,
            store_passwd: process.env.STORE_PASSWORD,
            total_amount: total_amount.toString(),
            currency,
            tran_id: tran_id || `tran_${Date.now()}`,
            success_url: process.env.SUCCESS_URL,
            fail_url: process.env.FAIL_URL,
            cancel_url: process.env.CANCEL_URL,
            cus_name: cus_name || '',
            cus_email: cus_email || '',
            cus_phone: cus_phone || '',
            cus_add1: rest.cus_add1 || 'Dhaka',
            cus_city: rest.cus_city || 'Dhaka',
            cus_country: rest.cus_country || 'Bangladesh',
            ship_name: rest.ship_name || 'Store Test',
            ship_city: rest.ship_city || 'Dhaka',
            ship_country: rest.ship_country || 'Bangladesh',
            emi_option: rest.emi_option || '0'
        };

        if (rest.cart) {
            sslczData.cart = JSON.stringify(rest.cart);
        }

        const response = await axios.post(process.env.SSL_COMMERZ_API_URL, 
            new URLSearchParams(sslczData).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const sslcz = response.data;

        if (sslcz.status === 'SUCCESS' && sslcz.GatewayPageURL) {
            return res.json({ status: 'success', data: sslcz.GatewayPageURL, logo: sslcz.storeLogo });
        }
        res.status(400).json({ status: 'fail', message: sslcz.failedreason || 'Payment initiation failed' });
    } catch (err) {
        console.error('Payment error:', err.message);
        res.status(500).json({ status: 'fail', message: 'SSLCommerz API connection failed' });
    }
});

// Hosted payment initiation endpoint (redirect-based) - NEW
app.post('/initiate-hosted-payment', async (req, res) => {
    try {
        const { total_amount, currency = 'BDT', tran_id, cus_name, cus_email, cus_phone, ...rest } = req.body;

        if (!total_amount) {
            return res.status(400).json({ status: 'fail', message: 'total_amount is required' });
        }

        const sslczData = {
            store_id: process.env.STORE_ID,
            store_passwd: process.env.STORE_PASSWORD,
            total_amount: total_amount.toString(),
            currency,
            tran_id: tran_id || `tran_${Date.now()}`,
            success_url: process.env.SUCCESS_URL,
            fail_url: process.env.FAIL_URL,
            cancel_url: process.env.CANCEL_URL,
            cus_name: cus_name || '',
            cus_email: cus_email || '',
            cus_phone: cus_phone || '',
            cus_add1: rest.cus_add1 || 'Dhaka',
            cus_city: rest.cus_city || 'Dhaka',
            cus_country: rest.cus_country || 'Bangladesh',
            ship_name: rest.ship_name || 'Store Test',
            ship_city: rest.ship_city || 'Dhaka',
            ship_country: rest.ship_country || 'Bangladesh',
            emi_option: rest.emi_option || '0'
        };

        if (rest.cart) {
            sslczData.cart = JSON.stringify(rest.cart);
        }

        const response = await axios.post(process.env.SSL_COMMERZ_API_URL, 
            new URLSearchParams(sslczData).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const sslcz = response.data;

        if (sslcz.status === 'SUCCESS' && sslcz.GatewayPageURL) {
            return res.json({ status: 'success', redirect_url: sslcz.GatewayPageURL });
        }
        res.status(400).json({ status: 'fail', message: sslcz.failedreason || 'Payment initiation failed' });
    } catch (err) {
        console.error('Payment error:', err.message);
        res.status(500).json({ status: 'fail', message: 'SSLCommerz API connection failed' });
    }
});

// Hosted payment direct redirect (GET) - NEW
app.get('/hosted-payment', async (req, res) => {
    try {
        const { total_amount, currency = 'BDT', tran_id, cus_name, cus_email, cus_phone, ...rest } = req.query;

        if (!total_amount) {
            return res.status(400).send('total_amount is required');
        }

        const sslczData = {
            store_id: process.env.STORE_ID,
            store_passwd: process.env.STORE_PASSWORD,
            total_amount: total_amount.toString(),
            currency,
            tran_id: tran_id || `tran_${Date.now()}`,
            success_url: process.env.SUCCESS_URL,
            fail_url: process.env.FAIL_URL,
            cancel_url: process.env.CANCEL_URL,
            cus_name: cus_name || '',
            cus_email: cus_email || '',
            cus_phone: cus_phone || '',
            cus_add1: rest.cus_add1 || 'Dhaka',
            cus_city: rest.cus_city || 'Dhaka',
            cus_country: rest.cus_country || 'Bangladesh',
            ship_name: rest.ship_name || 'Store Test',
            ship_city: rest.ship_city || 'Dhaka',
            ship_country: rest.ship_country || 'Bangladesh',
            emi_option: rest.emi_option || '0'
        };

        if (rest.cart) {
            sslczData.cart = JSON.stringify(rest.cart);
        }

        const response = await axios.post(process.env.SSL_COMMERZ_API_URL, 
            new URLSearchParams(sslczData).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const sslcz = response.data;

        if (sslcz.status === 'SUCCESS' && sslcz.GatewayPageURL) {
            return res.redirect(302, sslcz.GatewayPageURL);
        }
        res.status(400).send(sslcz.failedreason || 'Payment initiation failed');
    } catch (err) {
        console.error('Payment error:', err.message);
        res.status(500).send('SSLCommerz API connection failed');
    }
});

// Payment redirect handlers
app.get('/payment/success', (req, res) => {
    res.send(`<h1>Payment Success!</h1><p>Transaction ID: ${req.query.tran_id}</p>`);
});

app.get('/payment/fail', (req, res) => {
    res.send('<h1>Payment Failed</h1>');
});

app.get('/payment/cancel', (req, res) => {
    res.send('<h1>Payment Cancelled</h1>');
});

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
