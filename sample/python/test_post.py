import requests
with open('audio/test_tone.wav','rb') as f:
    r = requests.post('http://127.0.0.1:8000/analyze/', files={'file':('test_tone.wav', f, 'audio/wav')}, timeout=120)
print('status', r.status_code)
print(r.text)
