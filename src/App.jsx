import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import ReactMarkdown from "react-markdown";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${apiBase}/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data.reply || data.message,
      };

      setChat((prev) => [...prev, botMsg]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to server." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: 900,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 3,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              width: 48,
              height: 48,
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              DevHelper AI
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your coding assistant
            </Typography>
          </Box>
          <Chip
            label="Online"
            size="small"
            sx={{
              ml: "auto",
              bgcolor: "#4caf50",
              color: "#fff",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Chat Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            background: "#f8f9fa",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          {chat.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                opacity: 0.5,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 64, mb: 2, color: "#667eea" }} />
              <Typography variant="h6" color="textSecondary">
                Start a conversation
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ask me anything about coding!
              </Typography>
            </Box>
          )}

          <Stack spacing={2.5}>
            {chat.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: msg.role === "user" ? "#667eea" : "#f50057",
                    width: 36,
                    height: 36,
                  }}
                >
                  {msg.role === "user" ? (
                    <PersonIcon fontSize="small" />
                  ) : (
                    <SmartToyIcon fontSize="small" />
                  )}
                </Avatar>

                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    backgroundColor: msg.role === "user" ? "#667eea" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#1a1a1a",
                    borderRadius: 3,
                    borderTopLeftRadius: msg.role === "user" ? 16 : 4,
                    borderTopRightRadius: msg.role === "user" ? 4 : 16,
                    wordWrap: "break-word",
                  }}
                >
                  <Box
                    sx={{
                      "& p": { margin: 0, marginBottom: "0.5em" },
                      "& p:last-child": { marginBottom: 0 },
                      "& strong": { fontWeight: 700 },
                      "& em": { fontStyle: "italic" },
                      "& code": {
                        backgroundColor: msg.role === "user" ? "rgba(255,255,255,0.2)" : "#f5f5f5",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.9em",
                        fontFamily: "monospace",
                      },
                      "& pre": {
                        backgroundColor: msg.role === "user" ? "rgba(255,255,255,0.2)" : "#f5f5f5",
                        padding: "12px",
                        borderRadius: "8px",
                        overflow: "auto",
                        margin: "8px 0",
                      },
                      "& ul, & ol": {
                        marginLeft: "20px",
                        marginTop: "8px",
                        marginBottom: "8px",
                      },
                      "& li": {
                        marginBottom: "4px",
                      },
                    }}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </Box>
                </Paper>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Avatar
                  sx={{
                    bgcolor: "#f50057",
                    width: 36,
                    height: 36,
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    px: 2.5,
                    borderRadius: 3,
                    borderTopLeftRadius: 4,
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: "#bdbdbd",
                      animation: "pulse 1.4s infinite ease-in-out",
                      animationDelay: "0s",
                      "@keyframes pulse": {
                        "0%, 60%, 100%": { 
                          transform: "scale(0.8)",
                          bgcolor: "#bdbdbd",
                        },
                        "30%": { 
                          transform: "scale(1.1)",
                          bgcolor: "#757575",
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: "#bdbdbd",
                      animation: "pulse 1.4s infinite ease-in-out",
                      animationDelay: "0.2s",
                      "@keyframes pulse": {
                        "0%, 60%, 100%": { 
                          transform: "scale(0.8)",
                          bgcolor: "#bdbdbd",
                        },
                        "30%": { 
                          transform: "scale(1.1)",
                          bgcolor: "#757575",
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: "#bdbdbd",
                      animation: "pulse 1.4s infinite ease-in-out",
                      animationDelay: "0.4s",
                      "@keyframes pulse": {
                        "0%, 60%, 100%": { 
                          transform: "scale(0.8)",
                          bgcolor: "#bdbdbd",
                        },
                        "30%": { 
                          transform: "scale(1.1)",
                          bgcolor: "#757575",
                        },
                      },
                    }}
                  />
                </Paper>
              </Box>
            )}
            <div ref={chatEndRef} />
          </Stack>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid #e0e0e0",
            background: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-end",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              placeholder="Type your message..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f8f9fa",
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <IconButton
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                width: 48,
                height: 48,
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #653a8b 100%)",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default App;