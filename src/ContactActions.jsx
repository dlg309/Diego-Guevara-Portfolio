import { useState } from 'react';
import { Arrow, TextLink, assetHref } from './ProjectMedia';

export default function ContactActions({ email, resume, resumeDetailed, linkedin, github }) {
  const [message, setMessage] = useState('');

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setMessage('Email address copied.');
    } catch {
      setMessage(`Could not copy automatically. Email me at ${email}.`);
    }
  }

  return (
    <div className="contact-actions">
      <div className="contact-actions__primary">
        <a className="button button--primary" href={`mailto:${email}`}>Email Diego<Arrow /></a>
        <button className="button button--secondary" type="button" onClick={copyEmail}>Copy email</button>
        <a className="button button--secondary" href={assetHref(resume)} download>Download résumé<Arrow /></a>
      </div>
      <p className="contact-actions__status" role="status" aria-live="polite">{message}</p>
      <a className="email-link" href={`mailto:${email}`}>{email}</a>
      <div className="contact-links"><TextLink href={linkedin}>LinkedIn</TextLink><TextLink href={github}>GitHub</TextLink><TextLink href={resumeDetailed}>Detailed résumé</TextLink></div>
    </div>
  );
}
