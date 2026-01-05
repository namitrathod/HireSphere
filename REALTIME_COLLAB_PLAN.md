# 🚀 Upgrade Plan: Real-Time Collaborative Interview Platform

**Objective:** Transform the "Interview Scheduling" feature into a fully functional "Live Technical Interview" platform.

## 🏗️ Core Features

### 1. Smart Access Control
- **Logic:** The "Join Room" button is disabled until `Interview Time - 15 minutes`.
- **Security:** Only the specific `Applicant` and `Recruiter` assigned to that interview can enter.
- **Tech:** React conditional rendering + Django permission checks.

### 2. The Collaborative Code Editor
- **Frontend:** Monaco Editor (VS Code engine).
- **Backend:** Django Channels (WebSockets).
- **Protocol:**
    - **Connect:** User joins `ws://server/interview/{id}/`.
    - **Edit:** User A types -> Sends JSON `{"op": "insert", "char": "x", "pos": 10}`.
    - **Broadcast:** Server relays to User B -> User B's editor updates.
- **State:** Redis acts as the temporary "source of truth" to hold the code content during the session.

### 3. Integrated Video Chat
- **Implementation:** Embedded Jitsi Meet or Simple WebRTC (PeerJS).
- **Layout:** Split screen—Code on the left (70%), Video on the right (30%).

---

## � Implementation Phases

### Phase 1: Infrastructure (Async Server)
- [ ] Install `channels`, `daphne`, and `channels-redis`.
- [ ] Configure `ASGI` in `settings.py`.
- [ ] Set up a local Redis instance (using Docker or Cloud).

### Phase 2: The WebSocket Backend
- [ ] Create `interview/consumers.py`.
- [ ] Implement `connect`, `disconnect`, and `receive` methods.
- [ ] Create routing configuration (`ws/interviews/<id>/`).

### Phase 3: The Frontend Editor
- [ ] Install `@monaco-editor/react`.
- [ ] Build `<CollaborativeEditor />` component.
- [ ] Hook up WebSocket events to update the editor content.

### Phase 4: Access Logic & Video
- [ ] Update `InterviewDetail` page to show "Join" button based on time.
- [ ] Embed `<JitsiMeeting />` component for audio/video.

---

## �️ Tech Stack Upgrade
- **Django Channels:** For async WebSockets.
- **Redis:** For message passing.
- **Daphne:** To serve the async application.
- **React:** For the dynamic UI.
