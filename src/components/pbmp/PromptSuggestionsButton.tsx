import { motion } from 'framer-motion'

interface PromptSuggestionsButtonProps {
  text: string;
  onClick: () => void;
}

export default function PromptSuggestionsButton({ text, onClick }: PromptSuggestionsButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 text-left"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <span>{text}</span>
    </motion.button>
  );
}
