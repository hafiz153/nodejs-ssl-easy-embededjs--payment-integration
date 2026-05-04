# SSLCommerz Payment Integration (Node.js)

A Node.js implementation of SSLCommerz payment integration with both Embedded (popup) and Hosted (redirect) options using Express.js.

## Features

- **Embedded Payment**: Popup-based payment without leaving your site
- **Hosted Payment**: Redirect-based payment on SSLCommerz hosted page
- Express.js backend API
- SSLCommerz sandbox/live integration
- Easy configuration via environment variables

## Prerequisites

- Node.js installed
- SSLCommerz merchant account (sandbox or live)

## Installation

```bash
npm install
```

## Configuration

Edit the `.env` file with your credentials:
```
STORE_ID=your_store_id
STORE_PASSWORD=your_store_password
SUCCESS_URL=http://localhost:3000/payment/success
FAIL_URL=http://localhost:3000/payment/fail
CANCEL_URL=http://localhost:3000/payment/cancel
SSL_COMMERZ_API_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
PORT=3000
```

For production, change `SSL_COMMERZ_API_URL` to:
```
SSL_COMMERZ_API_URL=https://securepay.sslcommerz.com/gwprocess/v4/api.php
```

## Usage

Start the server:
```bash
npm start
```

Visit `http://localhost:3000` to see both payment options:
- **Embedded Payment**: Click "Pay with Popup" for inline payment
- **Hosted Payment**: Click "Pay with Redirect" to redirect to SSLCommerz

## Payment Flow

### Embedded Payment (Popup)
1. User clicks "Pay with Popup" button
2. SSLCommerz embed script sends payment data to `/initiate-payment` endpoint
3. Server forwards request to SSLCommerz API
4. SSLCommerz returns a GatewayPageURL
5. Embedded popup opens with the payment page
6. User completes payment and is redirected to success/fail/cancel URL

### Hosted Payment (Redirect)
1. User clicks "Pay with Redirect" button
2. Frontend sends payment data to `/initiate-hosted-payment` endpoint
3. Server forwards request to SSLCommerz API
4. SSLCommerz returns a GatewayPageURL
5. User is redirected to SSLCommerz hosted payment page
6. User completes payment and is redirected back to success/fail/cancel URL

## API Endpoints

### POST `/initiate-payment` (Embedded/Popup)

Called automatically by SSLCommerz embed script.

Request body (JSON or URL-encoded):
```json
{
  "total_amount": "50",
  "currency": "BDT",
  "tran_id": "order_12345",
  "cus_name": "Test User",
  "cus_email": "test@example.com",
  "cus_phone": "01700000000"
}
```

Response:
```json
{
  "status": "success",
  "data": "https://sandbox.sslcommerz.com/...",
  "logo": "https://..."
}
```

### POST `/initiate-hosted-payment` (Hosted/Redirect)

Called by frontend JavaScript.

Same request body as above.

Response:
```json
{
  "status": "success",
  "redirect_url": "https://sandbox.sslcommerz.com/..."
}
```

### GET `/hosted-payment` (Direct Redirect)

Query parameters:
```
/hosted-payment?total_amount=50&currency=BDT&tran_id=order_12345&...
```

Redirects directly to SSLCommerz payment page.

## File Structure

```
├── server.js           # Express server with payment endpoints
├── public/
│   └── index.html      # Frontend with both payment options
├── .env                # Environment variables (not committed)
├── .gitignore          # Git ignore rules
└── package.json        # Node.js dependencies
```

## Notes

- The `.env` file contains sensitive credentials and is excluded from git
- SSLCommerz sandbox credentials can be obtained from [sandbox.sslcommerz.com](https://sandbox.sslcommerz.com)
- Test card details are available in the SSLCommerz sandbox documentation
- The embedded payment uses SSLCommerz's official embed script and requires no changes to work
