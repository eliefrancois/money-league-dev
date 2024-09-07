

# **MoneyLeague**

**MoneyLeague** is a fantasy football platform that simplifies managing league funds. It allows commissioners to set up leagues, manage buy-ins, and automatically disperse payouts at the end of the season. Leveraging secure payment processing with Stripe and USDC accrual through Coinbase, MoneyLeague ensures that funds are handled efficiently and transparently.

## **Table of Contents**
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [How to Contribute](#how-to-contribute)
7. [License](#license)

---

## **Features**

- **League Creation**: Commissioners can create leagues, set buy-in fees, and specify payout rules.
- **Automated Payment Processing**: Players pay buy-ins via fiat payments (Stripe), which are converted to USDC and held in Coinbase for interest accrual.
- **Payout Automation**: At the end of the season, payouts are automatically distributed based on predefined league rules.
- **ESPN League Sync**: Syncs with ESPN to track user leagues, manage payments, and link fantasy football data.
- **Notifications**: Automated push notifications and emails to remind users about payments and league progress.

---

## **Tech Stack**

- **Frontend**: 
  - Expo (React Native) for the mobile app
  - Tamagui for UI components
- **Backend**:
  - Node.js/Express.js for API services
  - Supabase for database management and authentication
  - Stripe API for payment processing
  - Coinbase API for managing USDC holdings
- **Automation & Smart Contracts**:
  - Cron jobs to trigger payouts and other scheduled tasks
  - Optionally, Seahorse for smart contract handling (currently not in use)

---

## **Getting Started**

To get started with MoneyLeague, follow these instructions:

### **Prerequisites**
- Node.js installed (v14.x or higher)
- Expo CLI for mobile development
- Stripe account for payment processing
- Coinbase account for USDC handling
- Supabase account for authentication and database

<!-- ### **Environment Variables**

You'll need to set up environment variables for the following keys in a `.env` file:

```
STRIPE_API_KEY=<your_stripe_api_key>
COINBASE_API_KEY=<your_coinbase_api_key>
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_key>
ESPN_S2=<user_espn_s2_token>
SWID=<user_swid_token>
```

--- -->

## **Installation**

Clone the repo:

```bash
git clone https://github.com/eliefrancois/money-league-dev.git
cd money-league-dev
```

Install dependencies:

<!-- ### **Backend Setup**

```bash
cd backend
npm install
``` -->

<!-- Run the backend server:

```bash
npm start
``` -->

### **Frontend Setup**

```bash
npm install
```

Run the frontend:

```bash
npx expo start
```

---

<!-- ## **API Endpoints**

Here are a few key API endpoints:

### **POST** `/league/create`
- **Description**: Create a new league with specified buy-in fee and payout rules.
- **Body Parameters**:
  ```json
  {
    "leagueName": "string",
    "buyInFee": "number",
    "payoutRules": "object",
    "leagueSize": "number"
  }
  ```

### **GET** `/league/status`
- **Description**: Get the current status of a league (number of payments completed, remaining members).
- **Response**:
  ```json
  {
    "leagueName": "string",
    "membersPaid": "number",
    "membersRemaining": "number"
  }
  ```

### **POST** `/payout/trigger`
- **Description**: Triggers the payout process when the league concludes, and distributes winnings to the appropriate users.

--- -->

## **How to Contribute**

We welcome contributions! Here’s how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch-name`)
5. Open a pull request

---

## **License**

This project is licensed under the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0) - see the `LICENSE` file for details.

---