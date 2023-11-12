import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message }) => {
    return <React.Fragment>{message.message}</React.Fragment>;
}

Message.propTypes = {
    sender: PropTypes.string,
    message: PropTypes.string,
    sentAt: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
};

export default Message;
