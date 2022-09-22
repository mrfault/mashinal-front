export default function(req, res, next) {
  const url = req.url
  const deepLinkQuery = req.query.location
  const userAgent = req.headers['user-agent']
  const isIpad = userAgent.match(/iPad/)
  const isAndroid = userAgent.match(/Android/)
  const isIphone = userAgent.match(/iPhone/)
  const redirects = [
    {
      from: deepLinkQuery ? req.url : '',
      to: `app-redirect?isIpad=${isIpad}&isAndroid=${isAndroid}&isIphone=${isIphone}&location=${deepLinkQuery}`
    }
  ]
  const redirect = redirects.find((r) => r.from === url)
  if (redirect) {
    res.writeHead(301, { Location: redirect.to })
    res.end()
  } else {
    next()
  }
}
