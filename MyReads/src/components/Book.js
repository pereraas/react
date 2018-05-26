import React, { Component } from "react";
import BookShelfChanger from "./BookShelfChanger";

class Book extends Component {
  handleBookToBeUpdated = newShelf => {
    const book = {
      ...this.props.book,
      newShelf
    };
    this.props.handleBookToBeUpdated(book);
  };

  render() {
    const { book } = this.props;
    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage: `url(${book.backgroundImage})`
            }}
          />
          <BookShelfChanger currentShelf={book.currentShelf} handleBookToBeUpdated={this.handleBookToBeUpdated} />
        </div>
        <div className="book-title">{book.title}</div>
        {book.authors && <div className="book-authors">{book.authors.join(",\r\n")}</div>}
      </div>
    );
  }
}

export default Book;
