const path = require('path')
const Cube = require('../index')
const expect = require('chai').expect

const cano = {
  app: {
    paths: {
      api: `${__dirname}/api`,
    },
  },
};
describe('Cube test', () => {
  before(async (next) => {
    const cube = new Cube(cano);
    await cube.prepare();
    await cube.up();
    next();
  });
  it('Should generate the complete defined error object for Hires', function() {
    try {
      throw new HireError('insufficientFunds', 'Insufficient Funds')
    } catch (err) {
      const ctx = {
        params: { contains: 'This is the params.' },
        request: {
          body: { contains: 'This is body.' },
          query: { contains: 'This is query.' },
        }
      }
      HireError.process(ctx, err)
      expect(ctx).to.have.property('body')
      expect(ctx).to.have.property('status', 422)
      expect(ctx.body).to.have.property('code', 'insufficientFunds')
      expect(ctx.body).to.have.property('description', 'Insufficient funds for create hire.')
    }
  })

  it('Should generate the incomplete (without description) defined error object for Hires', function() {
    try {
      throw new HireError('notFound', 'Hire not Found in DB.')
    } catch (err) {
      const ctx = {
        params: { contains: 'This is the params.' },
        request: {
          body: { contains: 'This is body.' },
          query: { contains: 'This is query.' },
        }
      }
      UserError.process(ctx, err)
      expect(ctx).to.have.property('body')
      expect(ctx).to.have.property('status', 404)
      expect(ctx.body).to.have.property('code', 'notFound')
      expect(ctx.body).to.have.property('description', 'Please contact the API provider for more information.')
    }
  })

  it('Should generate an unknown error for Hires', function() {
    try {
      throw new Error('this is an unknown error with option show message active')
    } catch (err) {
      const ctx = {
        params: { contains: 'This is the params.' },
        request: {
          body: { contains: 'This is body.' },
          query: { contains: 'This is query.' },
        }
      }
      HireError.process(ctx, err)
      expect(ctx).to.have.property('body')
      expect(ctx).to.have.property('status', 400)
      expect(ctx.body).to.have.property('code', 'HireUnknownError')
      expect(ctx.body).to.have.property('description', 'Please contact the API provider for more information.')
    }
  })

  it('Should generate the complete defined error object for Users', function() {
    try {
      throw new UserError('notFound', new Error('User not Found in DB.'))
    } catch (err) {
      const ctx = {
        params: { contains: 'This is the params.' },
        request: {
          body: { contains: 'This is body.' },
          query: { contains: 'This is query.' },
        }
      }
      UserError.process(ctx, err)
      expect(ctx).to.have.property('body')
      expect(ctx).to.have.property('status', 404)
      expect(ctx.body).to.have.property('code', 'notFound')
      expect(ctx.body).to.have.property('description', 'User not found.')
    }
  })

  it('Should generate the incomplete (without status) defined error object for Users', function() {
    try {
      throw new UserError('emailExist', new Error('The email sent exist in DB.'))
    } catch (err) {
      const ctx = {
        params: { contains: 'This is the params.' },
        request: {
          body: { contains: 'This is body.' },
          query: { contains: 'This is query.' },
        }
      }
      UserError.process(ctx, err)
      expect(ctx).to.have.property('body')
      expect(ctx).to.have.property('status', 500)
      expect(ctx.body).to.have.property('code', 'emailExist')
      expect(ctx.body).to.have.property('description', 'The email already exist in system.')
    }
  })

  it('Should generate an unknown error for Users', function() {
    try {
      throw new Error('This is an unknown error with option show message active')
    } catch (err) {
      const ctx = {
        params: { contains: 'This is the params.' },
        request: {
          body: { contains: 'This is body.' },
          query: { contains: 'This is query.' },
        }
      }
      UserError.process(ctx, err)
      expect(ctx).to.have.property('body')
      expect(ctx).to.have.property('status', 500)
      expect(ctx.body).to.have.property('code', 'UserUnknownError')
      expect(ctx.body).to.have.property('description', 'Please contact the API provider for more information.')
    }
  })
})
