import React from "react";
import { motion } from "framer-motion";
import "../style/Components/Header.css";

const Header = () => {
  const gohome = () => {
    window.history.back();
  };

  return (
    <div>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.5 }}
      >
        <header id="headerFlex123">
          <button onClick={gohome} className="button123">
            <i className="fa-solid fa-backward"></i> Go Back
          </button>
          <img onClick={gohome} src="/Triangle-IP-Logo.png" alt="Logo" />
          <button className="button123" onClick={gohome}>
            <i className="fa-solid fa-house"></i> Home
          </button>
        </header>
      </motion.div>
    </div>
  );
};

export default Header;
