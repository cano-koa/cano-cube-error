
# proton-quark-error
Build clases for handling errors defined in a JSON file for the [proton-koa](https://github.com/nucleos-io/proton-koa) microframework.
This is the json structure that represents the error group for users (assume that the file is named `UserError.json`):

```sh
{
  "opts": {
    "unknownError": {
      "code": "UserUnknownError",
      "description": "Unknown error. Please contact the API provider for more information.",
      "status": 400
    }
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

The first level of the object represents the possible errors (code error), except for the `opts` field. This field allows you to add settings for the class to be built. So far only the option `unknownError` can be configured. If this option is not specified, the following default will be set:

```sh
{
  "code": "UnknownError",
  "description": "Unknown error. Please contact the API provider for more information.",
  "status": 400
}
```

At the next level of the json structure, for each error a `description` field must be defined that explains the error and a `status` field that will be an HTTP status to respond to the query affected by error:

```sh
{
    "description": "User not found.",
    "status": 404
}
```

Each built class is inserted as global. The classes will have as name, the name of the json file where their errors were defined.

To generate a new error, you must only create a new object of some of the classes and pass by parameter the error code and the native error that occurred:

```javascript
throw new UserError('notFound', new Error('this is native error.'))
```

Also each class contains a static method called `process` that receives by parameter the context of the request and the error. This allows you to configure the response of the request for a defined or unknown error.

```javascript
try {
    throw new UserError('notFound', new Error('this is native error.'))
} catch (err) {
    UserError.process(req, err)
}
```

The process method responds to the request with the status defined according to the type of error and as body an object with the fields `description` and `code` defined.

```sh
{
    "description": "User not found.",
    "code": "notFound"
}
```

More information in the test.
