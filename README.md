<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/refresh-with
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/refresh-with">
    <img src="https://img.shields.io/npm/v/@rill/refresh-with.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/refresh-with">
    <img src="https://img.shields.io/npm/dm/@rill/refresh-with.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Utility to redirect/refresh with an updated query string.

# Installation

```console
npm install @rill/refresh-with
```

# Example

```js
const app = require('rill')()
const refreshWith = require('@rill/refresh-with')

// Setup the middleware.
app.use(refreshWith())

// Use the 'res.refreshWith' utility.
// Example `href` is `http://test.com/my-view?modal=hello&test=1`
app.get('/my-view', ({ req, res }, next)=> {
	// Example usecase of removing a modal from the querystring.
	if (req.query.modal) {
		res.refreshWith({ modal: '', success: true })
		// Removes `modal` and adds `success=true`
		res.get('Location') // -> `http://test.com/my-view?success=true&test=1`
	}
})

// Example `referrer` is `http://test.com/my-view?modal=hello&test=1`
app.get('/from-somewhere-else', ({ req, res }, next)=> {
	// Example usecase of redirecting to the previous page while unsetting a modal.
	res.refreshWith({ modal: '', success: true }, { url: 'back' })
	// Removes `modal` and adds `success=true to the referrer`
	res.get('Location') // -> `http://test.com/my-view?success=true&test=1`
})
```

# API

###`ctx.res.refreshWith(setters:Object, options:Object)`
Similar to calling `ctx.res.redirect` but will update the current querystring with `setters` and default the `url` to the current `href`.
Specify the `options.url` option as `back` to automatically redirect to the `referrer` page.

You can also specify `options.alt` for the fallback when using `options.url = 'back'`.

---

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
