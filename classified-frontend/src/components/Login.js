// src/components/Login.js
import React, { useEffect, useRef } from 'react';

export default function Login({ setUser }) {
  const buttonRef = useRef(null);

  const handleCredentialResponse = (response) => {
    fetch('http://localhost/classified-app-backend/api/auth/google.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setUser(data.user);
        window.location.reload();
      } else {
        alert('Login failed');
      }
    })
    .catch(() => alert('Network error'));
  };

  useEffect(() => {
    // Remove old script if exists
    const oldScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: '1051773537048-50ku177q1vusu9iuu31k40pclk4nr5vh.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        { theme: "outline", size: "large", text: "signin_with", width: 240 }
      );
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return <div ref={buttonRef} className="inline-block"></div>;
}