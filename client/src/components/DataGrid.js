import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import * as queryString from "query-string";

import { Badge, Table } from "react-bootstrap";

import Pagination from "./Pagination";

import { getBooks } from "../actions/bookActions";
import NoResults from "./NoResults";

const DataGrid = ({
  setTotalCount,
  setAvailableCount,
  setNotAvailableCount,
}) => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const [books, setBooks] = useState([]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(params.page ? params.page : 1);

  useEffect(() => {
    (async () => {
      const { books, count, pages } = await getBooks({
        limit: 15,
        page: currentPage,
        genre: params.genre,
        orderBy: params.orderBy,
      });
      setBooks(books);
      setTotalCount(count);
      setAvailableCount(
        books.filter((book) => book.availableQuantity > 0).length
      );
      setNotAvailableCount(
        books.filter((book) => book.availableQuantity === 0).length
      );
      setPages(pages);
    })();
  }, []);

  return (
    <div>
      {books.length !== 0 ? (
        <div className="panel p-3">
          <Table responsive="md" size="sm" striped borderless>
            <thead className="text-nowrap">
              <tr>
                <th>ISBN</th>
                <th>TITLE</th>
                <th>AUTHOR</th>
                <th>PUBLICATION DATE</th>
                <th>STATUS</th>
                <th className="text-right">PRICE</th>
              </tr>
            </thead>
            <tbody className="text-nowrap">
              {books.map((book) => (
                <tr key={book.isbn}>
                  <td>
                    <Link to={`/admin/dashboard/book/${book.isbn}`}>
                      {book.isbn}
                    </Link>
                  </td>
                  <td>{book.title}</td>
                  <td>
                    {book.author.firstName} {book.author.lastName}
                  </td>
                  <td>{book.publicationDate}</td>
                  <td>
                    {book.availableQuantity === 0 ? (
                      <Badge variant="danger">
                        not available{" "}
                        <Badge variant="light">{book.availableQuantity}</Badge>
                      </Badge>
                    ) : (
                      <Badge variant="success">
                        available{" "}
                        <Badge variant="light">{book.availableQuantity}</Badge>
                      </Badge>
                    )}
                  </td>
                  <td className="text-right">{book.price}$</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination currentPage={currentPage} pages={pages} />
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default DataGrid;