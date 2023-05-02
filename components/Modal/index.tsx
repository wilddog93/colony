import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../Button/Button';
import { MdClose } from 'react-icons/md';

function Modal({ children, isOpen, onClose, size }: {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    size: string;
}) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [sizes, setSizes] = useState("max-w-2xl");

    const handleAnimationComplete = () => {
        setIsAnimating(false);
    };

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onClose();
        }, 200); // Set a delay to match the exit animation duration
    };

    useEffect(() => {
        if (size === "large") setSizes("max-w-5xl");
        else if (size === "medium") setSizes("max-w-2xl");
        else if (size === "small") setSizes("max-w-sm");
        else setSizes("max-w-2xl")
    }, [size])


    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 z-9998 overflow-y-auto'>
                    <motion.div
                        className="fixed z-9998 inset-0 bg-black/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onAnimationComplete={handleAnimationComplete}
                        onClick={handleClose}
                    >
                        <motion.div
                            className={`relative h-screen w-full flex justify-center`}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onAnimationComplete={handleAnimationComplete}
                        >
                            <div className={`w-full bg-white m-auto rounded-md ${sizes}`}>
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}


export default Modal;