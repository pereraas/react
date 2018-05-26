import React, { Component } from "react";
import BookShelf from "./BookShelf";
import * as BooksAPI from "../services/BooksAPI";
import Constant from "../utils/Constant";
import { Link } from "react-router-dom";

class BookCase extends Component {
  /*
  state = {
    shelves: [],
    bookToBeUpdated: undefined
  };

  filterBooksToBeDisplayed = (books, title) => {
    return (
      books &&
      books.filter(book => book.shelf === title).map(book => ({
        id: book.id,
        title: book.title,
        authors: book.authors,
        backgroundImage: book.imageLinks.thumbnail,
        shelf: book.shelf
      }))
    );
  };

  createShelves = books => {
    let shelves = [
      {
        title: "Want to Read",
        id: Constant.WANT_TO_READ,
        books: this.filterBooksToBeDisplayed(books, Constant.WANT_TO_READ)
      },
      {
        title: "Reading",
        id: Constant.CURRENTLY_READING,
        books: this.filterBooksToBeDisplayed(books, Constant.CURRENTLY_READING)
      },
      {
        title: "Read",
        id: Constant.READ,
        books: this.filterBooksToBeDisplayed(books, Constant.READ)
      }
    ];
    return shelves;
  };

  updateBook = () => {
    let books = this.state.shelves.map(shelf => shelf.books);
    books = [].concat(...books);

    const { id, currentShelf, newShelf } = this.state.bookToBeUpdated;
    //find the book object to be updated and update it with the newshelf
    const book = books.find(book => book.id === this.state.bookToBeUpdated.id);
    book.shelf = newShelf;

    BooksAPI.update({ id }, newShelf)
      .then(books => {
        if (!books[currentShelf].includes(id) && books[newShelf].includes(id)) {
          console.log("calling changeShelf");
          this.changeShelf(book, currentShelf, newShelf);
        } else {
          console.log("Failed to update the book");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  setBookTobeUpdated = book => {
    this.setState(() => ({ bookToBeUpdated: book }));
  };

  changeShelf = (bookTobeUpdated, currentShelfId, newShelfId) => {
    this.setState(currentState => {
      const currentShelf = currentState.shelves.filter(shelf => shelf.id === currentShelfId)[0];
      currentShelf.books = currentShelf.books.filter(book => book.id !== bookTobeUpdated.id);
      const newShelf = currentState.shelves.filter(shelf => shelf.id === newShelfId)[0];
      newShelf.books.push(bookTobeUpdated);

      const otherShelves = currentState.shelves.filter(
        shelf => shelf.id !== currentShelfId && shelf.id !== newShelfId
      );
      let newShelves = otherShelves.concat(currentShelf, newShelf);
      newShelves = newShelves.sort(
        (shelf1, shelf2) =>
          Constant.ORDER_OF_DISPLAYING.indexOf(shelf1.id) -
          Constant.ORDER_OF_DISPLAYING.indexOf(shelf2.id)
      );
      return { shelves: newShelves, bookToBeUpdated: undefined };
    });
  };

  componentDidMount() {
    try {
      const shelves = JSON.parse(localStorage.getItem("shelves"));
      if (shelves) {
        this.setState(() => ({ shelves }));
      } else {
        BooksAPI.getAll()
          .then(books => {
            this.setState(() => ({ shelves: this.createShelves(books) }));
          })
          .catch(error => console.log("Failed to get books ", error));
      }
    } catch (e) {
      console.log(e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.bookToBeUpdated) {
      console.log("calling updateBook from componentDidUpdate");
      this.updateBook();
    }
    if (localStorage.getItem("shelves") !== JSON.stringify(this.state.shelves)) {
      const json = JSON.stringify(this.state.shelves);
      localStorage.setItem("shelves", json);
    }
  }
  */

  render() {
    return (
      //TODO there is a missing div element
      <div className="list-books-content">
        <div>
          {this.props.shelves.map(shelf => (
            <BookShelf
              key={shelf.id}
              shelf={shelf}
              handleBookToBeUpdated={this.props.handleBookToBeUpdated}
            />
          ))}
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}

export default BookCase;
