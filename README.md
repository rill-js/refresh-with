[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Chat about Rill at https://gitter.im/rill-js/rill](https://badges.gitter.im/rill-js/rill.svg)](https://gitter.im/rill-js/rill?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Rill Refresh-With
Utility to redirect/refresh with an updated query string.

# Installation

#### Npm
```console
npm install @rill/refresh-with
```

# Example

#### Load the data in middleware.
```js
const app = rill();
const refreshWith = require("@rill/refresh-with")

// Setup the middleware.
app.use(refreshWith())

// Use the 'res.refreshWith' utility.
// Example `href` is `http://test.com/my-view?modal=hello&test=1`
app.get("/my-view", ({ req, res }, next)=> {
	// Example usecase of removing a modal from the querystring.
	if (req.query.modal) {
		res.refreshWith({ modal: undefined, success: true })
		// Removes `modal` and adds `success=true`
		res.get('Location') // -> `http://test.com/my-view?success=true&test=1`

		return
	}
})

// Example `referrer` is `http://test.com/my-view?modal=hello&test=1`
app.get("/from-somewhere-else", ({ req, res }, next)=> {

	// Example usecase of removing a modal from the querystring then redirect to the previous page.
	res.refreshWith({ modal: undefined, success: true }, { back: true })
	// Removes `modal` and adds `success=true to the referrer`
	res.get('Location') // -> `http://test.com/my-view?success=true&test=1`
})
```

# API

###`ctx.res.refreshWith(setters:Object, options:Object)`
Similar to calling `ctx.res.refresh` but will update the current querystring with `setters`.
Specify the `options.back` option as `true` to automatically redirect to the `referrer` page.


```

---

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
