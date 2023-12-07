import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // If present, this will have the form: "Basic <credential>"
  const basicAuth = context.request.headers.get('authorization');

  if (basicAuth) {
    // get auth value from string "Basic authValue"
    const authValue = basicAuth.split(' ')[1];
    if (authValue) {
      const [user, pwd] = atob(authValue).split(':');
      if (user === 'user' && pwd === 'pass') {
        // forward request
        return next();
      }
    }
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-authenticate': 'Basic realm="Secure Area"',
    },
  });
});
