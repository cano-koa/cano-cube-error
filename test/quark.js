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
  it('Should generate the complete defined error object for Hires', function() {
    try {
      throw new HireError('insufficientFunds', 'Insufficient Funds')
    } catch (err) {
      const ctx = {}
      HireError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 422)
      expect(ctx.body).to.have.deep.property('code', 'insufficientFunds')
      expect(ctx.body).to.have.deep.property('description', 'Insufficient funds for create hire.')
    }
  })

  it('Should generate the incomplete (without description) defined error object for Hires', function() {
    try {
      throw new HireError('notFound', 'Hire not Found in DB.')
    } catch (err) {
      const ctx = {}
      UserError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 404)
      expect(ctx.body).to.have.deep.property('code', 'notFound')
      expect(ctx.body).to.have.deep.property('description', 'Please contact the API provider for more information.')
    }
  })

  it('Should generate an unknown error for Hires', function() {
    try {
      throw new Error('this is an unknown error with option show message active')
    } catch (err) {
      const ctx = {}
      HireError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 400)
      expect(ctx.body).to.have.deep.property('code', 'HireUnknownError')
      expect(ctx.body).to.have.deep.property('description', 'Please contact the API provider for more information.')
    }
  })

  it('Should generate the complete defined error object for Users', function() {
    try {
      throw new UserError('notFound', new Error('User not Found in DB.'))
    } catch (err) {
      const ctx = {}
      UserError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 404)
      expect(ctx.body).to.have.deep.property('code', 'notFound')
      expect(ctx.body).to.have.deep.property('description', 'User not found.')
    }
  })

  it('Should generate the incomplete (without status) defined error object for Users', function() {
    try {
      throw new UserError('emailExist', new Error('The email sent exist in DB.'))
    } catch (err) {
      const ctx = {}
      UserError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 500)
      expect(ctx.body).to.have.deep.property('code', 'emailExist')
      expect(ctx.body).to.have.deep.property('description', 'The email already exist in system.')
    }
  })

  it('Should generate an unknown error for Users', function() {
    try {
      throw new Error('This is an unknown error with option show message active')
    } catch (err) {
      const ctx = {}
      UserError.process(ctx, err)
      expect(ctx).to.have.deep.property('body')
      expect(ctx).to.have.deep.property('status', 500)
      expect(ctx.body).to.have.deep.property('code', 'UserUnknownError')
      expect(ctx.body).to.have.deep.property('description', 'Please contact the API provider for more information.')
    }
  })
})
