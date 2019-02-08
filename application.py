import numpy as np
from sklearn.externals import joblib
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

def giveSuggestions(features,model,numberOfSuggestions=3):
    predictProbabilities=model.predict_proba(features)
    indeces=predictProbabilities[0].argsort()[-numberOfSuggestions:][::-1]
    suggest=[]
    probs=[]
    for i in range(len(indeces)):
        suggest.append(model.classes_[indeces[i]])
        probs.append(predictProbabilities[0,indeces[i]])
    return suggest,probs


app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predictroute():
    print(request.is_json)
    content=request.get_json()
    ph = content['ph']
    rainfall=content['rainfall']
    temp=content['temp']
    alt=content['alt']
    bestCrop,prob=giveSuggestions([[ph,temp,alt,rainfall]],lrmodel,7)
    return jsonify([{'x': bestCrop,
                     'y': prob,
                     'type':'bar'
                    }])

@app.route('/',methods=['GET'])
def index():
    return render_template('maps.html')
@app.route('/reloadModel/',methods=['GET'])
def reloadModel():
    lrmodel=joblib.load('model.joblib')
    return jsonify({'status':"success",'msg':"model successfully reloaded"})

if __name__ == '__main__':
     lrmodel=joblib.load('model.joblib')
     app.run(port=8080)
