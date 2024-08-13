import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddFlashcard.css'; // Import the CSS file

function AddFlashcard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories/list');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:5000/flashcards/create', {
        question,
        answer,
        difficulty,
        category,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Optionally clear form fields or redirect after successful submission
      navigate('/flashcards'); // Redirect to flashcards screen
    } catch (error) {
      setError('Failed to add flashcard');
      console.error('Failed to add flashcard', error);
    }
  };

  const handleGoToFlashcards = () => {
    navigate('/'); // Redirect to flashcards screen
  };

  return (
    <div className="add-flashcard-container">
      <h2>Add Flashcard</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Flashcard</button>
      </form>
      <button className="go-to-flashcards-button" onClick={handleGoToFlashcards}>Go to Flashcards</button>
    </div>
  );
}

export default AddFlashcard;
