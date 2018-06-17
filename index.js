const Cube = require('cano-cube');
const fs = require('fs');
const path = require('path');
const merge = require('lodash/merge');
const find = require('lodash/find');

/**
 * @class CubeError
 * @classdesc This cube is for instance, load and bind error handlers to the cano app core
 * @extends Cube
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
class CubeError extends Cube {
  /**
	 * @constructs
	 * @author Ernesto Rojas <ernesto20145@gmail.com>
	 */
  constructor(cano) {
    super(cano);
  }

  /**
	 * @override
	 * @method prepare
	 * @description
	 * @author Ernesto Rojas <ernesto20145@gmail.com>
	 */
  prepare() {
    return new Promise((resolve) => {
      global['CanoError'] = CanoError;
      resolve();
		});

  }

  up() {
    return new Promise((resolve) => {
      const files = getFiles(this.cano.app.paths.api);
      for (let fileName in files) {
        const typesErrors = files[fileName];
        const opts = buildOpts(typesErrors);
        const { className = fileName } = opts;
        const ClassError = buildConstructor(typesErrors, opts);
        ClassError.prototype = Object.create(CanoError.prototype);
        ClassError.prototype.constructor = ClassError;
        buildHandlerMethod(ClassError);
        global[className] = ClassError;
      }
      resolve();
		});
  }

}

function CanoError(err = 'An error has occurred.', opts = {}) {
  this.original = typeof err === 'string' ? new Error(err) : err;
  opts = merge({}, defaultOpts.unknownError, opts);
  const { description, status, code } = opts;
  this.content = {
    code,
    description,
  };
  this.fullContent = {
    code,
    description,
    message: this.original.message,
  };
  this.status = status;
}

Object.defineProperty(CanoError, 'handler', {
  value: function (err, opts = {}) {
    if (!(err instanceof CanoError)) {
      err = new CanoError(err, opts);
    }
    return err;
  },
  enumerable: false,
});

function getFiles(_path) {
  const files = path.join(_path, '/errors');
  return fs.existsSync(files) ? require('require-all')(files) : {};
}

function buildOpts(data) {
  const { opts = defaultOpts } = data;
  delete data.opts;
  return opts;
}

function buildConstructor(typesErrors, userOpts) {
  return function (code, err) {
    let opts = {};
    const { unknownError = {} } = userOpts;
    if (code !== 'unknownError') {
      const result = find(typesErrors, (value , name) => name === code);
      if (result) {
        const { description, status } = result;
        merge(opts, unknownError, { description, status, code })
      } else {
        merge(opts, unknownError);
      }
    } else {
      merge(opts, unknownError);
    }
    CanoError.call(this, err, opts);
  }
}

function buildHandlerMethod(ClassError) {
  Object.defineProperty(ClassError, 'handler', {
    value: function (err) {
      if (!(err instanceof CanoError)) {
        err = new ClassError('unknownError', err);
      }
      return err;
    },
    enumerable: false,
  });
}

const defaultOpts = {
  unknownError: {
    code: "unknownError",
    description: "Please contact the API provider for more information.",
    status: 500,
  },
};

module.exports = CubeError;
