'use strict'

var URL = require('url')
var assign = require('deep-assign')
var qSet = require('q-set')
var qFlat = require('q-flat')

module.exports = function () {
  return function refreshWithMiddleware (ctx, next) {
    var req = ctx.req
    var res = ctx.res

    res.refreshWith = function refreshWith (setters, opts) {
      opts = opts || {}
      var href = (opts.url === 'back' && (req.get('Referrer') || opts.alt)) || opts.url || req.href
      var parsed = URL.parse(href, true)
      var query = unflatten(parsed.query || {})
      parsed.query = cast(qFlat(assign(query, setters)))
      if ('hash' in opts) parsed.hash = opts.hash
      delete parsed.search
      res.redirect(URL.format(parsed))
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
