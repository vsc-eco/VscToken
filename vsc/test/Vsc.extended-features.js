// tests the extended features of the VSC Token

const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const expectEvent = require('openzeppelin-solidity/test/helpers/expectEvent');
const { ZERO_ADDRESS } = require('openzeppelin-solidity/test/helpers/constants');

const VscToken = artifacts.require('VscToken');

const BigNumber = web3.BigNumber;
const TWO_BILLION_IN_WEI = new BigNumber('2000000000'+'000000000000000000')
const TWO_BILLION_AND_ONE_WEI = new BigNumber('2000000000'+'000000000000000001')

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('VscToken', function ([creator, tom, jerry, max]) {
  beforeEach(async function () {
    this.token = await VscToken.new();
  });

  describe('isPauser', function () {
    it('creator should be the first pauser', async function () {
      (await this.token.isPauser(creator)).should.be.true
    });
    it('and neither tom nor jerry is a pauser', async function () {
        (await this.token.isPauser(tom)).should.be.false;
        (await this.token.isPauser(jerry)).should.be.false;
    });
  });

  describe('addPauser', function () {
    it('non-pauser should NOT be able to add a pauser', async function () {
      await shouldFail.reverting(this.token.addPauser(jerry, {from: tom}))
    });
    it('pauser should be able to add another as a pauser', async function () {
        const {logs} = await this.token.addPauser(tom, {from:creator});
        expectEvent.inLogs(logs, 'PauserAdded', {account:tom})
        await this.token.addPauser(jerry, {from:tom});
        (await this.token.isPauser(tom)).should.be.true;
        (await this.token.isPauser(jerry)).should.be.true;
        (await this.token.isPauser(creator)).should.be.true;
    });
  });

  describe('renouncePauser', function () {
    it('non-pauser cannot renounce', async function () {
      await shouldFail.reverting(this.token.renouncePauser({from:tom}));
      await this.token.addPauser(tom, {from:creator});
      const {logs} = await this.token.renouncePauser({from:tom});
      expectEvent.inLogs(logs, 'PauserRemoved', {account:tom});
      (await this.token.isPauser(tom)).should.be.false;
    });
    it('pauser can renounce', async function () {
      const {logs} = await this.token.renouncePauser({from:creator});
      expectEvent.inLogs(logs, 'PauserRemoved', {account: creator});
      (await this.token.isPauser(creator)).should.be.false;
      await shouldFail.reverting(this.token.addPauser(tom, {from:creator}))
    });
  });

  describe('pause & paused', function () {
    it('non-pauser should NOT be able to pause', async function () {
        await shouldFail.reverting(this.token.pause({from:tom}));
        await this.token.transfer(tom, 100, {from:creator}); // still ok
        (await this.token.balanceOf(tom)).should.be.bignumber.equal(100);
        (await this.token.paused()).should.be.false;
    });
    it('pauser can pause and it takes effect', async function () {
        await this.token.addPauser(tom, {from:creator});
        await this.token.transfer(tom, 100, {from:creator})
        const {logs} = await this.token.pause({from: tom});
        expectEvent.inLogs(logs, 'Paused');
        (await this.token.paused()).should.be.true;
        await shouldFail.reverting(this.token.transfer(tom, 100, {from:creator}));
        (await this.token.balanceOf(tom)).should.be.bignumber.equal(100);
        // not doing more tests since zeppelin pauser token test has done that
    });
  });

  describe('unpause', function () {
    it('non-pauser cannot unpause the token', async function () {
      await this.token.pause({from:creator});
      await shouldFail.reverting(this.token.unpause({from:tom}));
    });
    it('pauser can unpause the token', async function () {
        await this.token.pause({from:creator});
        const {logs} = await this.token.unpause({from:creator});
        expectEvent.inLogs(logs, 'Unpaused');
        await this.token.addPauser(tom, {from:creator});
        await this.token.addPauser(jerry, {from:tom});
        await this.token.pause({from:jerry});
        await this.token.unpause({from:tom});
        (await this.token.paused()).should.be.false;
    });
  });

  describe('superTransferFrom', function () {
    beforeEach(async function(){
        await this.token.transfer(tom, 200, {from:creator});
        await this.token.addPauser(jerry,{from:creator});
    })
    it('non-pauser should NOT be able to do it', async function () {
        await shouldFail.reverting(
            this.token.superTransferFrom(creator,tom,100,{from:max}));
    });
    it('Should revert when balance is not sufficient', async function () {
        let {logs} = await this.token.superTransferFrom(tom,max,40,{from:jerry});
        expectEvent.inLogs(logs, 'SuperTransfer', {from:tom,to:max,value:40});
        (await this.token.balanceOf(tom)).should.be.bignumber.equal(160);
        await shouldFail.reverting(
            this.token.superTransferFrom(tom,max,161,{from:jerry}));
        await shouldFail.reverting(
                this.token.superTransferFrom(creator,max,TWO_BILLION_IN_WEI,{from:jerry}));    
    });

    it('Pauser should be able to do it, even after paused', async function () {
        let {logs} = await this.token.superTransferFrom(tom,max,40,{from:jerry});
        expectEvent.inLogs(logs, 'SuperTransfer', {from:tom,to:max,value:40});
        (await this.token.balanceOf(tom)).should.be.bignumber.equal(160);
        (await this.token.balanceOf(max)).should.be.bignumber.equal(40);
        await this.token.pause({from:jerry});
        (await this.token.paused()).should.be.true;
        logs = (await this.token.superTransferFrom(creator, max, 50, {from:jerry})).logs;
        expectEvent.inLogs(logs, 'SuperTransfer', {from:creator,to:max,value:50});
        (await this.token.balanceOf(creator)).should.be.bignumber.equal(
            TWO_BILLION_IN_WEI.minus(200).minus(50)
        );
        (await this.token.balanceOf(max)).should.be.bignumber.equal(90);
    });
  });

  describe('terminate', function () {
    it('non-pauser cannot terminate', async function () {
        await shouldFail.reverting(this.token.terminate({from:tom}));
        await this.token.transfer(tom,130,{from:creator});
        (await this.token.balanceOf(tom)).should.be.bignumber.equal(130);
        (await this.token.balanceOf(creator)).should.be.bignumber.equal(
            TWO_BILLION_IN_WEI.minus(130)
        );
    });
    it('pauser can terminate, and nothing can be done afterwards', async function () {
        const {logs} = await this.token.terminate({from: creator})
        expectEvent.inLogs(logs, 'Terminated')
        try {
            await this.token.transfer(tom,130,{from:creator});
            assert(false, "Exception should be thrown")
        } catch (error) {
            // error thrown, pass
        };
        try {
            await this.token.pause({from:creator});
            assert(false, "Exception should be thrown")
        } catch (error) {
            // error thrown, pass
        };

    });
  });  
});
