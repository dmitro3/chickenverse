import css from "@/utils/css";

const Footer = ({ className }) => (
    <footer className={css("py-8 text-slate-400 text-sm", className)}>
        Made by Nathan Pham
    </footer>
);

export default Footer;
