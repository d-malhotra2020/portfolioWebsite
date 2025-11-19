import React from 'react'
import { motion } from 'framer-motion'
import { X, Users, RotateCcw, Eye } from 'lucide-react'

const VisitorCounter = ({ stats, onClose }) => {
  return (
    <motion.div 
      className="visitor-counter"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="visitor-stats">
        <div className="stat-item">
          <span className="stat-label">
            <Users size={16} /> Total Visitors
          </span>
          <motion.span 
            className="stat-value"
            key={stats.totalVisitors}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {stats.totalVisitors.toLocaleString()}
          </motion.span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">
            <RotateCcw size={16} /> Today
          </span>
          <motion.span 
            className="stat-value"
            key={stats.todayVisitors}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {stats.todayVisitors.toLocaleString()}
          </motion.span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">
            <Eye size={16} /> Online Now
          </span>
          <motion.span 
            className="stat-value"
            key={stats.onlineNow}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {stats.onlineNow}
          </motion.span>
        </div>
      </div>
      
      <motion.button 
        className="close-stats"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={14} />
      </motion.button>
    </motion.div>
  )
}

export default VisitorCounter