# Wealtment Limited — Next.js 15 Investment Platform

**Base URL:** `https://wealtment-backend.onrender.com/api`

## Quick Start

```bash
npm install
npm run dev
```

---

## Architecture

### `src/lib/endpointRoute.ts` — Central HTTP Client

All API calls go through `endpointRoute`. It auto-attaches the Bearer token from localStorage on every request. **Import this everywhere instead of raw fetch.**

```ts
import { endpointRoute } from "@/lib/endpointRoute";

// GET (token auto-attached)
const data = await endpointRoute.get("/plans");

// POST
const res  = await endpointRoute.post("/auth/login", { email, password });

// PUT
await endpointRoute.put("/users/profile", { name, bitcoinAddress });

// DELETE
await endpointRoute.delete("/plans/abc123");

// File upload (multipart/form-data)
await endpointRoute.upload("/deposits", formData);
```

### `src/lib/api.ts` — All API Functions

Import from here in pages. Never call `endpointRoute` directly in pages.

---

## API Integration Status

### ✅ AUTH MODULE — Fully Integrated
| Endpoint | Function | Page |
|---|---|---|
| POST /auth/signup | `apiSignup()` | `/signup` |
| POST /auth/login | `apiLogin()` | `/login` |
| POST /auth/forgot-password | `apiForgotPassword()` | `/forgot-password` |
| POST /auth/reset-password | `apiResetPassword()` | `/reset-password` |

### ✅ USER MODULE — Fully Integrated
| Endpoint | Function | Page |
|---|---|---|
| GET /users/profile | `apiGetProfile()` | `/user/profile`, `/user/dashboard` |
| PUT /users/profile | `apiUpdateProfile()` | `/user/profile` |

### ✅ PLAN MODULE — Fully Integrated
| Endpoint | Function | Page |
|---|---|---|
| GET /plans | `apiGetPlans()` | `/plans` (public), `/user/packages`, `/admin/packages` |
| POST /plans | `apiCreatePlan()` | `/admin/packages` |
| PUT /plans/:id | `apiUpdatePlan()` | `/admin/packages` |
| DELETE /plans/:id | `apiDeletePlan()` | `/admin/packages` |

### ✅ INVESTMENT MODULE — Fully Integrated
| Endpoint | Function | Page |
|---|---|---|
| POST /investments | `apiInvest()` | `/user/packages` |
| GET /investments/my | `apiGetMyInvestments()` | `/user/dashboard`, `/user/packages` |
| GET /investments | `apiGetAllInvestments()` | `/admin` (overview), `/admin/users` |

### ✅ DEPOSIT MODULE — Fully Integrated
| Endpoint | Function | Page |
|---|---|---|
| POST /deposits | `apiCreateDeposit()` | `/user/deposit` |
| GET /deposits/my | `apiGetMyDeposits()` | `/user/deposit` (history) |
| GET /deposits | `apiGetAllDeposits()` | `/admin` (pending deposits table) |
| PUT /deposits/:id/approve | `apiApproveDeposit()` | `/admin` (approve button) |

### ✅ WITHDRAWAL MODULE — Fully Integrated
| Endpoint | Function | Page |
|---|---|---|
| POST /withdrawals | `apiRequestWithdrawal()` | `/user/withdraw` |
| GET /withdrawals/my | `apiGetMyWithdrawals()` | `/user/withdraw` (history) |
| GET /withdrawals | `apiGetAllWithdrawals()` | `/admin/withdrawals` |
| PUT /withdrawals/:id/approve | `apiApproveWithdrawal()` | `/admin` + `/admin/withdrawals` |

---

## Routes

### Public
| Route | Description |
|---|---|
| `/` | Home — ticker, plans, features, live transactions |
| `/about` | About Us |
| `/faq` | FAQ accordion |
| `/plans` | Plans (fetched from API) |
| `/affiliates` | Referral program |
| `/support` | Support form |
| `/contact` | Contact form |
| `/login` | Login → saves token, redirects by role |
| `/signup` | Register → saves token, redirects to dashboard |
| `/forgot-password` | Request password reset email |
| `/reset-password?token=XXX` | Reset password with token |

### User (protected — token required)
| Route | Description |
|---|---|
| `/user/dashboard` | BTC + LTC balances, investments, live prices |
| `/user/packages` | Browse plans, invest, view my investments |
| `/user/deposit` | Deposit BTC/LTC with address + instructions |
| `/user/withdraw` | Withdraw to saved wallet address |
| `/user/profile` | Edit name + wallet addresses |

### Admin (protected — admin role required)
| Route | Description |
|---|---|
| `/admin` | Overview: stats, pending deposits, pending withdrawals, all investments |
| `/admin/users` | All investments list |
| `/admin/packages` | CRUD for investment plans |
| `/admin/withdrawals` | All withdrawals — filter, search, approve |

---

## Token Flow

1. User logs in → `apiLogin()` returns `{ token, user }`
2. `setUser(user)` in `src/lib/auth.ts` calls `saveToken(token)` → stores in `localStorage`
3. Every subsequent `endpointRoute.get/post/put/delete()` call reads the token via `getToken()` and adds `Authorization: Bearer <token>`
4. On logout → `removeUser()` calls `clearToken()` → token removed from localStorage

## Notes for Remaining Work

- **Deposit proof image upload**: The API accepts a `proof` field (image URL or base64). Currently the form doesn't include file upload — add a `<input type="file">` → convert to base64 → pass as `proof` in `apiCreateDeposit()`.
- **Admin user deletion**: Not in the API spec. Handle via a separate backend endpoint if needed.
- **Withdrawal rejection**: The API spec only has `/approve`. A reject endpoint needs to be added on the backend.
- **Real BTC/LTC balances**: Currently derived locally. The backend should return wallet balances via the profile endpoint or a dedicated `/users/balance` endpoint.
