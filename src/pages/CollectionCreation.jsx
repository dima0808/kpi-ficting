import React, { useEffect, useState } from 'react';
import {
  createCollection,
  getCollectionByName,
  getQuestionsByCollectionName,
  generateQuestions,
} from '../utils/http';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import Questions from '../components/creation/Questions';
import { FaPlus, FaFolderPlus, FaCheck, FaRobot } from 'react-icons/fa';

function CollectionCreation() {
  const location = useLocation();
  const [collection, setCollection] = useState({
    name: '',
    questions: [],
  });
  const [prompt, setPrompt] = useState(null); // Для налаштування запиту
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cloneName = params.get('cloneName');
    if (cloneName) {
      const token = Cookies.get('token');
      getCollectionByName(cloneName, token)
        .then((collectionData) => {
          getQuestionsByCollectionName(cloneName, token)
            .then((questionsData) => {
              setCollection({
                name: collectionData.name,
                questions: questionsData.questions.map((question) => ({
                  content: question.content,
                  points: question.points,
                  type: question.type,
                  answers:
                    question.type === 'matching'
                      ? question.answers
                          .filter((answer) => answer.isCorrect)
                          .map((answer) => ({
                            leftOption: answer.leftOption,
                            rightOption: answer.rightOption,
                          }))
                      : question.answers,
                })),
              });
            })
            .catch((error) => console.error('Error fetching questions:', error));
        })
        .catch((error) => console.error('Error fetching collection data:', error));
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollection({ ...collection, [name]: value });
  };

  const handleAddQuestionPrompt = () => {
    setPrompt({
      theme: '',
      type: 'single_choice',
      points: 1,
      questionsCount: 1,
    });
  };

  const handleGenerateQuestions = (prompt) => {
    const token = Cookies.get('token');
    generateQuestions(prompt, token)
      .then((data) => {
        setCollection({
          ...collection,
          questions: [
            ...collection.questions,
            ...data.questions.map((question) => ({
              content: question.content,
              points: question.points,
              type: question.type,
              answers:
                question.type === 'matching'
                  ? question.answers.map((answer) => ({
                      leftOption: answer.leftOption,
                      rightOption: answer.rightOption,
                    }))
                  : question.answers,
            })),
          ],
        });
        setPrompt(null);
      })
      .catch((error) => {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.message }));
      });
  };

  const handleAddQuestion = () => {
    setCollection({
      ...collection,
      questions: [
        ...collection.questions,
        {
          content: '',
          points: 0,
          type: 'multiple_choices',
          answers: [],
        },
      ],
    });
  };

  const validateField = (key, value) => {
    let error = '';
    if (key === 'collectionName' && !value) {
      error = 'Collection name cannot be empty.';
    }
    setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));
    return error === '';
  };

  const handleSubmit = async () => {
    const token = Cookies.get('token');
    createCollection(collection, token)
      .then(() => navigate('/collections'))
      .catch((error) => {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.message }));
      });
  };

  return (
    <>
      <div className="test-creation">
        <h2>Create a Collection</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={collection.name}
            onChange={handleInputChange}
            onBlur={(e) => validateField('collectionName', e.target.value)}
            className={errors.collectionName ? 'error-border' : ''}
          />
          {errors.collectionName && <div className="error-message">{errors.collectionName}</div>}
        </div>
      </div>
      <div className="test-creation__questions">
        <Questions
          instance={collection}
          errors={errors}
          setInstance={setCollection}
          setErrors={setErrors}
        />
      </div>
      {prompt && (
        <div className="test-creation__questions">
          <div className="question-form">
            <div className="collection__controll">
              <label>Theme:</label>
              <input
                type="text"
                name="theme"
                placeholder="Theme"
                value={prompt.theme}
                onChange={(e) => setPrompt({ ...prompt, theme: e.target.value })}
              />
            </div>
            <div className="answer__controller--score">
              <label>Points:</label>
              <input
                type="text"
                name="points"
                placeholder="Points"
                value={prompt.points}
                onChange={(e) => setPrompt({ ...prompt, points: e.target.value })}
              />
            </div>
            <div className="answer__controller--type">
              <label>Type:</label>
              <select
                name="type"
                value={prompt.type}
                onChange={(e) => setPrompt({ ...prompt, type: e.target.value })}>
                <option value="multiple_choices">Multiple Choices</option>
                <option value="single_choice">Single Choice</option>
                <option value="matching">Matching</option>
              </select>
            </div>
            <div className="collection__controll">
              <label>Questions count:</label>
              <input
                type="number"
                name="questionsCount"
                value={prompt.questionsCount}
                onChange={(e) => setPrompt({ ...prompt, questionsCount: e.target.value })}
              />
            </div>
            <button onClick={() => setPrompt(null)}>Cancel</button>
            <button onClick={() => handleGenerateQuestions(prompt)}>Generate</button>
          </div>
        </div>
      )}
      <div className="buttons-container">
        <button onClick={handleAddQuestion}>
          <FaPlus /> Add Question
        </button>
        <button onClick={handleAddQuestionPrompt}>
          <FaRobot /> Generation with AI
        </button>
        <button onClick={handleSubmit}>
          <FaCheck />
          Create Collection
        </button>
      </div>
      {errors.submit &&
        errors.submit.split(',').map((error, index) => (
          <div key={index} className="test-creation__questions error-message">
            {error}
          </div>
        ))}
    </>
  );
}

export default CollectionCreation;