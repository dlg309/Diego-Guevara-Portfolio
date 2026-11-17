import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { siteHref } from './ProjectMedia.jsx';
import projects from './content/projects.json';
import './style.css';

const page = document.documentElement.dataset.page || 'home';
const legacySections = {
  work: 'work/',
  'case-studies': 'case-studies/',
  about: 'background/',
  approach: 'background/#approach',
  experience: 'experience/',
  contact: 'contact/',
};

let destination;
if (page === 'home' && window.location.hash) {
  let id = '';
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { /* Ignore malformed old fragments. */ }
  destination = legacySections[id] || (projects.some(project => project.id === id) && `case-studies/#${id}`);
}

if (destination) window.location.replace(siteHref(destination));
else createRoot(document.getElementById('root')).render(<App page={page} />);
