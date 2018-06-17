const path = require('path');
const Cube = require('../index');
const expect = require('chai').expect;

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
      throw new HireError('insufficientFunds', 'Insufficient Funds');
    } catch (err) {
      expect(err).to.have.property('content');
      expect(err.content).to.have.property('code', 'insufficientFunds');
      expect(err.content).to.have.property('description');
      expect(err).to.have.property('original');
      expect(err).to.have.property('fullContent');
      expect(err.fullContent).to.have.property('code', 'insufficientFunds');
      expect(err.fullContent).to.have.property('description');
      expect(err.fullContent).to.have.property('message', 'Insufficient Funds');
      expect(err).to.have.property('status', 422);
    }
  });

  it('Should generate the incomplete (without description) defined error object for Hires', function() {
    try {
      throw new HireError('notFound', 'Hire not Found in DB.');
    } catch (err) {
      expect(err).to.have.property('content');
      expect(err.content).to.have.property('code', 'notFound');
      expect(err.content).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err).to.have.property('original');
      expect(err).to.have.property('fullContent');
      expect(err.fullContent).to.have.property('code', 'notFound');
      expect(err.fullContent).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err.fullContent).to.have.property('message', 'Hire not Found in DB.');
      expect(err).to.have.property('status', 404);
    }
  });

  it('Should generate an unknown error for Hires', function() {
    try {
      throw new Error('this is an unknown error with option show message active.');
    } catch (err) {
      err = HireError.handler(err);
      expect(err).to.have.property('content');
      expect(err.content).to.have.property('code', 'HireUnknownError');
      expect(err.content).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err).to.have.property('original');
      expect(err).to.have.property('fullContent');
      expect(err.fullContent).to.have.property('code', 'HireUnknownError');
      expect(err.fullContent).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err.fullContent).to.have.property('message', 'this is an unknown error with option show message active.');
      expect(err).to.have.property('status', 400);
    }
  });

  it('Should generate the complete defined error object for Users', function() {
    try {
      throw new UserError('notFound', new Error('User not Found in DB.'));
    } catch (err) {
      expect(err).to.have.property('content');
      expect(err.content).to.have.property('code', 'notFound');
      expect(err.content).to.have.property('description', 'User not found.');
      expect(err).to.have.property('original');
      expect(err).to.have.property('fullContent');
      expect(err.fullContent).to.have.property('code', 'notFound');
      expect(err.fullContent).to.have.property('description', 'User not found.');
      expect(err.fullContent).to.have.property('message', 'User not Found in DB.');
      expect(err).to.have.property('status', 404);
    }
  });

  it('Should generate the incomplete (without status) defined error object for Users', function() {
    try {
      throw new UserError('emailExist', new Error('The email sent exist in DB.'));
    } catch (err) {
      expect(err).to.have.property('content');
      expect(err.content).to.have.property('code', 'emailExist');
      expect(err.content).to.have.property('description', 'The email already exist in system.');
      expect(err).to.have.property('original');
      expect(err).to.have.property('fullContent');
      expect(err.fullContent).to.have.property('code', 'emailExist');
      expect(err.fullContent).to.have.property('description', 'The email already exist in system.');
      expect(err.fullContent).to.have.property('message', 'The email sent exist in DB.');
      expect(err).to.have.property('status', 500);
    }
  });

  it('Should generate an unknown error for Users', function() {
    try {
      throw new Error('This is an unknown error with option show message active.');
    } catch (err) {
      err = UserError.handler(err);
      expect(err).to.have.property('content');
      expect(err.content).to.have.property('code', 'UserUnknownError');
      expect(err.content).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err).to.have.property('original');
      expect(err).to.have.property('fullContent');
      expect(err.fullContent).to.have.property('code', 'UserUnknownError');
      expect(err.fullContent).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err.fullContent).to.have.property('message', 'This is an unknown error with option show message active.');
      expect(err).to.have.property('status', 500);
    }
  });

  it('Should generate an unknown error for CanoError', function() {
    try {
      throw new Error('This is an unknown error with option show message active.');
    } catch (err) {
      err = CanoError.handler(err);
      expect(err).to.have.property('content');
      expect(err.content).to.have.property('code', 'unknownError');
      expect(err.content).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err).to.have.property('original');
      expect(err).to.have.property('fullContent');
      expect(err.fullContent).to.have.property('code', 'unknownError');
      expect(err.fullContent).to.have.property('description', 'Please contact the API provider for more information.');
      expect(err.fullContent).to.have.property('message', 'This is an unknown error with option show message active.');
      expect(err).to.have.property('status', 500);
    }
  });
});
