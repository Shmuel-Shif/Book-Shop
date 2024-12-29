'use strict'

let allBooks = []
let filteredBooks = []

function onInit() {
    books = getBooks()
    filteredBooks = books
    calculateStatistics()
    render()
}

function render() {
    const bookTableBod = document.querySelector('tbody')
    const noBooksMessage = document.getElementById('noBooksMessage')
    bookTableBod.innerHTML = ''

    if (filteredBooks.length === 0) {
        noBooksMessage.style.display = 'block'
    } else {
        noBooksMessage.style.display = 'none'
    
    filteredBooks.forEach(book => {

        const row = document.createElement('tr')
        row.innerHTML = `
        <td class="titles">${book.title}</td>
        <td class="prices">${book.price}&#8362;</td>
        <td>
          <button class="table-btn" onclick="onShowDetails ('${book.id}')">Details</button>
          <button class="table-btn" onclick="onUpdateBook('${book.id}')">Update</button>
          <button class="table-btn" onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
        `
        bookTableBod.appendChild(row)
    })
    removeBook(bookId)
  }
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    showSuccessMessage()
    calculateStatistics()
    render()
}

function onUpdateBook(bookId) {
    const newPrice = prompt('Enter new price:')
    if (newPrice) {
      updateBookPrice(bookId, parseFloat(newPrice))
      showSuccessMessage()
      calculateStatistics()
      render()
    }
}
  
function onAddBook() {
    const title = prompt('Enter book title:')
    const price = +prompt('Enter book price:')
    const imgUrl = prompt('Enter book link img:') 

    if (!title || isNaN(price) || price <= 0) {
        alert('Please provide a valid title and price.')
        return
    }
        addBook(title, price, imgUrl)
        filteredBooks = [...books]
        showSuccessMessage()
        calculateStatistics()
        render()
    
}

function onShowDetails(bookId) {
    const book = books.find(book => book.id === bookId)

    if (book) {
        document.getElementById('bookTitle').innerHTML = `<span class="title-modal">Title:</span> ${book.title}`
        document.getElementById('bookPrice').innerHTML = `Price: ${book.price}&#8362;`
        
        const bookImg = document.getElementById('bookImg')
        bookImg.src = book.imgUrl || 'img/NaN.jpg'
        bookImg.alt = `Image of ${book.title}`
        document.getElementById("bookDetailsModal").style.display = 'block'
    }
}

function closeModal() {
    document.getElementById('bookDetailsModal').style.display = 'none'
}

function onSearchBook() {
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase()
    filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(searchTerm))

    render()
}

function onClearSearch() {
    document.getElementById('searchInput').value = ''
    filteredBooks = allBooks
    onSearchBook()
    render()
}

function onSearchBook() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase()

    filteredBooks = searchTerm 
    ? books.filter(book => book.title.toLowerCase().includes(searchTerm))
    : [...books]
    render()
}

function showSuccessMessage() {
    const messageElement = document.getElementById('successMessage')
    messageElement.style.display = 'block'
    
    setTimeout(() => {
        messageElement.style.display = 'none'
    }, 2000)
}

function calculateStatistics() {
    let expensiveCount = 0
    let averageCount = 0
    let cheapCount = 0

    books.forEach(book => {
        if (book.price >= 200) {
            expensiveCount++
        } else if (book.price >= 80 && book.price < 200) {
            averageCount++
        } else {
            cheapCount++
        }
    })

    document.getElementById('expensiveCount').innerText = `Books over NIS 200: ${expensiveCount}`
    document.getElementById('averageCount').innerText = `Books between 80 and 200 NIS: ${averageCount}`
    document.getElementById('cheapCount').innerText = `Books under NIS 80: ${cheapCount}`
}

function renderFooter() {
    const footer = document.querySelector('footer')
    footer.innerHTML = `
        <p id="expensiveCount">Expensive(200+): 0</p>
        <p id="averageCount">Average: 0</p>
        <p id="cheapCount">Cheap: 0</p>
    `
}