import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { API_BASE } from "../config";

const QUICK_PROMPTS = [
	{ label: "👨‍🌾 Farmer", text: "I am a farmer aged 45 from a rural area. What government schemes am I eligible for?" },
	{ label: "🎓 Student", text: "I am a 20 year old male student from a low income family. What education schemes can I apply for?" },
	{ label: "🧓 Senior Citizen", text: "I am a 65 year old senior citizen looking for pension and health benefit schemes." },
	{ label: "💼 Entrepreneur", text: "I want to start a small business or startup. What government schemes support entrepreneurs?" },
	{ label: "🏠 BPL Family", text: "I belong to the BPL category and need support for housing and food security." },
	{ label: "🤰 Pregnant Woman", text: "I am a pregnant woman from a low income rural family. What maternal health schemes can I access?" },
];

const TypingIndicator = () => (
	<div className="flex gap-1 items-center px-1 py-1">
		{[0, 1, 2].map(i => (
			<div
				key={i}
				className="w-2 h-2 rounded-full bg-[#0ed7b2]"
				style={{ animation: `bounce 1.2s infinite ${i * 0.2}s` }}
			/>
		))}
		<style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }`}</style>
	</div>
);

const AIAdvisorPanel = ({ initialMessage }) => {
	const [messages, setMessages] = useState([
		{
			role: "bot",
			text: "Namaste! 🙏 I'm your AI Scheme Advisor, powered by GovSec AI.\n\nTell me about your profile — **age**, **occupation**, **income level**, **location** (urban/rural), **gender** — and I'll recommend the most relevant government schemes for you.\n\nOr pick a quick option below!",
		},
	]);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const chatRef = useRef(null);
	const inputRef = useRef(null);
	const initialMessageHandled = useRef(false);

	// If navigated from SchemesPanel "Ask AI" button
	useEffect(() => {
		if (initialMessage && !initialMessageHandled.current) {
			initialMessageHandled.current = true;
			setInput(initialMessage);
			setTimeout(() => sendMessage(initialMessage), 300);
		}
	}, [initialMessage]);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages, isTyping]);

	const formatText = (text) => {
		return text
			.replace(/\n/g, "<br/>")
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
	};

	const sendMessage = async (overrideText) => {
		const text = (overrideText || input).trim();
		if (!text || isTyping) return;

		setInput("");
		setMessages(prev => [...prev, { role: "user", text }]);
		setIsTyping(true);

		try {
			const res = await axios.post(`${API_BASE}/schemes/ai-recommend`, { query: text });
			const reply = res.data.response || "Sorry, I couldn't generate a response. Please try again.";
			setMessages(prev => [...prev, { role: "bot", text: reply }]);
		} catch (err) {
			setMessages(prev => [...prev, {
				role: "bot",
				text: "⚠️ Connection error. Please make sure the backend server is running and try again.",
			}]);
		} finally {
			setIsTyping(false);
		}
	};

	const handleQuickPrompt = (text) => {
		setInput(text);
		sendMessage(text);
	};

	return (
		<div className="animate-pop-in flex flex-col h-full space-y-4">
			{/* Header */}
			<div className="gov-card p-0 overflow-hidden border border-[#0ed7b2]/20">
				<div style={{ background: "linear-gradient(135deg, #0b3d91 0%, #1a5abf 100%)" }} className="px-8 py-6">
					<h2 className="text-xl font-black text-white mb-1 tracking-widest uppercase">🤖 AI Policy Advisor</h2>
					<p className="text-sm text-slate-300">Get personalised government scheme recommendations based on your profile</p>
				</div>

				{/* Quick Prompts */}
				<div className="px-6 py-4 flex flex-wrap gap-2 bg-white/[0.02] border-b border-white/5">
					{QUICK_PROMPTS.map((p, i) => (
						<button
							key={i}
							onClick={() => handleQuickPrompt(p.text)}
							disabled={isTyping}
							className="bg-white/5 border border-white/10 hover:bg-[#0ed7b2]/10 hover:border-[#0ed7b2]/30 hover:text-[#0ed7b2] text-slate-400 text-xs font-black tracking-wide px-3 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{p.label}
						</button>
					))}
				</div>
			</div>

			{/* Chat Window */}
			<div className="gov-card flex-1 p-0 overflow-hidden flex flex-col" style={{ minHeight: "420px" }}>
				<div
					ref={chatRef}
					className="flex-1 overflow-y-auto p-6 space-y-4"
					style={{ maxHeight: "440px" }}
				>
					{messages.map((msg, i) => (
						<div key={i} className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
							<div
								className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black ${
									msg.role === "user" ? "bg-[#FF9933] text-white" : "bg-[#0b3d91] text-white"
								}`}
							>
								{msg.role === "user" ? "U" : "AI"}
							</div>
							<div
								className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
									msg.role === "user"
										? "bg-[#0ed7b2] text-[#020617] font-bold rounded-tr-sm"
										: "bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm"
								}`}
								dangerouslySetInnerHTML={{ __html: msg.role === "bot" ? formatText(msg.text) : msg.text }}
							/>
						</div>
					))}

					{isTyping && (
						<div className="flex gap-3 items-start">
							<div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black bg-[#0b3d91] text-white">
								AI
							</div>
							<div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
								<TypingIndicator />
							</div>
						</div>
					)}
				</div>

				{/* Input Bar */}
				<div className="border-t border-white/5 px-4 py-4 flex gap-3 items-center bg-white/[0.02]">
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={e => e.key === "Enter" && sendMessage()}
						placeholder="Describe your profile (age, occupation, income, location...)..."
						disabled={isTyping}
						className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#0ed7b2] transition-colors disabled:opacity-50"
					/>
					<button
						onClick={() => sendMessage()}
						disabled={isTyping || !input.trim()}
						className="w-11 h-11 bg-[#0b3d91] hover:bg-[#0d2d78] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all text-lg shadow-lg"
					>
						➤
					</button>
				</div>
			</div>
		</div>
	);
};

export default AIAdvisorPanel;
