import React, { createContext, useEffect, useState, useContext } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [lastMessage, setLastMessage] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to Backend WebSocket
        const ws = new WebSocket('ws://localhost:8000/ws/notifications/');

        ws.onopen = () => console.log('✅ Connected to Notifications');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLastMessage(data);
            setTimeout(() => setLastMessage(null), 5000); // clear after 5s
        };
        ws.onclose = () => console.log('❌ Disconnected');

        setSocket(ws);
        return () => ws.close();
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, lastMessage }}>
            {children}
            {lastMessage && (
                <div className="fixed bottom-5 right-5 z-50 animate-bounce">
                    <div className="bg-white border-l-4 border-blue-600 rounded-lg shadow-2xl p-4 flex items-start max-w-sm">
                        <div className="text-2xl mr-3">🔔</div>
                        <div>
                            <h4 className="font-bold text-gray-900">{lastMessage.title || "New Notification"}</h4>
                            <p className="text-sm text-gray-600">{lastMessage.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </WebSocketContext.Provider>
    );
};