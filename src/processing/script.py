# import os
# import json
# import openai
import obsidiantools as otools
# from sklearn.decomposition import PCA
# from tenacity import (
#     retry,
#     stop_after_attempt,
#     wait_random_exponential,
# )  # for exponential backoff

# # tenacity helps with rate limits
# # checkout here: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_handle_rate_limits.ipynb
# @retry(wait=wait_random_exponential(min=5, max=60), stop=stop_after_attempt(10))
# def createEmbedding(block):
#     # returns array of size 1536
#     return openai.Embedding.create(input = [block], model="text-embedding-ada-002")['data'][0]['embedding']

# def preprocessText(text):
#     pass

# def getAllEmbeddings(path):
#     # recursively walk through dir to get all markdown files
#     # returns a dictionary where {filename1: content1, filename2: content2, ...}
#     embeddings = {}
#     # only getting a subset of the directories and files because it's a lot
#     for item in os.listdir(path)[:5]:
#         print(item)
#         content = os.path.join(path, item)
#         if os.path.isdir(content):
#             embeddings.update(getAllEmbeddings(content))
#         elif content.endswith(".md"):
#             fp = open(content)
#             embeddings[item] = createEmbedding(fp.read())
#             fp.close()
#     return embeddings

# def reduce_demensions(vec_embeddings):
#     pca = PCA(n_components=2)
#     pca.fit(vec_embeddings)
#     pca_encodings = pca.transform(vec_embeddings)
#     return pca_encodings

# https://github.com/mfarragher/obsidiantools
def main():
    # Receive a JSON string from Node.js and parse it
    # vault_path = input()
    # vault = otools.Vault(vault_path).connect().gather()
    # print(vault.path)
    test = input()
    print(test)

if __name__ == "__main__":
    main()