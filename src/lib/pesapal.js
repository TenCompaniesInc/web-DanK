// src/lib/pesapal.js
// Shared helper for talking to Pesapal API 3.0 (sandbox or live, controlled by env vars)

const PESAPAL_ENV = process.env.PESAPAL_ENV || "sandbox"; // "sandbox" | "live"

const BASE_URLS = {
  sandbox: "https://cybqa.pesapal.com/pesapalv3",
  live: "https://pay.pesapal.com/v3",
};

const BASE_URL = BASE_URLS[PESAPAL_ENV];

function getCredentials() {
  const consumerKey =
    PESAPAL_ENV === "live"
      ? process.env.PESAPAL_LIVE_CONSUMER_KEY
      : process.env.PESAPAL_SANDBOX_CONSUMER_KEY;
  const consumerSecret =
    PESAPAL_ENV === "live"
      ? process.env.PESAPAL_LIVE_CONSUMER_SECRET
      : process.env.PESAPAL_SANDBOX_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error(
      `Missing Pesapal credentials for env "${PESAPAL_ENV}". Check your .env.local`
    );
  }
  return { consumerKey, consumerSecret };
}

// Simple in-memory token cache (token is valid 5 mins; safe to reuse across requests within that window).
let cachedToken = null;
let cachedTokenExpiry = 0;

export async function getPesapalToken() {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiry - 10000) {
    return cachedToken;
  }

  const { consumerKey, consumerSecret } = getCredentials();

  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });

  const data = await res.json();

  if (!data.token) {
    throw new Error("Pesapal auth failed: " + (data.message || JSON.stringify(data)));
  }

  cachedToken = data.token;
  cachedTokenExpiry = new Date(data.expiryDate).getTime();
  return cachedToken;
}

export async function registerIPN(url, type = "GET") {
  const token = await getPesapalToken();
  const res = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, ipn_notification_type: type }),
  });
  return res.json();
}

export async function submitOrderRequest(orderPayload) {
  const token = await getPesapalToken();
  const res = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });
  return res.json();
}

export async function getTransactionStatus(orderTrackingId) {
  const token = await getPesapalToken();
  const res = await fetch(
    `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
}

export { PESAPAL_ENV, BASE_URL };