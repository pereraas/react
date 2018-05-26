import React, { Component } from "react";

import Header from "./Header";
import BookCase from "./BookCase";
import * as BooksAPI from "../services/BooksAPI";
import Constant from "../utils/Constant";

class MyReadsApp extends Component {
  state = {
    bookShelves: []
  };

  filterBooksToBeDisplayed = (books, title) => {
    return (
      books &&
      books.filter(book => book.shelf === title).map(book => ({
        id: book.id,
        title: book.title,
        authors: book.authors,
        backgroundImage: book.imageLinks.thumbnail
      }))
    );
  };

  getAllBooks = () => {
    return new Promise((resolve, reject) => {
      BooksAPI.getAll()
        .then(books => {
          let bookShelves = [
            {
              title: "Reading",
              shelf: Constant.CURRENTLY_READING,
              books: this.filterBooksToBeDisplayed(books, Constant.CURRENTLY_READING)
            },
            {
              title: "Want to Read",
              shelf: Constant.WANT_TO_READ,
              books: this.filterBooksToBeDisplayed(books, Constant.WANT_TO_READ)
            },
            {
              title: "Read",
              shelf: Constant.READ,
              books: this.filterBooksToBeDisplayed(books, Constant.READ)
            }
          ];
          if (bookShelves) {
            resolve(bookShelves);
          } else {
            reject(Error("Failed to retrieve books"));
          }
        })
        .catch(reject);
    });
  };

  updateBook = (bookTobeUpdated, shelfTo) => {
    BooksAPI.update(bookTobeUpdated, shelfTo).then(books => {
      if (
        !books[bookTobeUpdated.shelf].includes[bookTobeUpdated.id] &&
        books[shelfTo].includes(bookTobeUpdated.id)
      ) {
        let moveFromShelf = this.state.bookShelves.filter(
          shelf => shelf.shelf === bookTobeUpdated.shelf
        )[0];
        // remove the book from the moveFromShelf shelf
        moveFromShelf = moveFromShelf.books.filter(book => {
          return book.id !== bookTobeUpdated.id;
        });
        // add the book to the shelfTo
        let moveToShelf = this.state.bookShelves
          .filter(shelf => shelf.shelf === shelfTo)[0]
          .books.push(bookTobeUpdated);

        this.setState(currentState => {
          return currentState.bookShelves.filter(shelf => {
            switch (shelf.shelf) {
              case bookTobeUpdated.shelf:
                return moveFromShelf;
              case shelfTo:
                return moveToShelf;
              default:
                return shelf;
            }
          });
        });
      } else {
        console.log("API failed to update the shelf of the book");
      }
    });
  };

  componentDidMount() {
    try {
      const bookShelves = JSON.parse(localStorage.getItem("bookShelves"));
      if (bookShelves) {
        this.setState(() => ({
          bookShelves
        }));
      } else {
        this.getAllBooks().then(
          bookShelves => {
            this.setState(() => ({ bookShelves }));
          },
          error => console.log(error)
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bookShelves !== this.state.bookShelves) {
      const json = JSON.stringify(this.state.bookShelves);
      localStorage.setItem("bookShelves", json);
    }
  }

  render() {
    return (
      <div>
        <Header title="MyReads" />
        <BookCase bookShelves={this.state.bookShelves} />
      </div>
    );
  }
}

export default MyReadsApp;
