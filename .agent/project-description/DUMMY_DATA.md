{
  "profile": {
    "username": "vinay_dev",
    "email": "vinay@example.com",
    "full_name": "Vinay",
    "currency": "INR"
  },

  "accounts": [
    { "name": "SBI Savings",  "type": "bank",        "initial_balance": 1000, "currency": "INR" },
    { "name": "ICICI Salary", "type": "bank",        "initial_balance": 1500, "currency": "INR" },
    { "name": "Cash",         "type": "cash",        "initial_balance": 20,   "currency": "INR" },
    { "name": "Credit Card",  "type": "credit_card", "initial_balance": 0,    "currency": "INR" }
  ],

  "transactions": [
    {
      "type": "income",
      "amount": 45000,
      "account": "ICICI Salary",
      "category": "Salary",
      "date": "2026-03-01",
      "note": "March salary"
    },
    {
      "type": "income",
      "amount": 8000,
      "account": "SBI Savings",
      "category": "Freelance",
      "date": "2026-03-03",
      "note": "UI design project"
    },
    {
      "type": "expense",
      "amount": 12000,
      "account": "SBI Savings",
      "category": "Housing / Rent",
      "date": "2026-03-05",
      "note": "March rent"
    },
    {
      "type": "expense",
      "amount": 450,
      "account": "Cash",
      "category": "Food & Drinks",
      "date": "2026-03-07",
      "note": "Vegetables and groceries"
    },
    {
      "type": "expense",
      "amount": 649,
      "account": "Credit Card",
      "category": "Subscriptions",
      "date": "2026-03-08",
      "note": "Netflix monthly"
    },
    {
      "type": "expense",
      "amount": 320,
      "account": "ICICI Salary",
      "category": "Transportation",
      "date": "2026-03-10",
      "note": "Ola to office"
    },
    {
      "type": "transfer",
      "amount": 10000,
      "from_account": "ICICI Salary",
      "to_account": "SBI Savings",
      "date": "2026-03-12",
      "note": "Moving to savings"
    },
    {
      "type": "expense",
      "amount": 1200,
      "account": "SBI Savings",
      "category": "Utilities",
      "date": "2026-03-14",
      "note": "BSES electricity"
    },
    {
      "type": "transfer",
      "amount": 500,
      "from_account": "SBI Savings",
      "to_account": "Cash",
      "date": "2026-03-16",
      "note": "Cash for the week"
    },
    {
      "type": "expense",
      "amount": 380,
      "account": "Cash",
      "category": "Food & Drinks",
      "date": "2026-03-18",
      "note": "Dinner with friends"
    }
  ]
}