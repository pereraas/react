import React from "react";
import BookShelf from "./BookShelf";
import { Link } from "react-router-dom";

const BookCase = props => (
  <div className="list-books-content">
    <div>
      {props.shelves.map(shelf => (
        <BookShelf key={shelf.id} shelf={shelf} handleBookToBeUpdated={props.handleBookToBeUpdated} />
      ))}
    </div>
    <div className="open-search">
      <Link to="/search">Add a book</Link>
    </div>
  </div>
);
export default BookCase;
