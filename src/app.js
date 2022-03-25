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
    return App.render()
  },

  render: () => {
    $('#account-id').html(App.account)
    return App.renderTasks()
  },

  renderTasks: async () => {
    const taskFormElement = document.getElementById('task-list')
    // clear element before rendering new tasks
    taskFormElement.innerHTML = ''

    const taskNumber = await App.todoList.taskNumber.call()
    console.log('------')
    console.log(taskNumber.toNumber())
  
    // create li element for every task fetched from blockchain
    for(let i=1; i<=taskNumber; i++) {
      const task = await App.todoList.tasks(i)
      const li = document.createElement('li')
      const span = document.createElement('span')
      span.classList.add('delete')
      span.setAttribute('id', i)
      span.innerHTML='X'
      li.innerHTML = task[1]
      span.addEventListener('click', async () => {
        await App.todoList.deleteTask(i, {from: App.account})
        App.renderTasks()
      })
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
      li.appendChild(span)
      taskFormElement.appendChild(li)
    }

  },

  addTask: async () => {
    const taskDescription = $('#new-task').val()

    // quit when string is empty
    if(taskDescription === '') return

    await App.todoList.createTask(taskDescription, {from: App.account})
    return App.renderTasks()
  },

  deleteTask: async (id) => {
    await App.todoList.deleteTask(id)
  }
  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});