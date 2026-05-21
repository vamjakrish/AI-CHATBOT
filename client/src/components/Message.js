import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Message.css';

const CodeBlock = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="code-block">
        <div className="code-block__header">
          <span className="code-block__lang">{match[1]}</span>
          <button className="code-block__copy" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: '0 0 8px 8px', fontSize: '0.85rem', background: '#0d0d14' }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }
  return <code className="inline-code" {...props}>{children}</code>;
};

export default function Message({ role, content, timestamp }) {
  const isUser = role === 'user';
  const time = timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`message message--${isUser ? 'user' : 'ai'} fade-in`}>
      {!isUser && (
        <div className="message__avatar">
          <span>✦</span>
        </div>
      )}
      <div className="message__body">
        <div className="message__bubble">
          {isUser ? (
            <p className="message__text">{content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ code: CodeBlock }}
              className="message__markdown"
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        {time && <span className="message__time">{time}</span>}
      </div>
      {isUser && (
        <div className="message__avatar message__avatar--user">
          <span>U</span>
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="message message--ai fade-in">
      <div className="message__avatar">
        <span>✦</span>
      </div>
      <div className="message__body">
        <div className="message__bubble message__bubble--typing">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
