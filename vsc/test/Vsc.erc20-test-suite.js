const suite = require('../node_modules/token-test-suite/lib/suite');
const VscToken = artifacts.require('VscToken');
const TWO_BILLION_IN_WEI = '2000000000'+'000000000000000000'

contract('VscToken', function (accounts) {
	let options = {
		// accounts to test with, accounts[0] being the contract owner
		accounts: accounts,

		// factory method to create new token contract
		create: async function () {
			return await VscToken.new();
		},

		// factory callbacks to mint the tokens
		// use "transfer" instead of "mint" for non-mintable tokens
		transfer: async function (token, to, amount) {
			return await token.transfer(to, amount, { from: accounts[0] });
		},

		// optional:
		// also test the increaseApproval/decreaseApproval methods (not part of the ERC-20 standard)
		increaseDecreaseApproval: false,

		// token info to test
		name: 'Ventures Coin',
		symbol: 'VSC',
		decimals: 18,

		// initial state to test
		initialSupply: TWO_BILLION_IN_WEI,
		initialBalances: [
			[accounts[0], TWO_BILLION_IN_WEI]
		],
		initialAllowances: [
			[accounts[0], accounts[1], 0]
		]
	};

	suite(options);
});