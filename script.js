import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbe_UM7owK0FWjFMz3Twbc9n7FZEQ46VU",
  authDomain: "alyamukhbitabertanya.firebaseapp.com",
  databaseURL: "https://alyamukhbitabertanya-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alyamukhbitabertanya",
  storageBucket: "alyamukhbitabertanya.firebasestorage.app",
  messagingSenderId: "414677179387",
  appId: "1:414677179387:web:8c1957856a46a5849d895e",
  measurementId: "G-T8F39XLWJ0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const forumInput =
  document.getElementById("forum-input");

const postBtn =
  document.getElementById("post-btn");

const threadContainer =
  document.getElementById("thread-container");

postBtn.addEventListener("click", () => {

  const text = forumInput.value.trim();

  if (text === "") {
    alert("Isi dulu pertanyaannya!");
    return;
  }

  push(ref(db, "threads"), {
    question: text
  });

  forumInput.value = "";
});

onValue(ref(db, "threads"), (snapshot) => {

  threadContainer.innerHTML = "";

  const data = snapshot.val();

  if (!data) return;

  Object.keys(data).forEach((threadId) => {

    const thread = data[threadId];

    const postCard =
      document.createElement("div");

    postCard.className = "post-card";

    let htmlContent = `
      <p class="post-text">
        ${thread.question}
      </p>

      <div
        class="reply-section"
        id="replies-${threadId}">
    `;

    if (thread.replies) {

      Object.keys(thread.replies).forEach((replyId) => {

        htmlContent += `
          <div class="reply-item">
            ${thread.replies[replyId].text}
          </div>
        `;
      });
    }

    htmlContent += `
      </div>

      <div class="reply-form">

        <textarea
          id="input-${threadId}"
          placeholder="Balas pertanyaan ini..."
          rows="1"></textarea>

        <button
          class="reply-btn"
          data-id="${threadId}">
          Balas
        </button>

      </div>
    `;

    postCard.innerHTML = htmlContent;

    threadContainer.insertBefore(
      postCard,
      threadContainer.firstChild
    );
  });

  document
    .querySelectorAll(".reply-btn")
    .forEach((btn) => {

      btn.addEventListener("click", (e) => {

        const threadId =
          e.target.getAttribute("data-id");

        const replyInput =
          document.getElementById(
            `input-${threadId}`
          );

        const replyText =
          replyInput.value.trim();

        if (replyText === "") {
          alert("Isi dulu balasannya!");
          return;
        }

        push(
          ref(db, `threads/${threadId}/replies`),
          {
            text: replyText
          }
        );

        replyInput.value = "";
      });
    });
});
