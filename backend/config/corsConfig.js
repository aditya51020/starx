export const ALLOWED_ORIGINS = [
  "https://starxbuildtech.co.in",
  "https://www.starxbuildtech.co.in",
  "https://starxbuildtech.co.in/",
  "https://www.starxbuildtech.co.in/",
  "https://starxproperties.in",
  "https://www.starxproperties.in",
  "https://starxproperties.in/",
  "https://www.starxproperties.in/",
  "https://starx-nu.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

export const corsOptions = {
  origin: (origin, callback) => {
    // console.log('Incoming Origin:', origin);
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS Blocked Origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};
