"use client";

import { Heart, MessageCircleReply, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { generateFingerprint } from "@/lib/fingerprint";
import { containsProfanity } from "@/lib/profanity";
import { generateRandomUsername } from "@/lib/username";
import { trackEvent, trackPageView, GA_EVENTS } from "@/lib/analytics";

interface Message {
    id: string;
    content: string;
    timestamp: Date;
    username?: string;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageContent, setMessageContent] = useState("");
    const [fingerprint, setFingerprint] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Generate stable IDs for skeleton loaders
    const skeletonIds = useMemo(
        () =>
            Array.from(
                { length: 3 },
                (_, i) => `skeleton-${i}-${Math.random()}`,
            ),
        [],
    );

    // Generate fingerprint on component mount
    useEffect(() => {
        setFingerprint(generateFingerprint());
    }, []);

    // Track page view on mount
    useEffect(() => {
        trackPageView("/", "Safe Venting Space");
    }, []);

    // Fetch messages from API on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/notion", {
                    method: "GET",
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to fetch messages");
                }

                const data = await res.json();
                if (data.messages && Array.isArray(data.messages)) {
                    // Convert timestamp strings back to Date objects
                    const messagesWithDates: Message[] = data.messages.map(
                        (msg: {
                            id: string;
                            content: string;
                            timestamp: string | Date;
                            username?: string;
                        }) => ({
                            ...msg,
                            timestamp:
                                typeof msg.timestamp === "string"
                                    ? new Date(msg.timestamp)
                                    : msg.timestamp,
                        }),
                    );
                    setMessages(messagesWithDates);
                    
                    // Track successful message fetch
                    trackEvent(GA_EVENTS.MESSAGE_FETCH_SUCCESS, {
                        message_count: messagesWithDates.length,
                    });
                    
                    // Track empty state if no messages
                    if (messagesWithDates.length === 0) {
                        trackEvent(GA_EVENTS.MESSAGE_EMPTY_STATE);
                    }
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                // Track fetch error
                trackEvent(GA_EVENTS.MESSAGE_FETCH_ERROR, {
                    error_message: error instanceof Error ? error.message : "Unknown error",
                });
                // Don't show error toast on initial load to avoid annoying users
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!messageContent.trim()) {
            return;
        }

        // Check for profanity before submitting
        if (containsProfanity(messageContent.trim())) {
            trackEvent(GA_EVENTS.FORM_PROFANITY_BLOCKED, {
                message_length: messageContent.trim().length,
            });
            toast.error(
                "Your message contains inappropriate language. Please revise your message to maintain a safe and respectful environment.",
            );
            return;
        }

        // Track form submission attempt
        trackEvent(GA_EVENTS.FORM_SUBMIT, {
            message_length: messageContent.trim().length,
        });

        setIsSubmitting(true);

        if (!fingerprint) {
            trackEvent(GA_EVENTS.FORM_SUBMIT_ERROR, {
                error_type: "fingerprint_generation_failed",
            });
            toast.error(
                "Unable to generate fingerprint. Please refresh the page.",
            );
            setIsSubmitting(false);
            return;
        }

        // Generate a random username for this submission
        const randomUsername = generateRandomUsername();

        try {
            const res = await fetch("/api/notion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: messageContent.trim(),
                    fingerprint,
                    username: randomUsername,
                    created_date: new Date().toISOString(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save message");
            }

            // Success - add message to local state
            const newMessage: Message = {
                id: data.id || Date.now().toString(),
                content: messageContent.trim(),
                timestamp: new Date(),
                username: randomUsername,
            };

            setMessages((prev) => [newMessage, ...prev]);
            setMessageContent("");
            
            // Track successful submission
            trackEvent(GA_EVENTS.FORM_SUBMIT_SUCCESS, {
                message_length: newMessage.content.length,
                message_id: newMessage.id,
            });
            
            toast.success("Your message has been shared anonymously");
        } catch (error) {
            console.error("Error submitting message:", error);
            
            // Track submission error
            trackEvent(GA_EVENTS.FORM_SUBMIT_ERROR, {
                error_type: "api_error",
                error_message: error instanceof Error ? error.message : "Unknown error",
            });
            
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to share your message. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
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
                        A safe, anonymous space to share your thoughts and
                        feelings. Your voice matters, and you are heard.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Shield className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            100% Anonymous • No Login Required
                        </span>
                    </div>
                </div>

                {/* Submission Form */}
                <Card className="mb-8 shadow-xs">
                    <CardHeader>
                        <CardTitle>Share Your Thoughts</CardTitle>
                        <CardDescription>
                            Express yourself freely. Your message will be shared
                            anonymously in the feed below.
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
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setMessageContent(newValue);
                                        
                                        // Track character count milestones
                                        const length = newValue.length;
                                        if (length > 0 && (length === 100 || length === 250 || length === 500 || length === 750 || length === 1000)) {
                                            trackEvent(GA_EVENTS.CHARACTER_COUNT, {
                                                character_count: length,
                                            });
                                        }
                                    }}
                                    rows={5}
                                    className="resize-none"
                                    required
                                    maxLength={1000}
                                />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                        Your message is completely anonymous
                                    </span>
                                    <span>
                                        {messageContent.length}/1000 characters
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting || !messageContent.trim()
                                }
                            >
                                {isSubmitting ? (
                                    <Spinner className="size-4" />
                                ) : (
                                    <MessageCircleReply className="size-4" />
                                )}
                                {isSubmitting
                                    ? "Sharing message..."
                                    : "Share anonymously"}
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

                    {isLoading ? (
                        <div className="space-y-4">
                            {skeletonIds.map((id) => (
                                <Card
                                    key={id}
                                    className="shadow-xs transition-shadow"
                                >
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Skeleton className="h-5 w-16 rounded-full" />
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        <Empty>
                            <EmptyMedia variant="icon">
                                <Heart className="size-6" />
                            </EmptyMedia>
                            <EmptyHeader>
                                <EmptyTitle>No messages yet</EmptyTitle>
                                <EmptyDescription>
                                    Be the first to share your thoughts. Your
                                    message will appear here anonymously.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <Card
                                    key={message.id}
                                    className="shadow-xs transition-shadow hover:shadow-md"
                                    onMouseEnter={() => {
                                        // Track message view on hover
                                        trackEvent(GA_EVENTS.MESSAGE_VIEW, {
                                            message_id: message.id,
                                            message_length: message.content.length,
                                        });
                                    }}
                                >
                                    <CardContent>
                                        <div className="space-y-4">
                                            <p className="whitespace-pre-wrap text-base leading-relaxed">
                                                {message.content}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {formatTimestamp(
                                                        message.timestamp,
                                                    )}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {message.username}
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
