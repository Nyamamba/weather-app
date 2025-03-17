import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiList, FiLogOut } from "react-icons/fi";
import { useSubscription } from "./SubscriptionContext";
import "./user.css";

const User = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { email, subscribedCities, setEmail } = useSubscription();

  const handleLogout = () => {
    setEmail("");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("subscribedCities");
    setOpen(false);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {email && (
          <div>
            <motion.div
              animate={open ? "open" : "closed"}
              className="relative p-4 rounded-full bg-blue-600 text-white"
            >
              <motion.button
                onClick={() => setOpen((pv) => !pv)}
                className={`user-name  hover:bg-white hover:text-black transition-all duration-1000 ease-in-out cursor-pointer ${
                  open ? "bg-white text-black" : "text-white bg-black"
                }`}
              >
                {email ? email[0].toUpperCase() : ""}
              </motion.button>

              {open && (
                <motion.ul
                  initial={wrapperVariants.closed}
                  animate={wrapperVariants.open}
                  exit={wrapperVariants.closed}
                  style={{ originY: "top", translateX: "-50%" }}
                  className="dropdown-menu flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[130%] -left-[200%] w-48 overflow-hidden"
                >
                  <Option
                    Icon={FiList}
                    text="Subscribed Cities"
                    onClick={() => setModalOpen(true)}
                  />
                  <Option
                    Icon={FiLogOut}
                    text="Logout"
                    onClick={handleLogout}
                  />
                </motion.ul>
              )}
            </motion.div>

            {/* open the modal */}

            {modalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center modal-overlay"
                onClick={() => setModalOpen(false)}
              >
                <div className="modal bg-white p-6 rounded-lg w-80 relative"
                onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="modal-heading text-lg font-semibold mb-4 text-indigo-800">
                    Subscribed Cities
                  </h2>
                  <ul className="mb-4">
                    {subscribedCities.length > 0 ? (
                      subscribedCities.map((city, index) => (
                        <li
                          key={index}
                          className="modal-list text-gray-700 p-2 border-b"
                        >
                          {city}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No Subscriptions</li>
                    )}
                  </ul>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="modal-button text-sm text-black  rounded-[50%] absolute top-2 right-2 border-solid border-2 border-white hover:border-black duration-200 ease-in-out cursor-pointer"
                  >
                    X
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Option = ({ text, Icon, onClick, disabled = false }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={!disabled ? onClick : undefined}
      className={`option-div flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-black text-slate-700 hover:text-white transition-colors cursor-pointer`}
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default User;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
  closed: {
    scaleY: 0,
    transition: { when: "afterChildren", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -15 },
};
const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
