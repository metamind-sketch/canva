import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS_LIST: FaqItem[] = [
  {
    question: 'How do I access and use these templates in Canva?',
    answer: 'Once you download or purchase a template, you will receive an instant digital file containing active direct access links. Clicking the link automatically copies the template into your personal Canva account! From there, you can drag and drop images, edit texts, swap colors, and customize elements at your own pace.'
  },
  {
    question: 'Do I need a paid Canva Pro account to use these templates?',
    answer: 'Absolutely not! All of our templates are designed with 100% free assets, free shapes, and free Google fonts that are included in the default, free tier of Canva. You do not need to pay for a Canva Pro subscription to edit, download, or share your designs.'
  },
  {
    question: 'Can I use these designs for commercial client work?',
    answer: 'Yes! Our templates include a lifetime commercial license. You can use these templates to create content for your business, your social media, or directly for paying clients. The only restriction is that you cannot resell our raw editable templates or links as your own Canva templates.'
  },
  {
    question: 'What happens if I make a mistake or need help with a template?',
    answer: 'Every purchase comes with a step-by-step PDF instruction manual and a 5-minute video walkthrough showing how to edit layers, align typography, and export high-resolution assets. You can also contact our digital helpdesk 24/7 at support@canvatemplates.com.'
  },
  {
    question: 'Do you offer a discount if I buy all the templates together?',
    answer: 'Yes! Our custom Bundle Builder (located above) offers scaling discounts: 15% off for 2 templates, 30% off for 3 templates, 40% off for 4+ templates, and an incredible 55% flat discount if you buy the entire catalog of premium templates in one click!'
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto" id="canva-faq-accordions">
      {FAQS_LIST.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] transition-all duration-300"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full py-5 px-6 flex items-center justify-between gap-4 text-left select-none cursor-pointer hover:bg-[#FAF9F6] transition-colors"
              id={`faq-btn-${index}`}
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#7D42FB] shrink-0 mt-0.5" />
                <span className="font-display font-extrabold text-base text-[#1A1A1A]">
                  {faq.question}
                </span>
              </div>
              <div className="shrink-0 p-1 border-2 border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
                {isOpen ? <Minus className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-2 text-sm text-neutral-600 leading-relaxed pl-14 border-t-2 border-[#1A1A1A] bg-[#FAF9F6]/30 font-serif italic">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
