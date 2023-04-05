import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxy = createProxyMiddleware({
  target: process.env.ZOOM_HOST,
  changeOrigin: true,
  pathRewrite: {
    '^/zoom/api': '',
  },

  onProxyRes: (proxyRes, req, res) => {
    console.log(
      'ZOOM API PROXY ==============================================',
      '\n'
    );

    const body = [];

    proxyRes
      .on('error', (err) => {
        console.error(err)
      })
      .on('data', (chunk) => {
        body.push(chunk)
      })
      .on('end', () => {
        const strBody = Buffer.concat(body).toString()
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
        console.log(
          `Zoom API Proxy => ${req.method} ${req.path} -> [${proxyRes.statusCode}] ${strBody}`
        )

        res.end()
      })
  }
})
