# ReneQ
Restaurant Reservation System

restaurant-rsvp/
├── client/                 # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.js
│   │   │   ├── SignUpForm.js
│   │   │   └── AuthContainer.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── validation.js
│   ├── models/
│   │   └── User.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── sql/
│   └── init.sql
├── README.md
└── .gitignore
