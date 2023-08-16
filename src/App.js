import './App.css'

import {tab} from '@testing-library/user-event/dist/tab';
import {initializeApp} from 'firebase/app'
import {getDatabase, onValue, push, ref, remove} from 'firebase/database'
import React from 'react'

import ChartRender from './components/ChartRender'
import Header from './components/Header'

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
          if (itemsArray[i][1][0].owner == 'Arthur') {
            newExpenseArthur += parseFloat(itemsArray[i][1][0].value)
          }
          else if (itemsArray[i][1][0].owner == 'Maysa') {
            newExpenseMaysa += parseFloat(itemsArray[i][1][0].value)
          }
          else if (itemsArray[i][1][0].owner == 'Dividido') {
            newExpenseToSplit += parseFloat(itemsArray[i][1][0].value)
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

  // function addRowHandlers() {
  //   var table = document.getElementById("table");
  //   var rows = table.getElementsByTagName("tr");
  //   for (let i = 0; i < rows.length; i++) {
  //     var currentRow = table.rows[i];
  //     var createClickHandler = function(row) {
  //       return function() {
  //         var cell = row.getElementsByTagName("td")[0];
  //         var id = cell.innerHTML;
  //         alert("id:" + id);
  //       };
  //     };
  //     currentRow.onclick = createClickHandler(currentRow);
  //   }
  // }
  // window.onload = addRowHandlers();

  return (
    <div className='App'>
      <Header />
      <div className='charts-section'>
        <ChartRender soloValue = {expenseArthur} splitValue = {expenseToSplit} name = 'Arthur'/>
        <ChartRender soloValue = {expenseMaysa} splitValue = {expenseToSplit} name = 'Maysa'/>
      </div>
      <table id="table" border={1}>
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
      <div id="input">
        <input id='date-input' placeholder='Data' type="date" max={getTodayDate()}></input>
        <input id='location-input' placeholder='Lugar' type='text'></input>
        <form>
          <input type="radio" id="owner-arthur" className="input-owner" name="input-radio" value="Arthur" />
          <label for='owner-arthur'>Arthur</label><br />
          <input type='radio' id='owner-maysa' className='input-owner' name='input-radio' value='Maysa' />
          <label for='owner-maysa'>Maysa</label><br />
          <input type='radio' id='owner-split' className='input-owner' name='input-radio' value='Dividido' />
          <label for='owner-split'>Dividido</label>
        </form>
        <input id='value-input' placeholder='Valor' type='number'></input>
      </div>
      <span id='check-input'></span>
      <button className='add-btn' onClick={handleAddButon}>Add</button>
      <button className='delete-btn' onClick={handleDeleteButon}>Delete all</button>
    </div>
  );
}

function clearTable() {
  const table = document.getElementById('table')
  for (let i = table.rows.length - 1; i > 0; i--) {
    console.log('Deleting row at index:', i);
    table.deleteRow(i)
  }
}

function handleRowClick(event) {
  const clickedRow = event.currentTarget;
  
  const cells = clickedRow.cells;
  const date = cells[0].textContent;
  const place = cells[1].textContent;
  const owner = cells[2].textContent;
  const value = cells[3].textContent;
  console.log('Row double-clicked:', date, place, owner, value);

  const keyToDelete = clickedRow.getAttribute('data-key'); // Get the Firebase key
  console.log(keyToDelete)
  if (keyToDelete) {
    const dataRef = database.ref('expensesControl');
    dataRef.child(keyToDelete).remove()
      .then(() => {
        console.log('Item deleted from Firebase:', keyToDelete);
      })
      .catch(error => {
        console.error('Error deleting item from Firebase:', error);
      });
  }
}

// Function to add data to the table
function addExpenseToTable(props) {
  const tbody = document.getElementById('table').getElementsByTagName('tbody')[0]
  console.log("Prop Key: " + props[0])
  
  props.forEach(data => {
    console.log("data Key: " + data[0])
    const newRow = tbody.insertRow()
    newRow.setAttribute('data-key', data.key)
    const dateCell = newRow.insertCell(0)
    const placeCell = newRow.insertCell(1)
    const ownerCell = newRow.insertCell(2)
    const valueCell = newRow.insertCell(3)
    dateCell.textContent = data[0].date
    placeCell.textContent = data[0].place
    ownerCell.textContent = data[0].owner
    valueCell.textContent = data[0].value

    newRow.addEventListener('dblclick', handleRowClick)
  });
}

function handleAddButon() {
  const dateInput = document.getElementById('date-input').value
  let dateValue = ''
  if (dateInput === '') {
    dateValue = getTodayDate()
  }  else {
    dateValue = dateInput
  }
  const locationInput = document.getElementById('location-input').value
  const selectedOwner = document.querySelector('.input-owner:checked')
  const valueInput = document.getElementById('value-input').value
  const inputOwner = selectedOwner ? selectedOwner.value : 'Dividido';
  const inputObject = [{
    date: dateValue,
    place: locationInput,
    owner: inputOwner,
    value: valueInput
  }] 
  if (valueInput > 0) {
    push(expensesInDB, inputObject)
    resetInputFields()
  }
  else {
    const checkInput = document.getElementById('check-input')
    checkInput.textContent = 'Qual o valor?'
  }
}

function handleDeleteButon() {
  remove(expensesInDB)
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function resetInputFields() {
  const dateInput = document.getElementById('date-input')
  const locationInput = document.getElementById('location-input')
  const valueInput = document.getElementById('value-input')

  dateInput.value = ''
  locationInput.value = ''
  valueInput.value = ''
}
export default App;
