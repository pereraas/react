import React from "react";
import Book from "./Book";

const BookShelf = props => {
  const { shelf, handleBookToBeUpdated } = props;
  const books = shelf.books.map(book => (
    <li key={book.id}>
      <Book book={book} handleBookToBeUpdated={handleBookToBeUpdated} />
    </li>
  ));

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{shelf.title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">{books}</ol>
      </div>
    </div>
  );
};

export default BookShelf;
