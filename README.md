# 🎧 Studio Online – The Future of Music Production in Your Browser

Welcome to **Studio Online** – a modern, collaborative, web-based Digital Audio Workstation (DAW) built for **music producers, beatmakers, and creatives** of all levels. Whether you're just starting or already crafting tracks, this platform gives you everything you need to compose, mix, and export your music — directly from your browser.

[![GitHub Repo](https://img.shields.io/badge/GitHub-rodrigo--alves--webdev/studio--online-blue?logo=github)](https://github.com/rodrigo-alves-webdev/studio-online)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🚀 Features

- 🎹 **Multi-track editor** with MIDI & audio support  
- 🔁 **Loop browser** with integrated sounds and samples  
- 💻 **Tone.js** and **WaveSurfer.js** powered audio engine  
- 🌐 **Realtime collaboration** using Supabase  
- 🔒 **Social login** (Google, Facebook, Apple)  
- 🎨 **Modern UI** built with React, TypeScript, TailwindCSS  
- ☁️ **Project autosave & cloud sync**  
- 🧠 Designed with a focus on **UX for beginners and pros** alike  

---

## 🧑‍💻 Technologies Used

- **Frontend**: React + TypeScript + Zustand + TailwindCSS  
- **Audio Engine**: Tone.js, WaveSurfer.js, Web MIDI API  
- **Realtime Database & Auth**: Supabase  
- **State Management**: Zustand  
- **Deployment**: Vercel (recommended) / Netlify / Firebase Hosting

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/rodrigo-alves-webdev/studio-online.git
cd studio-online
yarn
```

Create a .env.local file based on .env.example and add your Supabase keys:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

```

Then run the project locally run ```yarn dev``` in terminal.

The app will be running at http://localhost:3000

---

## 📁 Project Structure

```bash
studio-online/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application routes
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Supabase client, audio utilities, helpers
│   ├── stores/          # Zustand global states
│   └── styles/          # TailwindCSS config and custom styles
├── public/              # Static assets
├── .env.example         # Environment variables template
├── README.md            # You're here :)
└── ...
```

---

## 🤝 Contributing
We welcome contributions! Here's how you can help:

🚀 Fork the project

🛠️ Create a new branch: git checkout -b feature/your-feature-name

✅ Commit your changes: git commit -m 'feat: add new feature'

📬 Push to the branch: git push origin feature/your-feature-name

🧵 Open a Pull Request

If you'd like to collaborate or propose an idea, feel free to open an issue.

---

## 🧪 Roadmap – MVP v1

Here's what's planned for our MVP release:

- ✅ 🔐 **Social login** with Google and Facebook  
- ✅ 🧰 **Supabase integration** for auth, database and realtime  
- 🚧 🗂️ **Project dashboard** — create, edit, delete, and load music projects  
- 🚧 🎹 **Audio & MIDI track creation** — add instruments, loops, and sequences  
- 🔜 🤝 **Realtime collaboration** — invite friends and produce music together  
- 🔜 📤 **Export to MP3/WAV** — download your full mix  
- 🔜 🌍 **Community sharing & feedback** — publish tracks, get likes and comments  
- 🔜 🚀 **Onboarding experience** — guided first project and tooltips for beginners


---

## 🧙 About the Creator

Created with ❤️ by Rodrigo Alves, a passionate full-stack dev, musician, and storyteller building tools to empower creatives around the world.

Follow me on [GitHub](https://github.com/rodrigo-alves-webdev), [YouTube](https://www.youtube.com), or [Instagram](https://www.instagram.com).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

🎶 Create.