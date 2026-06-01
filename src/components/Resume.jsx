import React from 'react'
import { navigateTo } from '../lib/router'
import { whoami } from '../data/whoami'

const Resume = () => {
  return (
    <main className="resume-page">
      <header className="resume-screen-bar">
        <button className="back-link" onClick={() => navigateTo('/')}>
          ← back to portfolio
        </button>
        <div className="resume-screen-actions">
          <button
            className="resume-print-btn"
            onClick={() => window.print()}
            aria-label="Print this résumé"
          >
            print
          </button>
          <a className="resume-print-btn" href="/Dhruv_malhotra_resume.pdf" download>
            download pdf
          </a>
        </div>
      </header>

      <article className="resume-sheet">
        <header className="resume-head">
          <h1>{whoami.name}</h1>
          <p className="resume-role">{whoami.role}</p>
          <p className="resume-contact">
            <a href={`mailto:${whoami.links.email}`}>{whoami.links.email}</a>
            <span aria-hidden="true"> · </span>
            <span>{whoami.location}</span>
            <span aria-hidden="true"> · </span>
            <a href={whoami.links.github} target="_blank" rel="noopener noreferrer">
              github.com/d-malhotra2020
            </a>
            <span aria-hidden="true"> · </span>
            <a href={whoami.links.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/drewmalhotra
            </a>
          </p>
        </header>

        <section className="resume-block">
          <h2>// FOCUS</h2>
          <p>{whoami.focus}</p>
        </section>

        <section className="resume-block">
          <h2>// EXPERIENCE</h2>
          {whoami.experience.map((job, i) => (
            <div className="resume-job" key={i}>
              <div className="resume-job-head">
                <span className="resume-job-role">{job.role}</span>
                <span className="resume-job-period">{job.period}</span>
              </div>
              <div className="resume-job-org">
                {job.org} <span className="resume-job-loc">· {job.location}</span>
              </div>
              <ul className="resume-job-bullets">
                {job.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-block">
          <h2>// SIDE PROJECTS</h2>
          <ul className="resume-projects">
            {whoami.projects.map((p, i) => (
              <li key={i}>
                <a href={p.url}>
                  <strong>{p.title}</strong>
                </a>
                {' — '}
                <span>{p.oneliner}</span>
                {p.live && (
                  <>
                    {' '}
                    <a className="resume-link" href={p.live} target="_blank" rel="noopener noreferrer">
                      [live]
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="resume-block">
          <h2>// STACK</h2>
          <p className="resume-stack">{whoami.stack.join(' · ')}</p>
        </section>

        <footer className="resume-foot">
          <span>// drewmalhotra.com/resume</span>
          <span>// {new Date().toISOString().slice(0, 10)}</span>
        </footer>
      </article>
    </main>
  )
}

export default Resume
