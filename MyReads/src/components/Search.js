import React, { Component } from "react";
import Book from "./Book";
import { Link } from "react-router-dom";
import * as BookAPI from "../services/BooksAPI";
import Constant from "../utils/Constant";

//TODO refresh
class Search extends Component {
  state = {
    query: "",
    results: ""
  };

  updateQuery = q => {
    localStorage.setItem("query", q.trim());
    this.setState(() => ({ query: q.trim() }));
  };

  clearQuery = () => {
    this.updateQuery("");
  };
  clearResults = () => {
    this.setState(() => ({ results: "" }));
  };

  findIfInShelves = (booksInShelves, book) => {
    const bookInShelves = booksInShelves.find(obj => obj.id === book.id);
    return bookInShelves ? bookInShelves.currentShelf : Constant.NONE;
  };

  componentDidMount() {
    if (localStorage.getItem("query") && localStorage.getItem("results")) {
      this.setState(currentState => ({
        query: localStorage.getItem("query"),
        results: JSON.parse(localStorage.getItem("results"))
      }));
    }
  }

  componentWillUnmount() {
    localStorage.setItem("results", "");
    localStorage.setItem("query", "");
  }
  componentDidUpdate(prevProps, prevState) {
    try {
      console.log("prevProps", prevProps);
      console.log("prevState", prevState);
      console.log("this.state", this.state);

      if (prevState.query.trim() !== this.state.query.trim()) {
        BookAPI.search(this.state.query)
          .then(books => {
            let results;
            if (books) {
              results = books.map(book => ({
                id: book.id,
                title: book.title,
                authors: book.authors,
                backgroundImage: book.imageLinks.thumbnail,
                currentShelf: this.findIfInShelves(this.props.booksInShelves, book)
              }));

              localStorage.setItem("results", JSON.stringify(results));
              this.setState(() => ({ results }));
            }
          })
          .catch(error => {
            console.log("Search didn't return a successful response", error);
            this.clearResults();
          });
      }
    } catch (e) {
      console.log("Book search failed", e);
    }
  }
  render() {
    const { query, results } = this.state;
    const { handleBookToBeUpdated } = this.props;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={e => {
                this.updateQuery(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {results &&
              results.map(book => (
                <li key={book.id}>
                  <Book book={book} currentShelf={book.currentShelf} handleBookToBeUpdated={handleBookToBeUpdated} />
                </li>
              ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;
