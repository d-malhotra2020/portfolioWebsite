import { useState, useEffect, useCallback } from 'react'

export const useVisitorTracking = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    onlineNow: 0
  })
  const [showVisitorCounter, setShowVisitorCounter] = useState(false)

  const updateStats = useCallback(() => {
    const now = new Date()
    const today = now.toDateString()
    
    let savedStats = JSON.parse(localStorage.getItem('portfolioStats') || '{}')
    
    if (!savedStats.totalVisitors) savedStats.totalVisitors = 0
    if (!savedStats.dailyVisits) savedStats.dailyVisits = {}
    if (!savedStats.lastVisit) savedStats.lastVisit = null
    if (!savedStats.sessionStart) savedStats.sessionStart = now.toISOString()
    
    const lastVisit = savedStats.lastVisit ? new Date(savedStats.lastVisit) : null
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
    
    const isNewSession = !lastVisit || lastVisit < thirtyMinutesAgo
    
    if (isNewSession) {
      savedStats.totalVisitors++
      savedStats.dailyVisits[today] = (savedStats.dailyVisits[today] || 0) + 1
    }
    
    savedStats.lastVisit = now.toISOString()
    
    // Clean old daily data (keep only last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    Object.keys(savedStats.dailyVisits).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete savedStats.dailyVisits[date]
      }
    })
    
    localStorage.setItem('portfolioStats', JSON.stringify(savedStats))
    
    const sessionDuration = Math.floor((now - new Date(savedStats.sessionStart)) / 1000 / 60)
    
    setStats({
      totalVisitors: savedStats.totalVisitors,
      todayVisitors: savedStats.dailyVisits[today] || 0,
      onlineNow: sessionDuration < 30 ? 1 : 0
    })
  }, [])

  useEffect(() => {
    updateStats()

    // Check for developer access
    const checkDevMode = () => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('dev') === 'true' || urlParams.get('stats') === 'true') {
        setShowVisitorCounter(true)
      }
    }

    // Secret key combination: Ctrl+Shift+V
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        setShowVisitorCounter(prev => !prev)
      }
    }

    checkDevMode()
    document.addEventListener('keydown', handleKeyDown)

    // Update stats every 30 seconds when visible
    let interval = null
    if (showVisitorCounter) {
      interval = setInterval(updateStats, 30000)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (interval) clearInterval(interval)
    }
  }, [showVisitorCounter, updateStats])

  return {
    stats,
    showVisitorCounter,
    setShowVisitorCounter
  }
}