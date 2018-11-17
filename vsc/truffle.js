/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    // development network, launched with 'truffle development'
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    testnetBingInspiron: {
      host: "192.168.20.190",
      port: 8545,
      network_id: 3, 
      gas: 4612388,
      gasPrice: 50000000000 // 50 GWei
    },
    testnetLocal: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 3,
      gas: 4612388,
      gasPrice: 50000000000 // 50 GWei
    }
  }  
};
