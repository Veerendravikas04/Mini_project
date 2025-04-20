# 🎮 Connect 4 Game – Reinforcement Learning with Deep Q Networks

This is a mini-project implementing the classic **Connect 4 game** using **Reinforcement Learning** powered by **Deep Q Networks (DQN)**.  
The game is integrated with a **Flask** backend and a web frontend using **HTML**, **CSS**, and **JavaScript**.

---

## 🚀 Technologies Used

- Python 🐍  
- PyTorch 🔥 (for Deep Q Network)  
- Flask 🌐 (Web Framework)  
- HTML/CSS/JavaScript (Frontend)  
- Git & GitHub 💻  

---

## 🧠 What is a Deep Q Network (DQN)?

A **Q-Network** is used in **Reinforcement Learning (RL)** to approximate the **Q-function**:
- The Q-function, \( Q(s, a) \), tells the agent the expected reward of taking action \( a \) in state \( s \).

In traditional Q-learning:
- You create a Q-table for all states and actions.

But in large environments like **Connect 4**:
- The number of possible board states is massive.
- Instead of a table, we use a **Deep Neural Network** to **approximate** the Q-values.
- This is called a **Deep Q-Network (DQN)**.

### 🧠 How it works in this project:
- The agent sees the board as input (state).
- It passes the state through a deep neural network.
- The network predicts Q-values for all possible actions (columns to drop the disc).
- The action with the highest Q-value is chosen.
- The agent learns over time through rewards and penalties.
- A trained model is saved as `connect4_pytorch_model.pth`.

---

## 🌐 Web Integration

- `Flask` serves as the backend.
- `templates/` contains HTML files (Jinja templating).
- `static/` contains CSS and JavaScript for UI.
- The AI plays against human users via the web interface.

---


---

## ⚙️ Setup Instructions

### 🔁 Clone the Repository

```bash
git clone https://github.com/Veerendravikas04/Mini_project.git
cd Foldername


python -m venv env
.\env\Scripts\activate    # On Windows
# source env/bin/activate # On Linux/Mac


pip install -r requirements.txt


python app.py


if you made any changes push it into again git
git add .
git commit -m "Your message here"
git push origin master
