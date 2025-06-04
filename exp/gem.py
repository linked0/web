import vertexai
from vertexai.preview.generative_models import GenerativeModel, Image

PROJECT_ID = "kaggle-208607"
REGION = "us-central1"
vertexai.init(project=PROJECT_ID, location=REGION)

IMAGE_FILE = "/Users/hyunjaelee/Downloads/cheese-onion-scones-white-background-generative-ai_918839-11900.jpg"
image = Image.load_from_file(IMAGE_FILE)

# print command line arguments
import sys
import argparse
args = sys.argv[0:]
print(args)

generative_multimodal_model = GenerativeModel("gemini-1.5-pro-preview-0409")
response = generative_multimodal_model.generate_content(["What is shown in this image?", image])

print(response)