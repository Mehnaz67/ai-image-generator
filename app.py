import os
import urllib.parse
from flask import Flask, render_template, request, jsonify
base_dir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, template_folder=os.path.join(base_dir, 'templates'),static_folder=os.path.join(base_dir, 'static'))
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/generate", methods = ["POST"])
def generate_image():
    data = request.get_json() or {}
    prompt = data.get("prompt","").strip()
    style = data.get("style", "photorealistic")
    width = data.get("width", 1024)
    height = data.get("height", 1024)

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    enhanced_prompt = f"{prompt}, {style} style, high detail, high quality"
    encoded_prompt = urllib.parse.quote(enhanced_prompt)
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"

    return jsonify({
        "status": "success",
        "image_url": image_url,
        "prompt": prompt
    })

if __name__ == "__main__":
    app.run(debug=True)
