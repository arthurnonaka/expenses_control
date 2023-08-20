import './App.css'

import {initializeApp} from 'firebase/app'
import {getDatabase, onValue, push, ref, remove} from 'firebase/database'
import React from 'react'

import ChartRender from './components/ChartRender'
import Header from './components/Header'
import Form from './components/Form'

const appSettings = {
  databaseURL: 'https://controle-de-fatura-default-rtdb.firebaseio.com/'
} 
const app = initializeApp(appSettings)
const database = getDatabase(app)
const expensesInDB = ref(database, 'expensesControl')

function App() {
  const [expenseArthur, setExpenseArthur] = React.useState(0)
  const [expenseMaysa, setExpenseMaysa] = React.useState(0)
  const [expenseToSplit, setExpenseToSplit] = React.useState(0)
  React.useEffect(() => {
    onValue(expensesInDB, function(snapshot) {
      if (snapshot.exists()) {
        clearTable()
        let itemsArray = Object.entries(snapshot.val())
        let newExpenseArthur = 0
        let newExpenseMaysa = 0
        let newExpenseToSplit = 0
        for (let i = 0; i < itemsArray.length; i++) {
          addExpenseToTable(itemsArray[i])
          if (itemsArray[i][1].owner === 'Arthur') {
            newExpenseArthur += parseFloat(itemsArray[i][1].value)
          }
          else if (itemsArray[i][1].owner === 'Maysa') {
            newExpenseMaysa += parseFloat(itemsArray[i][1].value)
          }
          else if (itemsArray[i][1].owner === 'Dividido') {
            newExpenseToSplit += parseFloat(itemsArray[i][1].value)
          }
        }
      setExpenseArthur(newExpenseArthur)
      setExpenseMaysa(newExpenseMaysa)
      setExpenseToSplit(newExpenseToSplit)
      } else {
        clearTable()
        setExpenseArthur(0)
        setExpenseMaysa(0)
        setExpenseToSplit(0)
      }
    })
  }, [])

  return (
    <div className='App'>
      <head>
        <title>Controle de gastos</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300&display=swap" rel="stylesheet"></link>
        <link rel="apple-touch-icon" sizes="180x180" href="/logo/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo/favicon-16x16.png" />
        <link rel="manifest" href="/logo/site.webmanifest"></link>
      </head>
      <Header />
      <div className='charts-section'>
        <ChartRender soloValue = {expenseArthur} splitValue = {expenseToSplit} name = 'Arthur'/>
        <ChartRender soloValue = {expenseMaysa} splitValue = {expenseToSplit} name = 'Maysa'/>
      </div>
      <div className='table-div'>
        <table id="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Lugar</th>
              <th>Responsável</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      <Form handleAddButon = {handleAddButon} handleDeleteAll = {handleDeleteButon}/>
    </div>
  );
}

function clearTable() {
  const table = document.getElementById('table')
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i)
  }
}

// Function to add data to the table
function addExpenseToTable(props) {
  const tbody = document.getElementById('table').getElementsByTagName('tbody')[0]
  let itemID = props[0]
  
  props.forEach(data => {
    const newRow = tbody.insertRow()
    newRow.setAttribute('data-key', data.key)
    const dateCell = newRow.insertCell(0)
    const placeCell = newRow.insertCell(1)
    const ownerCell = newRow.insertCell(2)
    const valueCell = newRow.insertCell(3)
    dateCell.textContent = data.date
    placeCell.textContent = data.place
    ownerCell.textContent = data.owner
    valueCell.textContent = data.value

    newRow.addEventListener('dblclick', function() {
      let locationItemInDB = ref(database, `expensesControl/${itemID}`)
      remove(locationItemInDB)
    })
  });
}

function handleAddButon(inputObject) {
  push(expensesInDB, inputObject)
}

function handleDeleteButon() {
  remove(expensesInDB)
}

export default App;
