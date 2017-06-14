import React from 'react';
import EventForm from './EventForm';

class NewEventPage extends React.Component {
  render() {
    return (
      <div className="container">
        <EventForm />
      </div>
    );
  }
}

export default NewEventPage;