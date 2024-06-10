# Backend Authentication System

This repository demonstrates an authentication system with a Node.js backend. The frontend serves as a demonstration application to showcase backend functionality. Frontend page sources can be found at [Material-UI templates](https://mui.com/material-ui/getting-started/templates/) for SignIn and SignUp templates.

Deployed at: [Backend Authentication System](https://backend-auth-3hz6.onrender.com)

Please note that the initial loading time may take up to 50 seconds due to the usage of a free tier.

## Demo

### SignUp Page

![SignUp Page](https://github.com/ishan2829/backend-auth/assets/169195981/9b15aeeb-f1d3-4b7d-8ebd-0a47a579054f)

A successful signup will redirect the user to the signin page.

### SignIn Page

![SignIn Page](https://github.com/ishan2829/backend-auth/assets/169195981/6136142b-a241-40d9-9978-af11f983895e)

Upon successful signIn, the user is redirected to the dashboard page.

![Dashboard Page](https://github.com/ishan2829/backend-auth/assets/169195981/b6b50570-f046-4b50-b1be-449fddfec1ac)

The dashboard page makes a request to the backend to fetch the user's name and displays it. Users can click on the logout button; upon successful logout, the user is redirected to the signin page.

For security purposes, the system only allows one session per user. If a user is logged in on one browser and then logs in to another browser, the previous session is automatically invalidated. This system can be extended to support multiple sessions per user.

## Approach

The method is based on the Double Submit cookie method with slight modifications as outlined in this [StackOverflow post](https://stackoverflow.com/a/37396572).

When a user logs in, the following steps are performed:
- A JWT with an expiry of 1 hour is created and included in an HTTPOnly, secure, sameSite cookie with a maxAge of 1 hour.
- A CSRF Token is created and included in a secure, sameSite cookie with a maxAge of 1 hour.
- The CSRF Token is also stored in the database for the corresponding userId (as user session details).

When a user makes a request for a protected resource, the CSRF token is extracted from the cookie and must be passed in a header. This prevents CSRF attacks as the attacker's website cannot execute JavaScript to obtain the cookie and pass it as a header.

On the backend, when a request is received for a protected resource:
- The backend verifies the JWT, decodes it, and retrieves the userId.
- It compares the CSRF Token in the cookie with the one in the header.
- It then compares the CSRF Token with the token stored in the database.

The system only allows one session per user. If a user is logged in on one browser and then logs in to another browser, the previous session is automatically invalidated.

## Protection against XSS attacks

### Input Sanitization

- Input sanitization is performed using `Joi` and `sanitise-html`.

![Input Sanitization](https://github.com/ishan2829/backend-auth/assets/169195981/0e41d67e-d716-46c3-b591-096ce4aaa7dc)

- Content Security Policy via Helmet.

![Content Security Policy](https://github.com/ishan2829/backend-auth/assets/169195981/0dc060a4-fb46-4683-a243-36a41016aee5)

- The `html-entities` library is utilized to encode user-generated content before sending it to the frontend.
- `X-Content-Type-Options` is set to `nosniff` via helmet library. Browsers sometimes try to be helpful and guess the content type of a resource. This process is called MIME sniffing. However, this feature can be exploited by attackers to execute malicious code. The `X-Content-Type-Options: nosniff` header instructs the browser not to perform MIME sniffing on the response content. Instead, it must strictly adhere to the content type specified by the server in the Content-Type header. By preventing MIME sniffing, this header helps protect against certain types of attacks, such as cross-site scripting (XSS) attacks, where an attacker could disguise malicious code as a different content type (e.g., JavaScript disguised as an image) to bypass security mechanisms.

## CSRF Protection

- Double Submit Cookie method is employed as specified at the beginning of this document.
- The `sameSite` cookie attribute is applied to all cookies sent to the client.



## Running Locally

### Frontend

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

### Backend

1. Navigate to the `backend` directory.
2. Create a `.env` file and provide values for the variables specified in `.env.example`.
3. Run `npm install` to install dependencies.
4. Run `npx prisma generate`
5. Finally, run `npm start` to start the backend server.
