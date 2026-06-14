// src/components/Chatbot/Chatbot.jsx
import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { chatbotKnowledge } from '../../constants/portfolioData';

// Styled Components
const ChatSection = styled.section`
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg-primary);
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  font-weight: 400;
  color: var(--color-text-primary);
  
  span {
    color: var(--color-accent-primary);
    font-style: italic;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: var(--spacing-xl);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const InfoTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--color-text-primary);
`;

const InfoText = styled.p`
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.75;
`;

const ChatTerminal = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  height: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 420px;
  }
`;

const TerminalHeader = styled.div`
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
  padding: 12px var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-muted);
  
  span.dot {
    width: 6px;
    height: 6px;
    background: #a09e96;
    border-radius: 50%;
  }
`;

const MessageList = styled.div`
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
`;

const MessageBubble = styled(motion.div)`
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: var(--text-sm);
  line-height: 1.6;
  
  ${props => props.$isUser ? `
    align-self: flex-end;
    background: rgba(197, 179, 163, 0.1);
    color: var(--color-accent-primary);
    border: 1px solid rgba(197, 179, 163, 0.2);
  ` : `
    align-self: flex-start;
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  `}
`;

const SuggestionsBar = styled.div`
  padding: 8px var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.005);
`;

const SuggestionButton = styled.button`
  font-family: var(--font-primary);
  font-size: 11px;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition-base);
  min-height: auto;
  min-width: auto;
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: rgba(197, 179, 163, 0.3);
  }
`;

const InputForm = styled.form`
  display: flex;
  padding: 10px var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-tertiary);
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  transition: var(--transition-base);
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
`;

const SendBtn = styled.button`
  background: var(--color-accent-primary);
  color: var(--color-bg-primary);
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: var(--transition-base);
  
  &:hover:not(:disabled) {
    background: var(--color-accent-glow);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const Indicator = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 6px 10px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  
  span {
    width: 3px;
    height: 3px;
    background: var(--color-text-muted);
    border-radius: 50%;
    animation: ${pulse} 1.2s infinite ease-in-out;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 'msg-0', isUser: false, text: chatbotKnowledge.welcomeMessage }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const getResponse = (inputVal) => {
    const v = inputVal.toLowerCase();
    
    if (
      v.includes('phone') || 
      v.includes('number') || 
      v.includes('salary') || 
      v.includes('address') || 
      v.includes('private') ||
      v.includes('personal')
    ) {
      return chatbotKnowledge.answers.private_info;
    }
    
    if (v.includes('solar') || v.includes('solaride') || v.includes('yojana')) {
      return chatbotKnowledge.answers.solaride;
    }
    
    if (v.includes('rover') || v.includes('herc') || v.includes('design') || v.includes('mechanical')) {
      return chatbotKnowledge.answers.nasa_herc;
    }
    
    if (v.includes('space apps') || v.includes('apps challenge') || v.includes('collective')) {
      return chatbotKnowledge.answers.nasa_apps;
    }
    
    if (v.includes('united') || v.includes('airlines') || v.includes('operations')) {
      return chatbotKnowledge.answers.united;
    }
    
    if (v.includes('travel') || v.includes('trip') || v.includes('places') || v.includes('cities')) {
      return chatbotKnowledge.answers.travel;
    }
    
    if (v.includes('book') || v.includes('read') || v.includes('history')) {
      return chatbotKnowledge.answers.books;
    }
    
    if (v.includes('philosophy') || v.includes('stoic') || v.includes('marcus') || v.includes('seneca')) {
      return chatbotKnowledge.answers.philosophy;
    }

    if (v.includes('sport') || v.includes('cricket') || v.includes('baseball')) {
      return chatbotKnowledge.answers.sports;
    }

    return chatbotKnowledge.answers.fallback;
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    const userMsg = { id: `u-${Date.now()}`, isUser: true, text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const answer = getResponse(text);
      const botMsg = { id: `b-${Date.now()}`, isUser: false, text: answer };
      setMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  const handleForm = (e) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <ChatSection id="dialogue">
      <Container>
        <SectionHeader>
          <Title>Interactive // <span>Dialogues</span></Title>
        </SectionHeader>
        
        <Grid>
          <InfoPanel>
            <InfoTitle>Oracle Sandbox</InfoTitle>
            <InfoText>
              To respect time and keep conversations productive, I programmed this retrieval sandbox.
            </InfoText>
            <InfoText>
              Ask it about my current projects, sports indices, reading libraries, or travel logs. It simulates my conversational tone while protecting sensitive personal metrics.
            </InfoText>
          </InfoPanel>
          
          <ChatTerminal>
            <TerminalHeader>
              <span className="dot" /> terminal // ai-vanshul-v1.0
            </TerminalHeader>
            
            <MessageList>
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  $isUser={m.isUser}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {m.text}
                </MessageBubble>
              ))}
              
              {isTyping && (
                <Indicator>
                  thinking<span></span><span></span><span></span>
                </Indicator>
              )}
              
              <div ref={endRef} />
            </MessageList>
            
            <SuggestionsBar>
              {chatbotKnowledge.defaultSuggestions.map((sug) => (
                <SuggestionButton
                  key={sug}
                  onClick={() => handleSend(sug)}
                  disabled={isTyping}
                >
                  {sug}
                </SuggestionButton>
              ))}
            </SuggestionsBar>
            
            <InputForm onSubmit={handleForm}>
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Submit queries here..."
                disabled={isTyping}
              />
              <SendBtn type="submit" disabled={isTyping || !inputText.trim()}>
                <FaPaperPlane />
              </SendBtn>
            </InputForm>
          </ChatTerminal>
        </Grid>
      </Container>
    </ChatSection>
  );
};

export default Chatbot;
