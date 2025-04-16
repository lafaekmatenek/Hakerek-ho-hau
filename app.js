let currentUser = localStorage.getItem("username");

if (!currentUser) {
  currentUser = prompt("Masukkan nama kamu:");
  if (currentUser) {
    localStorage.setItem("username", currentUser);
  } else {
    alert("Nama tidak boleh kosong!");
    location.reload();
  }
}

document.getElementById("username").innerText = currentUser;

const db = firebase.database();
const form = document.getElementById("message-form");
const messagesDiv = document.getElementById("messages");

document.getElementById("upload-avatar").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById("profile-img").src = event.target.result;
      localStorage.setItem("avatar", event.target.result);
    };
    reader.readAsDataURL(file);
  }
});

const savedAvatar = localStorage.getItem("avatar");
if (savedAvatar) {
  document.getElementById("profile-img").src = savedAvatar;
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const message = document.getElementById("message").value;

  db.ref("messages").push({
    name: currentUser,
    message: message
  });

  form.reset();
});

db.ref("messages").on("child_added", function(snapshot) {
  const data = snapshot.val();
  const messageEl = document.createElement("div");

  const isCurrentUser = data.name === currentUser;
  messageEl.className = "message " + (isCurrentUser ? "you" : "other");
  messageEl.innerHTML = `<strong>${data.name}</strong><br>${data.message}`;

  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("avatar");
  location.reload();
}
