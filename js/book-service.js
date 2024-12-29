'use strict'


let books = getBooks()

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

function updateBookPrice(bookId, newPrice) {
    const book = books.find(book => book.id === bookId)
    if (book) {
        book.price = newPrice
        _saveBooks(books)
    }
}

function addBook(title, price, imgUrl) {
    const newBook = {
        id: 'b' + (books.length + 1),
        title,
        price,
        imgUrl: imgUrl || 'img/NaN.jpg'
    }
    books.push(newBook)
    _saveBooks(books)
    
}

