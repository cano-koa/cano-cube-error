const Quark = require('proton-quark')
const fs = require('fs')
const path = require('path')
module.exports = class Error extends Quark {

  constructor(proton) {
    super(proton)
  }

  configure() {
    const QuarkError = function() {}
    global['QuarkError'] = QuarkError
  }

  validate() {
    // Nothing to do ....
  }

  initialize() {
    this._initializeExceptions()
  }

  _initializeExceptions() {
    const clases = this._clases
    for (let className in clases) {
      const typesErrors = clases[className]
      const { opts } = typesErrors
      delete typesErrors.opts
      const ClassError = this._buildConstructor(typesErrors, opts)
      this._buildProcessMethod(ClassError)
      ClassError.prototype = new QuarkError()
      ClassError.prototype.constructor = ClassError
      global[className] = ClassError
    }
  }

  _buildConstructor(typesErrors, opts) {
    const self = this
    return function (code, err={}) {
      this._error = err
      const ctx = this
      if (code !== 'unknownError') {
        for (let codeError in typesErrors) {
          if (code === codeError) {
            const { description, status } = typesErrors[codeError]
            Object.assign(ctx, { description, status, code: codeError })
            break
          }
        }
      }
      if (!this.code) {
        self._setAtUnknownError(this, opts)
      }
      self._buildSetterAndGetter(this)
    }
  }

  _buildProcessMethod(ClassError) {
    ClassError.process = function(ctx, err) {
      if (err instanceof QuarkError) {
        ctx.status = err.status
        ctx.body = err.standarError
      } else {
        const newErr = new ClassError('unknownError', err)
        ctx.status = newErr.status
        ctx.body = newErr.standarError
      }
    }
  }

  _setAtUnknownError(ctx, opts=null) {
    const { unknownError: { description, status, code } } = opts || this._getDefaultOpts()
    Object.assign(ctx, { description, status, code })
  }

  _buildSetterAndGetter(ctx) {
    Object.defineProperty(ctx, 'standarError', { get: function() {
      return { description: ctx.description, code: ctx.code }
    }});
    Object.defineProperty(ctx, 'fullError', { get: function() {
      return Object.assign(ctx.standarError, { nativeError: ctx._error })
    }});
  }

  _getDefaultOpts() {
    return {
      unknownError: {
        code: "unknownError",
        description: "Unknown error. Please contact the API provider for more information.",
        status: 400
      }
    }
  }

  get _clases() {
    const clases = path.join(this.proton.app.path, '/errors')
    return fs.existsSync(clases) ? require('require-all')(clases) : {}
  }
}
