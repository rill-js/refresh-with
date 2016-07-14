'use strict'

var URL = require('url')
var QS = require('querystring')
var assign = require('deep-assign')
var qSet = require('q-set')
var qFlat = require('q-flat')
var queryReg = /\?[^#]+/g

module.exports = function () {
  return function refreshWithMiddleware (ctx, next) {
    var req = ctx.req
    var res = ctx.res

    res.refreshWith = function refreshWith (setters, opts) {
      opts = opts || {}

      // Get href, checking for back and defaulting to alt.
      var href = (opts.url === 'back' && (req.get('Referrer') || opts.alt)) || req.href

      // Pull out querystring from url and parse it.
      var m = href.match(queryReg)
      var query = m ? unflatten(QS.parse(m[0].slice(1))) : {}
      assign(query, setters)

      // Create the new query string and redirect.
      var querystring = '?' + QS.stringify(cast(qFlat(query)))
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

/**
 * Unflatten a query object.
 */
function unflatten (query) {
  var result = {}
  for (var key in query) qSet(result, key, query[key])
  return result
}
