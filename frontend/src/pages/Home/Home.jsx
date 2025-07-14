import React from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeWrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>
            World<span className={styles.brand}>Trip</span>:<br />
            Your <span className={styles.highlight}>Global Travel</span> Ticket!
          </h1>
          <p>
            Easily plan your trips and enjoy a seamless and fast experience with
            our intuitive platform.
          </p>
          <button
            onClick={() => navigate("/travels")}
            className={styles.exploreBtn}
          >
            Explore ➔
          </button>
        </div>
        <div className={styles.heroImages}>
          <img
            src="https://www.travelguide.net/media/new-york.jpeg"
            alt="Travel 1"
            className={styles.circle + " " + styles.img1}
          />
          <img
            src="https://assets.cityexperiences.com/wp-content/uploads/2023/01/denys-nevozhai-UzagqG756OU-unsplash.jpg"
            alt="Travel 2"
            className={styles.circle + " " + styles.img2}
          />
          <img
            src="https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=450,height=450,dpr=2/tour_img/981547dcba6d4572.jpeg"
            alt="Travel 3"
            className={styles.circle + " " + styles.img3}
          />
          <img
            src="https://media.cntraveller.com/photos/6343df288d5d266e2e66f082/4:3/w_5332,h_3999,c_limit/tokyoGettyImages-1031467664.jpeg"
            alt="Travel 4"
            className={styles.circle + " " + styles.img4}
          />
        </div>
      </section>

      {/* Hidden Gems Section */}
      <section className={styles.plans}>
        <h2>Discover Hidden Gems</h2>

        <div className={styles.plan}>
          <div className={styles.planText}>
            <h3>
              Perfect <span className={styles.green}>Beach Escape</span>
            </h3>
            <p>
              Travel to Spain’s captivating shores, where turquoise seas meet
              golden sands. Experience your dream seaside vacation here.
            </p>
            <button className={styles.planBtn}>
              <Link to={"/travel/6868213a12ff2072a3e33040"}>View Plan ➔</Link>
            </button>
          </div>
          <img
            src="https://assets3.thrillist.com/v1/image/2775263/1200x600/scale;;webp=auto;jpeg_quality=85.jpg"
            alt="Beach"
          />
        </div>

        <div className={styles.plan2}>
          <div className={styles.planText}>
            <h3>
              <span className={styles.green}>Alsace</span> Evenings
            </h3>
            <p>
              The city of Colmar promises history, romance, and magical moments.
              Your dream adventure starts here!
            </p>
            <button className={styles.planBtn}>
              <Link to={"/travel/6868218ee3c48d80067e99dd"}>View Plan ➔</Link>
            </button>
          </div>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Colmar_%2832350846618%29.jpg"
            alt="Alsace"
          />
        </div>

        <div className={styles.plan}>
          <div className={styles.planText}>
            <h3>
              Istanbul’s <span className={styles.green}>Coastal Gem</span>
            </h3>
            <p>
              Our planner will take you on an unforgettable adventure around
              Arnavutköy.
            </p>
            <button className={styles.planBtn}>
              <Link to={"/travel/686821e2e3c48d80067e99df"}>View Plan ➔</Link>
            </button>
          </div>
          <img
            src="https://blog.obilet.com/wp-content/uploads/2023/07/7bebek-min-1024x683.jpeg"
            alt="Istanbul"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
