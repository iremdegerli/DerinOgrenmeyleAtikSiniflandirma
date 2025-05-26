from flask import Flask, request, jsonify, send_file
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import os

app = Flask(__name__)

# Set TF compatibility flags
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Custom model loading with legacy support
try:
    model = load_model("InceptionV3_final.h5", compile=False)
except TypeError as e:
    print(f"First loading attempt failed: {e}")
    # Try with custom objects and legacy mode
    tf.keras.utils.disable_interactive_logging()
    model = load_model("InceptionV3_final.h5", 
                      compile=False,
                      custom_objects={'BatchNormalization': tf.keras.layers.BatchNormalization})
    
class_names = ['glass', 'paper', 'plastic']

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'no image uploaded'}), 400

    file = request.files['image']
    image = Image.open(file.stream).resize((224, 224))
    image = np.expand_dims(np.array(image) / 255.0, axis=0)
    
    # Use try/except for prediction to handle any errors
    try:
        predictions = model.predict(image, verbose=0)
        predicted_class = class_names[np.argmax(predictions)]
        
        return jsonify({
            'predicted_class': predicted_class,
            'confidence': float(np.max(predictions))
        })
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

@app.route('/')
def index():
    return send_file('index.html')

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
