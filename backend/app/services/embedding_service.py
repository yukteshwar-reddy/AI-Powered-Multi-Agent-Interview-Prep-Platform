from chromadb.utils import embedding_functions

# Use the default lightweight model from ChromaDB, which uses sentence-transformers under the hood
# all-MiniLM-L6-v2 is the default.
embedding_function = embedding_functions.DefaultEmbeddingFunction()

def get_embeddings(texts: list[str]):
    """Returns embeddings for a list of strings."""
    return embedding_function(texts)
