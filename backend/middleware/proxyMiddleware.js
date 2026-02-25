const { createProxyMiddleware } = require('http-proxy-middleware');

// Example: Proxying requests from /api/external to a mock university resource
const universityProxy = createProxyMiddleware({
  target: 'https://api.mock-university-resources.com', // The external server
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    '^/api/external': '', // Remove /api/external from the final request
  },
  onProxyReq: (proxyReq, req, res) => {
    // Industry Tip: Add custom headers or API keys here so the frontend doesn't see them
    proxyReq.setHeader('X-Special-Proxy-Header', 'UMS-Backend-Auth');
  },
  onError: (err, req, res) => {
    res.status(500).json({ message: 'Proxy Error: External service unreachable.' });
  }
});

module.exports = universityProxy;