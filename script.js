// Добавить комментари и заново проанализировать логику 

function Book(id, title, author, pages, haveRead) {
    if (!(this instanceof Book))
        return new Book(title, author, pages, haveRead)
    this.id = id
    this.title = title
    this.author = author
    this.pages = pages
    this.haveRead = haveRead
}

Book.prototype.bookInfo = function () {
    return "ID: " + this.id + " " +  "'" + this.title + "'" + ", " + this.author + ", " + this.pages + " pages" + ", " + ((this.haveRead) ? "was read" : "not read");
}

let myLibrary = [];

function addBookToLibrary(id, title, author, pages, haveRead) {
    const book = new Book(id, title, author, pages, haveRead)
    myLibrary.push(book)
    return book
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
const booksContainer = document.querySelector("#book-cards")

function openDialog() {
    dialog.showModal()
}

function serializeForm() {
    return Array.from(form.elements).filter((item) => {
        if (!!item.name)
            if (item.type === 'radio' && !item.checked)
                return false
            else
                return true
    }).map((item) => {
        const { name, type } = item
        const value = type === 'radio' && item.value === 'yes' ? true : type === 'radio' ? false : item.value
        return { name, value }
    }).reduce((obj, curr) => {
        obj[curr.name] = curr.value
        return obj
    }, {})
}


function submitHandle() {
    input = serializeForm()
    const book = addBookToLibrary(Date.now(), input.title, input.author, input.pages, input.haveRead)
    form.reset()
    let event = new Event('addBook')
    event.value = book
    form.dispatchEvent(event)
}

openDialogBtn.addEventListener('click', openDialog)
form.addEventListener('submit', submitHandle)
form.addEventListener('addBook', showBookCard)

function showBookCard(e) {
    const book = e.value
    // Даём карточке такой же айлишник, как и у книги
    const idx = myLibrary[myLibrary.indexOf(book)].id
    const card = document.createElement("div")
    card.className = "book-card"
    card.setAttribute('id', `card${idx}`)
    booksContainer.append(card)
    for (prop in book) {
        if (Object.prototype.hasOwnProperty.call(book, prop)) {
            if (prop === 'haveRead') {
                let readBtn = document.createElement("button")
                readBtn.className = "read"
                if (book[prop]) {
                    readBtn.className = "have-read"
                    readBtn.innerText = "Read"
                } else {
                    readBtn.innerText = "Not read"
                }
                card.append(readBtn)
            } else if (prop === 'id') 
                continue
            else {
                let el = document.createElement("h2")
                el.id = prop
                el.innerText = (prop !== "pages") ? book[prop] : book[prop] + " pages"
                card.append(el)
            }
        }
    }
    const removeBtn = document.createElement("button")
    removeBtn.className = "remove"
    removeBtn.setAttribute('index', +idx)
    removeBtn.addEventListener('click', removeCard)
    removeBtn.innerText = "Remove"
    card.append(removeBtn)
}

function removeCard(e) {
    const idx =  e.target.getAttribute('index')
    myLibrary = myLibrary.filter((item) => {
       return item.id.toString() !== idx
    })
    const card = document.querySelector(`#card${idx}`)
    card.remove()
}