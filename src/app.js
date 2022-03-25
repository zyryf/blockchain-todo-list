App = {
  web3Provider: null,
  account: null,
  contracts: {},

  init: async function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    
    return App.loadAccount();
  },

  loadAccount: async () => {
    // Set the current blockchain account
    const web3 = new Web3(App.web3Provider);
    App.account = web3.eth.accounts[0]
    return App.initContract()
  },


  initContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
    return App.renderAccountDetails()
  },

  renderAccountDetails:  () => {
    $('#account-id').html(App.account)
    return App.renderTasks()
  },

  renderTasks: async () => {
    const taskFormElement = $('#task-form')
    
    const taskNumber = await App.todoList.taskNumber()
    console.log(taskNumber)
  }


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});