// Get the URL params (token)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  // Call API to verify email
  verifyEmail(token);
} else {
  document.getElementById('message').innerText = 'Invalid verification link.';
}

async function verifyEmail(token) {
  try {
    const response = await fetch(`https://habyarimanacaleb.github.io/Gilber-portfolio/api/verify-email?token=${token}`);
    const data = await response.json();

    if (data.message === 'Email verified successfully') {
      document.getElementById('message').innerText = 'Your email has been successfully verified!';
    } else {
      document.getElementById('message').innerText = data.message || 'An error occurred!';
    }
  } catch (error) {
    document.getElementById('message').innerText = 'Error verifying your email.';
  }
}
