'use strict'

var test = require('tape')
var agent = require('supertest').agent
var rill = require('rill')
var refreshWith = require('../')

test('Updates Location header and QueryString', function (t) {
  t.plan(1)

  var request = agent(rill()
    .use(refreshWith())
    .get('/', function (ctx) {
      ctx.res.refreshWith({ a: 3, b: '' })
      t.equals(ctx.res.get('Location').split('?').pop(), 'a=3&c=3')
    })
    .listen().unref())

  // Request to load data.
  request
    .get('/')
    .query({ a: 1, b: 2, c: 3 })
    .expect(302)
    .then(function () {}, t.fail)
})
