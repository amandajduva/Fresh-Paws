const jwt = require('jsonwebtoken');

const secret = 'itisasecretttttt';
const expiration = '1h';

module.exports = {
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    //Split the token string into an array and return the new token
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    //if token can be verified, add the decoded users data to the request so it can be accessed in the resolver
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    //return the request object so it can be passed to the resolver as context
    return req;
  },
  signToken: function ({ email, username, _id }) {     //NEED TO MAKE SURE THESE MATCH FRONT END
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};