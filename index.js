'use strict'

var URL = require('url')
var QS = require('querystring')
var qFlat = require('q-flat')
var set = require('dot-prop').set
var has = Object.prototype.hasOwnProperty

module.exports = function () {
  return function refreshWithMiddleware (ctx, next) {
    var req = ctx.req
    var res = ctx.res

    res.refreshWith = function refreshWith (setters, opts) {
      opts = opts || {}
      var href = (opts.url === 'back' && (req.get('Referrer') || opts.alt)) || req.href
      if (isEmpty(setters)) return res.redirect(href)
      var querystring = buildQS(req.query, setters)
      var hash = req.hash || ''
      res.redirect(URL.resolve(href, querystring + hash))
    }

    return next()
  }
}

/**
 * Updates an old query and turns it into a query string.
 */
function buildQS (query, setters) {
  // Deep clone query.
  query = JSON.parse(JSON.stringify(query))
  // Set all keys from options.
  for (var key in setters) set(query, key, setters[key])
  // Build a query string.
  return isEmpty(query) ? '' : '?' + QS.stringify(cast(qFlat(query)))
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
 * Check if a value is empty.
 */
function isEmpty (val) {
  for (var key in val) if (has.call(val, key)) return false
  return true
}
