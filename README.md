# Cube Error for Cano Koa
Build clases for handling errors defined in a JSON file for the [cano-koa](https://github.com/cano-koa/cano-koa) microframework.
This is the json structure that represents the error group for users:

```json
{
  "opts": {
    "unknownError": {
      "code": "UserUnknownError",
      "description": "Unknown error. Please contact the API provider for more information.",
      "status": 500
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
  "status": 500
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
throw new UserError('emailExist', 'This is native error.');
```
or
```javascript
try {
    ...
} catch (err) {
    throw new UserError('emailExist', err);
}
```
#### Resulting object

```javascript
{
    original: [Error],
    content: {
        code: 'emailExist',
        description: 'The email already exist in system.'
    },
    fullContent: {
        code: 'emailExist',
        description: 'The email already exist in system.',
        message: 'This is native error.'
    },
    status: 400
}
```

#### The method handler
This static method allows you to transform errors (not defined in the errors folder) of the Javascript Error class and convert them to an unknown CanoError error.

```javascript
try {
    throw new Error('this is an error.');
} catch (err) {
    UserError.handler(err);
}
```

This method configures an error object of unknown type, based on the options defined in the json file of the class in question called by the method.

The CanoError base class configures the object of unknown type with the default values of the cube. This can be avoided by passing an options object as a second parameter. The options follow the same structure of the unknownError field of the json files.

```javascript
try {
    throw new Error('this is an error.');
} catch (err) {
    const opts = {
        "code": "MyUknownError",
        "description": "Unknown error.",
        "status": 500
    };
    CanoError.handler(err, opts);
}
```

More information in the test.
