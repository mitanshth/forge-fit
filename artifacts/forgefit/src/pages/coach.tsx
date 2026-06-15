import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListOpenaiConversations,
  useCreateOpenaiConversation,
  useDeleteOpenaiConversation,
  getListOpenaiConversationsQueryKey,
  getGetOpenaiConversationQueryKey,
} from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { triggerQuestCompletion } from "@/lib/quests";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, TerminalSquare, Plus, Trash2, MessageSquare } from "lucide-react";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export default function Coach() {
  const queryClient = useQueryClient();
  const { data: conversations, isLoading: convsLoading } = useListOpenaiConversations();
  const createConv = useCreateOpenaiConversation();
  const deleteConv = useDeleteOpenaiConversation();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [localMessages, setLocalMessages] = useState<Record<number, DisplayMessage[]>>({});
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (conversations?.length && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, activeId]);

  const loadMessages = useCallback(async (convId: number) => {
    if (localMessages[convId]) return;
    try {
      const res = await fetch(`/api/openai/conversations/${convId}/messages`, { credentials: "include" });
      if (res.ok) {
        const msgs: Array<{ role: string; content: string }> = await res.json();
        setLocalMessages(prev => ({
          ...prev,
          [convId]: msgs.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
        }));
      }
    } catch {
      // ignore
    }
  }, [localMessages]);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
  }, [activeId]);

  const handleNewConversation = async () => {
    const title = `Gate Session ${new Date().toLocaleDateString()}`;
    const conv = await createConv.mutateAsync({ data: { title } });
    queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
    setActiveId(conv.id);
    setLocalMessages(prev => ({ ...prev, [conv.id]: [] }));
  };

  const handleDelete = async (id: number) => {
    await deleteConv.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
    if (activeId === id) {
      const remaining = (conversations ?? []).filter(c => c.id !== id);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
    setLocalMessages(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming || !activeId) return;
    const content = input.trim();
    setInput("");

    const userMsg: DisplayMessage = { role: "user", content };
    const assistantMsg: DisplayMessage = { role: "assistant", content: "", streaming: true };

    setLocalMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), userMsg, assistantMsg],
    }));

    setIsStreaming(true);
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/openai/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (!json) continue;
          try {
            const parsed = JSON.parse(json);
            if (parsed.done) break;
            if (parsed.content) {
              accumulated += parsed.content;
              const snapshot = accumulated;
              setLocalMessages(prev => {
                const msgs = [...(prev[activeId] ?? [])];
                const lastIdx = msgs.length - 1;
                if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
                  msgs[lastIdx] = { ...msgs[lastIdx], content: snapshot };
                }
                return { ...prev, [activeId]: msgs };
              });
            }
          } catch {
            // skip malformed lines
          }
        }
      }

      setLocalMessages(prev => {
        const msgs = [...(prev[activeId] ?? [])];
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
          msgs[lastIdx] = { ...msgs[lastIdx], streaming: false };
        }
        return { ...prev, [activeId]: msgs };
      });

      queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(activeId) });
      triggerQuestCompletion("message_sent");
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setLocalMessages(prev => {
          const msgs = [...(prev[activeId] ?? [])];
          const lastIdx = msgs.length - 1;
          if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
            msgs[lastIdx] = {
              role: "assistant",
              content: "[SYSTEM ERROR: Connection severed. The Shadow Monarch grows impatient.]",
              streaming: false,
            };
          }
          return { ...prev, [activeId]: msgs };
        });
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const activeMessages = activeId ? (localMessages[activeId] ?? []) : [];

  return (
    <div className="h-[calc(100vh-5rem)] flex gap-4 animate-in fade-in duration-500">
      {/* Sidebar */}
      <div className="w-64 shrink-0 flex flex-col gap-3">
        <Button
          onClick={handleNewConversation}
          disabled={createConv.isPending}
          className="w-full bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white tracking-widest font-bold shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          data-testid="button-new-conversation"
        >
          <Plus className="w-4 h-4 mr-2" />
          NEW GATE
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {convsLoading && (
            <p className="text-muted-foreground text-xs tracking-widest animate-pulse px-2">LOADING GATES...</p>
          )}
          {!convsLoading && conversations?.length === 0 && (
            <p className="text-muted-foreground text-xs tracking-widest px-2">NO GATES OPENED YET</p>
          )}
          {conversations?.map(conv => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 p-3 rounded border cursor-pointer transition-all ${
                activeId === conv.id
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-card/40 border-primary/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
              onClick={() => setActiveId(conv.id)}
              data-testid={`conversation-item-${conv.id}`}
            >
              <MessageSquare className="w-3 h-3 shrink-0" />
              <span className="text-xs font-mono tracking-wide flex-1 truncate">{conv.title}</span>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(conv.id); }}
                className="opacity-0 group-hover:opacity-100 text-red-500/70 hover:text-red-400 transition-opacity"
                data-testid={`button-delete-conversation-${conv.id}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 bg-card/40 border-primary/20 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-primary/20 shrink-0">
          <h1 className="text-xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
            Shadow Monarch's Voice
          </h1>
          <p className="text-muted-foreground tracking-widest text-xs mt-1">AI SYSTEM MENTOR — DIRECT LINK ESTABLISHED</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
          {!activeId && (
            <div className="h-full flex items-center justify-center text-muted-foreground font-mono flex-col gap-4 opacity-40">
              <TerminalSquare className="w-12 h-12" />
              <p className="tracking-widest">OPEN A NEW GATE TO BEGIN</p>
            </div>
          )}
          {activeId && activeMessages.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground font-mono flex-col gap-4 opacity-40">
              <TerminalSquare className="w-12 h-12" />
              <p className="tracking-widest">SYSTEM AWAITING INPUT...</p>
              <p className="text-xs">Ask about training, nutrition, recovery, or rank advancement.</p>
            </div>
          )}
          {activeMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-4 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-secondary/50 border-secondary text-foreground font-mono"
                }`}
                data-testid={`message-${msg.role}-${i}`}
              >
                {msg.content}
                {msg.streaming && (
                  <span className="inline-block w-2 h-4 bg-primary/80 ml-1 animate-pulse align-middle" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-primary/20 bg-background/50 backdrop-blur shrink-0">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={activeId ? "ASK THE MONARCH..." : "OPEN A GATE FIRST..."}
              disabled={!activeId || isStreaming}
              className="bg-background/80 border-primary/30 font-mono focus-visible:ring-primary/50 h-12 tracking-wide"
              data-testid="input-chat"
            />
            <Button
              type="submit"
              disabled={!activeId || isStreaming || !input.trim()}
              className="h-12 w-12 p-0 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white shadow-[0_0_10px_rgba(139,92,246,0.3)] shrink-0 disabled:opacity-30"
              data-testid="button-send-message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
