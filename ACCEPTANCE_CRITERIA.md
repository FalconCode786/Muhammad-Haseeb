# Acceptance Criteria

This document captures the acceptance criteria for the primary user flows in this repository and maps them to the current validation logic in the backend and UI. These criteria are intentionally aligned with the existing implementation to keep the documentation authoritative and easy to validate.

## Validation Sources

- Backend request validation: `backend/middleware/validation.js`
- Contact API behavior: `backend/controllers/contactController.js` and `backend/routes/contact.js`
- Consultation API behavior: `backend/controllers/consultationController.js` and `backend/routes/consultation.js`
- Auth API behavior: `backend/routes/auth.js` (login + token verification)
- Frontend step gating: `05-tailwind-css/src/components/Contact.jsx` and `05-tailwind-css/src/components/Consultation.jsx`

## Contact Form (POST `/api/contact`)

### Acceptance Criteria
- **AC1: Required personal details**
  - Full name and contact number are required before submission.
  - Backend rejects missing/empty values with a `400 Validation failed` response.
- **AC2: Email validation (optional)**
  - Email is optional, but when provided must be a valid email address.
  - Backend rejects invalid email formats with a `400 Validation failed` response.
- **AC3: Length and URL constraints**
  - `projectName` must be ≤ 200 characters.
  - `message` must be ≤ 2000 characters.
  - `uiLink` must be a valid URL when provided.
  - Backend rejects violations with a `400 Validation failed` response.
- **AC4: Successful submission response**
  - Successful submissions return `201` with `{ success: true }` and the created contact ID.
- **AC5: UI step gating**
  - The frontend allows the user to continue from step 1 only when full name and contact number are provided.

### Validation Mapping
- Required field checks, email, URL, and length validation: `backend/middleware/validation.js` (`validateContact`)
- Successful response payload: `backend/controllers/contactController.js` (`submitContact`)
- Step gating: `05-tailwind-css/src/components/Contact.jsx` (`isStepValid`)

## Consultation Booking (POST `/api/consultation`)

### Acceptance Criteria
- **AC1: Required booking details**
  - Name, email, topic, date, and time are required for booking.
  - Backend rejects missing values with a `400 Validation failed` response.
- **AC2: Email and date validation**
  - Email must be valid.
  - Date must be ISO-8601 and cannot be in the past.
  - Backend rejects invalid values with a `400 Validation failed` response.
- **AC3: Consultation type restrictions**
  - `type` must be one of `video`, `phone`, or `chat` when provided.
  - Backend rejects invalid values with a `400 Validation failed` response.
- **AC4: No double-booking**
  - Booking a time slot that is already taken returns `409` with a conflict message.
- **AC5: Successful booking response**
  - Successful bookings return `201` with `{ success: true }` and booking details.
- **AC6: UI step gating**
  - Step 1 requires name, email, and topic.
  - Step 2 requires date, time, and type before continuing.

### Validation Mapping
- Required field checks, email, date, and type validation: `backend/middleware/validation.js` (`validateConsultation`)
- Double-booking check and success response: `backend/controllers/consultationController.js` (`bookConsultation`)
- Step gating: `05-tailwind-css/src/components/Consultation.jsx` (`isStepValid`)

## Auth (POST `/api/auth/login`, GET `/api/auth/verify`)

### Acceptance Criteria
- **AC1: Invalid credentials**
  - Invalid email or password returns `401` with `Invalid credentials`.
- **AC2: Successful login**
  - Valid credentials return `200` with `success: true` and a JWT token payload.
- **AC3: Token verification**
  - Requests without a token return `401` with `No token`.
  - Invalid tokens return `401` with `Invalid token`.

### Validation Mapping
- Login checks and token response: `backend/routes/auth.js`
- Token verification behavior: `backend/routes/auth.js` (`/verify` route)
