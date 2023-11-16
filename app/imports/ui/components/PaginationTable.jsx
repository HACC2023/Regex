import ReactPaginate from 'react-paginate';
import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Table } from 'react-bootstrap';
import StatItemAdmin from './StatItemAdmin';
import LoadingSpinner from './LoadingSpinner';
import { AskUs } from '../../api/askus/AskUs';

// eslint-disable-next-line react/prop-types
const PaginationTable = ({ itemsPerPage }) => {
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Retrieve total size of db using meteor functions.
  useEffect(() => {
    Meteor.call('getItemsCount', (error, result) => {
      if (error) {
        console.error('Error getting count:', error);
      } else {
        // console.log('Count:', result);
      }
      setTotalCount(result);
    });
  }, []);

  const { ready, pages } = useTracker(() => {
    console.log('USETRACKER RENDER');
    // Retrieve data for pagination table from mongodb.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const subscription = Meteor.subscribe(AskUs.adminPublicationName, itemOffset, itemsPerPage);
    const tableItems = AskUs.collection.find().fetch();
    setPageCount(Math.ceil(totalCount / itemsPerPage));
    return {
      pages: tableItems,
      ready: subscription.ready(),
    };
  }, [itemOffset]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage);
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <Container>
      {ready ? (
        <Table striped bordered hover className="items">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Question</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => <StatItemAdmin key={page._id} page={page} />)}
          </tbody>
        </Table>
      ) : (<LoadingSpinner />)}
      <ReactPaginate
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< Prev"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </Container>
  );
};

// Add a <div id="container"> to your HTML to see the componend rendered.
export default PaginationTable;
