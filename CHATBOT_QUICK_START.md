# Chatbot Quick Start Guide

## ✨ What's Been Added

A professional AI-powered chatbot has been integrated into your Litera application. It provides real-time answers to student queries with a beautiful, responsive UI.

## 🚀 Quick Test

1. **Start your development server:**
   ```bash
   cd client
   npm run dev
   ```

2. **Look for the floating chat button:**
   - You'll see a blue/purple gradient button in the bottom-right corner
   - It has a chat icon and a red notification dot

3. **Click the button to open the chat window**

4. **Try these test messages:**
   - "What courses do you offer?"
   - "Tell me about subscriptions"
   - "How do I get a certificate?"
   - "What is the wallet?"
   - "Hello"

## 📍 Where It Appears

The chatbot is available on:
- ✅ All public pages (Home, Courses, About, FAQ, etc.)
- ✅ Student Dashboard and all dashboard pages
- ✅ Admin Panel

## 🎨 Features at a Glance

### Visual Features
- **Floating Button**: Always visible in bottom-right corner
- **Glass-morphism Design**: Premium frosted glass effect
- **Smooth Animations**: Slide-in effects and transitions
- **Typing Indicator**: Three animated dots when bot is "thinking"
- **Quick Actions**: Pre-built buttons for common questions

### Functional Features
- **Auto-scroll**: Messages automatically scroll to bottom
- **Keyboard Support**: Press Enter to send messages
- **User Recognition**: Greets logged-in users by name
- **Timestamps**: Shows message time
- **Responsive**: Works perfectly on mobile devices

## 📱 Mobile Testing

1. Open your browser's device toolbar (F12 → Toggle Device Toolbar)
2. Select a mobile device (iPhone, Samsung, etc.)
3. The chatbot automatically adapts to the screen size
4. Test opening/closing and sending messages

## 🎯 Quick Actions

When you first open the chat, you'll see 4 quick action buttons:
- 📚 Courses
- 💳 Subscription
- 🎓 Certificates
- 💰 Wallet

Click any button to instantly ask about that topic!

## 🔧 Customization Points

Want to customize? Here are the quick wins:

### 1. Change Chat Window Size
In `client/src/components/ChatBot.jsx`, line ~263:
```javascript
className="w-[380px] h-[600px]"
// Change to your preferred size
```

### 2. Add New Quick Actions
In `ChatBot.jsx`, around line ~130:
```javascript
const quickActions = [
  { label: '📚 Courses', message: 'Tell me about available courses' },
  // Add your own here
  { label: '🎯 Your Topic', message: 'Your message' },
];
```

### 3. Add New Response Patterns
In `ChatBot.jsx`, in the `getBotResponse` function:
```javascript
if (message.includes('your_keyword')) {
  return "Your custom response here";
}
```

### 4. Change Colors
The chatbot uses your app's theme colors from `client/src/index.css`:
- `--brand`: #5b9cff (primary blue)
- `--brand-strong`: #3b82f6 (darker blue)
- `--bg-primary`: #0a0e1a (dark background)

## 📊 What the Bot Can Answer

Current knowledge base includes:

**Learning**
- Course information and categories
- Subscription plans and pricing
- Certificates and how to earn them
- Progress tracking

**Platform Features**
- Live classes schedule and joining
- Recording access
- Internship opportunities
- Wallet and coin system
- Referral program

**Support**
- Login and account issues
- Payment and billing
- Technical assistance
- General help

## 🔮 Next Steps

### For Basic Users
You're all set! The chatbot is ready to use. Just test it out and enjoy!

### For Advanced Customization

**Want AI-powered responses?**
1. Get an OpenAI API key
2. See `CHATBOT_FEATURE_DOCUMENTATION.md` for integration code
3. Implement the API call in `getBotResponse`

**Want to store conversations?**
1. Create a backend endpoint
2. Send messages to server on each chat
3. Retrieve history on chat open

**Want notifications?**
1. Implement a notification service
2. Show badge count on chat button
3. Store unread message count

## 🐛 Troubleshooting

**Chat button doesn't appear?**
- Check browser console for errors
- Verify the component is imported in layouts
- Clear browser cache and reload

**Styling looks off?**
- Ensure all CSS custom properties are defined
- Check for conflicting z-index values
- Verify Tailwind CSS is properly configured

**Not responsive on mobile?**
- Test on actual device, not just browser resize
- Check viewport meta tag in `index.html`
- Verify touch events work

## 📸 Screenshots Reference

The chatbot should look like:
- **Closed**: Blue/purple gradient floating button with notification dot
- **Open**: Premium glass-morphism chat window with header, messages, and input
- **Mobile**: Full-width chat window with touch-friendly interface

## ✅ Verification Checklist

Before considering it complete, verify:
- [ ] Chat button visible on all pages
- [ ] Opens and closes smoothly
- [ ] Can send and receive messages
- [ ] Quick actions work
- [ ] Responsive on mobile
- [ ] Typing indicator shows
- [ ] Auto-scroll works
- [ ] User name appears if logged in
- [ ] Keyboard (Enter) works to send
- [ ] All response patterns work

## 🎉 That's It!

Your chatbot is live and ready! Users can now get instant help on any page of your application.

**Pro Tip**: Monitor which questions users ask most and add more specific responses to improve the experience!

---

**Need More Help?**
- Full documentation: `CHATBOT_FEATURE_DOCUMENTATION.md`
- Component code: `client/src/components/ChatBot.jsx`
- Integration: Check the layout files

**Happy Chatting! 🚀**

