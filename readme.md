### Dependencies

* [Ganache](https://trufflesuite.com/ganache/index.html) (local etherum blockchain)
* [MetaMask](https://metamask.io/) (blockchain wallet)

### Initial Setup

  * Run Ganache on your local machine to initialize development blockchain
  * Setup [MetaMask](https://trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask.html) to run on your local network
  * Install dependencies
    ```
      npm install -g truffle
      npm install
    ```

  * Compile contracts

    ```
    truffle compile
    ```

  * Migrate contracts to the blockchain

    ```
    truffle migrate
    ```

  * Run local server

    ```
    npm run dev
    ```

### Debugging smart contracts

  Enter to the console

   ```
    truffle console
   ```

