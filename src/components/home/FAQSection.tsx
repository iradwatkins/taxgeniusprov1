'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How quickly can I get my refund?",
    answer: "With direct deposit, you can receive your federal refund in as little as 24 hours after IRS acceptance. Paper checks typically take 2-3 weeks."
  },
  {
    question: "What documents do I need to file?",
    answer: "You'll need your W-2s, 1099s, receipts for deductions, last year's tax return, and any other income or deduction documents. Our platform will guide you through everything you need."
  },
  {
    question: "Is my information secure?",
    answer: "Yes! We use bank-level 256-bit encryption and are IRS-authorized. Your data is protected with the same security standards used by major financial institutions."
  },
  {
    question: "What if I need help during filing?",
    answer: "Our CPAs are available via chat, phone, or video call. Premium plans include unlimited CPA support throughout the filing process."
  },
  {
    question: "Do you offer audit protection?",
    answer: "Yes! All our plans include free audit protection. If you're audited, we'll represent you and handle all IRS communications at no extra cost."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="bg-card rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
