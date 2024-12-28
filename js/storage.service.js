'use strict'


function getBooksFromStorage() {
    const booksData = localStorage.getItem('books')
    return booksData ? JSON.parse(booksData) : null
}

function saveBooksToStorage(books) {
    localStorage.setItem('books', JSON.stringify(books))
}  

function getBooks() {
    let books = getBooksFromStorage()

    if (!books) {

        books = [
            {
              id: 'b1',
              title: 'The Adventures of Lori Ipsi',
              price: 120,
            },
            {
              id: 'b2',
              title: 'World Atlas',
              price: 300,
            },
            {
              id: 'b3',
              title: 'Zorda the Greek',
              price: 87,
            },
            
        ]
        saveBooksToStorage(books)
        
    }
    return books
}

function _saveBooks(books) {
    saveBooksToStorage(books)
}

