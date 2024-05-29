const BASE_URL = process.env.NEXT_PUBLIC_API_HOST_URL;

export const createNote = async (newNoteRequest, boardId) => {
  try {
    const res = await fetch(`${BASE_URL}/boards/${boardId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNoteRequest),
    });
    const responseObj = await res.json();
    return responseObj;
  } catch (e) {
    console.log("error", e.message);
    return null;
  }
};

export const updateNote = async (updatedNoteRequest, boardId, noteId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/notes/${noteId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNoteRequest),
      }
    );
    const responseObj = await response.json();
    return responseObj;
  } catch (e) {
    console.log("error", e.message);
    return null;
  }
};

export const deleteNote = async (boardId, noteId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/notes/${noteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseObj = await response.json();
    return responseObj;
  } catch (e) {
    console.log('error', e.message);
    return null
  }
}


export const addVoteToNote = async (boardId, noteId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/notes/${noteId}/vote`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseObj = await response.json();
    return responseObj
  } catch (e) {
    console.log('error', e.message);
    return null
  }
}

export const sendBoardSummaryEmail = async (emailRequest) => {
  try {
    const response = await fetch(
      `${BASE_URL}/email-summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailRequest),
      }
    );
    const responseObj = await response.json();
    return responseObj
  } catch (e) {
    console.log('error', e.message);
    return null
  }
}