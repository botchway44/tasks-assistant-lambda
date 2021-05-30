import 'mocha';
import { expect } from 'chai';
import { hello } from './add.spec';
import { MongoClientConnection } from '../src/utils'

describe('Running TypeScript tests in ts-node runtime without compilation', () => {

  let mongoClient: any;
  before(async () => {
    // init mongo and inserts mock data
    mongoClient = new MongoClientConnection();
    return await mongoClient.connect();
  });



  it('provides adder that adds two numbers', () => {

    // insert task and verify if it works

    // return getAdder().then((add) => {
    expect(hello()).to.equal("Hello World!");
    // });
  });

  it('provides function that should return the same value that was passed', () => {
    // expect(getNumber(3)).toBe(3);
  });
});