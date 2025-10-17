# Chatbot Visual Guide

This guide shows you what the chatbot looks like and how it behaves visually.

## 🎨 Visual Representation

### Closed State (Floating Button)

```
                                    ╔══════════════════════════╗
                                    ║  Your App Content Here   ║
                                    ║                          ║
                                    ║                          ║
                                    ║                          ║
                                    ║                          ║
                                    ║                          ║
                                    ║                          ║
                                    ║                          ║
                                    ║                      ⬤   ║  ← Red notification dot
                                    ║                     ┌─┐  ║
                                    ║                     │💬│  ║  ← Chat button
                                    ║                     └─┘  ║     (Blue/Purple gradient)
                                    ╚══════════════════════════╝
```

### Open State (Chat Window)

```
                    ╔══════════════════════════════════════════╗
                    ║  Your App Content Here                   ║
                    ║                                          ║
                    ║                 ╔════════════════════╗   ║
                    ║                 ║ ⚪ Litera AI   [X] ║   ║
                    ║                 ║    Assistant       ║   ║
                    ║                 ║    🟢 Online       ║   ║
                    ║                 ╠════════════════════╣   ║
                    ║                 ║                    ║   ║
                    ║                 ║ 💬 Hello! I'm your ║   ║
                    ║                 ║    Litera AI...    ║   ║
                    ║                 ║    12:34 PM        ║   ║
                    ║                 ║                    ║   ║
                    ║                 ║  📚  💳  🎓  💰    ║   ║
                    ║                 ║ Quick Actions      ║   ║
                    ║                 ║                    ║   ║
                    ║                 ║         Hi there! ⚪║   ║
                    ║                 ║         12:35 PM   ║   ║
                    ║                 ║                    ║   ║
                    ║                 ║ 💬 How can I help? ║   ║
                    ║                 ║    12:35 PM        ║   ║
                    ║                 ║                    ║   ║
                    ║                 ╠════════════════════╣   ║
                    ║                 ║ [Type message...] ➤║   ║
                    ║                 ║ Powered by Litera AI║   ║
                    ║                 ╚════════════════════╝   ║
                    ╚══════════════════════════════════════════╝
```

## 📐 Detailed Layout

### Chat Window Components

```
╔═══════════════════════════════════════════════════════╗
║                    HEADER SECTION                      ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │ ⚪ Avatar  Litera AI Assistant        [X] Close  │ ║
║  │           🟢 Online                               │ ║
║  └──────────────────────────────────────────────────┘ ║
╠═══════════════════════════════════════════════════════╣
║                   MESSAGES SECTION                     ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │                                                   │ ║
║  │  Bot Message Bubble (Left-aligned)               │ ║
║  │  ┌─────────────────────────────────┐             │ ║
║  │  │ Hello! How can I help you?      │             │ ║
║  │  │ 12:34 PM                        │             │ ║
║  │  └─────────────────────────────────┘             │ ║
║  │                                                   │ ║
║  │             User Message Bubble (Right-aligned)  │ ║
║  │             ┌─────────────────────────────────┐  │ ║
║  │             │ What courses do you offer?      │  │ ║
║  │             │ 12:35 PM                        │  │ ║
║  │             └─────────────────────────────────┘  │ ║
║  │                                                   │ ║
║  │  Bot Message Bubble                              │ ║
║  │  ┌─────────────────────────────────┐             │ ║
║  │  │ We offer Full Stack, AI/ML...   │             │ ║
║  │  │ 12:35 PM                        │             │ ║
║  │  └─────────────────────────────────┘             │ ║
║  │                                                   │ ║
║  │  Typing Indicator                                │ ║
║  │  ┌─────┐                                         │ ║
║  │  │ ● ● ● │ (Animated bouncing dots)              │ ║
║  │  └─────┘                                         │ ║
║  │                                                   │ ║
║  └──────────────────────────────────────────────────┘ ║
╠═══════════════════════════════════════════════════════╣
║                    INPUT SECTION                       ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │ [Type your message here...              ] [➤ Send]│ ║
║  │                 Powered by Litera AI              │ ║
║  └──────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════╝
```

### Quick Actions Layout

```
┌─────────────────────────────────────────┐
│        Quick actions:                   │
├─────────────────┬───────────────────────┤
│  📚 Courses     │  💳 Subscription      │
├─────────────────┼───────────────────────┤
│  🎓 Certificates│  💰 Wallet            │
└─────────────────┴───────────────────────┘
```

## 🎨 Color Scheme

### Visual Color Representation

