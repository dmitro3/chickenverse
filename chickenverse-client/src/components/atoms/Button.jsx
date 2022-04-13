import tw from "tailwind-styled-components";

const Button = tw.button`
    px-4 min-w-[8rem] h-12
    whitespace-nowrap
    text-center grid place-items-center
    border-none rounded-md outline-none 
    text-white
    bg-blue-600 hover:bg-blue-700
    select-none
    text-lg
    w-fit
`;

export default Button;
