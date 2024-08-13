import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateFlashcard.css'; // Import the CSS file

function UpdateFlashcard() {
  const { id } = useParams(); // Get the flashcard ID from the URL
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/flashcards/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuestion(response.data.question);
        setAnswer(response.data.answer);
      } catch (error) {
        console.error('Failed to fetch flashcard', error);
      }
    };

    fetchFlashcard();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`http://localhost:5000/flashcards/update/${id}`, {
        question,
        answer,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to update flashcard', error);
    }
  };

  return (
    <div className="update-flashcard-container">
      <h2>Update Flashcard</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <button type="submit">Update Flashcard</button>
      </form>
      <button onClick={() => navigate('/flashcards')} className="go-to-flashcards-button">Back to Flashcards</button>
    </div>
  );
}

export default UpdateFlashcard;
