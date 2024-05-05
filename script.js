let currentCurrency = "USD"; // Valor por defecto
        const currencySelect = document.getElementById("currency");


        let balance = 0;
        const balanceDisplay = document.getElementById("balance");
        const historyList = document.getElementById("history");
        const amountInput = document.getElementById("amount");
        const reasonInput = document.getElementById("reason");

        const alertModal = document.getElementById("alertModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalMessage = document.getElementById("modalMessage");

        const deleteModal = document.getElementById("deleteModal");

        let transactionToDelete = null; // Guardar la transacción a eliminar
    
        function loadFromLocalStorage() {
            const storedBalance = localStorage.getItem("balance");
            if (storedBalance) {
                balance = parseFloat(storedBalance);
            }
    
            const storedHistory = localStorage.getItem("history");
            if (storedHistory) {
                const historyItems = JSON.parse(storedHistory);
                historyItems.forEach((item, index) => {
                    const historyItem = document.createElement("li");
                    historyItem.textContent = item;
    
                    const deleteButton = document.createElement("span");
                    deleteButton.textContent = "X";
                    deleteButton.className = "delete";
                    deleteButton.onclick = () => confirmDelete(index); // Confirmar eliminación
    
                    historyItem.appendChild(deleteButton);
                    historyItem.className = item.includes('+') ? 'income' : 'expense';
    
                    historyList.appendChild(historyItem);
                });
            }
    
            updateBalance();
        }
    
        function confirmDelete(index) {
            transactionToDelete = index; // Guardar el índice de la transacción a eliminar
            deleteModal.style.display = "flex"; // Mostrar el modal de confirmación
        }
    
        function deleteTransaction() {
            if (transactionToDelete !== null) {
                const transaction = historyList.children[transactionToDelete];
                historyList.removeChild(transaction); // Eliminar del historial
                transactionToDelete = null; // Restablecer
    
                saveToLocalStorage(); // Guardar cambios
                closeModal(); // Cerrar el modal de confirmación
            }
        }
    
        function saveToLocalStorage() {
            const historyItems = Array.from(historyList.children).map(li => li.textContent);
            localStorage.setItem("history", JSON.stringify(historyItems));
        }
    
        function updateBalance() {
            balanceDisplay.textContent = `Balance: S/${balance.toFixed(2)}`;
        }
    
        function showAlert(title, message) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            alertModal.style.display = "flex"; // Mostrar el modal de alerta
        }
    
        function closeModal() {
            deleteModal.style.display = "none"; // Cerrar el modal de confirmación
            alertModal.style.display = "none"; // Cerrar el modal de alerta
        }
    
        function addMoney() {
            const amount = parseFloat(amountInput.value);
            const reason = reasonInput.value.trim();
    
            if (!isNaN(amount) && amount > 0 && reason) {
                balance += amount;
                updateBalance();
    
                const historyItem = document.createElement("li");
                historyItem.textContent = `+ S/${amount.toFixed(2)} por ${reason}`;
    
                const deleteButton = document.createElement("span");
                deleteButton.textContent = "X";
                deleteButton.className = "delete";
                deleteButton.onclick = () => confirmDelete(historyList.children.length - 1);
    
                historyItem.appendChild(deleteButton);
    
                historyItem.className = 'income'; // Clase para ingresos
    
                historyList.appendChild(historyItem);
    
                saveToLocalStorage(); // Guardar en localStorage
                clearInputs(); // Limpiar inputs
    
                showAlert("Éxito", "Dinero agregado exitosamente!"); // Alerta para agregar dinero
            } else {
                showAlert("Error", "Por favor, ingresa un monto válido y una razón."); // Alerta para inputs incorrectos
            }
        }
    
        function removeMoney() {
            const amount = parseFloat(amountInput.value);
            const reason = reasonInput.value.trim();
    
            if (!isNaN(amount) && amount > 0 && reason) {
                if (balance >= amount) {
                    balance -= amount;
                    updateBalance();
    
                    const historyItem = document.createElement("li");
                    historyItem.textContent = `- S/${amount.toFixed(2)} por ${reason}`;
    
                    const deleteButton = document.createElement("span");
                    deleteButton.textContent = "X";
                    deleteButton.className = "delete";
                    deleteButton.onclick = () => confirmDelete(historyList.children.length - 1);
    
                    historyItem.appendChild(deleteButton);
    
                    historyItem.className = 'expense'; // Clase para gastos
    
                    historyList.appendChild(historyItem);
    
                    saveToLocalStorage(); // Guardar en localStorage
                    clearInputs(); // Limpiar inputs
    
                    showAlert("Éxito", "Dinero retirado exitosamente!"); // Alerta para quitar dinero
                } else {
                    showAlert("Error", "No puedes quitar más dinero del que tienes."); // Alerta para balance insuficiente
                }
            } else {
                showAlert("Error", "Por favor, ingresa un monto válido y una razón."); // Alerta para inputs incorrectos
            }
        }
    
        function clearInputs() {
            amountInput.value = "";
            reasonInput.value = "";
        }
    
        // Obtener la divisa del localStorage y configurarla en el selector
        function loadFromLocalStorage() {
            const storedCurrency = localStorage.getItem("currency");
            if (storedCurrency) {
                currentCurrency = storedCurrency; // Recuperar la divisa
                currencySelect.value = storedCurrency; // Configurar el valor del selector
            }
            // Otras partes del código para cargar balance e historial
        }

        // Guardar la divisa seleccionada en localStorage
        function saveToLocalStorage() {
            localStorage.setItem("currency", currentCurrency); // Guardar la divisa actual
            // Otras partes para guardar el historial y balance
        }

        // Obtener el símbolo de la divisa actual
        function getCurrencySymbol() {
    switch (currentCurrency) {
        case "USD": // Estados Unidos
            return "$";
        case "EUR": // Unión Europea
            return "€";
        case "GBP": // Reino Unido
            return "£";
        case "JPY": // Japón
            return "¥";
        case "CAD": // Canadá
            return "C$";
        case "AUD": // Australia
            return "A$";
        case "CHF": // Suiza
            return "CHF";
        case "MXN": // México
        case "ARS": // Argentina
        case "COP": // Colombia
        case "CLP": // Chile
        case "UYU": // Uruguay
            return "$";
        case "BRL": // Brasil
            return "R$";
        case "PEN": // Perú
            return "S/";
        case "INR": // India
            return "₹";
        case "ZAR": // Sudáfrica
            return "R";
        case "RUB": // Rusia
            return "₽";
        case "CNY": // China
        case "HKD": // Hong Kong
            return "¥";
        case "NZD": // Nueva Zelanda
            return "NZ$";
        default:
            return "$"; // Valor predeterminado
    }
}

        // Función para cambiar la divisa seleccionada
        function changeCurrency() {
            currentCurrency = currencySelect.value; // Actualizar la divisa
            updateBalance(); // Actualizar el balance con la nueva divisa
            saveToLocalStorage(); // Guardar la nueva divisa
        }

        // Actualizar el balance para reflejar el símbolo de la divisa
        function updateBalance() {
            balanceDisplay.textContent = `Balance: ${getCurrencySymbol()}${balance.toFixed(2)}`;
        }
                document.getElementById("addButton").onclick = addMoney;
                document.getElementById("removeButton").onclick = removeMoney;
            
                document.getElementById("confirmDeleteButton").onclick = deleteTransaction;
            
                loadFromLocalStorage(); // Cargar datos iniciales