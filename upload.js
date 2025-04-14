document.getElementById("upload-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fileInput = document.querySelector('input[name="video"]');
  const firstName = document.querySelector('input[name="first-name"]').value;
  const lastName = document.querySelector('input[name="last-name"]').value;
  const email = document.querySelector('input[name="email"]').value;

  const file = fileInput.files[0];
  if (!file) return alert("Please select a file.");

  // Step 1: Request a presigned POST URL from your backend
  const response = await fetch("https://goeg9mejf6.execute-api.us-east-2.amazonaws.com/generate-presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      firstName: firstName,
      lastName: lastName,
      email: email
    })
  });

  const data = await response.json();
  const formData = new FormData();

  // Step 2: Append all S3 POST fields from the response
  Object.entries(data.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Step 3: Append the actual file
  formData.append("file", file);

  // Step 4: Upload directly to S3
  const uploadStatus = document.getElementById("upload-status");
  uploadStatus.textContent = "PLEASE WAIT: Uploading... Do not navigate away. This could take several minutes depending on your Internet Service Provider.";

  const s3Upload = await fetch(data.url, {
    method: "POST",
    body: formData
  });

  if (s3Upload.ok) {
    uploadStatus.textContent = "Upload successful! You'll receive an email invoice once your video has been verified.";
  } else {
    uploadStatus.textContent = "Upload failed. Please try again.";
  }
});