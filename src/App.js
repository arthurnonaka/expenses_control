import React from 'react'
import { tab } from '@testing-library/user-event/dist/tab';
import './App.css'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue } from 'firebase/database' 
import Header from "./components/Header"
import ChartRender from "./components/ChartRender"

const appSettings = {
  databaseURL: "https://controle-de-fatura-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const expensesInDB = ref(database, "expensesControl")
function App() {
  const [expenseArthur, setExpenseArthur] = React.useState(0)
  const [expenseMaysa, setExpenseMaysa] = React.useState(0)
  const [expenseToSplit, setExpenseToSplit] = React.useState(0)

  onValue(expensesInDB, function(snapshot) {
    clearTable()
    let itemsArray = Object.values(snapshot.val())
    let newExpenseArthur = 0
    let newExpenseMaysa = 0
    let newExpenseToSplit = 0
    for (let i = 0; i < itemsArray.length; i++) {      
        addExpenseToTable(itemsArray[i])
        if(itemsArray[i][0].owner == "Arthur") {
          newExpenseArthur += parseFloat(itemsArray[i][0].value)
        } else if(itemsArray[i][0].owner == "Maysa") {
          newExpenseMaysa += parseFloat(itemsArray[i][0].value)
        } else if(itemsArray[i][0].owner == "Dividido") {
          newExpenseToSplit += parseFloat(itemsArray[i][0].value)
        }
    }
    // setExpenseArthur(newExpenseArthur)
    // setExpenseMaysa(newExpenseMaysa)
    // setExpenseToSplit(newExpenseToSplit)
  })

  return (
    <div className="App">
      <Header />
      <div className='charts-section'>
        {/* <ChartRender soloValue = {expenseArthur} splitValue = {expenseToSplit} name = "Arthur"/>
        <ChartRender soloValue = {expenseMaysa} splitValue = {expenseToSplit} name = "Maysa"/> */}
      </div>
      <table id="table">
        <tr>
          <td>Data</td>
          <td>Lugar</td>
          <td>Responsável</td>
          <td>Valor</td>
        </tr>
      </table>
      <div id="input">
        <input id='date-input' placeholder='Data' type="date" max={getTodayDate()}></input>
        <input id='location-input' placeholder='Lugar' type="text"></input>
        <form>
          <input type="radio" id="owner-arthur" className="input-owner" name="input-radio" value="Arthur" />
          <label for="owner-arthur">Arthur</label><br />
          <input type="radio" id="owner-maysa" className="input-owner" name="input-radio" value="Maysa" />
          <label for="owner-maysa">Maysa</label><br />
          <input type="radio" id="owner-split" className="input-owner" name="input-radio" value="Dividido" />
          <label for="owner-split">Dividido</label>
        </form>
        <input id='value-input' placeholder='Valor' type="number"></input>
      </div>
      <span id="check-input"></span>
      <button className='add-btn' onClick={handleAddButon}>Add</button>
      <button className='delete-btn' onClick={clearTable}>Delete all</button>
    </div>
  );
}


function clearTable() {
  const table = document.getElementById("table")
  for(let i = table.rows.length - 1; i > 0; i--) {
    console.log('Deleting row at index:', i);
    table.deleteRow(i)
  }
}

function addExpenseToTable(props) {
  const table = document.getElementById("table")
  const row = table.insertRow(1)
  const date = row.insertCell(0)
  const location = row.insertCell(1)
  const owner = row.insertCell(2)
  const value = row.insertCell(3)
  date.innerHTML = props[0].date
  location.innerHTML = props[0].place
  owner.innerHTML = props[0].owner
  value.innerHTML = props[0].value
}

function handleAddButon() {
  const dateInput = document.getElementById("date-input").value
  let dateValue = ""
  if(dateInput === "") {
    dateValue = getTodayDate()
  } else {
    dateValue = dateInput
  }
  const locationInput = document.getElementById("location-input").value
  const selectedOwner = document.querySelector('.input-owner:checked')
  const valueInput = document.getElementById("value-input").value
  const inputOwner = selectedOwner ? selectedOwner.value : "Dividido";
  const table = document.getElementById("table")
  const inputObject = [{
    date: dateValue,
    place: locationInput,
    owner: inputOwner,
    value: valueInput
  }]
  if(valueInput > 0) {
    push(expensesInDB, inputObject)
    resetInputFields()
  } else {
    const checkInput = document.getElementById("check-input")
    checkInput.textContent = "Qual o valor?"
  }
}

function handleDeleteButon() {
  const countEl = document.getElementById("count")
  countEl.textContent = 0
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function resetInputFields() {
  const dateInput = document.getElementById("date-input")
  const locationInput = document.getElementById("location-input")
  const valueInput = document.getElementById("value-input")

  dateInput.value = ""
  locationInput.value = ""
  valueInput.value = ""
}
export default App;
