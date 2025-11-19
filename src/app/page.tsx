"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Heart, Send, Shield } from "lucide-react";

interface Message {
	id: string;
	content: string;
	timestamp: Date;
}

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [messageContent, setMessageContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!messageContent.trim()) {
			return;
		}

		setIsSubmitting(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		const newMessage: Message = {
			id: Date.now().toString(),
			content: messageContent.trim(),
			timestamp: new Date(),
		};

		setMessages((prev) => [newMessage, ...prev]);
		setMessageContent("");
		setIsSubmitting(false);
	};

	const formatTimestamp = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (seconds < 60) {
			return "Just now";
		}
		if (minutes < 60) {
			return `${minutes}m ago`;
		}
		if (hours < 24) {
			return `${hours}h ago`;
		}
		return date.toLocaleDateString();
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
				{/* Header Section */}
				<div className="mb-8 text-center">
					<div className="mb-4 flex items-center justify-center gap-2">
						<h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
							Safe Venting Space
						</h1>
					</div>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						A safe, anonymous space to share your thoughts and feelings. Your voice
						matters, and you are heard.
					</p>
					<div className="mt-4 flex items-center justify-center gap-2">
						<Shield className="size-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">
							100% Anonymous • No Login Required
						</span>
					</div>
				</div>

				{/* Submission Form */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Share Your Thoughts</CardTitle>
						<CardDescription>
							Express yourself freely. Your message will be shared anonymously in the
							feed below.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="message">Your Message</Label>
								<Textarea
									id="message"
									placeholder="What's on your mind? Share anything you'd like..."
									value={messageContent}
									onChange={(e) => setMessageContent(e.target.value)}
									rows={5}
									className="resize-none"
									required
									maxLength={1000}
								/>
								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span>Your message is completely anonymous</span>
									<span>
										{messageContent.length}/1000 characters
									</span>
								</div>
							</div>
							<Button type="submit" disabled={isSubmitting || !messageContent.trim()}>
								<Send className="size-4" />
								{isSubmitting ? "Sharing..." : "Share Anonymously"}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Separator className="mb-8" />

				{/* Messages Feed */}
				<div className="space-y-4">
					<div className="mb-6">
						<h2 className="text-2xl font-semibold tracking-tight">
							Community Feed
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Messages shared by others in this safe space
						</p>
					</div>

					{messages.length === 0 ? (
						<Empty>
							<EmptyMedia variant="icon">
								<Heart className="size-6" />
							</EmptyMedia>
							<EmptyHeader>
								<EmptyTitle>No messages yet</EmptyTitle>
								<EmptyDescription>
									Be the first to share your thoughts. Your message will appear here
									anonymously.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						<div className="space-y-4">
							{messages.map((message) => (
								<Card key={message.id} className="transition-shadow hover:shadow-md">
									<CardContent className="pt-6">
										<div className="space-y-4">
											<p className="whitespace-pre-wrap text-base leading-relaxed">
												{message.content}
											</p>
											<div className="flex items-center justify-between">
												<Badge variant="secondary" className="text-xs">
													{formatTimestamp(message.timestamp)}
												</Badge>
												<span className="text-xs text-muted-foreground">
													Anonymous
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
