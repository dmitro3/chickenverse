import { motion } from "framer-motion";

const PageTransition = ({ children }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
        }}
        initial="hidden"
        animate="show"
        exit="hidden"
    >
        {children}
    </motion.div>
);

export default PageTransition;
