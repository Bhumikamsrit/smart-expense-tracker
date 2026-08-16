import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    transactions: {
      executor: "constant-arrival-rate",
      rate: 1100,
      timeUnit: "1s",
      duration: "60s",
      preAllocatedVUs: 200,
      maxVUs: 1000,
    },
  },
};

export default function () {
  const payload = JSON.stringify({
    merchant: "Demo Merchant",
    amount: 499,
    method: "UPI",
  });
  const res = http.post(`${__ENV.BASE_URL}/v1/transactions`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  check(res, { "accepted": (r) => r.status === 200 });
}
