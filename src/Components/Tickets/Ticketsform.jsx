import React from 'react'
import { Typography, TextField, Button } from '@mui/material';

function Ticketsform() {

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement form submission
        // onSubmit({ title, description });
      };
  return (
    <>Ticketsform
        <Typography variant="h4" gutterBottom>
        Create New Ticket
      </Typography>
      <form  onSubmit={handleSubmit}>
        <TextField label="Title" variant="outlined" />
        <TextField label="Description" variant="outlined" multiline rows={4} />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    
    </>
  )
}

export default Ticketsform