import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatInputForm } from './ChatInputForm';
import { renderWithProviders as render } from '../../utils/test-utils';

const mockT = {
  scoutPlaceholder: 'Ask something'
};

describe('ChatInputForm', () => {
  it('renders correctly and takes input', () => {
    const setInputMock = vi.fn();
    const sendMock = vi.fn();
    
    render(
      <ChatInputForm 
        inputMessage="" 
        setInputMessage={setInputMock} 
        isSending={false} 
        handleSendMessage={sendMock} 
        t={mockT as any} 
      />
    );
    
    expect(screen.getByPlaceholderText('Ask something')).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText('Ask something');
    fireEvent.change(input, { target: { value: 'test msg' } });
    expect(setInputMock).toHaveBeenCalledWith('test msg');
  });

  it('handles enter key to send', () => {
    const sendMock = vi.fn();
    
    render(
      <ChatInputForm 
        inputMessage="hello" 
        setInputMessage={vi.fn()} 
        isSending={false} 
        handleSendMessage={sendMock} 
        t={mockT as any} 
      />
    );
    
    const input = screen.getByPlaceholderText('Ask something');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(sendMock).toHaveBeenCalled();
  });

  it('handles click to send', () => {
    const sendMock = vi.fn();
    
    render(
      <ChatInputForm 
        inputMessage="hello" 
        setInputMessage={vi.fn()} 
        isSending={false} 
        handleSendMessage={sendMock} 
        t={mockT as any} 
      />
    );
    
    const btn = screen.getByRole('button', { name: 'Send message' });
    fireEvent.click(btn);
    expect(sendMock).toHaveBeenCalled();
  });
});
