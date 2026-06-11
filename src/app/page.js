'use client'
import { useState, useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Hero from './home/hero/Hero'
import PopularRestaurants from './home/popularRestaurants/PopularRestaurants'
import TopAndNearby from './home/topAndNearby/TopAndNearby'
import RecommendedRestaurants from './home/recommended/RecommendedRestaurants'


export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/restaurants/')
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => b.rating - a.rating).slice(0, 6)
        setRestaurants(sorted)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Загрузка ресторанов...</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Hero restaurants={restaurants} />
      <RecommendedRestaurants />
      <TopAndNearby />
      <PopularRestaurants restaurants={restaurants} />
      <Footer />
    </>
  )
};