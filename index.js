'use strict'

var URL = require('url')
var QS = require('querystring')
var qFlat = require('q-flat')
var queryReg = /\?[^#]+/g

module.exports = function () {
  return function refreshWithMiddleware (ctx, next) {
    var req = ctx.req
    var res = ctx.res

    res.refreshWith = function refreshWith (setters, opts) {
      setters = qFlat(setters)
      opts = opts || {}

      // Get href, checking for back and defaulting to alt.
      var href = (opts.url === 'back' && (req.get('Referrer') || opts.alt)) || req.href

      // Pull out querystring from url and parse it.
      var m = href.match(queryReg)
      var query = m ? QS.parse(m[0].slice(1)) : {}

      // Assign setters to query.
      for (var key in setters) query[key] = setters[key]

      // Create the new query string and redirect.
      var querystring = '?' + QS.stringify(cast(query))
      var hash = req.hash || ''
      res.redirect(URL.resolve(href, querystring + hash))
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