```
╔════════════════════════════════════════════════════╗
║  PRIMARY COLORS                                    ║
╠════════════════════════════════════════════════════╣
║  Brand Blue:     ████████  #5b9cff                ║
║  Brand Strong:   ████████  #3b82f6                ║
║  Background:     ████████  #0a0e1a                ║
║  Text Primary:   ████████  #f0f4ff                ║
║  Text Secondary: ████████  #b8c5e8                ║
╠════════════════════════════════════════════════════╣
║  ACCENT COLORS                                     ║
╠════════════════════════════════════════════════════╣
║  Success Green:  ████████  #2ecc71                ║
║  Warning Orange: ████████  #f39c12                ║
║  Error Red:      ████████  #e74c3c                ║
║  Info Blue:      ████████  #3498db                ║
╚════════════════════════════════════════════════════╝
```

## 📱 Responsive Behavior

### Desktop View (1024px+)

```
┌────────────────────────────────────────────────────────┐
│  Navigation                                      User  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Main Content Area                                     │
│                                                        │
│                                                        │
│                                         ╔══════════╗   │
│                                         ║ Chatbot  ║   │
│                                         ║  Window  ║   │
│                                         ║   380px  ║   │
│                                         ║   wide   ║   │
│                                         ║          ║   │
│  Footer                                 ╚══════════╝   │
└────────────────────────────────────────────────────────┘
                                             ↑
                                        Fixed position
                                        Bottom-right
```

### Tablet View (768px - 1023px)

```
┌────────────────────────────────────────┐
│  Navigation               User         │
├────────────────────────────────────────┤
│                                        │
│  Content Area                          │
│                                        │
│                         ╔══════════╗   │
│                         ║ Chatbot  ║   │
│                         ║  Window  ║   │
│                         ║  380px   ║   │
│                         ║          ║   │
│  Footer                 ╚══════════╝   │
└────────────────────────────────────────┘
```

### Mobile View (<768px)

```
┌───────────────────────────┐
│  Header            [≡]    │
├───────────────────────────┤
│                           │
│  Content                  │
│                           │
│  ╔═══════════════════╗    │
│  ║                   ║    │
│  ║    Chatbot        ║    │
│  ║    Full Width     ║    │
│  ║    (minus         ║    │
│  ║    margins)       ║    │
│  ║                   ║    │
│  ║                   ║    │
│  ╚═══════════════════╝    │
│                           │
└───────────────────────────┘
```

## ⚡ Animation Sequences

### Opening Animation

```
Step 1: Button State
   ┌─┐
   │💬│  ← Visible
   └─┘

Step 2: Click Event
   ┌─┐
   │💬│  ← User clicks
   └─┘
     ↓

Step 3: Button Scales Down
   ╔═╗
   ║💬║  ← scale(0)
   ╚═╝

Step 4: Window Slides Up
         ╔══════╗
         ║      ║  ← Slides from bottom
         ╚══════╝
           ↑ Animate

Step 5: Window Fully Open
   ╔══════════════╗
   ║   Chatbot    ║  ← scale(1), opacity(1)
   ║   Content    ║
   ╚══════════════╝
```

### Typing Indicator Animation

```
Frame 1:  ●  ○  ○
Frame 2:  ○  ●  ○
Frame 3:  ○  ○  ●
Frame 4:  ○  ●  ○
(Repeats continuously)
```

### Message Send Animation

```
Step 1: User types
┌──────────────────────────┐
│ Hello                [➤] │
└──────────────────────────┘

Step 2: User presses Enter/clicks Send
┌──────────────────────────┐
│                      [➤] │  ← Input clears
└──────────────────────────┘

Step 3: Message appears (fade in)
                  ┌─────────┐
                  │ Hello   │  ← User bubble
                  │ 12:35   │
                  └─────────┘

Step 4: Typing indicator shows
┌─────┐
│ ● ● ● │  ← Bot is typing
└─────┘

Step 5: Bot response appears
┌─────────────────┐
│ How can I help? │  ← Bot bubble
│ 12:35 PM        │
└─────────────────┘
```

## 🎭 State Transitions

### Visual State Flow

```
┌─────────────┐
│   CLOSED    │  ← Initial state
│  (Button    │
│   visible)  │
└─────┬───────┘
      │ Click
      ↓
┌─────────────┐
│   OPENING   │  ← Animation state
│  (Slide up) │
└─────┬───────┘
      │ Complete
      ↓
┌─────────────┐
│    OPEN     │  ← Active state
│  (Chat      │
│   visible)  │
└─────┬───────┘
      │ Click X
      ↓
┌─────────────┐
│  CLOSING    │  ← Animation state
│ (Slide down)│
└─────┬───────┘
      │ Complete
      ↓
┌─────────────┐
│   CLOSED    │  ← Back to initial
└─────────────┘
```

## 💬 Message Bubble Styles

### Bot Message (Left-aligned)

```
┌────────────────────────────────┐
│ Hello! How can I assist you    │
│ today?                         │
│ 12:34 PM                       │
└────────────────────────────────┘
 └─ Light background
    White/gray border
    Rounded corners
```

