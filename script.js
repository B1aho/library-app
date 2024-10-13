let myLibrary = [];

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

function addBookToLibrary(id, title, author, pages, haveRead) {
    const book = new Book(id, title, author, pages, haveRead)
    myLibrary.push(book)
    return book
}

// html-elements
const dialog = document.querySelector("#dialog-book")
const form = document.querySelector("#book-form")
const openDialogBtn = document.querySelector(".main-btn")
const booksContainer = document.querySelector("#book-cards")
const imgContainer = document.querySelector("#no-cards")

// On button click show dialog popup. On button click outside dialog-div dialog will be closed
openDialogBtn.addEventListener('click', openDialog)
dialog.addEventListener('click', closeDialog)
function openDialog() {
    dialog.showModal()
}

function closeDialog(e) {
    if (e.target.id === 'dialog-book')
        dialog.close()
}
/* 
When form is submit, serialize data from form into one object, give id to it and add to library and emit event when done
*/
form.addEventListener('submit', submitHandle)

function serializeForm() {
    return Array.from(form.elements).filter((item) => {
        // Take only named elements of form (exclude button) 
       if (item.name) return true
    }).map((item) => {
        // Map every named element of form and transform it into object with name and value props. Result is array of such objects.
        const { name, type } = item
        const value = type === 'checkbox' && item.checked ? true : type === 'checkbox' ? false : item.value
        return { name, value }
        // Reduce array of objects into one object like Book type
    }).reduce((obj, curr) => {
        obj[curr.name] = curr.value
        return obj
    }, {})
}

function submitHandle() {
    let input = serializeForm()
    const book = addBookToLibrary(Date.now(), input.title, input.author, input.pages, input.haveRead)
    form.reset()
    let event = new Event('addBook')
    event.value = book
    form.dispatchEvent(event)
    // Hide image when adding start
    imgContainer.style.display = 'none'
}

// When book was add to library, show card of recently added book
form.addEventListener('addBook', showBookCard)

function showBookCard(e) {
    const book = e.value
    // Give card-element same book's id and append card
    const card = document.createElement("div")
    const id = myLibrary[myLibrary.indexOf(book)].id
    card.className = "book-card"
    card.id = `card${id}`
    booksContainer.append(card)
    for (let prop in book) {
        // Iterate only through book's own properties
        if (Object.prototype.hasOwnProperty.call(book, prop)) {
            // Add 'Read' btn depends on haveRead value
            if (prop === 'haveRead') {
                const readBtn = document.createElement("button")
                readBtn.id = `read${id}`
                readBtn.addEventListener("click", changeReadStatus)
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
                el.innerText = (prop === "pages") ? book[prop] + " pages" : (prop === "title") ? '"' + book[prop] + '"' : book[prop]
                card.append(el)
            }
        }
    }
    // Add remove btn on card's display
    const removeBtn = document.createElement("button")
    removeBtn.className = "remove"
    removeBtn.id = `remove${id}`
    removeBtn.addEventListener('click', removeCard)
    removeBtn.innerText = "Remove"
    card.append(removeBtn)
}

function removeCard(e) {
    const id = extractId(e.target.id)
    myLibrary = myLibrary.filter((item) => {
       return item.id.toString() !== id
    })
    const card = document.querySelector(`#card${id}`)
    card.remove()
}

function changeReadStatus(e) {
    const btn = e.target
    const id = extractId(btn.id)
    btn.classList.toggle("have-read")
    const book = myLibrary.find((b) => {
        return b.id === +id
    })
    if (book) {
        book.haveRead = btn.className.includes("have-read") ? true : false
    }
    btn.innerText = btn.className.includes("have-read") ? "Read" : "Not read"
}

// Extract number part of id
function extractId(str) {
    const reg = /\d+/g
    const matches = str.match(reg)
    return matches[0]
}
