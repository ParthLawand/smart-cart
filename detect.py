from ultralytics import YOLO
import cv2
from collections import Counter
import requests
import time
import sys

# -------- LOAD MODEL --------
model = YOLO(r"D:\smart cart sdp\yoloModel.pt")

# -------- CLASS MAP --------
CLASS_MAP = {
    "Coca Cola 300ml": "COCA_COLA_01",
    "Cadbury 18gm": "CADBURY_01",
    "Bingo Potato Chips 21gm": "BINGO_01",
    "Britania Marie Gold 117gm": "MARIE_GOLD_01",
    "Dove Soap 100gm": "DOVE_01"
}

# -------- API CONFIG --------
if len(sys.argv) < 2:
    print("❌ Error: cartId is required as a command-line argument.")
    print("Usage: python detect.py <cartId>")
    sys.exit(1)

cartId = sys.argv[1]
API_URL = f"http://localhost:5000/api/cart/{cartId}/detection-event"

# -------- SEND FUNCTION --------
def send_event(event, product_id, confidence):
    payload = {
        "event": event,
        "product_id": product_id,
        "confidence": round(confidence, 2)
    }

    print("\n🚀 Sending Request:", payload)

    try:
        response = requests.post(API_URL, json=payload)

        print("✅ Status Code:", response.status_code)

        try:
            print("📦 Response JSON:", response.json())
        except:
            print("⚠ No JSON response")

    except Exception as e:
        print("❌ API Error:", e)


# -------- CAMERA --------
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Error: Could not open webcam.")
    exit()

print("🎥 Starting detection... Press 'Q' to quit.\n")

# -------- PARAMETERS --------
CONF_THRESHOLD = 0.7
HISTORY_SIZE = 10

PRIORITY = ["Cadbury 18gm", "Dove Soap 100gm"]

history = []
last_sent_label = None

# -------- MAIN LOOP --------
while True:
    ret, frame = cap.read()

    if not ret:
        print("❌ Error: Failed to read frame.")
        break

    frame = cv2.resize(frame, (640, 480))

    results = model(frame, conf=CONF_THRESHOLD)[0]
    annotated_frame = results.plot()

    frame_best_label = None
    max_conf = 0

    # -------- DETECTION --------
    if results.boxes is not None and len(results.boxes) > 0:
        detections = []

        for box in results.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = model.names[cls_id]

            if conf >= CONF_THRESHOLD:
                detections.append((label, conf))

                if conf > max_conf:
                    max_conf = conf
                    frame_best_label = label

        # -------- PRIORITY OVERRIDE --------
        detected_labels = [d[0] for d in detections]
        for p in PRIORITY:
            if p in detected_labels:
                frame_best_label = p
                break

    # -------- DEBUG PRINT --------
    print("Frame Best Label:", frame_best_label, "| Confidence:", round(max_conf, 2))

    # -------- TEMPORAL SMOOTHING --------
    if frame_best_label:
        history.append(frame_best_label)

    if len(history) > HISTORY_SIZE:
        history.pop(0)

    final_label = None
    if history:
        final_label = Counter(history).most_common(1)[0][0]

    # -------- EVENT LOGIC --------

    # ADD EVENT
    if final_label:
        if final_label != last_sent_label:
            product_id = CLASS_MAP.get(final_label)

            if product_id:
                print(f"\n🔥 FINAL DETECTION: {final_label}")

                send_event("ADD", product_id, max_conf)

                last_sent_label = final_label
                time.sleep(0.5)

    # REMOVE EVENT
    else:
        if last_sent_label is not None:
            product_id = CLASS_MAP.get(last_sent_label)

            if product_id:
                print(f"\n❌ REMOVED: {last_sent_label}")

                send_event("REMOVE", product_id, 0.9)

                last_sent_label = None
                time.sleep(0.5)

    # -------- DISPLAY --------
    if final_label:
        cv2.putText(
            annotated_frame,
            f"FINAL: {final_label}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

    cv2.imshow("Smart Cart Detection", annotated_frame)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

# -------- CLEANUP --------
cap.release()
cv2.destroyAllWindows()