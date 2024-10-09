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

function addBookToLibrary(title, author, pages, haveRead) {
    myLibrary.push(new Book(title, author, pages, haveRead))
  }

function libraryList() {
    myLibrary.forEach((book, idx) => {
        console.log(idx + ') ' + book.bookInfo() + '\n')
    })
}

const dialog = document.querySelector("#dialog-book")
const form = document.querySelector("#book-form")
const openDialogBtn = document.querySelector(".main-btn")
const submitBtn = document.querySelector("#submit-btn")

function openDialog() {
    dialog.showModal()
}

function serializeForm() {
    return Array.from(form.elements).filter((item) =>{ 
        if (!!item.name)
            if  (item.type === 'radio' && !item.checked)
                return false
            else
                return true
    }).map((item) => {
        const {name, type} = item
        const value = type === 'radio' && item.value === 'yes' ? true : type === 'radio' ? false : item.value
        return {name, value}
    }).reduce((obj, curr) => {
        obj[curr.name] = curr.value
        return obj
    }, {})
}


function submitHandle() {
    input = serializeForm()
    addBookToLibrary(input.title, input.author, input.pages, input.haveRead)
    form.reset()
}

openDialogBtn.addEventListener('click', openDialog)
form.addEventListener('submit', submitHandle)
