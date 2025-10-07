import os
from dotenv import load_dotenv
import tweepy

# Load variables from .env into os.environ
load_dotenv()


# Replace with your actual Bearer Token
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")

# Replace with the username of the account you want to get tweets from
username = "jayfeelsogood" # Example username

# Authenticate using the Bearer Token (app-only authentication for read-only access)
client = tweepy.Client(BEARER_TOKEN)

# client = tweepy.Client(
#     bearer_token="xxx",
#     consumer_key="xxx",
#     consumer_secret="xxx",
#     access_token="xxx",
#     access_token_secret="xxx",
#     wait_on_rate_limit=True
# )

try:
    # Get user ID from username
    user_response = client.get_user(username=username)
    if user_response.data:
        user_id = user_response.data.id

        # Get recent tweets from the user
        # You can customize parameters like max_results, tweet_fields, etc.
        response = client.get_users_tweets(id=user_id, max_results=5)

        # Print the text of each tweet
        if response.data:
            for tweet in response.data:
                print(f"Tweet ID: {tweet.id}")
                print(f"Text: {tweet.text}")
                print("-" * 20)
        else:
            print(f"No tweets found for user {username}.")

    else:
        print(f"User {username} not found.")

except tweepy.TweepyException as e:
    print(f"Error during Tweepy request: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")