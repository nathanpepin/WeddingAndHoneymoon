import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, MapPin } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title script-font">Our Wedding & Honeymoon</h1>
          <h2 className="hero-subtitle">A Journey of Love</h2>
          <p className="hero-date">July 18 - August 1, 2025</p>
          <div className="hero-buttons">
            <Link to="/timeline" className="btn">
              <Calendar size={20} />
              View Our Timeline
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">
                <Heart size={48} />
              </div>
              <h3>Wedding Memories</h3>
              <p>Relive the magic of our special day with beautiful photos and videos from our wedding celebration.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <MapPin size={48} />
              </div>
              <h3>Honeymoon Adventure</h3>
              <p>Follow our incredible journey through Japan, from Tokyo's bustling streets to Hakone's serene mountains.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <Camera size={48} />
              </div>
              <h3>Interactive Stories</h3>
              <p>Each photo tells a story. Add captions and descriptions to preserve the memories forever.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Days of Adventure</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Countries Explored</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Memories Made</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
