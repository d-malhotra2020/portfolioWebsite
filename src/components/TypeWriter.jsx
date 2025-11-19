import React, { useState, useEffect } from 'react'

const TypeWriter = ({ phrases, typeSpeed = 50, deleteSpeed = 30, delayBetween = 2000 }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    
    const timeout = setTimeout(() => {
      if (isWaiting) {
        setIsWaiting(false)
        setIsDeleting(true)
        return
      }

      if (!isDeleting) {
        // Typing forward
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1))
        } else {
          // Finished typing, wait before deleting
          setIsWaiting(true)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1))
        } else {
          // Finished deleting, move to next phrase
          setIsDeleting(false)
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, isWaiting ? delayBetween : isDeleting ? deleteSpeed : typeSpeed + Math.random() * 50)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isWaiting, currentPhraseIndex, phrases, typeSpeed, deleteSpeed, delayBetween])

  return <span id="typed-text">{currentText}</span>
}

export default TypeWriter