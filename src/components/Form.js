import React from "react"

export default function Form(props) {
    const [formData, setFormData] = React.useState(
        {
            date: "", 
            place: "", 
            owner: "", 
            value: ""
        }
    )
    
    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }
    
    function formatDate(inputDate) {
        // Parse the input date in YYYY-MM-DD format
        const parts = inputDate.split("-");
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        
        // Construct the formatted date in DD/MM/YYYY format
        const formattedDate = `${day}/${month}/${year}`;
        
        return formattedDate;
    }

    function handleAdd(event) {
        event.preventDefault()
        if (formData.date === '') {
            formData.date = getTodayDate()
        } else {
            formData.date = formatDate(formData.date)
        }
        if (formData.owner === '') {
            formData.owner = "Dividido"
        }        
        if (formData.value > 0) {
            props.handleAddButon(formData)
            resetInputFields()
        } else {
            const checkInput = document.getElementById('check-input')
            checkInput.textContent = 'O valor não pode ser zero'
        }
    }
    
    function handleDelete() {
        props.handleDeleteAll()
    }

    function getTodayDate() {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        // return `${year}-${month}-${day}`
        return `${day}/${month}/${year}`
      }

    function resetInputFields() {
        setFormData({
            date: "", 
            place: "", 
            owner: "", 
            value: ""
        })
    }
    return (
        <form>
            <div className="input-div">
                <input
                    id='date-input' 
                    placeholder='Data' 
                    type="date" 
                    max={getTodayDate()}
                    onChange={handleChange}
                    name="date"
                    value={formData.date}
                />
                <input
                    id='place-input'
                    type="text"
                    placeholder="Lugar"
                    onChange={handleChange}
                    name="place"
                    value={formData.place}
                />            
                <select 
                    id="owner-input" 
                    value={formData.owner}
                    onChange={handleChange}
                    name="owner"
                >
                    <option value="Dividido">Dividido</option>
                    <option value="Arthur">Arthur</option>
                    <option value="Maysa">Maysa</option>
                </select>
                <input 
                    id="value-input" 
                    placeholder='Valor (R$)' 
                    type='number'
                    value={formData.value}
                    onChange={handleChange}
                    name="value"
                />
            </div>
            <br />
            <span id='check-input'></span>
            <div className="buttons-div">
                <button id="addButon" onClick={handleAdd}>Salvar</button>
                <button id="deleteButon" onClick={handleDelete}>Apagar tudo</button>
            </div>
        </form>
    )
}
