// Deklarasi tipe untuk React
import * as React from "react";

// Deklarasi tipe untuk Material UI
declare module "@mui/material";
declare module "@mui/icons-material/*";

// Deklarasi tipe untuk Next.js
declare module "next/router";
declare module "next/link";

// Deklarasi tipe untuk bcryptjs
declare module "bcryptjs";

// Deklarasi tipe untuk process.env
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    JWT_SECRET: string;
  }
}

// Deklarasi tipe untuk JSX
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
