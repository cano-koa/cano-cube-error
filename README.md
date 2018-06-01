# cano-cube-error
Build clases for handling errors defined in a JSON file for the [cano-koa](https://github.com/cano-koa/cano-koa) microframework.
This is the json structure that represents the error group for users:

```json
{
  "opts": {
    "unknownError": {
      "code": "UserUnknownError",
      "description": "Unknown error. Please contact the API provider for more information.",
      "status": 400
    },
    "className":"UserError"
  },
  "notFound": {
    "status": 404,
    "description": "User not found."
  },
  "emailExist": {
    "status": 400,
    "description": "The email already exist in system."
  }
}
```

The first level of the object represents the possible errors (code error), except for the `opts` field. This field allows you to add settings for the class to be built. So far  the options `unknownError`  and `className` can be configured. If the `opts` field is not specified, the following default will be set:

```json
{
  "code": "UnknownError",
  "description": "Unknown error. Please contact the API provider for more information.",
  "status": 400
}
```

If the className field is not specified, the name of the file will be taken as the class name.

At the next level of the json structure, for each error a `description` field must be defined that explains the error and a `status` field that will be an HTTP status to respond to the query affected by error:


```json
{
    "description": "User not found.",
    "status": 404
}
```

If some of these two fields is not defined, the fields defined in `opts.unknownError` will be taken. If these are also not defined, the default fields of the quark will be taken.

Each built class is inserted as global. The classes will have as name, the name of the json file where their errors were defined.

To generate a new error, you must only create a new object of some of the classes and pass by parameter the error code and the native error (error object or string) that occurred:

```javascript
throw new UserError('notFound', 'This is native error.')
```
#### The method process
Also each class contains a static method called `process` that receives by parameter the context of the request and the error. This allows you to configure the response of the request for a defined or unknown error.

```javascript
try {
    throw new UserError('notFound', new Error('this is native error.'))
} catch (err) {
    UserError.process(req, err)
}
```

The process method responds to the request with the status defined according to the type of error and as body an object with the fields `description` and `code` defined.

```json
{
    "description": "User not found.",
    "code": "notFound"
}
```

#### Tasks
The tasks will be defined in a function object in a file named `tasks.js` located in the `errors` folder. The names of the functions must be equal to the name of the error class to which it corresponds. The only parameter of these functions will always be an object with the body, the params and the query of the http request. The functions will keep the context of the class error. See the following example.

```javascript
module.exports = {
    UserError: function ({ body, params, query }) {
        console.error(`UserError
            Body ${JSON.stringify(body)}
            Params ${JSON.stringify(params)}
            Query ${JSON.stringify(query)}
            Error ${JSON.stringify(this.standarError)}`)
    }
}
```

The tasks will be called at the end of the execution of the `process` method.

More information in the test.
