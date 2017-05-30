const path = require('path')
const Quark = require('../index.js')
const expect = require('chai').expect

const proton = {
  app: { path: __dirname },
  log: {
    error: function(text) {
      console.error(text)
    }
  }
}

describe('Quark test', () => {
  before(next => {
    const quark = new Quark(proton)
    quark.configure()
    quark.validate()
    quark.initialize()
    next()
  })
  it('generate the defined error object for Hires', function() {
    try {
      throw new HireError('insufficientFunds', new Error('Insufficient Funds'))
    } catch (err) {
      const ctx = {}
      HireError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 422)
      expect(ctx.body).to.have.deep.property('code', 'insufficientFunds')
      expect(ctx.body).to.have.deep.property('description', 'Insufficient funds for create hire.')
    }
  })
  it('handle an unknown error for Hires', function() {
    try {
      throw new Error('this is an unknown error with option show message active')
    } catch (err) {
      const ctx = {}
      HireError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 400)
      expect(ctx.body).to.have.deep.property('code', 'HireUnknownError')
      expect(ctx.body).to.have.deep.property('description', 'Unknown error. Please contact the API provider for more information.')
    }
  })

  it('generate the defined error object for Users', function() {
    try {
      throw new UserError('notFound', new Error('user not Found in DB.'))
    } catch (err) {
      const ctx = {}
      UserError.process(ctx, err)
      expect(ctx).to.have.deep.property('status', 404)
      expect(ctx.body).to.have.deep.property('code', 'notFound')
      expect(ctx.body).to.have.deep.property('description', 'User not found.')
    }
  })
  it('handle an unknown error for Users', function() {
    try {
      throw new Error('this is an unknown error with option show message active')
    } catch (err) {
      const ctx = {}
      UserError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 400)
      expect(ctx.body).to.have.deep.property('code', 'UserUnknownError')
      expect(ctx.body).to.have.deep.property('description', 'Unknown error. Please contact the API provider for more information.')
    }
  })
})
