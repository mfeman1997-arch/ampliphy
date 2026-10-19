# Ampliphy

Ampliphy helps small brands plan a month of Facebook and Instagram posts from their Canva or Gamma designs, publish them, and see who is worth talking to next.

This repository is the coded version of my Figma design for Lyon INC: 14 screens, from the trial invite to the "who to talk to next" view, built as a working React app.

**Live demo:** _link added after the first deploy_

## Designed and built by

**Muhammad Feman**, UX/UI Designer · [Portfolio](https://muhammadfeman.framer.website/) · [LinkedIn](https://www.linkedin.com/in/muhammadfeman/) · [Behance](https://www.behance.net/muhammadfeman)

I designed every screen in Figma, then built it in React and TypeScript using AI-assisted coding (Claude Code). The design file is the source of truth; the app follows it screen by screen.

## What you can try

| Stage | Screens |
| --- | --- |
| Sign in & onboard | Trial invite, magic link, quick-start guide, connect Canva/Gamma, connect Facebook/Instagram, import progress |
| Plan | Home, design library with multi-select, month calendar with drag and drop, compose with caption and hashtags |
| Publish | Publish activity timeline with a failed Instagram post you can fix ("Crop to 4:5 & retry") |
| Engage | Comment inbox with suggested replies, engagement overview |
| Follow up | Who to talk to next, with the reasons behind each suggestion and an editable message |

## Interaction choices

- **Suggestions you can see and reject.** Caption rewrites appear as a before/after; suggested replies and messages are editable and never sent automatically.
- **Reasons, not magic.** "Who to talk to next" lists why each person is suggested.
- **Undo everywhere.** Moving a post, replying, hiding a comment and marking someone as contacted can all be undone from the toast.
- **Honest failure states.** Retrying the same 2:1 image fails again with the real reason; cropping it to 4:5 fixes it.
- **Works on a phone.** The side rail becomes a bottom tab bar and every screen fits 375px.

All data is sample data for the fictional brand Rose Glow Skincare. Nothing connects to real Canva, Facebook or Instagram accounts.

## Stack

React 18, TypeScript, Vite. No UI library: components, icons and charts are hand-built to match the Figma file.

## Run locally

```bash
npm install
npm run dev
```
