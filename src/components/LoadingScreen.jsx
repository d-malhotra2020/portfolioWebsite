import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <motion.div 
      className="page-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loader-content">
        <motion.div 
          className="loader-spinner"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="loader-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Loading Portfolio
        </motion.div>
        <motion.div 
          className="loader-subtext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Dhruv Malhotra
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen