'use strict'


function getBooksFromStorage() {
    const booksData = localStorage.getItem('books')
    return booksData ? JSON.parse(booksData) : []
}

function saveBooksToStorage(books) {
    localStorage.setItem('books', JSON.stringify(books))
}  

function getBooks() {
    let books = getBooksFromStorage()

    if (!books || books.length === 0) {

        books = [
            {
              id: 'b1',
              title: 'The Adventures of Lori Ipsi',
              price: 120,
              imgUrl: 'img/Lori Ipsi.jpg',
              rating: getRandomRating()
            },
            {
              id: 'b2',
              title: 'World Atlas',
              price: 300,
              imgUrl: 'img/World Atlas.jpg',
              rating: getRandomRating()
            },
            {
              id: 'b3',
              title: 'Zorda the Greek',
              price: 87,
              imgUrl: 'img/Zorda the Greek.jpg',
              rating: getRandomRating()
            },
            
        ]
        saveBooksToStorage(books)
        
    }
    console.log("Books:", books)
    return books
}

function getRandomRating() {
  return (Math.random() * 10).toFixed(0) / 2
}

function _saveBooks(books) {
    saveBooksToStorage(books)
}

