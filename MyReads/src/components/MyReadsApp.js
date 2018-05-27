import React, { Component } from "react";
import Header from "./Header";
import BookCase from "./BookCase";
import Search from "./Search";
import NotFoundPage from "./NotFoundPage";
import * as BooksAPI from "../services/BooksAPI";
import Constant from "../utils/Constant";
import { Route, Switch } from "react-router-dom";
import "../MyReadsApp.css";

class MyReadsApp extends Component {
  state = {
    shelves: [],
    bookToBeUpdated: undefined
  };

  setBookTobeUpdated = book => {
    this.setState(() => ({ bookToBeUpdated: book }));
  };

  groupBy = (books, getKey, mapper) => {
    const map = new Map();
    books.forEach(book => {
      const key = getKey(book);
      const bookMapped = mapper ? mapper(book) : book;
      const valArray = map.get(key);
      valArray ? valArray.push(bookMapped) : map.set(key, [bookMapped]);
    });
    return map;
  };

  getDisplayDetails = book => ({
    id: book.id,
    title: book.title,
    authors: book.authors,
    backgroundImage: book.imageLinks ? (book.imageLinks.thumbnail ? book.imageLinks.thumbnail : "") : "",
    currentShelf: book.shelf ? book.shelf : "none"
  });

  createShelves = books => {
    const booksGroupedByShelf = this.groupBy(books, book => book.shelf, this.getDisplayDetails);
    const shelves = [
      {
        title: "Want to Read",
        id: Constant.WANT_TO_READ,
        books: booksGroupedByShelf.get(Constant.WANT_TO_READ)
      },
      {
        title: "Reading",
        id: Constant.CURRENTLY_READING,
        books: booksGroupedByShelf.get(Constant.CURRENTLY_READING)
      },
      {
        title: "Read",
        id: Constant.READ,
        books: booksGroupedByShelf.get(Constant.READ)
      }
    ];
    return shelves;
  };

  moveBook = currentState => {
    const shelves = currentState.shelves;
    const { id, title, authors, backgroundImage, currentShelf, newShelf } = currentState.bookToBeUpdated;
    const shelvesMapped = new Map();
    shelves.forEach(shelf => {
      shelvesMapped.set(shelf.id, shelf);
    });

    if (currentShelf !== Constant.NONE) {
      const booksWithoutTheBookTobeUpdated = shelvesMapped.get(currentShelf).books.filter(book => book.id !== id);
      shelvesMapped.get(currentShelf).books = booksWithoutTheBookTobeUpdated;
    }
    const book = {
      id,
      title,
      authors,
      backgroundImage,
      currentShelf: newShelf
    };
    shelvesMapped.get(newShelf).books.push(book);

    const newShelves = [];
    shelvesMapped.forEach((v, k) => {
      newShelves.push(v);
    });
    newShelves.sort(
      (shelf1, shelf2) =>
        Constant.ORDER_OF_DISPLAYING.indexOf(shelf1.id) - Constant.ORDER_OF_DISPLAYING.indexOf(shelf2.id)
    );
    return newShelves;
  };

  updateBook = () => {
    const { id, currentShelf, newShelf } = this.state.bookToBeUpdated;
    BooksAPI.update({ id }, newShelf)
      .then(books => {
        if ((!books[currentShelf] || !books[currentShelf].includes(id)) && books[newShelf].includes(id)) {
          this.setState(currentState => ({
            shelves: this.moveBook(currentState),
            bookToBeUpdated: undefined
          }));
        } else {
          console.log("Failed to update the book");
        }
      })
      .catch(error => {
        console.log(error);
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
            const grouped = this.groupBy(books, book => book.shelf);
            console.log(grouped);
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
      this.updateBook();
    }
    if (localStorage.getItem("shelves") !== JSON.stringify(this.state.shelves)) {
      const json = JSON.stringify(this.state.shelves);
      localStorage.setItem("shelves", json);
    }
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact={true}
            path="/"
            render={() => (
              <div className="list-books">
                <Header title="MyReads" />
                <BookCase shelves={this.state.shelves} handleBookToBeUpdated={this.setBookTobeUpdated} />
              </div>
            )}
          />

          <Route
            exact={true}
            path="/search"
            render={({ history }) => (
              <Search
                booksInShelves={[].concat(...this.state.shelves.map(shelf => shelf.books))}
                handleBookToBeUpdated={b => {
                  this.setBookTobeUpdated(b);
                  history.push("/");
                }}
              />
            )}
          />
          <Route
            render={() => (
              <div className="list-books">
                <Header title="MyReads" />
                <NotFoundPage />
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default MyReadsApp;
