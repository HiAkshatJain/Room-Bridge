from flask import Flask, request, jsonify
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from db import SessionLocal
from models import Room
from utils.cache import get_cached_rank, set_cached_rank, invalidate_locality
from utils.ranking import rank_rooms_batch
from utils.sentiment import predict_sentiment_score, predict_single


app = Flask(__name__)


@app.get("/health")
def health():
    return {"status":"ok"}

# # ---------- 1) Sentiment API (single review text) ----------
# @app.post("/sentiment")
# def sentiment_api():
#     data = request.get_json(silent=True) or {}
#     text = data.get("text") or data.get("review") or ""

#     if not text.strip():
#         return jsonify({"error": "text is required"}), 400

#     score, label = predict_sentiment_score(text)
#     return jsonify({"text": text, "sentiment": label, "score": float(score)})


# # ---------- 2) Ranked rooms by locality (DB → Redis) ----------
# # @app.get("/properties")
# # def properties_by_locality():
# #     locality = request.args.get("locality")
# #     if not locality or not locality.strip():
# #         return jsonify({"error":"locality query param is required"}), 400


# #     cached = get_cached_rank(locality)
# #     if cached is not None:
# #         return jsonify({"source":"cache","locality":locality,"rooms":cached})


# #     with SessionLocal() as session:
# #     stmt = (
# #         select(Room)
# #         .options(joinedload(Room.reviews))
# #         .where(Room.location == locality)
# #         .where(Room.is_available == True)
# #     )
# #     rooms = session.scalars(stmt).all()
# #     room_dicts = []

# #     for r in rooms:
# #         room_dicts.append({
# #             "id": r.id,
# #             "title": r.title,
# #             "location": r.location,
# #             "reviews": [
# #                 {
# #                 "id": rv.id,
# #                 "rating": rv.rating,
# #                 "reviewComment": rv.reviewComment,
# #                 "createdAt": rv.createdAt.isoformat() if rv.createdAt else None,
# #                 }
# #                 for rv in (r.reviews or [])
# #             ],
# #         })


# #     ranked = rank_rooms_batch(room_dicts)
# #     set_cached_rank(locality, ranked)
# #     return jsonify({"source":"fresh","locality":locality,"rooms":ranked})


# # ---------- 3) Invalidate cache when new review arrives ----------
# @app.post("/webhook/review-created")
# def webhook_review_created():
#     """Call this from Spring after saving a new RoomReview so cache stays
#     correct."""
#     data = request.get_json(silent=True) or {}
#     locality = data.get("locality") # send room.location in webhook body

#     if locality:
#         invalidate_locality(locality)

#     return {"ok": True}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)