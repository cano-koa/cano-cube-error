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
      const CanoError = function() {};
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
        ClassError.prototype = new CanoError();
        ClassError.prototype.constructor = ClassError;
        buildProcessMethod(ClassError);
        global[className] = ClassError;
      }
      resolve();
		});
  }

}

function getFiles(_path) {
  const files = path.join(_path, '/errors');
  return fs.existsSync(files) ? require('require-all')(files) : {};
}

function buildOpts(data) {
  const { opts = defaultOpts } = data;
  delete data.opts;
  return opts;
}

function getAvailableFields(data) {
  const { code, description, status } = data;
  const result = {};
  if (code) Object.assign(result, { code });
  if (description) Object.assign(result, { description });
  if (status) Object.assign(result, { status });
  return result;
}

function setDataError(ctx, data, userOpts = {}) {
  merge(ctx, defaultOpts.unknownError, userOpts.unknownError || {}, data);
}

function setAtUnknownError(ctx, opts={}) {
  setDataError(ctx, {}, opts);
}

function buildSetterAndGetter(ctx) {
  Object.defineProperty(ctx, 'standarError', { get: function() {
    return { description: ctx.description, code: ctx.code }
  }});
  Object.defineProperty(ctx, 'fullError', { get: function() {
    const { message } = ctx._error
    return Object.assign(ctx.standarError, { message })
  }});
}

function buildConstructor(typesErrors, opts) {
  return function (codeError, err = 'An error has occurred.') {
    this._error = typeof err === 'string' ? new Error(err) : err;
    if (codeError !== 'unknownError') {
      const result = find(typesErrors, (value , name) => name === codeError);
      if (result) {
        const { description, status } = result;
        setDataError(this, { description, status, code: codeError }, opts);
      }
    }
    if (!this.code) {
      setAtUnknownError(this, opts);
    }
    buildSetterAndGetter(this);
  }
}

function buildProcessMethod(ClassError) {
  ClassError.process = function(ctx, err) {
    if (!(err instanceof CanoError)) {
      err = new ClassError('unknownError', err);
    }
    ctx.status = err.status;
    ctx.body = err.standarError;
  };
}

const defaultOpts = {
  unknownError: {
    code: "unknownError",
    description: "Please contact the API provider for more information.",
    status: 400
  }
};

module.exports = CubeError;
