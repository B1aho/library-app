function Book (title, author, pages, haveRead) {
    if (!(this instanceof Book))
        return new Book(title, author, pages, haveRead) 
    this.title = title
    this.author = author
    this.pages = pages
    this.haveRead = haveRead
}

Book.prototype.bookInfo = function() {
    return  "'" + this.title + "'" + ", " +  this.author + ", " + this.pages + " pages" + ", " + ((this.haveRead) ? "was read" : "not read");
}

const myLibrary = [];

function addBookToLibrary() {
    // do stuff here
    const title = prompt("Enter title of a Book", "No title entered")
    const author = prompt("Enter author of a Book", "No author entered")
    const pages = prompt("Enter number of pages", "0 pages enterd")
    let answer = prompt("Have you read this book? Answer yes or no.", "Yes").toLowerCase()
    const haveRead = (answer.charAt(0) === 'y') ? true : false
    myLibrary.push(new Book(title, author, pages, haveRead))
  }

function libraryList() {
    myLibrary.forEach((book, idx) => {
        console.log(idx + ') ' + book.bookInfo() + '\n')
    })
}