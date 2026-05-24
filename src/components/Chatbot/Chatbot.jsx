// src/components/Chatbot/Chatbot.jsx
import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { chatbotKnowledge } from '../../constants/portfolioData';

// Styled Components
const ChatWidget = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
  }
`;

const ChatBubbleButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-accent-primary);
  color: #070a13;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
  font-size: 1.4rem;
  
  &:hover {
    background: #fbbf24;
  }
`;

const ChatDrawer = styled(motion.div)`
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 380px;
  height: 500px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 1001;

  @media (max-width: 480px) {
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
`;

const DrawerHeader = styled.div`
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  
  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
  }
`;

const CloseButton = styled.button`
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  
  &:hover {
    color: var(--color-accent-primary);
  }
`;

const MessageList = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
`;

const MessageBubble = styled(motion.div)`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: var(--text-sm);
  line-height: 1.5;
  
  ${props => props.$isUser ? `
    align-self: flex-end;
    background: var(--color-accent-primary);
    color: #070a13;
    border-bottom-right-radius: 2px;
  ` : `
    align-self: flex-start;
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-bottom-left-radius: 2px;
  `}
`;

const SuggestionsContainer = styled.div`
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.01);
`;

const SuggestionTag = styled.button`
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: var(--text-xs);
  cursor: pointer;
  transition: var(--transition-base);
  min-height: auto;
  min-width: auto;
  
  &:hover {
    color: var(--color-accent-secondary);
    border-color: rgba(56, 189, 248, 0.3);
    background: rgba(56, 189, 248, 0.02);
  }
`;

const InputArea = styled.form`
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-tertiary);
  gap: 8px;
`;

const TextInput = styled.input`
  flex: 1;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  padding: 8px 14px;
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
`;

const SendButton = styled.button`
  background: var(--color-accent-primary);
  color: #070a13;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #fbbf24;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  align-self: flex-start;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  
  span {
    width: 4px;
    height: 4px;
    background: var(--color-text-muted);
    border-radius: 50%;
    animation: ${pulse} 1.2s infinite ease-in-out;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'msg-init', isUser: false, text: chatbotKnowledge.welcomeMessage }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const matchResponse = (query) => {
    const q = query.toLowerCase();
    
    // Privacy protection rules
    if (
      q.includes('phone') || 
      q.includes('number') || 
      q.includes('salary') || 
      q.includes('address') || 
      q.includes('exact location') ||
      q.includes('personal')
    ) {
      return chatbotKnowledge.answers.private_info;
    }
    
    // Solaride matches
    if (q.includes('solar') || q.includes('solaride') || q.includes('green energy') || q.includes('yojana')) {
      return chatbotKnowledge.answers.solaride;
    }
    
    // NASA Rover matches
    if (q.includes('rover') || q.includes('herc') || q.includes('seds') || q.includes('mechanical rover')) {
      return chatbotKnowledge.answers.nasa_herc;
    }
    
    // NASA Space Apps matches
    if (q.includes('space apps') || q.includes('apps challenge') || q.includes('collective') || q.includes('zimbabwe')) {
      return chatbotKnowledge.answers.nasa_apps;
    }
    
    // United Airlines matches
    if (q.includes('united') || q.includes('airlines') || q.includes('operations') || q.includes('analyst')) {
      return chatbotKnowledge.answers.united;
    }
    
    // Travel matches
    if (q.includes('travel') || q.includes('trip') || q.includes('visit') || q.includes('cities') || q.includes('countries')) {
      return chatbotKnowledge.answers.travel;
    }
    
    // Book matches
    if (q.includes('book') || q.includes('read') || q.includes('history') || q.includes('author')) {
      return chatbotKnowledge.answers.books;
    }
    
    // Philosophy matches
    if (q.includes('philosophy') || q.includes('stoic') || q.includes('marcus') || q.includes('naval') || q.includes('socrates')) {
      return chatbotKnowledge.answers.philosophy;
    }

    // Sports matches
    if (q.includes('sport') || q.includes('cricket') || q.includes('baseball') || q.includes('softball')) {
      return chatbotKnowledge.answers.sports;
    }

    return chatbotKnowledge.answers.fallback;
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { id: `msg-user-${Date.now()}`, isUser: true, text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Trigger simulated typing delay
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const answerText = matchResponse(text);
      const botMsg = { id: `msg-bot-${Date.now()}`, isUser: false, text: answerText };
      setMessages(prev => [...prev, botMsg]);
    }, 850);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <ChatWidget>
      <ChatBubbleButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat assistant"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </ChatBubbleButton>

      <AnimatePresence>
        {isOpen && (
          <ChatDrawer
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <DrawerHeader>
              <Title>
                <span /> AI Vanshul Assistant
              </Title>
              <CloseButton onClick={() => setIsOpen(false)} aria-label="Close chat">
                <FaTimes />
              </CloseButton>
            </DrawerHeader>

            <MessageList>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  $isUser={msg.isUser}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.text}
                </MessageBubble>
              ))}
              
              {isTyping && (
                <TypingIndicator>
                  Vanshul is typing<span></span><span></span><span></span>
                </TypingIndicator>
              )}
              
              <div ref={messageEndRef} />
            </MessageList>

            {/* Suggested quick question prompts */}
            <SuggestionsContainer>
              {chatbotKnowledge.defaultSuggestions.map((sug) => (
                <SuggestionTag
                  key={sug}
                  onClick={() => handleSendMessage(sug)}
                  disabled={isTyping}
                >
                  {sug}
                </SuggestionTag>
              ))}
            </SuggestionsContainer>

            <InputArea onSubmit={handleFormSubmit}>
              <TextInput
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isTyping}
              />
              <SendButton type="submit" disabled={isTyping || !inputText.trim()} aria-label="Send message">
                <FaPaperPlane />
              </SendButton>
            </InputArea>
          </ChatDrawer>
        )}
      </AnimatePresence>
    </ChatWidget>
  );
};

export default Chatbot;
