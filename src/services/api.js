/**
 * API service layer to connect to the n8n webhooks.
 */

/**
 * Extracts and formats the text response from n8n's payload dynamically.
 * Handles nested JSON structures (e.g., {"output": "text"} or [{"output": "text"}])
 * and falls back to raw text if needed.
 * 
 * @param {any} data - The raw response payload from n8n.
 * @returns {string} The extracted text message.
 */
function extractResponseText(data) {
  if (data === null || data === undefined) {
    return "";
  }
  if (typeof data === 'string') {
    return data;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    const first = data[0];
    if (first && typeof first === 'object') {
      return first.output || first.text || first.message || JSON.stringify(first);
    }
    return String(first);
  }
  if (typeof data === 'object') {
    return data.output || data.text || data.message || JSON.stringify(data);
  }
  return String(data);
}

/**
 * Helper to rewrite yug3108.app.n8n.cloud URLs to local proxy paths to avoid browser CORS policy blocks.
 */
function getProxiedUrl(originalUrl) {
  if (originalUrl && originalUrl.startsWith("https://yug3108.app.n8n.cloud")) {
    return originalUrl.replace("https://yug3108.app.n8n.cloud", "/n8n-webhook");
  }
  return originalUrl;
}

/**
 * Sends student data to the specified n8n form ingestion webhook.
 * 
 * @param {string} webhookUrl - The n8n form submission webhook endpoint URL.
 * @param {Object} studentData - The collected fields from the welcome onboarding form.
 * @returns {Promise<any>} The response payload.
 */
export async function submitStudentProfile(webhookUrl, studentData) {
  if (!webhookUrl || webhookUrl.trim() === "" || webhookUrl.includes("YOUR_N8N_FORM_WEBHOOK_URL")) {
    throw new Error("Form Ingestion Webhook URL is not configured. Please open Settings in the sidebar to configure it.");
  }

  const payload = {
    name: studentData.name || "",
    age: studentData.age || "",
    education: studentData.education || "",
    course: studentData.course || "",
    skills: studentData.skills || "",
    interests: studentData.interests || "",
    favoriteSubjects: studentData.favoriteSubjects || "",
    careerGoals: studentData.careerGoals || "",
    workStyle: studentData.workStyle || "",
    location: studentData.location || "",
    additionalInfo: studentData.additionalInfo || ""
  };

  try {
    const response = await fetch(getProxiedUrl(webhookUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned an error status: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("API Error in submitStudentProfile:", error);
    throw new Error(error.message || "Failed to establish a network connection to the form webhook. Please check your URL.");
  }
}

/**
 * Sends a chat message to the n8n Chat Agent webhook.
 * 
 * @param {string} webhookUrl - The n8n chat trigger webhook endpoint URL.
 * @param {string} message - The message typed by the user.
 * @param {string} sessionId - A unique session ID for tracking chat memory in n8n.
 * @returns {Promise<string>} The assistant's text response.
 */
export async function sendChatMessage(webhookUrl, message, sessionId) {
  if (!webhookUrl || webhookUrl.trim() === "" || webhookUrl.includes("YOUR_N8N_CHAT_WEBHOOK_URL")) {
    throw new Error("Chat Agent Webhook URL is not configured. Please open Settings in the sidebar to configure it.");
  }

  const payload = {
    action: "sendMessage",
    chatInput: message,
    sessionId: sessionId
  };

  try {
    const response = await fetch(getProxiedUrl(webhookUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned an error status: ${response.status} ${response.statusText}`);
    }

    let rawData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      rawData = await response.json();
    } else {
      const text = await response.text();
      try {
        rawData = JSON.parse(text);
      } catch (e) {
        rawData = text;
      }
    }

    return extractResponseText(rawData);
  } catch (error) {
    console.error("API Error in sendChatMessage:", error);
    throw new Error(error.message || "Failed to connect to the Chat Agent webhook. Please check your URL.");
  }
}

