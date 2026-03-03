import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExample, setShowExample] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a query or job description");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);

      if (data.recommendations.length === 0) {
        setError("No recommendations found. Please try a different query.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch recommendations");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "I am hiring for Java developers who can also collaborate effectively with my business teams.",
    "Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script.",
    "Need to screen for an analyst role - want both cognitive and personality assessments",
  ];

  const loadExample = (exampleQuery) => {
    setQuery(exampleQuery);
    setShowExample(false);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>SHL Assessment Recommendation System</h1>
        <p>Find the most relevant assessments for your job openings</p>
      </header>

      <main className="container">
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a job description or describe the role you're hiring for..."
              className="query-input"
              rows="5"
              disabled={loading}
            />
            <div className="button-group">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Processing..." : "Get Recommendations"}
              </button>
              <button
                type="button"
                onClick={() => setShowExample(!showExample)}
                className="example-btn"
              >
                {showExample ? "Hide Examples" : "Show Examples"}
              </button>
            </div>
          </form>

          {showExample && (
            <div className="examples">
              <h3>Example Queries:</h3>
              {exampleQueries.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(example)}
                  className="example-item"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {recommendations.length > 0 && (
          <div className="results-section">
            <h2>Recommended Assessments ({recommendations.length})</h2>
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Assessment Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Relevance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec, idx) => (
                    <tr key={idx} className={`rank-${idx + 1}`}>
                      <td className="rank">{idx + 1}</td>
                      <td className="name">{rec.assessment_name}</td>
                      <td className="type">{rec.test_type || "—"}</td>
                      <td className="category">{rec.category || "—"}</td>
                      <td className="score">
                        <div className="score-bar">
                          <div
                            className="score-fill"
                            style={{
                              width: `${rec.relevance_score || 75}%`,
                            }}
                          />
                        </div>
                        {rec.relevance_score && `${rec.relevance_score}%`}
                      </td>
                      <td className="action">
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-btn"
                        >
                          View →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing query and matching assessments...</p>
          </div>
        )}
      </main>
    </div>
  );
}
import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      setResults(data.recommendations || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <h1>SHL Assessment Recommender</h1>
      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter job description..."
        rows={5}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>
      {results.map((r, i) => (
        <div key={i} className="card">
          <a href={r.url} target="_blank">{r.assessment_name}</a>
          <span> — Score: {r.relevance_score}</span>
          <p>{r.reason}</p>
        </div>
      ))}
    </div>
  )
}

export default App
