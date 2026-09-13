const API_BASE_URL = 'http://localhost:8080/api/quiz';

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();

  return {
    message: text
  };
};

export const generateQuiz = async (
  videoId,
  videoTitle
) => {
  const response = await fetch(
    `${API_BASE_URL}/generate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoId,
        videoTitle
      })
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      'Failed to generate quiz.'
    );
  }

  return data;
};

export const saveQuizResult = async ({
  userId,
  videoId,
  videoTitle,
  score,
  totalQuestions
}) => {
  const response = await fetch(
    `${API_BASE_URL}/result`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        videoId,
        videoTitle,
        score,
        totalQuestions
      })
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      'Failed to save quiz result.'
    );
  }

  return data;
};