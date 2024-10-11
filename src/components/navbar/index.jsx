import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { url: "/", title: "الرئيسية" },
    { url: "/patients", title: "المرضي" },
    { url: "/examinations", title: "الفحوصات" },
    // { url: "/portfolio", title: "Portfolio" },
  ];

  const topVariants = {
    closed: { rotate: 0 },
    opened: { rotate: 45, backgroundColor: "rgb(255,255,255)" },
  };

  const centerVariants = {
    closed: { opacity: 1 },
    opened: { opacity: 0, backgroundColor: "rgb(255,255,255)" },
  };

  const bottomVariants = {
    closed: { rotate: 0 },
    opened: { rotate: -45, backgroundColor: "rgb(255,255,255)" },
  };

  const listVariants = {
    closed: { opacity: 0, x: "100vw" },
    opened: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.3, // Staggering the animation for children
      },
    },
  };

  const listItemVariants = {
    closed: { opacity: 0, x: -10 },
    opened: { opacity: 1, x: 0 },
  };

  return (
    <div className="h-full flex items-center justify-between text-3xl px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
      {/* Links */}
      <div className="hidden md:flex gap-4 w-1/3 ">
        {links.map((link) => (
          <NavLink to={link.url} key={link.url}>
            {link.title}
          </NavLink>
        ))}
      </div>

      {/* responsive menu */}
      <div className="md:hidden ">
        {/* Menu button */}
        <button
          className="w-10 h-8 flex flex-col justify-between z-50 relative top-5"
          onClick={() => setOpen(!open)}
        >
          <motion.div
            variants={topVariants}
            animate={open ? "opened" : "closed"}
            className="w-10 h-1 bg-black rounded origin-left"
          ></motion.div>
          <motion.div
            variants={centerVariants}
            animate={open ? "opened" : "closed"}
            className="w-10 h-1 bg-black rounded "
          ></motion.div>
          <motion.div
            variants={bottomVariants}
            animate={open ? "opened" : "closed"}
            className="w-10 h-1 bg-black rounded origin-left"
          ></motion.div>
        </button>
        {/* Menu list */}
        <motion.div
          variants={listVariants}
          initial="closed"
          animate={open ? "opened" : "closed"}
          className="absolute top-0 left-0 w-screen h-full bg-black text-white flex flex-col items-center justify-center gap-8 text-4xl z-40"
        >
          {links.map((link) => (
            <motion.div key={link.url} variants={listItemVariants}>
              <NavLink
                to={link.url}
                onClick={() => setOpen(false)} // Close the menu on link click
              >
                {link.title}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;
