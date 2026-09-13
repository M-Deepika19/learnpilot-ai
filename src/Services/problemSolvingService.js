const API_BASE_URL = 'http://localhost:5000/practice';

export const generatePracticeQuestions = async (
  category,
  topic
) => {
  const response = await fetch(
    `${API_BASE_URL}/generate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category,
        topic
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      'Failed to generate practice questions.'
    );
  }

  return data;
};