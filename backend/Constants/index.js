const constants = {
  passwordSaltRounds: 10,
  helmetOptions: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        // mui loading inline-styles
        // https://github.com/mui/material-ui/issues/19938
        // pass hash to load inline-styles
        styleSrc: [
          "'self'",
          'https://fonts.googleapis.com',
          `'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='`,
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'"],
        objectSrc: [],
        mediaSrc: [],
        frameSrc: [],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        connectSrc: ["'self'"],
      },
      reportOnly: false,
    },
    // no referrer information is sent when navigating to a new page.
    referrerPolicy: {
      policy: 'no-referrer',
    },
    // Strict-Transport-Security header tells browsers to prefer HTTPS instead of insecure HTTP
    strictTransportSecurity: {
      maxAge: 15552000, // remember for 180 days
      includeSubDomains: true,
      preload: true,
    },
    // X-Content-Type-Options: nosniff
    // tells browser not to guess content type
    // By preventing MIME sniffing,
    // this header helps protect against certain types of attacks,
    // such as cross-site scripting (XSS) attacks, where an attacker could disguise malicious code as a different
    // content type (example - JavaScript disguised as an image) to bypass security mechanisms.
    xContentTypeOptions: true,
  },
};

export default constants;
