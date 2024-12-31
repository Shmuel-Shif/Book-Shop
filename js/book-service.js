'use strict'

let books = getBooks()
let currentPage = 1
const booksPerPage = 5
let currentEditingBookId = null


function getBooksList() {
    return books
}

function removeBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId)
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1)
        _saveBooks(books)
    }
}

function updateBookPrice(bookId, newPrice,) {
    const book = books.find(book => book.id === bookId)
    if (book) {
        book.price = newPrice
        _saveBooks(books)
    }
}

function addBook(title, price, imgUrl, rating) {
    const newBook = {
        id: 'b' + (books.length + 1),
        title,
        price,
        imgUrl: imgUrl || 'img/NaN.jpg',
        rating: rating || getRandomRating()
    };
    books.push(newBook)
    _saveBooks(books)
    render()
}

function getPaginatedBooks() {
    const startIdx = (currentPage - 1) * booksPerPage
    const endIdx = startIdx + booksPerPage
    return filteredBooks.slice(startIdx, endIdx)
}

function onPrevPage() {
    if (currentPage > 1) {
        currentPage--
        render()
    }
}

function onNextPage() {
    if (currentPage * booksPerPage < filteredBooks.length) {
        currentPage++
        render()
    }
}

function saveBook() {
    const title = document.getElementById('bookTitleInput').value.trim()
    const price = parseFloat(document.getElementById('bookPriceInput').value)
    const imgUrl = document.getElementById('bookImgInput')?.value || 'img/NaN.jpg'
    const rating = parseFloat(document.getElementById('bookRatingInput').value)

    if (!title || isNaN(price) || price <= 0 || isNaN(rating) || rating < 0 || rating > 5) {
        const errorMessage = document.getElementById('error-message')
        errorMessage.textContent = 'Please provide valid inputs for all fields.'
        errorMessage.style.display = 'block'

        setTimeout(() => {
            errorMessage.style.display = 'none'
        }, 2000)
        
        return
    }

    if (!currentEditingBookId) {
        addBook(title, price, imgUrl, rating)
        filteredBooks = [...books]
    } else {
        const book = books.find(book => book.id === currentEditingBookId)
        if (book) {
            book.title = title
            book.price = price
            book.imgUrl = imgUrl
            book.rating = rating
        }
    }

    closeBookEditModal()
    calculateStatistics()
    render()
    showSuccessMessage()
}

function onRatingChange(bookId, change) {
    event.preventDefault()
    const book = books.find(book => book.id === bookId)

    if (book) {
        const newRating = Math.max(0, Math.min(5, (book.rating + change).toFixed(1)))
        book.rating = parseFloat(newRating)
        document.getElementById('ratingDisplay').textContent = `${book.rating} ⭐`
    }
}

function generateStars(rating) {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 !== 0
    let starsHTML = ''

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full-star">★</span>'
    }

    if (halfStar) {
        starsHTML += '<span class="star half-star">★</span>'
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty-star">★</span>'
    }

    return starsHTML
}

function onCloseModal() {
    const title = document.getElementById('bookTitleInput').value
    const price = parseFloat(document.getElementById('bookPriceInput').value)
    const rating = parseFloat(document.getElementById('ratingDisplay').textContent)

    if (currentBookId) {
        
        const book = books.find(book => book.id === currentBookId)
        if (book) {
            book.title = title;
            book.price = price;
            book.rating = rating;
        }
    } else {
        
        addBook(title, price, '', rating)
    }

    saveBooksToStorage(books)
    filteredBooks = [...books]
    render()
    closeModal()
}

function onEditBook(bookId) {
    currentBookId = bookId
    const book = books.find(book => book.id === bookId)

    if (book) {
        document.getElementById('bookTitleInput').value = book.title
        document.getElementById('bookPriceInput').value = book.price
        document.getElementById('ratingDisplay').textContent = `${book.rating} ⭐`
    }

    openModal()
}

function onSortColumn(field) {

    if (sortBy.field === field) {
        sortBy.order = sortBy.order === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.field = field
        sortBy.order = 'asc'
    }

    filteredBooks.sort((a, b) => {
        if (sortBy.order === 'asc') {
            return a[field] > b[field] ? 1 : -1
        } else {
            return a[field] < b[field] ? 1 : -1
        }
    })

    render()
    updateColumnHeaders()
    updateURL()
}

function updateColumnHeaders() {
    const headers = ['titleHeader', 'priceHeader', 'ratingHeader']
    headers.forEach(headerId => {
        const header = document.getElementById(headerId)
        const field = headerId.replace('Header', '')
        
        if (field === sortBy.field) {
            const sign = sortBy.order === 'asc' ? '+' : '-'
            header.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)} ${sign}`
        } else {
            header.textContent = field.charAt(0).toUpperCase() + field.slice(1)
        }
    })
}

function updateURL() {
    const urlParams = new URLSearchParams()
    if (sortBy.field) {
        urlParams.set('sortField', sortBy.field)
        urlParams.set('sortOrder', sortBy.order)
    }
    urlParams.set('page', currentPage)
    window.history.replaceState(null, '', `?${urlParams.toString()}`)
}

function getBooksForCurrentPage() {
    const startIdx = (currentPage - 1) * booksPerPage;
    const endIdx = startIdx + booksPerPage;
    const result = filteredBooks.slice(startIdx, endIdx);
    return result
    updateURL()
}
