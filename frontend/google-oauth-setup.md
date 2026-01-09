# Google OAuth Integration Setup Guide

## Overview
This guide explains how to integrate Google OAuth authentication into the Smart Irrigation Scheduler login system.

## Prerequisites
1. Google Cloud Project
2. Google API Console access
3. Domain for your application (for production)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Configure OAuth 2.0 Credentials

1. In the Google Cloud Console, navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Configure the consent screen:
   - Application type: Web application
   - Application name: Smart Irrigation Scheduler
   - User support email: your-email@example.com
   - Developer contact information: your-email@example.com
4. Add scopes:
   - `email` - View user's email address
   - `profile` - View basic profile information
5. Add authorized JavaScript origins:
   - Development: `http://localhost:8000`
   - Development: `http://127.0.0.1:8000`
   - Production: `https://yourdomain.com`
6. Add authorized redirect URIs:
   - Development: `http://localhost:8000/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`
7. Save and copy your **Client ID** and **Client Secret**

## Step 3: Frontend Integration

### Update login.html
Add Google OAuth script to the `<head>` section:

```html
<script src="https://apis.google.com/js/platform.js" async defer></script>
<meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
```

### Update login.js
Replace the mock Google OAuth handlers with actual implementation:

```javascript
// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';

// Initialize Google Sign-In
function initGoogleSignIn() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile'
        });
    });
}

// Handle Google Sign-In
function onGoogleSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const token = googleUser.getAuthResponse().id_token;
    
    // Send token to backend for verification
    verifyGoogleToken(token, {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        imageUrl: profile.getImageUrl()
    });
}

// Handle Google Sign-In for login
document.getElementById('google-signin-btn').addEventListener('click', () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(onGoogleSignIn);
});

// Handle Google Sign-In for registration
document.getElementById('google-signup-btn').addEventListener('click', () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
        // Handle registration with Google data
        onGoogleSignUp(googleUser);
    });
});
```

## Step 4: Backend Integration

### Create OAuth endpoints in your backend

```python
# Example for Flask backend
from flask import request, jsonify
import requests

@app.route('/auth/google', methods=['POST'])
def google_auth():
    token = request.json.get('token')
    
    # Verify token with Google
    response = requests.get(
        f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={token}'
    )
    
    if response.status_code == 200:
        user_data = response.json()
        # Create or find user in your database
        user = create_or_find_google_user(user_data)
        # Generate JWT token
        jwt_token = generate_jwt_token(user)
        return jsonify({
            'success': True,
            'token': jwt_token,
            'user': user
        })
    
    return jsonify({'success': False, 'message': 'Invalid token'}), 401
```

## Step 5: Environment Configuration

Create `.env` file:

```
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## Step 6: Security Considerations

1. **Token Validation**: Always validate Google tokens on the backend
2. **HTTPS**: Use HTTPS in production
3. **State Parameter**: Implement CSRF protection with state parameter
4. **Token Storage**: Store tokens securely (httpOnly cookies)
5. **Scope Limitation**: Request only necessary permissions

## Step 7: Testing

1. Test in development environment
2. Verify token flow end-to-end
3. Test error scenarios (invalid tokens, network issues)
4. Test user creation and login flow

## Step 8: Production Deployment

1. Update authorized origins and redirect URIs
2. Enable production domain
3. Configure proper SSL certificates
4. Set up monitoring for OAuth failures

## Troubleshooting

### Common Issues
- **Invalid Client ID**: Verify Client ID matches Google Cloud Console
- **Redirect URI Mismatch**: Ensure redirect URIs match exactly
- **CORS Issues**: Configure backend to allow Google origins
- **Token Verification**: Check token format and expiration

### Debug Tools
- Google OAuth 2.0 Playground
- Browser developer tools
- Google Cloud Console logs

## Alternative: Using Firebase Authentication

For easier implementation, consider using Firebase Authentication:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>

<script>
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    appId: "your-app-id"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // Google Sign-In
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      // Handle successful sign-in
    })
    .catch((error) => {
      // Handle error
    });
</script>
```

## Next Steps

1. Choose between Google OAuth or Firebase Authentication
2. Implement backend token verification
3. Add user profile management
4. Implement logout functionality
5. Add session management
6. Test thoroughly before production deployment
