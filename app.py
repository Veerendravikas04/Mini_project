import os
import sys
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from connect4_pytorch import (
    DQNAgent,
    select_action,
    check_win,
    apply_action,
    get_valid_columns,
    preprocess_board,
    load_agent_for_play
)

app = Flask(__name__)
CORS(app)

AI_AGENT = None

def initialize_ai_agent():
    global AI_AGENT
    model_file = "connect4_pytorch_model.pth"
    AI_AGENT = load_agent_for_play(model_file)
    if AI_AGENT is None:
        print("No pre-trained model found. Training a new model...")
        from connect4_pytorch import train_agent
        AI_AGENT = train_agent(episodes=1000, model_filename=model_file)

@app.route('/')
def splash():
    return render_template('splash.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/game')
def game():
    return render_template('index.html')

@app.route('/api/move', methods=['POST'])
def get_ai_move():
    data = request.json
    board = data.get('board')
    difficulty = data.get('difficulty', 'hard')

    if not board or not isinstance(board, list):
        return jsonify({"error": "Invalid board state"}), 400

    board_array = np.array(board)

    if check_win(board, 1):
        return jsonify({
            "move": -1,
            "board": board,
            "win": False,
            "draw": False
        })

    valid_columns = get_valid_columns(board_array)
    if not valid_columns:
        return jsonify({
            "move": -1,
            "board": board,
            "win": False,
            "draw": True
        })

    move = select_action(board_array, AI_AGENT, difficulty)
    new_board = apply_action(board, move, 2)

    is_ai_win = check_win(new_board, 2)
    is_draw = not get_valid_columns(new_board)

    return jsonify({
        "move": int(move),
        "board": [int(cell) for row in new_board for cell in row],
        "win": is_ai_win,
        "draw": is_draw
    })

@app.route('/api/check', methods=['POST'])
def check_move():
    data = request.json
    board = data.get('board')
    column = data.get('column')

    if board is None or column is None:
        return jsonify({"valid": False, "error": "Invalid input"})

    valid_columns = get_valid_columns(np.array(board))
    is_valid = column in valid_columns

    return jsonify({ "valid": is_valid })

if __name__ == '__main__':
    initialize_ai_agent()
    app.run(debug=True)
