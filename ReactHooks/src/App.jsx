// import { useState } from 'react'
import './App.css'
import { ThemeProvider } from '../../TradingApp/src/context/ThemeContext'
import UseStateHook from './ReactHooks/UseStateHook'
import UseEffectHook from './ReactHooks/UseEffectHook'
import UseContextHook from './ReactHooks/UseContextHook'
import CustomHook from './ReactHooks/CustomHook'

function App() {


  return (
    <ThemeProvider>
      <ThemeProvider />
      <UseStateHook />
      <UseEffectHook />
      <UseContextHook />
      <CustomHook />
    </ThemeProvider>
  )
}

export default App
