"""This to implement movie routes"""
from flask import Blueprint, jsonify, request, session
import random, requests

movie_bp = Blueprint('movie', __name__)
api_key = None
discover_url = "https://api.themoviedb.org/3/discover/movie/?api_key="
keyword_url = "https://api.themoviedb.org/3/search/keyword?api_key="
movie_url = "https://api.themoviedb.org/3/movie/"
image_url = "https://image.tmdb.org/t/p/w500/"
query = ['cooking', 'food', 'chef', 'restaurant', 'baking', 'kitchen', 'recipe', 'meal', 'food truck', 'barbecue', 'fine dining', 'cooking competition']


@movie_bp.route("/ask", methods=["GET"])
def ask():
    """MOVIEDB api"""
    if 'email' not in session:
        return jsonify({"message": "Not logged in"}), 400

    # random discover or keyword search ???
    x = random.randint(1, 2)
    data = {
        'image': '',
        'name': '',
        'desc': '',
        'lang': '',
    }
    if x == 1:
        res = requests.get(discover_url + "&page=" + str(random.randint(1, 5)))
        if not res.status_code == 200:
            print(str(f"Error: f{res.text}"), 500)
            return jsonify({"message": str(f"Error: f{res.text}")}), 500
        print(res)
        res = res.json()['results']
        reslen = len(res)
        movie = res[random.randint(0, reslen)]
    else:
        res = requests.get(keyword_url + '&sort_by=popularity.desc&query=' + random.choice(query))
        if not res.status_code == 200:
            print(str(f"Error: f{res.text}"), 500)
            return jsonify({"message": str(f"Error: f{res.text}")}), 500
        print(res)
        res = res.json()['results']
        reslen = len(res)
        movie = res[random.randint(0, reslen)]
        movie_id = movie['id']
        res = requests.get(movie_url + movie_id + '/?api_key=' + api_key)
        if not res.status_code == 200:
            print(str(f"Error: f{res.text}"), 500)
            return jsonify({"message": str(f"Error: f{res.text}")}), 500
        print(res)
        movie = res.json()

    data['image'] = movie['poster_path']
    data['desc'] = movie['overview']
    data['name'] = movie['title']
    data['lang'] = movie['original_language']

    return jsonify(data), 200


def init_movie_routes(key):
    global discover_url
    global keyword_url
    global api_key
    keyword_url = keyword_url + key
    discover_url = discover_url + key
    api_key = key
