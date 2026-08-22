# PBMP Chatbot — Pseudocode (English)

Document for Google Docs import.  
Source: Grow24 PBMP Chatbot end-to-end flow.

---

## 1) Page load — chatbot mounts

```
ON website page load (grow24.ai):
    RENDER chatbot floating button
    SET messages = []
    SET isOpen = false
    SET isLoading = false
```

---

## 2) User opens chatbot

```
ON user clicks chat icon:
    SET isOpen = true
    SHOW chat window
    IF messages is empty:
        SHOW welcome text
        SHOW prompt suggestion buttons
```

---

## 3) User sends a message

```
FUNCTION handleSendMessage(userText):

    IF userText is empty OR isLoading is true:
        RETURN

    IF text looks like booking request:
        ADD user message to messages
        ADD booking-form assistant message
        SET isInBookingFlow = true
        RETURN   // do not call AI for booking form path

    IF text asks for diagram and diagram already exists:
        SHOW existing diagram
        RETURN

    ADD user message to UI messages
    SET isLoading = true

    TRY:
        responseText = CALL sendMessage(all messages including new user message)
        cleanText, diagramType = PARSE responseText for [DIAGRAM_PROMPT:...]
        ADD assistant message to UI
        IF diagramType exists:
            SHOW "Want to see diagram?" prompt
    CATCH error:
        SHOW error in UI
    FINALLY:
        SET isLoading = false
```

---

## 4) Frontend API call

```
FUNCTION sendMessage(messages):

    endpoint = PBMP_CHAT_API_ENDPOINT
               OR VITE_API_ENDPOINT
               OR "https://pbmpchatbotbackend.zeabur.app/api/chat"

    payload = {
        messages: [
            systemPrompt,
            ...convert each message to { role, parts: [{ type: "text", text }] }
        ]
    }

    response = HTTP POST endpoint WITH payload

    result = ""
    FOR EACH streamed chunk in response:
        IF chunk starts with "0:":
            result = result + parseJSON(chunk without "0:")

    RETURN result
```

---

## 5) Backend — POST /api/chat

```
ON POST /api/chat:

    messages = request.body.messages
    IF messages missing:
        RETURN 400 error

    latestMessage = last item in messages
    messageText = extract text from latestMessage
    IF messageText empty:
        RETURN 400 error

    LOG "Chat request received"
    LOG messageText

    cycleType = detectCycleQuestion(messageText)
        // returns "personal" OR "professional" OR null

    // Step A: embedding
    embedding = GoogleEmbeddings.embed(messageText)

    // Step B: knowledge search
    docContext = ""
    IF AstraDB connected:
        docs = AstraDB.collection("pbmp_chat")
                       .vectorSearch(embedding, limit=5)
        relevantDocs = docs WHERE similarity > 0.7 (if score exists)
        docContext = JOIN relevantDocs texts

    // Step C: build prompt
    systemPrompt = PBMP rules + Grow24 identity + topic limits + docContext
    history = last N conversation messages (trimmed by count/size)

    // Step D: generate answer
    chat = Gemini.startChat(systemPrompt + history)
    stream = chat.sendMessageStream(messageText)

    SET response headers to streaming
    fullResponse = ""
    FOR EACH chunk in stream:
        text = chunk.text
        fullResponse = fullResponse + text
        WRITE to client: "0:" + JSON(text)

    IF fullResponse too short:
        WRITE fallback apology message

    IF cycleType is not null:
        WRITE "0:" + JSON("\n\n[DIAGRAM_PROMPT:" + cycleType + "]")

    END response
```

---

## 6) End-to-end flow (one function view)

```
FUNCTION PBMP_Chatbot_EndToEnd():

    user opens grow24.ai
    user opens chatbot
    user types question and presses Send

    browser shows user bubble immediately
    browser POSTs question to Zeabur backend /api/chat

    backend:
        1. read question
        2. create embedding
        3. search AstraDB knowledge
        4. ask Gemini with question + knowledge context
        5. stream answer back

    browser:
        collect stream chunks
        show assistant bubble
        optionally show diagram prompt

    DONE
```

---

## 7) Servers in the flow

```
Website UI (grow24.ai)
        |
        |  POST /api/chat
        v
Zeabur Backend (pbmpchatbotbackend.zeabur.app)
        |
        +----> AstraDB   (retrieve PBMP docs)
        |
        +----> Gemini AI (generate answer)
        |
        v
Stream answer back to Website UI
```

---

## 8) Special paths (not normal Q&A)

```
IF user says "book meeting" / "schedule demo":
    SHOW booking form in chat
    ON form submit:
        POST /api/leads
        SAVE lead in AstraDB (leads collection)
        OPTIONAL send email

IF user uses microphone:
    browser speech-to-text converts voice -> text
    put text into input
    THEN same sendMessage flow as typed text
```

---

## Servers summary

| Layer | What | URL / Place |
|-------|------|-------------|
| Website UI | Chatbot bubble + window | https://www.grow24.ai |
| Backend API | Node/Express chat API | https://pbmpchatbotbackend.zeabur.app |
| AstraDB | Knowledge base vector search | DataStax Astra |
| Gemini AI | Answer generation | Google AI API |
| Standalone chat (optional) | Full-page chatbot UI | https://pbmpchatbot.vercel.app |

---

*End of document*