### User Message (Right-aligned)

```
                  ┌────────────────┐
                  │ I need help    │
                  │ 12:35 PM       │
                  └────────────────┘
                   └─ Blue/Purple gradient
                      White text
                      Rounded corners
```

## 🔘 Button States

### Chat Button States

```
Normal:           Hover:           Clicked:
   ┌─┐              ┌─┐              ┌─┐
   │💬│             │💬│ ↑           │💬│ ↓
   └─┘              └─┘ Lifted       └─┘ Pressed
                    Glow effect
```

### Send Button States

```
Disabled:         Enabled:         Hover:
   [➤]              [➤]             [➤] ↑
   Gray             Blue            Lifted
                    gradient        Glow
```

## 📏 Measurements Reference

### Desktop Dimensions

```
Chat Window:
┌─────────── 380px ────────────┐
│                              │ ↕
│                              │ 600px
│                              │
└──────────────────────────────┘

Chat Button:
┌── 56px ──┐
│          │ ↕ 56px
└──────────┘

Position:
Bottom: 24px (1.5rem)
Right:  24px (1.5rem)
```

### Mobile Dimensions

```
Chat Window:
┌──── calc(100vw - 2rem) ────┐
│                            │ ↕
│                            │ calc(100vh - 2rem)
│                            │
└────────────────────────────┘

Margins: 1rem on all sides
```

## 🎯 Interactive Zones

```
┌═══════════════════════════════════════╗
║ [X]  ← Close button (40x40px)         ║
╠═══════════════════════════════════════╣
║                                       ║
║  Clickable message bubbles            ║
║  (future: copy, share)                ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  📚 Courses  💳 Subscription    │ ║
║  │  ← Quick action buttons         │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
╠═══════════════════════════════════════╣
║ [Type message...        ] [➤ Send]   ║
║  ↑ Text input           ↑ Send btn   ║
╚═══════════════════════════════════════╝
```

## 🌈 Gradient Effects

### Button Gradient

```
    Blue #5b9cff
      ╱╲
     ╱  ╲
    ╱    ╲
   ╱      ╲
  ╱ Button ╲
 ╱  Gradient╲
╱____________╲
Purple #3b82f6
```

### Glass Effect

```
┌──────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  ← Blur layer
│                  │
│  Content Here    │  ← Semi-transparent
│                  │
└──────────────────┘
```

## 🎨 Shadow Layers

```
Normal State:
 ┌────────┐
 │ Button │
 └────┬───┘
   Shadow (sm)

Hover State:
   ┌────────┐
   │ Button │ ↑ Lifted
   └────┬───┘
     Shadow (lg + glow)
```

## 🔄 Loading States

### Initial Load

```
Step 1: Component mounts
┌────────────────────┐
│    Loading...      │
└────────────────────┘

Step 2: Chat initialized
┌────────────────────┐
│  Litera AI ready   │
└────────────────────┘

Step 3: Welcome message
┌────────────────────┐
│ Hello! I'm your... │
└────────────────────┘
```

## 📋 Accessibility Indicators

```
┌───────────────────────────────┐
│ [Button]  ← aria-label="Send" │
│           ← role="button"     │
│           ← tabindex="0"      │
└───────────────────────────────┘

Focus State (keyboard nav):
┌═══════════════════════════════┐
║ [Button] ← 2px blue outline   ║
╚═══════════════════════════════╝
```

---

## 🎬 Complete User Flow Visualization

```
1. User visits page
   ↓
2. Sees floating button (bottom-right)
   ┌─┐
   │💬│ ⬤
   └─┘
   ↓
3. Clicks button
   ↓
4. Chat slides up with animation
   ╔════════════╗
   ║  Chatbot   ║ ⬆ Slides up
   ╚════════════╝
   ↓
5. Shows welcome message
   "Hello! I'm your Litera AI Assistant..."
   ↓
6. Shows quick actions
   📚 💳 🎓 💰
   ↓
7. User types or clicks quick action
   ↓
8. Shows typing indicator
   ● ● ●
   ↓
9. Bot responds (1-2 seconds)
   ↓
10. Conversation continues
    ↓
11. User clicks X to close
    ↓
12. Chat slides down
    ╔════════════╗
    ║  Chatbot   ║ ⬇ Slides down
    ╚════════════╝
    ↓
13. Button reappears
    ┌─┐
    │💬│
    └─┘
```

---

**This visual guide helps you understand:**
- How the chatbot looks
- Where it appears
- How it animates
- What users see
- How interactions work
- Responsive behavior
- Color scheme
- Layout structure

**For actual implementation details, see:**
- `ChatBot.jsx` - Component code
- `CHATBOT_FEATURE_DOCUMENTATION.md` - Technical docs
- `CHATBOT_QUICK_START.md` - Quick start guide

