'use strict'

var URL = require('mini-url')
var QS = require('mini-querystring')
var assign = require('deep-assign')
var qFlat = require('q-flat')

module.exports = function () {
  return function refreshWithMiddleware (ctx, next) {
    var req = ctx.req
    var res = ctx.res

    res.refreshWith = function refreshWith (setters, opts) {
      opts = opts || {}
      var href = (opts.url === 'back' && (req.get('Referrer') || opts.alt)) || opts.url || req.href
      var parsed = URL.parse(href)
      var query = QS.parse(parsed.search, true)
      var search = QS.stringify(cast(qFlat(assign(query, setters))))
      if (search) search = '?' + search

      res.redirect(URL.stringify({
        protocol: parsed.protocol,
        host: parsed.host,
        pathname: parsed.pathname,
        search: search,
        hash: opts.hash || parsed.hash
      }))
    }

    return next()
  }
}

/**
 * Ignores empty strings and undefined.
 * Converts date to iso string.
 * Converts everything else to a string.
 */
function cast (data) {
  var result = {}
  for (var key in data) {
    var val = data[key]
    if (val === '' || val === undefined) continue
    else if (val instanceof Date && isFinite(val)) result[key] = val.toISOString()
    else result[key] = String(val)
  }
  return result
}
