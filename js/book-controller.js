'use strict'

let allBooks = []
let filteredBooks = []
let filterBy = {
    title: '',
    rating: 0
}

let sortBy = {
    field: null, 
    order: 'asc' 
}

function onInit() {
    books = getBooks()
    filteredBooks = [...books]
    calculateStatistics()
    render()

    document.getElementById('searchInput').addEventListener('input', onFilterBooks)
    document.getElementById('ratingFilter').addEventListener('change', onFilterBooks)
    document.getElementById('clearFilterBtn').addEventListener('click', onClearFilter)

    document.querySelectorAll('input[name="sortField"]').forEach(input => {
        input.addEventListener('change', onSortBooks)
    })
    document.querySelectorAll('input[name="sortOrder"]').forEach(input => {
        input.addEventListener('change', onSortBooks)
    })
}

function render() {
    const bookTableBod = document.querySelector('tbody')
    const noBooksMessage = document.getElementById('noBooksMessage')
    bookTableBod.innerHTML = ''
    
    const booksToDisplay = getBooksForCurrentPage()
    
    if (booksToDisplay.length === 0) {
        noBooksMessage.style.display = 'block'
    } else {
        noBooksMessage.style.display = 'none'
        
        booksToDisplay.forEach(book => {
            
            const row = document.createElement('tr')
            row.innerHTML = `
            <td class="titles">${book.title}</td>
            <td class="prices">${book.price}&#8362;</td>
            <td class="rating">${generateStars(book.rating)}</td>
            <td>
            <button class="table-btn" onclick="onShowDetails ('${book.id}')">Details</button>
            <button class="table-btn" onclick="onUpdateBook('${book.id}')">Update</button>
            <button class="table-btn" onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
            `
            bookTableBod.appendChild(row)
        })
    }
    updatePaginationButtons()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    showSuccessMessage()
    calculateStatistics()
    render()
}

function onUpdateBook(bookId) {
     
    const book = books.find(book => book.id === bookId)
    if (book) {
            openBookEditModal(book)
    }
}

function onAddBook() {
     currentEditingBookId = null
     openBookEditModal()
}

function onShowDetails(bookId) {
    const book = books.find(book => book.id === bookId)

    if (book) {
        document.getElementById('bookTitle').innerHTML = `<span class="title">Title:</span> ${book.title}`
        document.getElementById('bookPrice').innerHTML = `<span class="title">Price:</span> ${book.price}&#8362;`
        document.getElementById('bookRating').innerHTML = `<span class="title">Rating:</span> ${book.rating} ⭐`

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

function updateQueryString() {
    const queryParams = new URLSearchParams()

    if (filterBy.title) {
        queryParams.set('title', filterBy.title)
    }
    if (filterBy.rating > 0) {
        queryParams.set('rating', filterBy.rating)
    }

    window.history.pushState({}, '', '?' + queryParams.toString())
}

function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    
    const title = queryParams.get('title') || ''
    const rating = parseFloat(queryParams.get('rating')) || 0

    filterBy = {
        title: title,
        rating: rating
    };

    document.getElementById('searchInput').value = title
    document.getElementById('ratingFilter').value = rating

    onFilterBooks()
}

function onClearFilter() {
    
    document.getElementById('searchInput').value = ''
    document.getElementById('ratingFilter').value = ''
    
    filterBy = {
        title: '',
        rating: 0
    };
    
    updateQueryString()
    
    filteredBooks = books
    render()
}

function onSortBooks() {
    
    const sortField = document.querySelector('input[name="sortField"]:checked').value
    const sortOrder = document.querySelector('input[name="sortOrder"]:checked').value
    
    sortBy.field = sortField
    sortBy.order = sortOrder
    
    filteredBooks.sort((a, b) => {
        if (sortBy.order === 'asc') {
            return a[sortBy.field] > b[sortBy.field] ? 1 : -1
        } else {
            return a[sortBy.field] < b[sortBy.field] ? 1 : -1
        }
    })
    
    render()
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
    const prevPageBtn = document.getElementById('prevPageBtn')
    const nextPageBtn = document.getElementById('nextPageBtn')
    
    prevPageBtn.disabled = currentPage === 1
    nextPageBtn.disabled = currentPage === totalPages
    
    document.getElementById('pageNumber').textContent = currentPage
}

function onNextPage() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
    if (currentPage < totalPages) {
        currentPage++
    } else {
        currentPage = 1
    }
    render()
    updateURL()
}

function onPrevPage() {
    if (currentPage > 1) {
        currentPage--
    } else {
        currentPage = Math.ceil(filteredBooks.length / booksPerPage)
    }
    render()
    updateURL()
}

function openBookEditModal(book = null) {
    const titleInput = document.getElementById('bookTitleInput')
    const priceInput = document.getElementById('bookPriceInput')
    const ratingInput = document.getElementById('bookRatingInput')
    
    if (!titleInput || !priceInput || !ratingInput) {
        console.error('Error: One or more modal inputs are missing from the DOM.')
        return;
    }
    
    if (book) {
        titleInput.value = book.title || ''
        priceInput.value = book.price || 0
        ratingInput.value = book.rating || 3
        currentEditingBookId = book.id;
    } else {
        titleInput.value = ''
        priceInput.value = ''
        ratingInput.value = `3`
        currentEditingBookId = null
    }
    
    document.getElementById('bookEditModal').style.display = 'block'
}

function closeBookEditModal() {
    const modal = document.getElementById('bookEditModal')
    modal.style.display = 'none'
}

function openBookDetailsModal(bookId) {
    const book = books.find(book => book.id === bookId)
    if (book) {
        document.getElementById('bookTitle').textContent = book.title
        document.getElementById('bookPrice').textContent = `${book.price}₪`
        document.getElementById('bookRating').textContent = generateStars(book.rating)
        document.getElementById('bookImg').src = book.imgUrl;
        
        document.getElementById('bookDetailsModal').style.display = 'block'
    }
}

function closeBookDetailsModal() {
    document.getElementById('bookDetailsModal').style.display = 'none'
    history.pushState(null, null, window.location.pathname)
}

function filterBooksByTitle(titleFilter) {
    const regex = new RegExp(titleFilter, 'i')
    return books.filter(book => regex.test(book.title))
}

function onFilterBooks() {
    const titleFilter = document.getElementById('searchInput').value.trim().toLowerCase()
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value) || 0
    
    const regex = new RegExp(titleFilter, 'i')
    
    filteredBooks = books.filter(book => {
        const matchesTitle = titleFilter === '' || regex.test(book.title)
        const matchesRating = book.rating >= ratingFilter
        
        return matchesTitle && matchesRating
    })
    
    render()
}

function onFilterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase()
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value)

    filterBy.title = searchTerm
    filterBy.rating = ratingFilter

    filteredBooks = books.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(filterBy.title)
        const matchesRating = book.rating >= filterBy.rating
        return matchesTitle && matchesRating
    });

    updateQueryString()

    render()
}
