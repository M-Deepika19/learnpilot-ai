const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

async function apiRequest(
  endpoint,
  method = "GET",
  body = null
) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    options
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Request failed"
    );
  }

  return data;
}

export async function checkHealth() {
  return apiRequest("/health");
}

export async function askVideoQuestion({
  videoId,
  videoTitle,
  question,
}) {
  return apiRequest(
    "/rag/ask",
    "POST",
    {
      videoId,
      videoTitle,
      question,
    }
  );
}

export async function generateSmartNotes({
  videoId,
  videoTitle,
}) {
  return apiRequest(
    "/rag/generate-notes",
    "POST",
    {
      videoId,
      videoTitle,
    }
  );
}

export async function generateVideoQuiz({
  videoId,
  videoTitle,
}) {
  return apiRequest(
    "/rag/generate-quiz",
    "POST",
    {
      videoId,
      videoTitle,
    }
  );
}

export async function generatePracticeQuestions({
  category,
  topic,
}) {
  return apiRequest(
    "/practice/generate",
    "POST",
    {
      category,
      topic,
    }
  );
}

export async function runCode({
  language,
  code,
  input,
}) {
  return apiRequest(
    "/compiler/run",
    "POST",
    {
      language,
      code,
      input,
    }
  );
}

export {
  API_BASE_URL,
};